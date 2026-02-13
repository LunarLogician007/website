---
title: "Part-1 and Part-2 : Wave Generation and Non Linear Circuit"
date: 11-09-2015 00:02:42 +/-TTTT
categories: [Projects, Frequency Analysis on 8051 Microcontroller using Coherent Sampling]
tags: [project]     # TAG names should always be lowercase
---


### **Part 1 – Sine/Cos Wave Generation using DAC and Microcontroller**

Goal is to generate a sine wave of multiple freq using the 8051 microcontroller and a DAC.
We initially generated a single cosine wave using the PT-51 board and MCP4921 DAC via the **lookup table method**, 


We started by interfacing the MCP4921 DAC with our PT-51 Board, which is based on the 8051 microcontroller, using the SPI interface, as the DAC itself is a 12-bit resolution SPI-based IC.
Since it has 12-bit resolution and we used 5V as Vref, we generated a constant DC output by feeding digital inputs to the DAC. The DAC’s output voltage (Vout) is given by 5V * (digital value / 4096). When provided with a digital value of 2048, it produces a constant voltage of 2.5V. This confirms successful communication between the MCU and the DAC.
Next, we used a lookup table method to generate a cos wave. This involved creating a table of precomputed cosine values and feeding them sequentially to the DAC to get a continuously varying DC voltage that mimics a cos wave. as shown in the figure below.

![PT-51 and DAC Output for 1 freq Cos wave](/assets/images/pt51_dac_output1.jpg)  

which introduced slight noise (as visible in the photo where the output sometimes becomes 0) due to the sampling rate we assumed, even though we followed the Nyquist criterion. After generating a single tone, we proceeded to generate the sum of two cosine waves with different frequencies (100 Hz and 127 Hz). The main reason for choosing these frequencies is that the intermodulation signal (i.e., 127 - 100 = 27 Hz) does not have any integer multiples that overlap with either the 100 Hz or 127 Hz frequencies.

![PT-51 and DAC Output 2](/assets/images/pt51_dac_output2.jpg)  

Although the waveform shape was correct, the frequency accuracy was off due to the speed limitations of the external SPI interface, and there was significant noise present. To address these issues, we switched to using the **ESP32 microcontroller**. We interfaced the DAC with the ESP32 via SPI, which allowed us to generate the required waveform with precise frequency control 

![ESP32 and DAC FFT](/assets/images/esp32_dac_fft.jpg)


---

### **Part 2 – Non-Linear Circuit**

For this part, we selected a **diode** as the non-linear element and passed the previously generated signal from the ESP32 through it. The resulting waveform and its **frequency spectrum (FFT)** were analyzed using an oscilloscope to study the effect of non-linearity on the signal.

> **Note:**
> Initially, the **DC offset** produced by the DAC output was **removed using a coupling capacitor** before feeding the signal to the diode. Later, we **removed the capacitor** and allowed the DC offset to remain in the input signal to observe how it influenced the diode’s non-linear response.

#### **Observations**

* **Without DC Offset:**
  When the DC offset was removed, the input signal swung symmetrically around zero. Since the diode conducts only during the positive half-cycles (above its threshold voltage), much of the input signal was clipped. In the FFT plot, the **harmonic peaks were small** and less distinct, as seen in the first photo.

* **With DC Offset:**
  When the DC offset was retained, the input signal remained mostly positive, allowing the diode to conduct over a larger portion of the waveform. This resulted in a more pronounced **non-linear distortion**, and as expected, the FFT displayed **clear and distinct harmonic peaks**, indicating the generation of multiple frequency components due to the diode’s non-linearity.

#### **Results**

* The presence of DC offset enhances the conduction region of the diode, making the non-linear behavior more prominent.
* The FFT clearly demonstrates **harmonic generation**, confirming that the diode acts as a non-linear device that introduces frequency components beyond the input’s fundamental frequency.

![FFT without DC offset](/assets/images/fft_without_dc_offset.jpg)
*FFT of the diode circuit output without DC offset – weaker harmonic content.*

![FFT with DC offset](/assets/images/fft_with_dc_offset.jpg)
*FFT of the diode circuit output with DC offset – strong harmonic peaks visible.*

---
---
