import { useState } from 'react';
import IntroSection from './components/IntroSection';
import SkillSection from './components/SkillSection';
import UpsetSection from './components/UpsetSection';
import ComebackSection from './components/ComebackSection';
import MathSection from './components/MathSection';
import WriteupSection from './components/WriteupSection';

const TABS = [
  { id: 'intro',     label: 'Home' },
  { id: 'skill',     label: 'Win Probability' },
  { id: 'upset',     label: 'Upset Probability' },
  { id: 'comeback',  label: 'Comeback Explorer' },
  { id: 'writeup',   label: 'Writeup' },
];

function App() {
  const [active, setActive] = useState('intro');

  const content = {
    intro:     <IntroSection onNavigate={setActive} />,
    skill:     <><SkillSection /><MathSection section="skill" /></>,
    upset:     <><UpsetSection /><MathSection section="upset" /></>,
    comeback:  <><ComebackSection /><MathSection section="comeback" /></>,
    writeup:   <WriteupSection />,
  };

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: 'var(--color-bg)' }}>

      {/* ── Nav bar ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-stone-200 overflow-hidden">
        <div className="max-w-full mx-auto px-6 flex items-center justify-between">

          {/* Logo / wordmark */}
          <button
            onClick={() => setActive('intro')}
            className="py-3 flex items-center gap-2 shrink-0"
          >
            <span className="text-sm font-semibold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-navy)' }}>
              Skill Issue?
            </span>
          </button>

          {/* Tab links */}
          <nav className="overflow-x-auto">
            <div className="flex">
              {TABS.filter(t => t.id !== 'intro').map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setActive(id)}
                  className={`px-4 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                    ${active === id
                      ? 'border-lime-500 text-lime-600'
                      : 'border-transparent text-stone-400 hover:text-stone-700 hover:border-stone-300'
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </nav>
        </div>
      </header>

      {/* ── Page content ────────────────────────────────────────────────── */}
      <main className={active === 'intro' ? '' : 'max-w-5xl mx-auto px-6 py-10'}>
        {content[active]}
      </main>

    </div>
  );
}

export default App;
