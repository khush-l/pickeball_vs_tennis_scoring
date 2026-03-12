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
  { value: 'p', label: 'One parameter', sub: 'P(A wins rally)' },
  { value: '2k', label: 'Trials per point', sub: 'CLT approx.' },
  { value: '1k', label: 'Bootstrap resamples', sub: '95% CI' },
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
        <div className="relative z-10 w-full mx-auto px-8 pt-20 pb-16 flex flex-col lg:flex-row items-center gap-10" style={{ maxWidth: '1400px' }}>

          {/* Left: text */}
          <div className="flex flex-col items-start flex-shrink-0 relative" style={{ width: '500px' }}>
            {/* Meme watermark behind title */}
            <img
              src="/skill-issue.jpg"
              alt=""
              aria-hidden="true"
              className="absolute pointer-events-none select-none"
              style={{
                width: '220px',
                top: '-10px',
                left: '-20px',
                opacity: 0.12,
                transform: 'rotate(-8deg)',
                borderRadius: '8px',
              }}
            />
            {/* Title */}
            <h1
              className="text-white mb-6 leading-[1.05]"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.8rem, 5vw, 5rem)',
                fontWeight: 900,
              }}
            >
              Skill Issue<br />
              <span style={{ color: 'var(--color-accent)' }}>or</span>{' '}
              Scoring Issue?
            </h1>

            {/* Subtitle */}
            <p
              className="text-stone-300 mb-10 leading-relaxed"
              style={{ fontSize: '1.05rem' }}
            >
              This project compares <span style={{ color: '#93c5fd' }}>pickleball</span> and{' '}
              <span style={{ color: '#fdba74' }}>tennis</span>: if two players differ
              by a tiny margin of skill, does the <em>scoring system</em> decide who wins?
            </p>

            {/* Stat pills — all on one row */}
            <div className="flex gap-3 w-full">
              {STATS.map(({ value, label, sub }) => (
                <div
                  key={label}
                  className="flex-1 rounded-xl px-4 py-3 border border-white/10"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  <p
                    className="text-white font-bold leading-none mb-1"
                    style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}
                  >
                    {value}
                  </p>
                  <p className="text-stone-400 text-xs">{label}</p>
                  <p className="text-stone-500 text-xs">{sub}</p>
                </div>
              ))}
            </div>

          </div>

          {/* Right: image — takes remaining space, pushed to the right */}
          <div className="flex-1 min-w-0 flex justify-end">
            <div className="overflow-hidden rounded-2xl border-2 border-white/10 shadow-2xl" style={{ width: 'min(600px, 100%)' }}>
              <img
                src="https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/file-uploads/blogs/7966/images/587f05a-7ec6-7aac-0a41-a18f1f170674_tennis-vs-pickleball.jpg"
                alt="Tennis vs Pickleball"
                className="w-full h-auto block"
              />
            </div>
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

