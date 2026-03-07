import { InlineMath, BlockMath } from 'react-katex';

const S1 = () => (
  <div className="mb-8">
    <h3 className="text-base font-semibold text-slate-700 mb-3 flex items-center gap-2">
      <span className="text-slate-400 font-mono text-sm">§1</span> Rally Model &amp; Scoring Rules
    </h3>
    <p className="text-slate-600 mb-3 leading-relaxed text-sm">
      Each rally is an independent Bernoulli trial. Let <InlineMath math="X_i" /> indicate
      whether Player&nbsp;A wins rally <InlineMath math="i" />:
    </p>
    <div className="bg-white border border-slate-200 rounded-lg p-4 mb-3 text-center">
      <BlockMath math="X_i \sim \text{Bernoulli}(p), \quad i = 1, 2, \ldots" />
    </div>
    <p className="text-slate-600 text-sm leading-relaxed mb-3">
      The total points scored by Player&nbsp;A in <InlineMath math="n" /> rallies is:
    </p>
    <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4 text-center">
      <BlockMath math="S_n = \sum_{i=1}^{n} X_i \sim \text{Binomial}(n,\, p)" />
    </div>
    <p className="text-slate-600 text-sm leading-relaxed mb-2">
      <strong>Side-out scoring (pickleball):</strong> Only the server earns a point on a
      won rally. If the non-server wins the rally, service transfers — no point is awarded.
      Let <InlineMath math="s_t \in \{A, B\}" /> be the server at time <InlineMath math="t" />.
      Then the scoring update is:
    </p>
    <div className="bg-white border border-slate-200 rounded-lg p-4 text-sm">
      <BlockMath math="\text{score}_A \mathrel{+}= \mathbf{1}[X_t = 1,\; s_t = A], \quad \text{score}_B \mathrel{+}= \mathbf{1}[X_t = 0,\; s_t = B]" />
      <BlockMath math="s_{t+1} = \begin{cases} A & \text{if } s_t = A \text{ and } X_t = 1 \\ B & \text{if } s_t = A \text{ and } X_t = 0 \\ B & \text{if } s_t = B \text{ and } X_t = 0 \\ A & \text{if } s_t = B \text{ and } X_t = 1 \end{cases}" />
    </div>
  </div>
);

const S2 = () => (
  <div className="mb-8">
    <h3 className="text-base font-semibold text-slate-700 mb-3 flex items-center gap-2">
      <span className="text-slate-400 font-mono text-sm">§2</span> Pickleball Win Probability
    </h3>
    <p className="text-slate-600 mb-3 leading-relaxed text-sm">
      Pickleball uses rally scoring where every rally produces a point. A game is won by
      the first player to reach 11 points with a margin of at least 2. The exact win
      probability at score state <InlineMath math="(a, b)" /> satisfies the recurrence:
    </p>
    <div className="bg-white border border-slate-200 rounded-lg p-4 mb-3">
      <BlockMath math="W(a,b) = p \cdot W(a+1,b) + (1-p) \cdot W(a,b+1)" />
    </div>
    <p className="text-slate-600 text-sm mb-2">with boundary conditions:</p>
    <div className="bg-white border border-slate-200 rounded-lg p-4">
      <BlockMath math="W(a,b) = \begin{cases} 1 & \text{if } a \geq 11,\; a - b \geq 2 \\ 0 & \text{if } b \geq 11,\; b - a \geq 2 \end{cases}" />
    </div>
  </div>
);

const S3 = () => (
  <div className="mb-8">
    <h3 className="text-base font-semibold text-slate-700 mb-3 flex items-center gap-2">
      <span className="text-slate-400 font-mono text-sm">§3</span> Tennis Win Probability
    </h3>
    <p className="text-slate-600 mb-3 leading-relaxed text-sm">
      Tennis is a hierarchical scoring system: points form games, games form sets,
      sets form matches (best-of-3). Let <InlineMath math="G(a,b)" /> be the probability
      of winning a game from point score <InlineMath math="(a,b)" />, and{' '}
      <InlineMath math="T(g_a, g_b)" /> the probability of winning a set:
    </p>
    <div className="bg-white border border-slate-200 rounded-lg p-4 mb-3">
      <BlockMath math="G(a,b) = p \cdot G(a+1,b) + (1-p)\cdot G(a,b+1)" />
      <BlockMath math="T(g_a,g_b) = G_{\text{win}} \cdot T(g_a+1,\,g_b) + (1-G_{\text{win}})\cdot T(g_a,\,g_b+1)" />
    </div>
    <p className="text-slate-600 text-sm leading-relaxed">
      The full match probability composes these layers. These are estimated via simulation:
    </p>
    <div className="bg-white border border-slate-200 rounded-lg p-4 mt-3 text-center">
      <BlockMath math="\hat{P}(\text{win}) = \frac{1}{N} \sum_{k=1}^{N} \mathbf{1}[\text{Player A wins match } k]" />
    </div>
  </div>
);

const S5 = () => (
  <div className="mb-8">
    <h3 className="text-base font-semibold text-slate-700 mb-3 flex items-center gap-2">
      <span className="text-slate-400 font-mono text-sm">§4</span> Upset &amp; Comeback Probability
    </h3>
    <p className="text-slate-600 mb-3 leading-relaxed text-sm">
      An <em>upset</em> occurs when the weaker player wins the match. The upset probability is:
    </p>
    <div className="bg-white border border-slate-200 rounded-lg p-4 mb-3 text-center">
      <BlockMath math="P(\text{upset}) = 1 - P(\text{win match} \mid p)" />
    </div>
    <p className="text-slate-600 text-sm leading-relaxed">
      A <em>comeback</em> probability is the conditional probability of winning given
      a trailing score state <InlineMath math="(a, b)" /> with <InlineMath math="a < b" />.
      It is estimated by running simulations starting from{' '}
      <InlineMath math="(a, b)" /> rather than <InlineMath math="(0, 0)" />.
    </p>
  </div>
);

const S6 = () => (
  <div className="mb-4">
    <h3 className="text-base font-semibold text-slate-700 mb-3 flex items-center gap-2">
      <span className="text-slate-400 font-mono text-sm">§5</span> Uncertainty — Nonparametric Bootstrap
    </h3>
    <p className="text-slate-600 mb-3 leading-relaxed text-sm">
      Win probability estimates are binary outcomes (<InlineMath math="W_k \in \{0,1\}" />).
      Uncertainty is quantified with a <strong>nonparametric bootstrap</strong> on the 0/1 win
      array. With <InlineMath math="B" /> bootstrap resamples of size <InlineMath math="N" />:
    </p>
    <div className="bg-white border border-slate-200 rounded-lg p-4 mb-3 text-center">
      <BlockMath math="\hat{p}^{*(b)} = \frac{1}{N}\sum_{k=1}^{N} W_k^{*(b)}, \quad b = 1, \ldots, B" />
    </div>
    <p className="text-slate-600 text-sm leading-relaxed mb-2">
      The 95% percentile confidence interval is:
    </p>
    <div className="bg-white border border-slate-200 rounded-lg p-4 mb-3 text-center">
      <BlockMath math="\text{CI}_{0.95} = \left[\hat{p}^{*(0.025)},\; \hat{p}^{*(0.975)}\right]" />
    </div>
    <p className="text-slate-600 text-sm leading-relaxed">
      Bootstrap standard error:{' '}
      <InlineMath math="\hat{\sigma}_{\text{boot}} = \text{std}\!\left(\hat{p}^{*(1)},\ldots,\hat{p}^{*(B)}\right)" />.
      With <InlineMath math="N = 2{,}000" /> trials and <InlineMath math="B = 1{,}000" />{' '}
      resamples, the typical half-width is approximately <InlineMath math="\pm 0.022" />.
    </p>
  </div>
);

const SECTION_MAP = {
  skill:     [S1, S3],
  upset:     [S1, S5],
  comeback:  [S2, S5],
  simulator: [S1],
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
