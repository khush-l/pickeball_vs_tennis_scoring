import { useState } from 'react';
import { simulatePickleballGame } from '../simulation';

export default function SimulatorSection() {
  const [p, setP] = useState(0.55);
  const [result, setResult] = useState(null);
  const [step, setStep] = useState(0);

  const simulate = () => {
    const sim = simulatePickleballGame(p);
    setResult(sim);
    setStep(0);
  };

  const showAll = () => result && setStep(result.log.length);

  const visibleLog = result ? result.log.slice(0, step) : [];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Match Simulator</h2>
        <p className="text-slate-500 leading-relaxed">
          Simulate a pickleball game rally-by-rally and watch the score evolve. Each
          rally is an independent Bernoulli trial with probability{' '}
          <span className="font-mono">p</span>.
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6">
        <label className="block text-sm font-semibold text-slate-600 mb-2">
          Rally win probability{' '}
          <span className="font-mono text-blue-700">p = {p.toFixed(2)}</span>
        </label>
        <input
          type="range" min="0.50" max="0.80" step="0.01" value={p}
          onChange={(e) => { setP(parseFloat(e.target.value)); setResult(null); }}
          className="w-full accent-blue-600 h-2 cursor-pointer mb-4"
        />
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={simulate}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
          >
            Simulate game
          </button>
          {result && step < result.log.length && (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
            >
              Next rally
            </button>
          )}
          {result && step < result.log.length && (
            <button
              onClick={showAll}
              className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm px-5 py-2 rounded-lg transition-colors"
            >
              Show all
            </button>
          )}
        </div>
      </div>

      {/* Log */}
      {result && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="bg-slate-800 text-slate-100 px-5 py-3 font-mono text-xs flex justify-between items-center">
            <span>Pickleball — rally log</span>
            <span className="text-slate-400">p = {p.toFixed(2)}</span>
          </div>
          <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
            {visibleLog.map((rally, i) => (
              <div
                key={i}
                className={`flex items-center px-5 py-2 text-sm gap-4 ${rally.winner === 'A' ? 'bg-blue-50' : 'bg-orange-50'}`}
              >
                <span className="font-mono text-slate-400 w-8 text-right">{i + 1}.</span>
                <span className={`font-semibold w-20 ${rally.winner === 'A' ? 'text-blue-700' : 'text-orange-600'}`}>
                  {rally.winner === 'A' ? 'A wins' : 'B wins'}
                </span>
                <span className="font-mono text-slate-600">
                  Score: <strong>{rally.aScore}</strong> – <strong>{rally.bScore}</strong>
                </span>
              </div>
            ))}
          </div>

          {/* Final result */}
          {step >= result.log.length && (
            <div className={`px-5 py-4 text-center font-bold text-base tracking-wide ${result.winner === 'A' ? 'bg-blue-600 text-white' : 'bg-orange-500 text-white'}`}>
              Player {result.winner} wins{' '}
              {result.log[result.log.length - 1].aScore}–{result.log[result.log.length - 1].bScore}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
