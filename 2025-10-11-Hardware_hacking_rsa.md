---
title: "Hardware Hacking — SPA on RSA"
date: 11-09-2015 00:02:42 +/-TTTT
categories: [Projects, Electronics]
tags: [project]     # TAG names should always be lowercase
---

# 🔐 SPA on RSA — tracing square and multiply

*Tracing the square-and-multiply: when power reveals exponent bits.*

Public-key operations like RSA are often the poster child for SPA: classic square-and-multiply exponentiation performs a square for every bit and a multiply only when the exponent bit is `1`. That conditional multiply leaves a fingerprint that SPA can pick up, allowing an attacker to reconstruct the exponent bit sequence.

---

## High-level RSA leakage idea

* Square is always executed for each exponent bit.
* Multiply is conditional on the exponent bit being `1`.
* Multiply and square have different energy/time patterns — with good traces you can distinguish them and recover bits.

---

## RSA SPA workflow (notebook-backed)

1. **Trace collection**: capture high-quality power traces for RSA exponentiation.
2. **Landmark detection & alignment**: find repeating patterns or markers to align traces.
3. **Segmentation**: split the trace into windows corresponding to each exponent bit.
4. **Feature extraction**: for each window compute energy, peak count, correlation with templates, etc.
5. **Classification**: classify windows as `S` (square only) or `SM` (square+multiply) using template correlation or a simple supervised classifier.
6. **Reconstruction**: read off the exponent bits and verify using public modulus/exponent relationships.

**Simple algorithm (concept)**:

```text
trace = collect_trace()
landmarks = find_landmarks(trace)
segments = segment_trace(trace, landmarks)
for seg in segments:
    s_score = corr(seg, template_S)
    sm_score = corr(seg, template_SM)
    bit = 1 if sm_score > s_score else 0
reconstructed_exponent = bits_to_int(bit_sequence)
````

---

## Template matching & classification

* Build templates for `S` and `SM` from known or synthetic traces.
* Use normalized cross-correlation as a score.
* Alternatively, compute a feature vector per segment (energy, peak count, duration) and run a small classifier (SVM, logistic regression) trained on labeled segments.

---

## Countermeasures covered in the notebook

1. **Exponent blinding** — randomize exponent or use multiplicative blinding on input so each invocation looks different.
2. **Montgomery ladder / constant-time algorithms** — use a fixed sequence of operations independent of secret bits.
3. **Noise injection / dummy operations** — add random noise operations or dummy multiplications to mask the multiply peaks.
4. **Hardware mitigations** — shields, decoupling capacitors, or active power smoothing.

The notebook `/mnt/data/HardHack-RSA.ipynb` demonstrates these mitigations with before/after plots so you can visually inspect how leakage decreases.

---

## Practical considerations

* **Trace quality matters**: higher sampling rate and higher ADC resolution make fingerprinting easier.
* **Alignment is critical**: poor alignment will smear the multiply peaks across segments.
* **Mitigations are effective**: constant-time algorithms and blinding make recovery much harder, but implementation mistakes reintroduce leakage.
* **Verification**: once you recover an exponent guess, verify it against the public modulus and known relationships (if available).

---

## Running the RSA notebook

The RSA notebook uses `numpy`, `scipy`, and `matplotlib`. It contains helper functions:

* `find_landmarks()`
* `segment_trace()`
* `template_score()`
* visualization helpers to overlay and compare traces pre/post mitigation

Run `/mnt/data/HardHack-RSA.ipynb` to reproduce experiments.

---

## Final words

SPA against RSA is a high-impact technique: if the implementation leaks, you can recover secret exponents. The best defense is designing implementations that avoid data-dependent operation sequences (Montgomery ladder, blinding). Use the RSA notebook to learn how attacks work and to validate mitigations.

*Only perform these experiments on devices you own or have explicit permission to test.*

```

---

If you want, I can:
- Save these exact files into the canvas for editing (I can create them as separate textdocs), or
- Produce shorter/longer versions, add figures taken from the notebooks, or generate a README that links them.  

Which next step do you want?
```
