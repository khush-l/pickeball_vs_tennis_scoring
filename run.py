import numpy as np
import matplotlib.pyplot as plt
from scipy import stats
import os
import inspect

OUT_DIR = os.path.dirname(os.path.abspath(__file__))


def rally_theory(p, n):
    X   = stats.bernoulli(p)
    S_n = stats.binom(n, p)
    return {
        'E_X':    X.mean(),
        'Var_X':  X.var(),
        'E_Sn':   S_n.mean(),
        'Var_Sn': S_n.var(),
    }


def simulate_pickleball(p, start_a=0, start_b=0, server='A', rng=None):
    # side-out scoring: only the server scores, first to 11 win by 2
    if rng is None:
        rng = np.random.default_rng()

    a = start_a
    b = start_b
    srv = server

    while True:
        a_won = rng.random() < p

        if srv == 'A':
            if a_won:
                a += 1
            else:
                srv = 'B'
        else:
            if not a_won:
                b += 1
            else:
                srv = 'A'

        if (a >= 11 or b >= 11) and abs(a - b) >= 2:
            winner = 'A' if a > b else 'B'
            return winner, a, b


def simulate_tennis_game(p, rng):
    # first to 4 points, win by 2
    a = 0
    b = 0
    while True:
        if rng.random() < p:
            a += 1
        else:
            b += 1
        if (a >= 4 or b >= 4) and abs(a - b) >= 2:
            winner = 'A' if a > b else 'B'
            return winner


def simulate_tennis_set(p, start_games_a=0, start_games_b=0, rng=None):
    # first to 6 games win by 2, tiebreak at 6-6
    if rng is None:
        rng = np.random.default_rng()

    a = start_games_a
    b = start_games_b

    while True:
        game_winner = simulate_tennis_game(p, rng)
        if game_winner == 'A':
            a += 1
        else:
            b += 1

        if (a >= 6 or b >= 6) and abs(a - b) >= 2:
            winner = 'A' if a > b else 'B'
            return winner, a, b

        if a == 6 and b == 6:
            ta = 0
            tb = 0
            while not ((ta >= 7 or tb >= 7) and abs(ta - tb) >= 2):
                if rng.random() < p:
                    ta += 1
                else:
                    tb += 1
            winner = 'A' if ta > tb else 'B'
            return winner, a, b


def run_trials(sim_fn, p, n=2000, rng=None, **kwargs):
    # run n simulations, return 0/1 win array for Player A
    if rng is None:
        rng = np.random.default_rng()

    wins = np.zeros(n, dtype=int)
    accepts_server = 'server' in inspect.signature(sim_fn).parameters
    for i in range(n):
        # randomize starting server so neither player has a structural advantage
        if accepts_server and 'server' not in kwargs:
            kwargs_i = dict(kwargs, server=('A' if rng.random() < 0.5 else 'B'))
        else:
            kwargs_i = kwargs
        winner, _, _ = sim_fn(p, rng=rng, **kwargs_i)
        if winner == 'A':
            wins[i] = 1
    return wins


def clt_ci(wins, alpha=0.05):
    # Wald interval: p_hat +/- z * SE, where SE = sqrt(p_hat*(1-p_hat)/n)
    n     = len(wins)
    p_hat = float(np.mean(wins))
    se    = float(np.sqrt(p_hat * (1 - p_hat) / n))
    Z     = stats.norm(0, 1)
    z     = float(Z.ppf(1 - alpha / 2))
    return {
        'p_hat':   p_hat,
        'se':      se,
        'ci_low':  p_hat - z * se,
        'ci_high': p_hat + z * se,
    }


def bootstrap_ci(wins, n_boot=1000, alpha=0.05, rng=None):
    # nonparametric bootstrap CI using percentile method
    if rng is None:
        rng = np.random.default_rng()

    n = len(wins)
    boot_means = np.zeros(n_boot)
    for i in range(n_boot):
        resample       = rng.choice(wins, size=n, replace=True)
        boot_means[i]  = np.mean(resample)

    lower = float(np.percentile(boot_means, 100 * alpha / 2))
    upper = float(np.percentile(boot_means, 100 * (1 - alpha / 2)))
    return {
        'mean':    float(np.mean(wins)),
        'boot_se': float(np.std(boot_means, ddof=1)),
        'ci_low':  lower,
        'ci_high': upper,
    }


def compare_systems(p_values, n=2000, rng=None):
    if rng is None:
        rng = np.random.default_rng()

    results = {
        'p':          [],
        'pb_win':     [],
        'pb_ci_low':  [],
        'pb_ci_high': [],
        'tn_win':     [],
        'tn_ci_low':  [],
        'tn_ci_high': [],
    }

    for p in p_values:
        pb_wins = run_trials(simulate_pickleball, p, n, rng)
        pb      = bootstrap_ci(pb_wins, rng=rng)

        tn_wins = run_trials(simulate_tennis_set, p, n, rng)
        tn      = bootstrap_ci(tn_wins, rng=rng)

        results['p'].append(p)
        results['pb_win'].append(pb['mean'])
        results['pb_ci_low'].append(pb['ci_low'])
        results['pb_ci_high'].append(pb['ci_high'])
        results['tn_win'].append(tn['mean'])
        results['tn_ci_low'].append(tn['ci_low'])
        results['tn_ci_high'].append(tn['ci_high'])

    return results


def pickleball_comeback(p, a, b, server, n=2000, rng=None):
    if rng is None:
        rng = np.random.default_rng()
    wins = run_trials(simulate_pickleball, p, n, rng, start_a=a, start_b=b, server=server)
    return bootstrap_ci(wins, rng=rng)


def tennis_comeback(p, ga, gb, n=2000, rng=None):
    if rng is None:
        rng = np.random.default_rng()
    wins = run_trials(simulate_tennis_set, p, n, rng, start_games_a=ga, start_games_b=gb)
    return bootstrap_ci(wins, rng=rng)


def plot_win_probability(results):
    p      = np.array(results['p'])
    pb_win = np.array(results['pb_win'])
    tn_win = np.array(results['tn_win'])

    plt.figure(figsize=(8, 5))
    plt.plot(p, pb_win, label='Pickleball')
    plt.fill_between(p, results['pb_ci_low'], results['pb_ci_high'], alpha=0.2)
    plt.plot(p, tn_win, label='Tennis')
    plt.fill_between(p, results['tn_ci_low'], results['tn_ci_high'], alpha=0.2)
    plt.axvline(0.5, linestyle='--', alpha=0.5)
    plt.axhline(0.5, linestyle='--', alpha=0.5)
    plt.xlim(p[0], p[-1])
    plt.xlabel('Rally win probability p')
    plt.ylabel('P(A wins)')
    plt.title('Win probability vs. rally skill')
    plt.legend()
    plt.tight_layout()
    plt.savefig(os.path.join(OUT_DIR, 'win_probability.png'), dpi=300)
    plt.show()


def plot_upset_probability(results):
    p        = np.array(results['p'])
    pb_upset = 1 - np.array(results['pb_win'])
    tn_upset = 1 - np.array(results['tn_win'])
    pb_up_lo = 1 - np.array(results['pb_ci_high'])
    pb_up_hi = 1 - np.array(results['pb_ci_low'])
    tn_up_lo = 1 - np.array(results['tn_ci_high'])
    tn_up_hi = 1 - np.array(results['tn_ci_low'])

    plt.figure(figsize=(8, 5))
    plt.plot(p, pb_upset, label='Pickleball')
    plt.fill_between(p, pb_up_lo, pb_up_hi, alpha=0.2)
    plt.plot(p, tn_upset, label='Tennis')
    plt.fill_between(p, tn_up_lo, tn_up_hi, alpha=0.2)
    plt.xlim(p[0], p[-1])
    plt.xlabel('Rally win probability p')
    plt.ylabel('Upset probability')
    plt.title('Upset probability vs. rally skill')
    plt.legend()
    plt.tight_layout()
    plt.savefig(os.path.join(OUT_DIR, 'upset_probability.png'), dpi=300)
    plt.show()


def plot_comeback(p, rng=None):
    if rng is None:
        rng = np.random.default_rng()

    pb_a = pickleball_comeback(p, 6, 10, 'A', rng=rng)
    pb_b = pickleball_comeback(p, 6, 10, 'B', rng=rng)
    tn   = tennis_comeback(p, 2, 5, rng=rng)

    labels     = ['PB 6-10, A serving', 'PB 6-10, B serving', 'Tennis 2-5']
    means      = [pb_a['mean'], pb_b['mean'], tn['mean']]
    ci_results = [pb_a, pb_b, tn]
    lower_errs = [means[i] - ci_results[i]['ci_low']  for i in range(3)]
    upper_errs = [ci_results[i]['ci_high'] - means[i] for i in range(3)]

    plt.figure(figsize=(8, 5))
    plt.bar(labels, means, yerr=[lower_errs, upper_errs], capsize=5)
    plt.ylabel('Comeback probability')
    plt.title(f'Comeback probability at p = {p:.2f}')
    plt.tight_layout()
    plt.savefig(os.path.join(OUT_DIR, 'comeback_probability.png'), dpi=300)
    plt.show()


if __name__ == "__main__":
    rng = np.random.default_rng(109)

    th = rally_theory(0.55, 20)
    print(f"E[X]={th['E_X']:.3f}  Var(X)={th['Var_X']:.3f}  "
          f"E[S_n]={th['E_Sn']:.3f}  Var(S_n)={th['Var_Sn']:.3f}")

    wins55 = run_trials(simulate_pickleball, 0.55, n=2000, rng=rng)
    clt    = clt_ci(wins55)
    boot   = bootstrap_ci(wins55, rng=rng)
    print(f"\nCLT  CI: [{clt['ci_low']:.4f}, {clt['ci_high']:.4f}]  SE={clt['se']:.4f}")
    print(f"Boot CI: [{boot['ci_low']:.4f}, {boot['ci_high']:.4f}]  SE={boot['boot_se']:.4f}\n")

    p_values = np.linspace(0.50, 0.80, 31)
    results  = compare_systems(p_values, rng=rng)

    print("p    | PB win  | TN win")
    for i in range(len(results['p'])):
        p_i  = results['p'][i]
        pb_i = results['pb_win'][i]
        tn_i = results['tn_win'][i]
        print(f"{p_i:.2f} | {pb_i:.3f}   | {tn_i:.3f}")

    plot_win_probability(results)
    plot_upset_probability(results)
    plot_comeback(0.55, rng=rng)
