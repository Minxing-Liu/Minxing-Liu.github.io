#!/usr/bin/env python3
"""Independent mathematical checks for the KC recurrence reading note.

Requires Python 3, NumPy and SciPy. Run:
    python kc-recurrence-checks.py --output kc-recurrence-checks.json

These checks do not reproduce the source PDF's connectome/simulation results.
They verify selected identities, quadratures and explicit counterexamples.
"""
import argparse
import itertools
import json
import math

import numpy as np
import scipy
from scipy.integrate import quad
from scipy.optimize import minimize_scalar
from scipy.stats import norm, t

RESULTS = {}


def check(name, observed, expected, atol=1e-9, rtol=1e-9):
    a, b = np.asarray(observed), np.asarray(expected)
    error = float(np.max(np.abs(a - b)))
    if not np.allclose(a, b, atol=atol, rtol=rtol):
        raise AssertionError(f"{name}: maximum error {error}")
    RESULTS[name] = {"passed": True, "maximum_absolute_error": error}


def pr(s):
    return float(np.trace(s) ** 2 / np.sum(s * s))


def claws(n, k):
    subsets = list(itertools.combinations(range(n), k))
    j = np.zeros((len(subsets), n))
    for row, subset in zip(j, subsets):
        row[list(subset)] = 1 / math.sqrt(k)
    return j


def kernel(q, f):
    """Centered equal-threshold Gaussian Bernoulli kernel."""
    if q >= 1 - 1e-14:
        return f * (1 - f)
    if q <= -1 + 1e-14:
        return max(2 * f - 1, 0) - f * f
    z = norm.isf(f)
    return quad(lambda u: math.exp(-z*z/(1+math.sin(u)))/(2*math.pi),
                0, math.asin(q), epsabs=1e-12, epsrel=1e-11)[0]


def main():
    # Exhaustive independent claw pairs, including equal rows.
    n, k = 7, 3
    j = claws(n, k)
    gram = j @ j.T
    check("hypergeometric_overlap_moments", [gram.mean(), gram.var()],
          [k/n, (n-k)**2/(n*n*(n-1))])

    f = .1
    z = norm.isf(f)
    errs = []
    for q in [-.6, -.2, 0, .2, .8]:
        p11 = quad(lambda x: norm.pdf(x) * norm.sf((z-q*x)/math.sqrt(1-q*q)),
                   z, np.inf, epsabs=1e-12)[0]
        errs.append(p11 - f*f - kernel(q, f))
    check("conditional_and_arcsine_gaussian_integrals", errs, np.zeros(5))
    h = 1e-5
    check("first_threshold_kernel_derivative",
          (kernel(h, f)-kernel(-h, f))/(2*h), norm.pdf(z)**2, atol=1e-10)

    # Balanced enumeration makes the otherwise large-NK column mean exact.
    n, k = 5, 2
    j = claws(n, k)
    nk = len(j)
    u = np.ones((nk, nk))/nk
    p = np.eye(nk)-u
    a = 2.0
    beta = a/(1+a)
    delta = 2*beta-beta*beta
    g = np.linalg.inv(np.eye(nk)+a*u)
    check("APL_rank_one_inverse", g, np.eye(nk)-beta*u)
    ch = g @ j @ j.T @ g.T
    q = ch/np.sqrt(np.outer(np.diag(ch), np.diag(ch)))
    q_overlap = (j @ j.T-delta*k/n)/(1-delta*k/n)
    check("APL_overlap_correlation_balanced_finite_network", q, q_overlap)
    cb = np.array([[kernel(float(x), f) for x in row] for row in q])
    off = ~np.eye(nk, dtype=bool)
    d_pair = 1/(1/nk+(1-1/nk)*np.mean((cb[off]/(f*(1-f)))**2))
    check("binary_participation_pair_identity", pr(cb), d_pair)

    # Nonbalanced J checks the exact cross-block term in PDF Eq. 80.
    jr = j[[0, 1, 1, 2, 3, 3, 3, 7, 8, 9]]
    s = jr @ jr.T
    uv = np.ones(nk)/math.sqrt(nk)
    lam = uv @ s @ uv
    b = p @ s @ uv
    sp = p @ s @ p
    c = 1/(1+a)
    exact_block = (c*c*lam+np.trace(sp))**2 / (
        c**4*lam*lam+2*c*c*(b @ b)+np.sum(sp*sp))
    check("APL_current_dimension_with_cross_blocks", pr(g @ s @ g.T), exact_block)

    # Valid random-claw support example: N_P=5, K=2, all ten subsets.
    s = j @ j.T
    c_opt = math.sqrt(1.5/4)
    g_opt = p+c_opt*u
    d_before, d_opt, d_limit = pr(s), pr(g_opt @ s @ g_opt.T), pr(p @ s @ p)
    check("APL_nonmonotonic_dimension_counterexample", [d_before, d_opt, d_limit], [4, 5, 4])
    RESULTS["APL_counterexample_values"] = {
        "feedforward": d_before, "optimal_finite_inhibition": d_opt,
        "infinite_inhibition_limit": d_limit}

    # Exact structured-overlap B3 example: regular Johnson graph J(5,2).
    adjacency = ((s > 1e-10) & off).astype(float)
    check("structured_overlap_degree", adjacency.sum(axis=1), np.full(nk, 6))
    sp = p @ s @ p
    m_centered = -.8*adjacency/6+.8*u
    gb3 = np.linalg.inv(np.eye(nk)-m_centered)
    check("structured_B3_residual_dimension_unchanged_example", pr(gb3 @ sp @ gb3.T), 4)

    # Perfect spectral alignment is enough to disprove the PDF's inversion-sign argument.
    eig = np.array([4., 1.])
    d0 = eig.sum()**2/(eig @ eig)
    inh = eig/(1+.1*eig)**2
    exc = eig/(1-.1*eig)**2
    di, de = inh.sum()**2/(inh @ inh), exc.sum()**2/(exc @ exc)
    assert di > d0 > de
    RESULTS["aligned_spectrum_sign_counterexample"] = {
        "passed": True, "initial": float(d0),
        "inhibitory": float(di), "excitatory": float(de)}

    # Semicircle resolvent integrals: nu = R sin(theta).
    radius, gamma = .7, .6
    moments = []
    for power in [2, 4]:
        moments.append(quad(lambda th: 2/math.pi*math.cos(th)**2 /
                            (1-gamma*radius*math.sin(th))**power,
                            -math.pi/2, math.pi/2, epsabs=1e-12)[0])
    v = (gamma*radius)**2
    check("semicircle_resolvent_moments", moments,
          [2/v*(1/math.sqrt(1-v)-1), (1-v)**(-2.5)])
    rg = moments[1]/moments[0]**2
    check("resolvent_moment_ratio", rg,
          (1+math.sqrt(1-v))**2/(4*(1-v)**1.5))

    # Exact finite-P Hebbian mean/variance, using all target/distractor/label states.
    states = np.array([[0, 0], [0, 1], [1, 0], [1, 1]], dtype=float)
    probs = np.array([.5, .2, .2, .1])
    centered = states-.3
    cov = centered.T @ (probs[:, None]*centered)
    target = (centered*centered).sum(axis=1)
    mean_t = probs @ target
    var_t = probs @ (target-mean_t)**2
    vals, weights = [], []
    for i in range(4):
        for l in range(4):
            for label in [-1, 1]:
                vals.append(target[i]+label*(centered[l] @ centered[i]))
                weights.append(probs[i]*probs[l]/2)
    vals, weights = np.array(vals), np.array(weights)
    check("exact_Hebbian_margin_moments",
          [weights @ vals, weights @ (vals-mean_t)**2],
          [mean_t, var_t+np.trace(cov @ cov)])

    # The PDF's interaction/noise proxy; not a finite-classifier optimum.
    optima = {}
    for reliability, expected in [(.4, .03530), (.8, .01943)]:
        def objective(rate):
            kc = kernel(reliability, rate)
            return -(kc-2*kernel(reliability/2, rate))/(rate*(1-rate)-kc)
        opt = minimize_scalar(objective, bounds=(.002, .5), method="bounded",
                              options={"xatol": 1e-12})
        check(f"interaction_proxy_optimum_c_{reliability}", opt.x, expected, atol=6e-6)
        optima[str(reliability)] = float(opt.x)
    RESULTS["interaction_proxy_optima"] = optima

    # Student first-moment projection is distinct from threshold susceptibility.
    nu, si, threshold = 5, 1.7, 1.2
    scale = math.sqrt((nu-2)/nu)
    cutoff = threshold/(scale*si)
    numerical = quad(lambda y: scale*y*t.pdf(y, nu), cutoff, np.inf, epsabs=1e-12)[0]/si
    formula = scale*(nu+cutoff*cutoff)*t.pdf(cutoff, nu)/((nu-1)*si)
    check("Student_truncated_first_moment_coefficient", numerical, formula)

    report = {"scope": "Independent selected mathematical checks; no connectome reproduction",
              "numpy": np.__version__, "scipy": scipy.__version__,
              "checks_passed": sum(isinstance(v, dict) and v.get("passed", False)
                                   for v in RESULTS.values()), "results": RESULTS}
    parser = argparse.ArgumentParser()
    parser.add_argument("--output")
    args = parser.parse_args()
    text = json.dumps(report, ensure_ascii=False, indent=2)
    if args.output:
        with open(args.output, "w", encoding="utf-8") as stream:
            stream.write(text+"\n")
    print(text)


if __name__ == "__main__":
    main()
