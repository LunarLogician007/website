---
title: "Hardware Hacking — SPA on Password Checking"
description: "Reading power traces byte-by-byte to crack passwords using Simple Power Analysis"
date: 2025-03-15
tags: [hardware-security, side-channel]
icon: "⚡"
featured: false
guide: "Electronics and Robotics Club"
---

### Overview
- Studied **timing-based side-channel vulnerabilities** by analyzing instruction-level delays in cryptographic operations
- Performed **Simple Power Analysis (SPA)** on **RSA** to extract secret keys through visual inspection of power traces
- Used **ChipWhisperer Nano** to analyze power traces on an **STM32-based target** for side-channel vulnerability

# ⚡ SPA on Password Checking — reading power traces to guess bytes

*When power curves blink, bytes show themselves.*

Simple Power Analysis (SPA) inspects the device's power (or current/voltage) trace while it runs the verification routine and looks for data-dependent differences. For password checking, a single data-dependent instruction or a differing instruction sequence for a correct byte often leaves a visible fingerprint.

---

## High-level idea

1. For each candidate input, capture the power trace when the device verifies the password.
2. Align traces (important!) using a marker or cross-correlation.
3. Subtract a reference "wrong" trace (e.g., null guess) or compute difference-from-baseline.
4. Average repeated traces and score candidates in a focused time window.
5. The candidate producing the clearest difference is likely the correct byte.

---

## Byte-by-byte SPA algorithm (concept)

```text
for byte_index in 0..(password_len-1):
    for candidate in 0..255:
        traces = capture_traces(candidate_at_index, n_reps)
        aligned = align_traces(traces)
        mean_trace = mean(aligned)
        diff = mean_trace - reference_mean
        score[candidate] = scoring_function(diff, window)
    guessed_byte = argmax(score)
    fix guessed_byte and continue
```

Key operations:

* `align_traces()`: cross-correlation or hardware marker alignment
* `reference_mean`: mean trace from a known-wrong candidate
* `scoring_function()`: peak amplitude in window, correlation to template, or SNR

---

## Common scoring functions

* **Peak amplitude in window** — picks the candidate with the largest deviation.
* **Cross-correlation with a known template** — good when you have a synthetic or prior-captured correct pattern.
* **Z-score / SNR** — `(peak - local_mean) / local_std` for robust ranking.

---

## Practical tips

* **Repetitions**: SPA often needs many repetitions (10–200) to beat noise.
* **Windowing**: restrict scoring to a small time window where the compare routine executes.
* **Alignment**: misalignment destroys subtle features — align traces carefully.
* **Visualization**: plot stacked traces and difference traces — sometimes the eye beats automated detectors.
* **Averaging**: average multiple repetitions per candidate to reduce noise and reveal the fingerprint.

---

## Example (Python-ish snippet)

```python
# traces shape: (n_reps, n_samples)
aligned = [cross_correlate_align(t, reference) for t in traces]
mean_trace = np.mean(aligned, axis=0)
diff = mean_trace - reference_mean
score = np.max(diff[window_start:window_end]) / np.std(diff[window_start:window_end])
```

---

## Countermeasures (defender checklist)

* **Constant-time password comparison** (no early return).
* **Power-equalizing operations** — ensure the same instruction sequence runs no matter the data.
* **Introduce masking or dummy operations** to equalize energy signatures.
* **Hardware mitigations** — shielding, power filtering, and decoupling to reduce observable differences.

---

## Final words

SPA for password checking is straightforward in concept but requires attention to alignment, noise, and statistical scoring. The payoff is high: byte-by-byte recovery with moderate lab effort when devices leak.

*Respect the law and test only with permission.*
