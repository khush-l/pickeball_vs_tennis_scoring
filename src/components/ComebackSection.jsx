import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ErrorBar,
} from 'recharts';
import { pickleballComeback, tennisComeback } from '../simulation';

const P_VALUES = [0.50, 0.52, 0.55, 0.58, 0.60, 0.65];

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

export default function ComebackSection() {
  const [sport, setSport] = useState('pb');
  // Pickleball state
  const [pbA, setPbA] = useState(6);
  const [pbB, setPbB] = useState(10);
  const [server, setServer] = useState('A');  // side-out scoring: who holds serve matters
  // Tennis state
  const [tnA, setTnA] = useState(2);
  const [tnB, setTnB] = useState(5);

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validate = () => {
    if (sport === 'pb') {
      if (pbA < 0 || pbA > 30 || pbB < 0 || pbB > 30) return 'Scores must be between 0 and 30.';
    } else {
      if (tnA < 0 || tnA > 6 || tnB < 0 || tnB > 6) return 'Game scores must be 0–6.';
    }
    return '';
  };

  const compute = () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    setLoading(true);
    setTimeout(() => {
      const data = P_VALUES.map((pv) => {
        const res =
          sport === 'pb'
            ? pickleballComeback(pv, pbA, pbB, server)
            : tennisComeback(pv, tnA, tnB);
        return {
          p: pv.toFixed(2),
          prob: parseFloat((res.mean * 100).toFixed(1)),
          // ErrorBar expects [low_delta, high_delta]
          ciErr: [
            parseFloat(((res.mean - res.ciLow) * 100).toFixed(1)),
            parseFloat(((res.ciHigh - res.mean) * 100).toFixed(1)),
          ],
          ciLow:  parseFloat((res.ciLow * 100).toFixed(1)),
          ciHigh: parseFloat((res.ciHigh * 100).toFixed(1)),
        };
      });
      setResults(data);
      setLoading(false);
    }, 0);
  };

  const scoreLabel = sport === 'pb'
    ? `Pickleball: ${pbA}–${pbB}, ${server} serving`
    : `Tennis: ${tnA}–${tnB} games in set`;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Comeback Explorer</h2>
        <p className="text-slate-500 leading-relaxed">
          Enter any score state and compute the probability that Player A wins from that
          position across a range of rally skill values. Pickleball uses{' '}
          <strong>side-out scoring</strong>: only the server earns a point on a won rally,
          so who holds serve at a given moment matters.
          Error bars show 95% bootstrap confidence intervals.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
        {/* Sport selector */}
        <div className="flex gap-2 mb-6">
          {[['pb', 'Pickleball'], ['tn', 'Tennis']].map(([id, label]) => (
            <button
              key={id}
              onClick={() => { setSport(id); setResults(null); setError(''); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${sport === id
                  ? id === 'pb' ? 'bg-blue-600 text-white' : 'bg-orange-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Score inputs */}
        {sport === 'pb' ? (
          <div>
            <p className="text-sm font-semibold text-slate-600 mb-3">
              Current game score (side-out scoring, first to 11 win by 2)
            </p>
            <div className="flex items-center gap-4 flex-wrap mb-4">
              <label className="flex flex-col gap-1">
                <span className="text-xs text-slate-500">Player A score</span>
                <input
                  type="number" min="0" max="30" value={pbA}
                  onChange={(e) => { setPbA(clamp(parseInt(e.target.value) || 0, 0, 30)); setResults(null); }}
                  className="w-24 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </label>
              <span className="text-slate-400 font-bold text-lg mt-4">–</span>
              <label className="flex flex-col gap-1">
                <span className="text-xs text-slate-500">Player B score</span>
                <input
                  type="number" min="0" max="30" value={pbB}
                  onChange={(e) => { setPbB(clamp(parseInt(e.target.value) || 0, 0, 30)); setResults(null); }}
                  className="w-24 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </label>
            </div>
            {/* Server toggle — matters because only the server scores */}
            <div>
              <p className="text-xs text-slate-500 mb-2">Who is currently serving?</p>
              <div className="flex gap-2">
                {[['A', 'A serving'], ['B', 'B serving']].map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() => { setServer(val); setResults(null); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                      ${server === val
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-sm font-semibold text-slate-600 mb-3">Games won in current set (first to 6, win by 2, tiebreak at 6–6)</p>
            <div className="flex items-center gap-4 flex-wrap">
              <label className="flex flex-col gap-1">
                <span className="text-xs text-slate-500">Player A games</span>
                <input
                  type="number" min="0" max="6" value={tnA}
                  onChange={(e) => { setTnA(clamp(parseInt(e.target.value) || 0, 0, 6)); setResults(null); }}
                  className="w-24 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </label>
              <span className="text-slate-400 font-bold text-lg mt-4">–</span>
              <label className="flex flex-col gap-1">
                <span className="text-xs text-slate-500">Player B games</span>
                <input
                  type="number" min="0" max="6" value={tnB}
                  onChange={(e) => { setTnB(clamp(parseInt(e.target.value) || 0, 0, 6)); setResults(null); }}
                  className="w-24 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </label>
            </div>
          </div>
        )}

        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

        <button
          onClick={compute}
          disabled={loading}
          className={`mt-5 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors disabled:opacity-50
            ${sport === 'pb' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-orange-500 hover:bg-orange-600'}`}
        >
          {loading ? 'Computing...' : 'Compute comeback probability'}
        </button>
      </div>

      {results && (
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-1">
            Comeback probability: {scoreLabel}
          </p>
          <p className="text-xs text-slate-400 mb-4">Error bars = 95% bootstrap CI across p values</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={results} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="p" label={{ value: 'p', position: 'insideBottom', offset: -10, fontSize: 12 }} tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `${v}%`} domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(v, name, props) =>
                  name === 'prob'
                    ? [`${v}%  (CI: ${props.payload.ciLow}%–${props.payload.ciHigh}%)`, 'Win probability']
                    : null
                }
                labelFormatter={(v) => `p = ${v}`}
              />
              <Bar dataKey="prob" radius={[5, 5, 0, 0]}>
                <ErrorBar dataKey="ciErr" width={4} strokeWidth={1.5} stroke={sport === 'pb' ? '#1d4ed8' : '#c2410c'} />
                {results.map((_, i) => (
                  <Cell key={i} fill={sport === 'pb' ? '#2563eb' : '#ea580c'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-3 sm:grid-cols-6 gap-2">
            {results.map(({ p: pv, prob, ciLow, ciHigh }) => (
              <div key={pv} className={`text-center rounded-lg py-3 px-1 ${sport === 'pb' ? 'bg-blue-50' : 'bg-orange-50'}`}>
                <p className="font-mono text-xs text-slate-500">p = {pv}</p>
                <p className={`text-xl font-bold ${sport === 'pb' ? 'text-blue-700' : 'text-orange-600'}`}>{prob}%</p>
                <p className="font-mono text-xs text-slate-400">[{ciLow}, {ciHigh}]</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
