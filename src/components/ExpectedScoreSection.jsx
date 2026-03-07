import { useState } from 'react';
import { expectedPickleballScore, expectedTennisScore } from '../simulation';

export default function ExpectedScoreSection() {
  const [p, setP] = useState(0.55);
  const [scores, setScores] = useState(null);
  const [loading, setLoading] = useState(false);

  const compute = () => {
    setLoading(true);
    setTimeout(() => {
      const pb = expectedPickleballScore(p, 3000);
      const tn = expectedTennisScore(p, 800);
      setScores({ pb, tn });
      setLoading(false);
    }, 0);
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Expected Score</h2>
        <p className="text-slate-500 leading-relaxed">
          How does the average final score look? Set a rally probability and compute the
          expected scoreline — this connects directly to expected value from probability theory.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-8">
        <label className="block text-sm font-semibold text-slate-600 mb-2">
          Rally win probability{' '}
          <span className="font-mono text-blue-700">p = {p.toFixed(2)}</span>
        </label>
        <input
          type="range" min="0.50" max="0.80" step="0.01" value={p}
          onChange={(e) => { setP(parseFloat(e.target.value)); setScores(null); }}
          className="w-full accent-blue-600 h-2 cursor-pointer mb-4"
        />
        <button
          onClick={compute}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
        >
          {loading ? 'Computing...' : 'Compute expected score'}
        </button>
      </div>

      {scores && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Pickleball */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <p className="text-xs uppercase tracking-widest text-blue-400 font-semibold mb-4">Pickleball — avg game score</p>
            <div className="flex items-end gap-4">
              <div className="text-center">
                <p className="text-xs text-blue-400 mb-1">Player A</p>
                <p className="text-5xl font-extrabold text-blue-700">{scores.pb.a}</p>
              </div>
              <p className="text-2xl text-blue-300 mb-2">–</p>
              <div className="text-center">
                <p className="text-xs text-slate-400 mb-1">Player B</p>
                <p className="text-5xl font-extrabold text-slate-500">{scores.pb.b}</p>
              </div>
            </div>
          </div>
          {/* Tennis */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
            <p className="text-xs uppercase tracking-widest text-orange-400 font-semibold mb-4">Tennis — avg sets won</p>
            <div className="flex items-end gap-4">
              <div className="text-center">
                <p className="text-xs text-orange-400 mb-1">Player A</p>
                <p className="text-5xl font-extrabold text-orange-600">{scores.tn.a}</p>
              </div>
              <p className="text-2xl text-orange-300 mb-2">–</p>
              <div className="text-center">
                <p className="text-xs text-slate-400 mb-1">Player B</p>
                <p className="text-5xl font-extrabold text-slate-500">{scores.tn.b}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
