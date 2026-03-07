# Skill Issue or Scoring Issue?

Built for the CS109 Challenge at Stanford.

## Overview

A probabilistic analysis of pickleball vs. tennis scoring systems. The core question: if two players differ by a small margin of skill, does the scoring system determine who wins more than the skill itself?

All win probabilities are estimated by simulating N = 2,000 independent matches per skill level, with 95% confidence intervals computed via nonparametric bootstrap (B = 1,000 resamples). The CLT justifies treating the sample win rate as approximately normal, validating the bootstrap intervals.

## Sections

- **Win Probability** — how a rally-skill edge translates into match wins across both sports
- **Upset Probability** — how often the stronger player still loses
- **Comeback Explorer** — win probability from any mid-game score state
- **Match Simulator** — step through a pickleball game rally by rally
- **Writeup** — full methodology, derivations, and results

## Stack

- React + Vite
- Recharts
- Tailwind CSS v4
- KaTeX

## Run locally

```bash
npm install
npm run dev
```
