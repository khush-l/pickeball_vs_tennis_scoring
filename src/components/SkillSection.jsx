import { useState, useEffect, useCallback } from 'react';
import {
  ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, Legend, ResponsiveContainer,
} from 'recharts';
import { buildCurveData, estimateWinProb, pickleballGame, tennisSet } from '../simulation';

const CURVE_DATA = buildCurveData();

function pct(v) { return `${(v * 100).toFixed(1)}%`; }

export default function SkillSection() {
  const [p, setP] = useState(0.55);
  const [pbRes, setPbRes] = useState(null);
  const [tnRes, setTnRes] = useState(null);
  const [loading, setLoading] = useState(false);

  const compute = useCallback((val) => {
    setLoading(true);
    setTimeout(() => {
      setPbRes(estimateWinProb((pp) => pickleballGame(pp, 0, 0, Math.random() < 0.5 ? 'A' : 'B').winner === 'A', val));
      setTnRes(estimateWinProb(tennisSet, val));
      setLoading(false);
    }, 0);
  }, []);

  useEffect(() => { compute(p); }, []);

  const pbWin = pbRes?.mean ?? null;
  const tnWin = tnRes?.mean ?? null;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Skill &amp; Win Probability</h2>
        <p className="text-slate-500 leading-relaxed">
          Drag the slider to set Player A's rally win probability{' '}
          <span className="font-mono font-semibold text-slate-700">p</span>. Each estimate
          uses <span className="font-semibold text-slate-600">N = 2,000</span> simulated
          matches. Shaded bands show 95% bootstrap confidence intervals (B = 1,000
          resamples), which agree closely with the CLT normal approximation.
        </p>
      </div>

      {/* Slider */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
        <label className="block text-sm font-semibold text-slate-600 mb-3">
          Rally win probability —{' '}
          <span className="font-mono text-blue-700">p = {p.toFixed(2)}</span>
        </label>
        <input
          type="range" min="0.50" max="0.80" step="0.01" value={p}
          onChange={(e) => { const v = parseFloat(e.target.value); setP(v); compute(v); }}
          className="w-full accent-blue-600 h-2 cursor-pointer"
        />
        <div className="flex justify-between text-xs text-slate-400 mt-1 font-mono">
          <span>0.50 — even skill</span><span>0.65</span><span>0.80 — dominant</span>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <p className="text-xs uppercase tracking-widest text-blue-400 font-semibold mb-2">Pickleball win probability</p>
          <p className="text-5xl font-extrabold text-blue-700 mb-1">{loading || pbWin === null ? '—' : pct(pbWin)}</p>
          {pbRes && !loading && (
            <p className="text-xs text-blue-400 font-mono">
              95% CI [{pct(pbRes.ciLow)}, {pct(pbRes.ciHigh)}]
            </p>
          )}
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
          <p className="text-xs uppercase tracking-widest text-orange-400 font-semibold mb-2">Tennis win probability</p>
          <p className="text-5xl font-extrabold text-orange-600 mb-1">{loading || tnWin === null ? '—' : pct(tnWin)}</p>
          {tnRes && !loading && (
            <p className="text-xs text-orange-400 font-mono">
              95% CI [{pct(tnRes.ciLow)}, {pct(tnRes.ciHigh)}]
            </p>
          )}
        </div>
      </div>

      {/* Chart with CI shading */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-1">Match win probability vs. rally skill</p>
        <p className="text-xs text-slate-400 mb-4">Narrow bands = 95% bootstrap CI</p>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart
            data={CURVE_DATA.map(d => ({
              ...d,
              pbCiSpan: parseFloat((d.pbCiHigh - d.pbCiLow).toFixed(4)),
              tnCiSpan: parseFloat((d.tnCiHigh - d.tnCiLow).toFixed(4)),
            }))}
            margin={{ top: 5, right: 20, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="p" tickFormatter={(v) => v.toFixed(2)} domain={['dataMin', 'dataMax']} label={{ value: 'Rally win probability p', position: 'insideBottom', offset: -12, fontSize: 12 }} tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} domain={[0, 1]} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v, name) => [`${(v * 100).toFixed(1)}%`, name]} labelFormatter={(v) => `p = ${v}`} />
            <Legend verticalAlign="top" />
            <ReferenceLine x={p.toFixed(3)} stroke="#94a3b8" strokeDasharray="4 2" label={{ value: `p = ${p.toFixed(2)}`, fontSize: 11, fill: '#64748b' }} />
            {/* CI bands: base at ciLow, span up to ciHigh */}
            <Area type="monotone" dataKey="pbCiLow"  stackId="pb" stroke="none" fill="transparent" legendType="none" tooltipType="none" dot={false} activeDot={false} />
            <Area type="monotone" dataKey="pbCiSpan" stackId="pb" stroke="none" fill="#2563eb" fillOpacity={0.18} legendType="none" tooltipType="none" dot={false} activeDot={false} />
            <Area type="monotone" dataKey="tnCiLow"  stackId="tn" stroke="none" fill="transparent" legendType="none" tooltipType="none" dot={false} activeDot={false} />
            <Area type="monotone" dataKey="tnCiSpan" stackId="tn" stroke="none" fill="#ea580c" fillOpacity={0.18} legendType="none" tooltipType="none" dot={false} activeDot={false} />
            {/* Lines on top */}
            <Line type="monotone" dataKey="pickleball" name="Pickleball" stroke="#2563eb" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="tennis" name="Tennis" stroke="#ea580c" strokeWidth={2} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
