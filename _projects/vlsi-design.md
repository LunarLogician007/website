---
title: "VLSI Design — Q-Learning Hardware Accelerator"
description: "Custom ASIC accelerator for Q-learning achieving single-cycle Q-value updates at 100 MHz with 11.39 µW power"
date: 2025-12-01
tags: [vlsi, asic, machine-learning]
icon: "🔬"
featured: true
guide: "EE671 — VLSI Design"
thumbnail: "/assets/images/Final chip layout.png"
---

### Overview
- Implemented a **pipelined Q-learning agent** (64x4 state-action space) in **Verilog** using sequential logic, with a hardware-optimized Q-update datapath (FSM, state storage, fixed-point) achieving one update per clock cycle
- Executed the complete **ASIC design flow**—RTL, synthesis, and place-and-route—using **Cadence Innovus**
- Designed **transistor-level layouts** for X1/X2 inverter, NOR gate, and DFF using **Magic VLSI** with **Sky130A PDK**



We took Q-learning—a fundamental machine learning algorithm used in everything from game AI to autonomous robots—and built a custom chip to accelerate it. This wasn't just about making things faster; it was about taking an algorithm from theory all the way to physical silicon.

## The Big Idea

Imagine you're building a robot that needs to navigate a maze. Software-based Q-learning works, but it's slow and power-hungry. For real-time robotics applications like autonomous drones or mobile robots that need to make split-second decisions, milliseconds matter. Our solution? Design a dedicated hardware accelerator that can update Q-values in a single clock cycle.

## From Algorithm to Silicon: The Journey

### **Stage 1: Designing the Brain (RTL Design)**

We started by implementing the Bellman equation—the mathematical heart of Q-learning—in Verilog. Our design features:
- A **Q-table storing 1,024 entries** (64 states × 4 actions)
- A **4-stage pipeline** for parallel processing
- Smart **data forwarding logic** to handle hazards (because when you're updating values at lightning speed, you need to make sure old and new data don't collide)

The coolest part? We didn't just test it with dummy data. We built a complete maze environment where our hardware agent actually learns to navigate from start to goal, just like a real reinforcement learning agent.

![Waveform visualization of state transitions, actions, and Q-value updates](/assets/images/waveform.png)

```
Training loop: 5,000 episodes
Success rate: Converged! ✓
Agent status: Successfully learned optimal policy
```

### **Stage 2: From Code to Gates (Synthesis)**

Using Cadence Genus, we transformed our Verilog code into actual logic gates—over 10,000 of them! The synthesis tool optimized our design to meet a 100 MHz clock frequency while balancing area and power consumption.

**The numbers:**
- 4,234 combinational cells
- 6,066 sequential cells  
- Total area: ~65,000 µm²

### **Stage 3: Drawing the Chip (Physical Design)**

This is where things got really interesting (and challenging). Using Cadence Innovus, we:
- Placed all 10,300 cells on the chip
- Routed thousands of connections without creating any shorts
- Designed the power distribution network
- Synthesized a clock tree to ensure every flip-flop gets the clock signal at the right time

![Final chip layout](/assets/images/Final%20chip%20layout.png)

## The Reality Check: When Things Don't Go Perfectly

Here's the honest truth: we hit a snag with **hold timing violations**. Our forwarding logic created paths that were *too fast*—data was changing before the receiving flip-flops were ready for it. We tried buffer insertion, clock skew optimization, and various ECO (Engineering Change Order) routes.

Did we fix it completely? Not quite. We got it down to **-0.212 ns**, which is manageable but not perfect. In a commercial design, this would require more iterations. But you know what? That struggle taught us more about real-world ASIC design than getting it right on the first try ever could.

## The Results

Despite the timing hiccup, our design works! The post-layout simulations show the agent successfully learning to navigate mazes. We achieved:

✅ **Zero DRC violations** (design rules: check!)  
✅ **Zero antenna violations**  
✅ **Zero connectivity issues**  
✅ **Functional correctness verified** at RTL, gate, and layout levels  
⚠️ **Minor hold timing violation** (room for improvement)

**Performance specs:**
- Clock: 100 MHz
- Power: 11.39 µW (that's micro-watts!)
- Throughput: Single-cycle Q-value updates after pipeline fill

## What We Learned

1. **Pipelining is powerful but tricky** - It gives you speed but introduces hazards that need careful handling
2. **Timing closure is an art** - You're constantly juggling setup time, hold time, area, and power
3. **RTL decisions have physical consequences** - Architectural choices you make in code directly impact whether your chip will actually work
4. **Real-world design is iterative** - You don't just write code and it works; you iterate, debug, optimize, and sometimes accept trade-offs

## Why This Matters

This isn't just an academic exercise. Hardware-accelerated machine learning is the future of edge AI. From autonomous vehicles to IoT devices, the ability to learn and adapt in real-time with minimal power consumption is crucial. Our design proves that even complex ML algorithms like Q-learning can be implemented efficiently in custom silicon.

Plus, going through the complete flow—from algorithm to physical layout—gave us hands-on experience with the same tools and challenges that real chip designers face every day at Industries.

---

**Team:** Hemang Dave, Jay Patel, Saravan Kumar Boddeda, Srivathsa Thotakura  
**Course:** EE671: VLSI Design | IIT Bombay | Autumn 2025  
**Tools:** Cadence Genus (Synthesis), Cadence Innovus (Physical Design), Icarus Verilog (Simulation)

---

