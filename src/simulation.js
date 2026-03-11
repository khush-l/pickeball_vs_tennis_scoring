// ─────────────────────────────────────────────────────────────────────────────
// simulation.js — aligned with the CS109 Python analysis
//
// Key modelling choices (matching the paper):
//   • X_i ~ Bernoulli(p)  per rally, independent
//   • Pickleball uses SIDE-OUT scoring: only the current server scores a point.
//     If the non-server wins the rally, service transfers — no point is awarded.
//     First to WIN_SCORE (11) win by WIN_BY (2).
//   • Tennis: standard point→game→set hierarchy. Comparison is at the *set*
//     level (matching simulate_tennis_set in the paper), not best-of-3.
//   • Uncertainty: nonparametric bootstrap on 0/1 win arrays, 95 % CI.
// ─────────────────────────────────────────────────────────────────────────────


// ─── §0  Bernoulli sample ─────────────────────────────────────────────────────
// X_i ~ Bernoulli(p).  Returns true if Player A wins rally i.
function wonRally(p) {
  return Math.random() < p;
}


// ─── §1  Pickleball game — side-out scoring ───────────────────────────────────
// Only the server earns a point on a won rally.
// A lost rally by the server → side-out (service passes), no point scored.
// First to WIN_SCORE with a margin of at least WIN_BY.
//
// Parameters
//   p        : P(A wins any rally)
//   startA   : A's starting score (default 0)
//   startB   : B's starting score (default 0)
//   server   : 'A' or 'B' — who is serving first
export function pickleballGame(p, startA = 0, startB = 0, server = 'A',
                                winScore = 11, winBy = 2) {
  let a = startA, b = startB;
  let currentServer = server;
  while (true) {
    const aWon = wonRally(p);
    if (currentServer === 'A') {
      if (aWon) { a++; }             // server wins rally → point + keep serve
      else      { currentServer = 'B'; }  // server loses → side-out, no point
    } else {
      if (!aWon) { b++; }            // B (server) wins rally
      else       { currentServer = 'A'; } // B loses → side-out
    }
    if ((a >= winScore || b >= winScore) && Math.abs(a - b) >= winBy) break;
  }
  return { winner: a > b ? 'A' : 'B', scoreA: a, scoreB: b };
}

// Convenience wrapper — returns boolean (A won?)
function pickleballGameWon(p, startA = 0, startB = 0, server = 'A') {
  return pickleballGame(p, startA, startB, server).winner === 'A';
}


// ─── Tennis game: standard points (0-15-30-40-deuce) ─────────────────────────
// First to 4 points, win by 2.
function tennisGame(p) {
  let a = 0, b = 0;
  while (true) {
    if (wonRally(p)) a++; else b++;
    if (a >= 4 && b >= 4) {
      if (Math.abs(a - b) >= 2) return a > b;
    } else if (a >= 4 && a - b >= 2) return true;
    else if (b >= 4 && b - a >= 2) return false;
  }
}

// ─── Tennis set: first to 6 games win by 2, tiebreak at 6-6 ──────────────────
// Comparison unit in the paper is a *set* (not a full match).
function tennisSetPlay(p, startGA = 0, startGB = 0) {
  let ga = startGA, gb = startGB;
  while (true) {
    if (tennisGame(p)) ga++; else gb++;
    if (ga === 7 || gb === 7) return { winner: ga > gb ? 'A' : 'B', gamesA: ga, gamesB: gb };
    if (ga === 6 && gb === 6) {
      // tiebreak: first to 7 win by 2
      let ta = 0, tb = 0;
      while (true) {
        if (wonRally(p)) ta++; else tb++;
        if ((ta >= 7 || tb >= 7) && Math.abs(ta - tb) >= 2) break;
      }
      return { winner: ta > tb ? 'A' : 'B', gamesA: ga, gamesB: gb };
    }
    if ((ga >= 6 || gb >= 6) && Math.abs(ga - gb) >= 2)
      return { winner: ga > gb ? 'A' : 'B', gamesA: ga, gamesB: gb };
  }
}

// Convenience wrapper used by estimateWinProb / curve builder
export function tennisSet(p) {
  return tennisSetPlay(p).winner === 'A';
}

// ─── Tennis match: best-of-3 sets (kept for reference) ───────────────────────
export function tennisMatch(p) {
  let sa = 0, sb = 0;
  while (sa < 2 && sb < 2) {
    if (tennisSet(p)) sa++; else sb++;
  }
  return sa > sb;
}


// ─── §2  Nonparametric bootstrap CI ──────────────────────────────────────────
// Matches bootstrap_mean_ci() in the Python paper.
// wins : Float32Array or plain array of 0/1
// Returns { mean, ciLow, ciHigh, bootSE }
export function bootstrapCI(wins, nBoot = 1000, alpha = 0.05) {
  const n = wins.length;
  const bootMeans = new Float32Array(nBoot);
  for (let b = 0; b < nBoot; b++) {
    let s = 0;
    for (let i = 0; i < n; i++) s += wins[Math.floor(Math.random() * n)];
    bootMeans[b] = s / n;
  }
  const sorted = bootMeans.slice().sort();
  const loIdx = Math.floor(nBoot * (alpha / 2));
  const hiIdx = Math.floor(nBoot * (1 - alpha / 2));
  const mean = wins.reduce((acc, v) => acc + v, 0) / n;
  // bootstrap SE
  let sumSq = 0;
  for (let i = 0; i < nBoot; i++) sumSq += (sorted[i] - mean) ** 2;
  const bootSE = Math.sqrt(sumSq / (nBoot - 1));
  return {
    mean: parseFloat(mean.toFixed(4)),
    ciLow: parseFloat(sorted[loIdx].toFixed(4)),
    ciHigh: parseFloat(sorted[hiIdx].toFixed(4)),
    bootSE: parseFloat(bootSE.toFixed(4)),
  };
}


// ─── §3  Estimate win probability with bootstrap CI ───────────────────────────
// matchFn(p) → bool
export function estimateWinProb(matchFn, p, n = 2000) {
  const wins = new Float32Array(n);
  for (let i = 0; i < n; i++) wins[i] = matchFn(p) ? 1 : 0;
  return bootstrapCI(wins);   // { mean, ciLow, ciHigh, bootSE }
}


// ─── §4  Precompute curves over p ∈ [0.50, 0.80] ─────────────────────────────
// Returns array of { p, pickleball, tennis, pbUpset, tnUpset,
//                    pbCiLow, pbCiHigh, tnCiLow, tnCiHigh }
// Uses pickleballGame with default A-serving at (0,0) to match Python's
// simulate_pickleball_game(p) and simulate_tennis_set(p).
export function buildCurveData(n = 2000) {
  const points = [];
  for (let i = 0; i <= 30; i++) {
    const p = 0.50 + i * (0.30 / 30);
    // randomize starting server each trial so neither player has a structural advantage
    const pbRes = estimateWinProb((pp) => pickleballGameWon(pp, 0, 0, Math.random() < 0.5 ? 'A' : 'B'), p, n);
    const tnRes = estimateWinProb(tennisSet, p, n);
    points.push({
      p: parseFloat(p.toFixed(3)),
      pickleball: pbRes.mean,
      tennis:     tnRes.mean,
      pbUpset:    parseFloat((1 - pbRes.mean).toFixed(4)),
      tnUpset:    parseFloat((1 - tnRes.mean).toFixed(4)),
      pbCiLow:    pbRes.ciLow,
      pbCiHigh:   pbRes.ciHigh,
      tnCiLow:    tnRes.ciLow,
      tnCiHigh:   tnRes.ciHigh,
    });
  }
  return points;
}


// ─── §5  Pickleball comeback ──────────────────────────────────────────────────
// Matches estimate_pickleball_comeback() in the paper.
// server: 'A' or 'B'
// Returns { mean, ciLow, ciHigh, bootSE }
export function pickleballComeback(p, aScore, bScore, server = 'A', trials = 2000) {
  const wins = new Float32Array(trials);
  for (let t = 0; t < trials; t++) {
    wins[t] = pickleballGame(p, aScore, bScore, server).winner === 'A' ? 1 : 0;
  }
  return bootstrapCI(wins);
}


// ─── §6  Tennis comeback ──────────────────────────────────────────────────────
// Matches estimate_tennis_comeback() in the paper.
// aGames, bGames: games already won in the current set
// Returns { mean, ciLow, ciHigh, bootSE }
export function tennisComeback(p, aGames, bGames, trials = 2000) {
  const wins = new Float32Array(trials);
  for (let t = 0; t < trials; t++) {
    wins[t] = tennisSetPlay(p, aGames, bGames).winner === 'A' ? 1 : 0;
  }
  return bootstrapCI(wins);
}


// ─── §7  Step-by-step pickleball simulator (for the Match Simulator tab) ──────
// Returns { log: [{rally, server, winner, aScore, bScore}], winner }
// Uses side-out scoring, starting server = A.
export function simulatePickleballGame(p) {
  const log = [];
  let a = 0, b = 0, currentServer = 'A', rally = 0;
  while (true) {
    rally++;
    const aWon = wonRally(p);
    const serverThisRally = currentServer;
    if (currentServer === 'A') {
      if (aWon)  { a++; }
      else       { currentServer = 'B'; }
    } else {
      if (!aWon) { b++; }
      else       { currentServer = 'A'; }
    }
    log.push({ rally, server: serverThisRally, winner: aWon ? 'A' : 'B', aScore: a, bScore: b });
    if ((a >= 11 || b >= 11) && Math.abs(a - b) >= 2) break;
  }
  return { log, winner: a > b ? 'A' : 'B' };
}


// ─── §8  Expected score ───────────────────────────────────────────────────────
export function expectedPickleballScore(p, trials = 4000) {
  let totalA = 0, totalB = 0;
  for (let t = 0; t < trials; t++) {
    const { scoreA, scoreB } = pickleballGame(p);
    totalA += scoreA; totalB += scoreB;
  }
  return { a: (totalA / trials).toFixed(1), b: (totalB / trials).toFixed(1) };
}

// Tennis expected score: average games won per set
export function expectedTennisScore(p, trials = 1500) {
  let totalGA = 0, totalGB = 0;
  for (let t = 0; t < trials; t++) {
    const { gamesA, gamesB } = tennisSetPlay(p);
    totalGA += gamesA; totalGB += gamesB;
  }
  return { a: (totalGA / trials).toFixed(1), b: (totalGB / trials).toFixed(1) };
}
