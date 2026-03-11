const SECTIONS = [
  {
    id: 'skill',
    label: 'Win Probability',
    desc: 'How a small skill edge translates into winning the match.',
    color: '#3b82f6',
  },
  {
    id: 'upset',
    label: 'Upset Probability',
    desc: 'How often the better player still loses.',
    color: '#f97316',
  },
  {
    id: 'comeback',
    label: 'Comeback Explorer',
    desc: 'Enter any score state and compute the comeback win probability.',
    color: '#8b5cf6',
  },
  {
    id: 'writeup',
    label: 'Writeup',
    desc: 'Methodology, derivations, simulation design, and results.',
    color: '#f59e0b',
  },
];

const STATS = [
  { value: 'p', label: 'One parameter', sub: 'P(A wins a rally)' },
  { value: '2k', label: 'Trials per point', sub: 'CLT normal approximation' },
  { value: '1k', label: 'Bootstrap resamples', sub: '95% CI per estimate' },
];

export default function IntroSection({ onNavigate }) {
  return (
    <div>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden"
        style={{ background: 'var(--color-navy)', minHeight: '92vh' }}
      >
        {/* Decorative blobs */}
        <div
          className="absolute -top-32 -right-40 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: 'var(--color-pb)' }}
        />
        <div
          className="absolute -bottom-40 -left-32 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: 'var(--color-tn)' }}
        />

        {/* Two-column layout */}
        <div className="relative z-10 max-w-6xl mx-auto px-8 pt-24 pb-20 flex flex-col lg:flex-row items-center gap-12">

          {/* Left: text */}
          <div className="flex-1 flex flex-col items-start">

            {/* Title */}
            <h1
              className="text-white mb-6 leading-[1.05]"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
                fontWeight: 900,
              }}
            >
              Skill Issue<br />
              <span style={{ color: 'var(--color-accent)' }}>or</span>{' '}
              Scoring Issue?
            </h1>

            {/* Subtitle */}
            <p
              className="text-stone-300 mb-10 max-w-lg leading-relaxed"
              style={{ fontSize: 'clamp(1rem, 1.8vw, 1.15rem)' }}
            >
              This project compares <span style={{ color: '#93c5fd' }}>pickleball</span> and{' '}
              <span style={{ color: '#fdba74' }}>tennis</span>: if two players differ
              by a tiny margin of skill, does the <em>scoring system</em> decide who wins?
            </p>

            {/* Stat pills */}
            <div className="flex flex-wrap gap-3 mb-10">
              {STATS.map(({ value, label, sub }) => (
                <div
                  key={label}
                  className="rounded-xl px-5 py-4 border border-white/10"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  <p
                    className="text-white font-bold leading-none mb-1"
                    style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}
                  >
                    {value}
                  </p>
                  <p className="text-stone-400 text-xs">{label}</p>
                  <p className="text-stone-500 text-xs">{sub}</p>
                </div>
              ))}
            </div>

          </div>

          {/* Right: meme image */}
          <div className="flex-shrink-0 flex flex-col items-center gap-3 ml-8">
            <div
              className="overflow-hidden border-2 border-white/10 shadow-2xl"
              style={{ width: 'clamp(200px, 20vw, 280px)' }}
            >
              <img
                src="/skill-issue.jpg"
                alt="Skill issue meme"
                className="w-full h-auto block"
              />
            </div>
            <p className="text-stone-600 text-xs italic">the defense of every losing player</p>
          </div>

        </div>

        {/* Scroll hint removed */}
      </div>

      {/* ── Section cards ────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-8 py-20">
        <h2
          className="mb-2 text-stone-800"
          style={{ fontFamily: 'var(--font-display)', fontSize: '2rem' }}
        >
          Explore the analysis
        </h2>
        <p className="text-stone-500 mb-10 text-sm">
          Each section is an interactive tool backed by the same probability model.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SECTIONS.map(({ id, label, desc, color }) => (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className="group text-left rounded-2xl p-6 border border-stone-200 bg-white
                         hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              {/* Color bar */}
              <div
                className="w-8 h-1 rounded-full mb-4 transition-all duration-200 group-hover:w-14"
                style={{ background: color }}
              />
              <p
                className="font-semibold text-stone-800 mb-2 text-base"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {label}
              </p>
              <p className="text-stone-500 text-sm leading-relaxed">{desc}</p>
              <p
                className="mt-4 text-xs font-semibold uppercase tracking-widest"
                style={{ color }}
              >
                Open →
              </p>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}

