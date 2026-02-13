---
title: "Part 3: Amplitude Detection using Coherent Sampling"
description: "Quadrature sampling technique for real-time amplitude detection of frequency components on an 8051 microcontroller"
date: 2025-12-14
tags: [embedded, 8051, signal-processing]
icon: "📊"
featured: true
guide: "EE337 — Microprocessors Lab"
thumbnail: "/assets/images/single_tone_output.jpg"
---

### Overview
- Generated dual-tone signals on an **ESP32** using **DAC** to drive a nonlinear circuit and observe intermodulation tones
- Used an **8051 microcontroller** for synchronized, precise sampling of circuit output to enable accurate frequency analysis
- Leveraged **ADC, SPI, hardware timers, and interrupts** to ensure accurate timing and efficient data capture
- Implemented error-handling strategies due to phase miss alignment to maintain accuracy in amplitude estimation
### **Part 3 – Amplitude Detection**

In this stage, we aimed to **extract the amplitude of specific frequency components** from the signal obtained after the non-linear circuit. The goal was to measure the amplitude of known fundamental tones (100 Hz, 127 Hz, 27 Hz, 73 Hz, 154 Hz, etc.) using the **PT-51 board**.

---

#### **Initial Approach – Two Sample Points**

We first attempted amplitude detection by taking **two samples per period**, one at the cosine peak (*t = 0*) and another at the cosine minimum (*t = T/2*).
The idea was to estimate the amplitude as half the difference between the maximum and minimum samples.
However, this approach led to **inaccurate results** due to:

* **Phase mismatch** between the sampling instants and the actual waveform.
* Small **timing errors** accumulating over cycles, especially when multiple frequencies were present.
* The **non-sinusoidal** nature of the waveform after the diode distortion, which made peak-based detection unreliable.

This motivated the shift to a more robust method that could account for both **in-phase (I)** and **quadrature (Q)** components.

---

#### **Improved Approach – Four Sample Points (Quadrature Sampling)**

To overcome the phase and timing inaccuracies, we adopted the **Quadrature Sampling Technique**, which samples the waveform at **four equidistant points** in each cycle:

* *t = 0* → Cosine peak (Real positive)
* *t = T/4* → Sine peak (Imaginary positive)
* *t = T/2* → Cosine minimum (Real negative)
* *t = 3T/4* → Sine minimum (Imaginary negative)



![Amplitude Detection Logic](/assets/images/amplitude_logic.jpg)
*Firmware logic for quadrature-based amplitude detection.*

This allows the extraction of both **real (I)** and **imaginary (Q)** components of the signal:
[
I = V(t=0) - V(t=T/2)
]
[
Q = V(t=T/4) - V(t=3T/4)
]

The **amplitude** of the fundamental component is then computed as:
[
A = \sqrt{I^2 + Q^2}
]

This technique is inherently less sensitive to phase shifts or harmonics since it effectively reconstructs the fundamental sinusoidal component through vector addition in the I–Q plane.


![Python Simulation](/assets/images/python_simulation.jpg)
*Python simulation verifying amplitude reconstruction accuracy.*

---

#### **Sampling Precision and Averaging**

We used an **ESP32 hardware timer** to generate precise delays corresponding to *T/4* for the target frequency.
For instance, for 100 Hz (T = 10 ms), the delay was set to **2.5 ms** between samples.
To improve accuracy:

* Sampling was repeated for about **50 consecutive cycles**.
* Each cycle’s computed amplitude was **averaged**, reducing the influence of noise and other unwanted harmonics.

---

#### **Results and Observations**

* **Fundamental Frequencies:**
  The amplitude detection worked effectively for single-tone and low-interference cases. The computed amplitudes closely matched the expected values, verifying the correctness of the I–Q approach.

* **Multiple/Intermodulation Frequencies:**
  When multiple tones were present (e.g., sum and difference frequencies such as *f₁–f₂* or *2f₁–f₂*), the results became **noisy and inconsistent**.
  This was due to overlapping spectral components and slight timing offsets, which affected phase coherence.

---

#### **Experimental Results**

1. **Single Tone Test** – 1.5 Vpp sine wave
   → Measured output: **766 mV** (accurate and stable reading)

2. **Multiple Tone Test** – Ramp input 1 Vpp (sampling focused on 100 Hz fundamental)
   → Measured output: **580 mV** (variation observed due to nearby frequency components)

![Single Tone Output](/assets/images/single_tone_output.jpg)
*Output for a clean single-tone input showing accurate amplitude detection.*

![Multiple Tone Output](/assets/images/multiple_tone_output.jpg)
*Amplitude detection in multi-tone case showing reduced precision.*

---



#### **Final thoughts**

Switching from two-point to four-point sampling made things way more accurate and reliable.The whole Quadrature Sampling Technique did a great job pulling out the main signal, even when there was a bunch of noisy harmonics messing things up. Just goes to show how practical and effective I–Q analysis is for real-time signal processing, especially when you’re working with embedded systems.

With this amplitude detect of various intermodulation signals marks the end of this project 
