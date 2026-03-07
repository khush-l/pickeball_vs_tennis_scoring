import { useState, useEffect, useCallback } from 'react';
import {
  ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, Legend, ResponsiveContainer,
} from 'recharts';
import { buildCurveData, estimateWinProb, pickleballGame, tennisSet } from '../simulation';

const CURVE_DATA = buildCurveData();

// Derive upset CI bounds from the win CI bounds (upset = 1 - win)
const UPSET_DATA = CURVE_DATA.map((d) => ({
  ...d,
  pbUpsetCiLow:  parseFloat((1 - d.pbCiHigh).toFixed(4)),
  pbUpsetCiHigh: parseFloat((1 - d.pbCiLow).toFixed(4)),
  tnUpsetCiLow:  parseFloat((1 - d.tnCiHigh).toFixed(4)),
  tnUpsetCiHigh: parseFloat((1 - d.tnCiLow).toFixed(4)),
}));

function pct(v) { return `${(v * 100).toFixed(1)}%`; }

export default function UpsetSection() {
  const [p, setP] = useState(0.55);
  const [pbRes, setPbRes] = useState(null);
  const [tnRes, setTnRes] = useState(null);
  const [loading, setLoading] = useState(false);

  const compute = useCallback((val) => {
    setLoading(true);
    setTimeout(() => {
      const pb = estimateWinProb((pp) => pickleballGame(pp).winner === 'A', val);
      const tn = estimateWinProb(tennisSet, val);
      setPbRes({ mean: 1 - pb.mean, ciLow: 1 - pb.ciHigh, ciHigh: 1 - pb.ciLow });
      setTnRes({ mean: 1 - tn.mean, ciLow: 1 - tn.ciHigh, ciHigh: 1 - tn.ciLow });
      setLoading(false);
    }, 0);
  }, []);

  useEffect(() => { compute(p); }, []);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Upset Probability</h2>
        <p className="text-slate-500 leading-relaxed">
          An <strong>upset</strong> occurs when the stronger player — Player A with{' '}
          <span className="font-mono">p &gt; 0.50</span> — still loses the match. Drag
          the slider to see how upset frequency changes with the skill gap.
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
          <p className="text-xs uppercase tracking-widest text-blue-400 font-semibold mb-2">Pickleball upset probability</p>
          <p className="text-5xl font-extrabold text-blue-700 mb-1">{loading || pbRes === null ? '—' : pct(pbRes.mean)}</p>
          {pbRes && !loading && (
            <p className="text-xs text-blue-400 font-mono">
              95% CI [{pct(pbRes.ciLow)}, {pct(pbRes.ciHigh)}]
            </p>
          )}
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
          <p className="text-xs uppercase tracking-widest text-orange-400 font-semibold mb-2">Tennis upset probability</p>
          <p className="text-5xl font-extrabold text-orange-600 mb-1">{loading || tnRes === null ? '—' : pct(tnRes.mean)}</p>
          {tnRes && !loading && (
            <p className="text-xs text-orange-400 font-mono">
              95% CI [{pct(tnRes.ciLow)}, {pct(tnRes.ciHigh)}]
            </p>
          )}
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-xl p-5 mb-6 text-sm text-slate-600 leading-relaxed">
        Pickleball produces more upsets than tennis across most skill levels. With
        side-out scoring only the server can score, compressing the final scoreline
        and leaving more room for variance to decide the outcome.
      </div>

      {/* Chart */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-1">Upset probability vs. rally skill</p>
        <p className="text-xs text-slate-400 mb-4">Narrow bands = 95% bootstrap CI</p>
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart
            data={UPSET_DATA.map(d => ({
              ...d,
              pbUpsetCiSpan: parseFloat((d.pbUpsetCiHigh - d.pbUpsetCiLow).toFixed(4)),
              tnUpsetCiSpan: parseFloat((d.tnUpsetCiHigh - d.tnUpsetCiLow).toFixed(4)),
            }))}
            margin={{ top: 5, right: 20, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="p" tickFormatter={(v) => v.toFixed(2)} label={{ value: 'Rally win probability p', position: 'insideBottom', offset: -12, fontSize: 12 }} tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} domain={[0, 0.55]} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v, name) => [`${(v * 100).toFixed(1)}%`, name]} labelFormatter={(v) => `p = ${v}`} />
            <Legend verticalAlign="top" />
            <ReferenceLine x={p.toFixed(3)} stroke="#94a3b8" strokeDasharray="4 2" label={{ value: `p = ${p.toFixed(2)}`, fontSize: 11, fill: '#64748b' }} />
            {/* CI bands: base at ciLow, span up to ciHigh */}
            <Area type="monotone" dataKey="pbUpsetCiLow"  stackId="pb" stroke="none" fill="transparent" legendType="none" tooltipType="none" dot={false} activeDot={false} />
            <Area type="monotone" dataKey="pbUpsetCiSpan" stackId="pb" stroke="none" fill="#2563eb" fillOpacity={0.18} legendType="none" tooltipType="none" dot={false} activeDot={false} />
            <Area type="monotone" dataKey="tnUpsetCiLow"  stackId="tn" stroke="none" fill="transparent" legendType="none" tooltipType="none" dot={false} activeDot={false} />
            <Area type="monotone" dataKey="tnUpsetCiSpan" stackId="tn" stroke="none" fill="#ea580c" fillOpacity={0.18} legendType="none" tooltipType="none" dot={false} activeDot={false} />
            {/* Lines on top */}
            <Line type="monotone" dataKey="pbUpset" name="Pickleball" stroke="#2563eb" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="tnUpset" name="Tennis" stroke="#ea580c" strokeWidth={2} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
