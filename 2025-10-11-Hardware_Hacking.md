---
title: "Hardware Hacking"
date: 11-09-2015 00:02:42 +/-TTTT
categories: [Projects, Electronics]
tags: [Project]     # TAG names should always be lowercase
---


# ⏱️ Password Timing Analysis — When nanoseconds talk

*What if how long a device takes to say “no” leaks the password?*

Timing attacks are one of the simplest — and most revealing — side channels. They don't require fancy lab equipment: a stopwatch, careful automation, and statistical techniques can be enough to pull meaningful secrets from poorly implemented password checkers.

---

## Why timing leaks exist

Many password/PIN checkers compare bytes or characters sequentially and return on the first mismatch. If the checker short-circuits (returns early) on a mismatch, the response time correlates with how many leading bytes matched. That timing difference, while tiny, is often measurable and exploitable.

> **Ethics reminder:** Only run analysis on devices you own or have explicit written permission to test.

---

## Example: sequential byte comparison

Imagine a routine that compares a candidate password to the stored secret byte by byte:

```c
for (i = 0; i < len; ++i) {
    if (candidate[i] != secret[i]) return WRONG;
}
return OK;
````

If the candidate matches the first *k* bytes before failing at *k+1*, the routine will take slightly longer than when it fails earlier — that time delta leaks information about *k*.

---

## Attack workflow (practical)

1. Automate inputs: script sending candidate passwords and measuring response time.
2. Repeat many times per candidate to reduce jitter and network noise.
3. Compute statistics (mean, median, trimmed mean) for each candidate.
4. Rank candidates by response time — the highest-time candidate likely matches more leading bytes.
5. Fix the best byte and move to the next position.

**Pseudo process**:

```text
for position in 0..(password_len-1):
    for candidate_byte in 0..255:
        times = send_candidate(candidate_with_byte, n_reps)
        score[candidate_byte] = robust_mean(times)
    chosen = argmax(score)
    fix chosen at position
```

---

## Practical measurement tips

* **Use robust statistics**: median or trimmed mean resists outliers better than plain mean.
* **High repetition**: collect lots of samples per candidate (50–200), depending on noise.
* **Control the environment**: run attacker script close to the target to reduce network jitter; repeat during low-load periods.
* **Clock syncing**: use the same timer on your attacking machine and isolate delays (e.g., subtract known protocol/transport overhead).
* **Add a baseline**: measure a known-wrong input to understand background timing.

---

## Countermeasures (what defenders should do)

* **Constant-time comparison**: always compare all bytes and return only after full check (avoid short-circuiting).
* **Randomized delays**: add a randomized but bounded delay before returning (reduces signal, but careful — poor randomization can be bypassed).
* **Rate limiting & throttling**: limit the number of attempts and slow repeated trials.
* **Normalized processing**: ensure all code paths take equal time (or are padded) for the verification routine.

---

## When timing still helps

Even with random delays or network noise, clever statistics and high sample counts can recover signals. Timing is inexpensive to attempt — it's often worth trying before moving to hardware power analysis.

---

## Resources & notebook

* See `/mnt/data/HardHack_Password_cracking_using_SPA.ipynb` for companion simulations combining timing and power-based techniques. The notebook includes examples showing how timing noise and randomized delays affect recovery rates.

---

## Final note

Timing attacks are a first, low-cost step in side-channel reconnaissance: try them early when evaluating an authentication routine. They highlight the importance of constant-time design even for simple password checks.

*Always test responsibly.*



