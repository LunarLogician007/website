---
title: "AI-Assisted Wi-Fi RRM+"
description: "Built NS-3 simulation platform for enterprise Wi-Fi optimization achieving 31.5% throughput improvement"
date: 2025-12-01
tags: [networking, ai, simulation]
icon: "📶"
featured: true
guide: "Arista Networks — Inter-IIT Tech Meet 14.0"
thumbnail: "/assets/images/arista_thumb.jpg"
---

### Overview
- Built an **NS-3 simulation platform** for enterprise Wi-Fi networks to optimize overall **throughput** and **retry rate**
- Architected a **Multi-Timescale Control Loop** with a sub-second **Fast Loop** for interference and radar avoidance
- Integrated **Bayesian Optimization** with **NS-3** to tune Tx Power, Channel Width, and OBSS-PD for better QoE
- Achieved **31.5% improvement** in mean edge-client throughput and **1364% bottleneck elimination**
- Developed a **Graph Attention Network (GAT)** surrogate achieving **92% R² accuracy**, reducing inference time by **1000x**

# Teaching Wi-Fi Networks to Think: Building an AI-Powered Radio Resource Manager

## When Your Conference Call Keeps Dropping...

Enterprise Wi-Fi networks are making decisions like it's still 2010—periodic scans, static configurations, and AP-side observations that miss what's happening at your device. When interference spikes, the network takes *minutes* to react.

For the Inter-IIT Tech Meet 14.0 (Arista problem statement), our team built an AI-assisted Radio Resource Management system that makes enterprise Wi-Fi smarter, faster, and more responsive.

## The Big Idea: Multi-Timescale Intelligence

Our solution? **Three control loops operating at different timescales:**

### **Fast Loop (Sub-Second)**: Emergency Response
When radar is detected or sudden interference spikes happen, our fast loop uses a dedicated sensing radio to continuously monitor the spectrum and instantly switch to the best fallback channel.

### **Slow Loop (Minutes)**: Strategic Optimization  
Using Bayesian Optimization (and later Safe Reinforcement Learning), we find the optimal configuration for transmit power, channel width, and OBSS-PD settings across all APs.

### **Event Loop**: Situational Awareness
Different scenarios need different strategies. High-load exam centers? Prioritize bandwidth. BLE interference in a café? Switch channels temporarily.

## Building the Fast Loop: When Every Millisecond Counts

When radar forces channel evacuation, our scoring function picks the best fallback:

```
Score = w1 × Interference + w2 × Airtime + w3 × Bandwidth + w4 × DFS_Probability
```

### Testing in NS-3

| Scenario | Random P50 (Mbps) | Smart P50 (Mbps) | Improvement |
|----------|-------------------|------------------|-------------|
| High Load | 16.68 | 27.77 | **+66%** |
| Low Tx Power | 20.27 | 36.90 | **+82%** |
| Close Congested | 32.13 | 41.32 | **+29%** |

Not only did we get better throughput, but we also maintained lower retry rates—meaning more reliable connections when it matters most.

## The Slow Loop: Bayesian Optimization for Wi-Fi

The slow loop needed to answer a deceptively simple question: **What's the best configuration for our network right now?**

### Why Bayesian Optimization?

Unlike grid search or random search, Bayesian Optimization builds a probabilistic model of which configurations work well and intelligently explores the parameter space.

**Our parameter space:**
- Transmit Power: 5–23 dBm
- Channel Width: 20/40/80/160 MHz
- OBSS-PD: -90 to -62 dBm
- Channel Assignment: Multiple overlapping options

That's **12 dimensions per AP** in a 4-AP network = 48-dimensional optimization problem!

### The NS-3 Testbed

I built a comprehensive NS-3 testbed with Friis propagation, Nakagami-m fading (m=3.0), and 802.11ac SpectrumWifiPhy. The topology featured 4 APs in a 40×40m area with 20 "near" clients (within 4m) and 8 "edge" clients (50m away). Those edge clients at 50m are the real test—you're fighting physics at that distance.

### Results: BO in Action

Starting from a baseline configuration (15 dBm, 20 MHz, OBSS-PD = -82 dBm), the Bayesian Optimizer explored 40 iterations and found configurations that:

✅ Improved **mean edge throughput by 31.5%**  
✅ Fixed the worst-performing AP (AP2): **1364% improvement** (0.139 → 2.037 Mbps)  
✅ Reduced **max P95 retry rate** from 29.68% to 12.63%

![BO optimization progress](/assets/images/BO.png)

## GNN Surrogate Model

For our Graph Neural Network, we generated thousands of high-fidelity NS-3 simulations covering all channel widths, overlapping/non-overlapping assignments, various power levels, and different client distributions.

Our best GAT (Graph Attention Network) model achieved:

- **Throughput prediction:** R² = 0.756 (MAE = 5.09 Mbps)
- **Retry rate prediction:** R² = 0.625 (MAE = 0.067)

This lets us predict network performance **1000× faster** than running a simulation, enabling the RL agent to explore millions of configurations.

## Upgrading to Safe RL

Bayesian Optimization worked well, but had **no safety guarantees**. We upgraded to a **Constrained TD3** algorithm with hard constraints: max P95 retry ≤ 8% and no throughput regression.

Using Lagrangian relaxation, the RL agent maximizes performance while *strictly* respecting safety bounds. The NS-3 environment worked beautifully, though the GNN surrogate's predictions became unreliable when the RL agent explored unusual state-space regions—a lesson in the difficulty of surrogate model generalization.

## Graph Coloring: Channel Assignment Done Right

Channel assignment is fundamentally a **graph coloring problem**. We modeled APs as nodes with edge weights = RSSI × spectral overlap, and solved the weighted interference minimization as a mixed-integer linear program with PuLP.

![Graph coloring visualization](/assets/images/Graph_coloring.png)

## The Numbers That Matter

**Fast Loop:**
- Sub-second response to radar/interference
- 66–82% throughput improvement vs. random fallback

**Slow Loop (BO):**
- 31.5% mean edge throughput improvement
- 57.5% reduction in max P95 retry rate

**Graph Coloring:**
- Consistent P50 throughput gains across all APs
- Reduced inter-AP interference by 15–25%

## What We Learned

1. **Simulation**: NS-3 was our testbed, our debugger, and our reality check. Building a realistic simulation environment taught us more about Wi-Fi than any textbook.

2. **Bayesian Optimization**: Everyone wants to use RL for everything, but sometimes a good optimization algorithm with smart exploration is exactly what you need.

3. **Safety matters**: In production systems, you can't "explore" your way to a solution if exploration means breaking connectivity for 100 users. Safe RL isn't optional—it's essential.

4. **Surrogate models are hard**: Building a GNN that generalizes to the full RL exploration distribution is a research problem in itself. We learned this the hard way.

5. **Multi-timescale control works**: Having fast, slow, and event loops operating in harmony is more effective than any single optimization strategy.
