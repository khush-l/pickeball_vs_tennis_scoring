import { InlineMath, BlockMath } from 'react-katex';

/* §1 — Probabilistic Model (Bernoulli rallies + Binomial + scoring rules) */
const S1 = () => (
  <div className="mb-8">
    <h3 className="text-base font-semibold text-slate-700 mb-3 flex items-center gap-2">
      <span className="text-slate-400 font-mono text-sm">§1</span> Probabilistic Model
    </h3>
    <p className="text-slate-600 mb-3 leading-relaxed text-sm">
      Each rally is modeled as an independent Bernoulli trial. Let{' '}
      <InlineMath math="X_i" /> indicate whether Player&nbsp;A wins rally{' '}
      <InlineMath math="i" />:
    </p>
    <div className="bg-white border border-slate-200 rounded-lg p-4 mb-3 text-center">
      <BlockMath math="X_i \sim \text{Bernoulli}(p), \quad i = 1, 2, \ldots" />
    </div>
    <p className="text-slate-600 text-sm leading-relaxed mb-3">
      where <InlineMath math="p = P(\text{A wins a rally})" />. When{' '}
      <InlineMath math="p = 0.5" /> both players are equal; when{' '}
      <InlineMath math="p > 0.5" /> Player&nbsp;A is stronger. For{' '}
      <InlineMath math="n" /> rallies, the number won by A is:
    </p>
    <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4 text-center">
      <BlockMath math="S_n = \sum_{i=1}^{n} X_i \sim \text{Binomial}(n,\, p)" />
    </div>
    <p className="text-slate-600 text-sm leading-relaxed mb-2">
      with <InlineMath math="\mathbb{E}[S_n] = np" /> and{' '}
      <InlineMath math="\text{Var}(S_n) = np(1-p)" />. The scoring system then
      determines how this rally-level advantage translates into match outcomes.
    </p>
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mt-3 text-sm">
      <p className="text-slate-600 mb-1">
        <strong>Pickleball (side-out scoring):</strong> Only the serving player earns a
        point on a won rally. If the receiver wins, service transfers but no point is
        awarded. First to 11, win by&nbsp;2.
      </p>
      <p className="text-slate-600">
        <strong>Tennis (rally scoring):</strong> Every rally produces a point.
        Points form games (first to 4, win by&nbsp;2); games form a set (first to 6,
        win by&nbsp;2; tiebreak at 6&ndash;6).
      </p>
    </div>
  </div>
);

/* §2 — Sampling and Estimation (CLT + bootstrap) */
const S2 = () => (
  <div className="mb-8">
    <h3 className="text-base font-semibold text-slate-700 mb-3 flex items-center gap-2">
      <span className="text-slate-400 font-mono text-sm">§2</span> Sampling and Estimation
    </h3>
    <p className="text-slate-600 mb-3 leading-relaxed text-sm">
      Exact match probabilities are difficult to compute analytically. Instead, for a
      fixed <InlineMath math="p" />, <InlineMath math="N = 2{,}000" /> independent matches
      are simulated. Let <InlineMath math="W_j \in \{0,1\}" /> indicate whether Player&nbsp;A
      wins match <InlineMath math="j" />. The estimated win probability is the sample mean:
    </p>
    <div className="bg-white border border-slate-200 rounded-lg p-4 mb-3 text-center">
      <BlockMath math="\hat{p} = \frac{1}{N} \sum_{j=1}^{N} W_j" />
    </div>
    <p className="text-slate-600 text-sm leading-relaxed mb-3">
      Since each <InlineMath math="W_j" /> is Bernoulli, by the{' '}
      <strong>Central Limit Theorem</strong> the sampling distribution of{' '}
      <InlineMath math="\hat{p}" /> is approximately normal for large{' '}
      <InlineMath math="N" />:
    </p>
    <div className="bg-white border border-slate-200 rounded-lg p-4 mb-3 text-center">
      <BlockMath math="\hat{p} \approx \mathcal{N}\!\left(p,\; \frac{p(1-p)}{N}\right)" />
    </div>
    <p className="text-slate-600 text-sm leading-relaxed mb-2">
      This gives the standard error:
    </p>
    <div className="bg-white border border-slate-200 rounded-lg p-4 mb-3 text-center">
      <BlockMath math="\mathrm{SE}(\hat{p}) \approx \sqrt{\frac{p(1-p)}{N}}" />
    </div>
    <p className="text-slate-600 text-sm leading-relaxed">
      In addition, uncertainty is quantified with a <strong>nonparametric bootstrap</strong>:{' '}
      <InlineMath math="B = 1{,}000" /> resamples are drawn with replacement from the{' '}
      <InlineMath math="N" /> simulated outcomes. The 95% bootstrap confidence interval is:
    </p>
    <div className="bg-white border border-slate-200 rounded-lg p-4 mt-3 text-center">
      <BlockMath math="\hat{p}^{*(b)} = \frac{1}{N}\sum_{j=1}^{N} W_j^{*(b)}, \qquad \mathrm{CI}_{0.95} = \!\left[\hat{p}^{*(0.025)},\; \hat{p}^{*(0.975)}\right]" />
    </div>
    <p className="text-slate-600 text-sm leading-relaxed mt-3">
      With <InlineMath math="N = 2{,}000" /> and <InlineMath math="B = 1{,}000" />,
      the bootstrap intervals agree closely with the CLT approximation; the typical
      half-width is approximately <InlineMath math="\pm 0.022" />.
    </p>
  </div>
);

/* §3 — Upset and Comeback Probability */
const S3 = () => (
  <div className="mb-8">
    <h3 className="text-base font-semibold text-slate-700 mb-3 flex items-center gap-2">
      <span className="text-slate-400 font-mono text-sm">§3</span> Upset &amp; Comeback Probability
    </h3>
    <p className="text-slate-600 mb-3 leading-relaxed text-sm">
      An <em>upset</em> occurs when the weaker player (<InlineMath math="p > 0.5" />)
      still loses the match. The upset probability is estimated as:
    </p>
    <div className="bg-white border border-slate-200 rounded-lg p-4 mb-3 text-center">
      <BlockMath math="P(\text{upset}) = 1 - \hat{p}" />
    </div>
    <p className="text-slate-600 text-sm leading-relaxed">
      A <em>comeback</em> probability is estimated by starting simulations from a
      trailing score state <InlineMath math="(a, b)" /> with <InlineMath math="a < b" />
      {' '}rather than from <InlineMath math="(0, 0)" />. In pickleball, the server at
      that state also matters: since only the server can score, holding serve from a
      deficit leads to a meaningfully different win probability than receiving.
    </p>
  </div>
);

const SECTION_MAP = {
  skill:    [S1, S2],
  upset:    [S1, S2, S3],
  comeback: [S1, S2, S3],
};

export default function MathSection({ section }) {
  const blocks = SECTION_MAP[section];
  if (!blocks) return null;

  return (
    <div className="mt-10 border-t border-stone-200 pt-8">
      <p className="text-xs uppercase tracking-widest text-stone-400 font-semibold mb-6">
        Mathematical Background
      </p>
      {blocks.map((Block, i) => <Block key={i} />)}
    </div>
  );
}
