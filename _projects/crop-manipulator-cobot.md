---
title: "Mobile Crop Manipulator Co-Bot"
description: "Integrated mobile manipulation with 6-DOF arm for autonomous pick-and-place tasks using ROS2"
date: 2025-12-01
tags: [robotics, ros2, embedded]
icon: "🤖"
featured: true
guide: "Eyantra"
thumbnail: "/assets/images/eyantra_thumb.jpeg"
---

### Overview
- Integrated **mobile manipulation**, coordinating a differential-drive base with a **6-DOF arm** for autonomous pick-and-place tasks
- Designed **low-latency geometric algorithms** for LiDAR-based shape detection, avoiding compute-heavy ML pipelines
- Implemented real-time **TF2-based spatial transformations** to map 2D vision outputs into precise 3D actuation frames
- Built a **deterministic navigation and control architecture** using custom state machines without reliance on Nav2

# Building an Autonomous Farm Robot: Or, Identifying 100 Ways to Break a Robot

Agriculture is facing a crisis. The solution, obviously, is to build a complex robot that navigates mud, identifies plants, and delicately picks fruit. What could possibly go wrong? (Spoiler: Everything.)

This project was my attempt to answer: **"How hard can it be to make a robot do farm work?"**
Answer: Very.

## Part 1: Autonomous Navigation (Driving Blindfolded)

### The Challenge
Imagine you're navigating an office blindfolded, using only a laser pointer to detect walls. Also, every 5 seconds, someone pushes you slightly. That's autonomous navigation. The robot relies on **LiDAR** to see, which means it sees a "plant" and a "person's leg" as basically the same obstacle: "Thing to Avoid".

**Requirements:**
- Go from A to B without hitting C (the wall).
- Reach exact coordinates (±30 cm, or "close enough for government work").
- Do it autonomously, because I am tired of driving it with a joystick.

### The Pipeline
Every few milliseconds, the robot updates its existential dread (map) using laser scans.

```
┌─────────────────────────────────────────────────────────┐
│                    NAVIGATION SYSTEM                    │
│             (The "Don't Crash" Module)                  │
└─────────────────────────────────────────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            ▼               ▼               ▼
    ┌──────────────┐ ┌─────────────┐ ┌──────────────┐
    │   LiDAR      │ │  Wheel      │ │   Target     │
    │   Scanner    │ │  Odometry   │ │  Waypoint    │
    │ (The Eyes)   │ │ (The Feet)  │ │ (The Dream)  │
    └──────┬───────┘ └──────┬──────┘ └──────┬───────┘
           │                │               │
           │     ┌──────────┴───────────┐   │
           └────►│  Localiz. Engine     │◄──┘
                 │ "Where am I???"      │
                 └──────────┬───────────┘
                            │
                 ┌──────────▼───────────┐
                 │  Obstacle Detection  │
                 │ "Is that a wall?"    │
                 └──────────┬───────────┘
                            │
                 ┌──────────▼───────────┐
                 │  Path Planning Logic │
                 │ "Hard Left! Now!!"   │
                 └──────────┬───────────┘
                            │
                ┌───────────┴───────────┐
                ▼                       ▼
         ┌─────────────┐         ┌─────────────┐
         │   Linear    │         │   Angular   │
         │  Velocity   │         │  Velocity   │
         └─────────────┘         └─────────────┘
```

I implemented **Proportional Control**, which is a fancy way of saying:
- **Far away?** Full speed ahead!
- **Close?** Panic brake.
- **Too close?** Oscillate back and forth until the battery dies.

---

## Part 2: Computer Vision (Hallucinating Fruit)

### The Problem
Fruits move on a conveyor belt. The robot needs to spot spoiled ones. Simple for a human (unless you're colorblind), impossible for a machine that thinks a shadow is a black hole.

### The Solution: HSV Because RGB is Trash
We use an **RGB-D (Red-Green-Blue-Depth)** camera. We immediately throw away the RGB values because RGB is emotionally unstable. A red apple in shadow looks black in RGB. In **HSV (Hue-Saturation-Value)**, it still looks red, just darker.

**The "Is It a Fruit?" Pipeline:**

```
┌────────────────────────────────────────────────────────────┐
│              COMPUTER VISION PIPELINE                      │
└────────────────────────────────────────────────────────────┘
                            │
            ┌───────────────┴────────────────┐
            ▼                                ▼
    ┌──────────────┐                ┌──────────────┐
    │  RGB Camera  │                │ Depth Camera │
    └──────┬───────┘                └──────┬───────┘
           │                               │
    ┌──────▼───────┐                       │
    │  RGB -> HSV  │                       │
    │ (Fix lighting│                       │
    │  issues)     │                       │
    └──────┬───────┘                       │
           │                               │
    ┌──────▼───────┐                       │
    │ Color Filter │                       │
    │ "Find Ugly   │                       │
    │  Color"      │                       │
    └──────┬───────┘                       │
           │                               │
    ┌──────▼───────┐                       │
    │   Contours   │                       │
    │ (Blobs)      │                       │
    └──────┬───────┘                       │
           │                               │
           ├───────────────────────────────┘
           │
           ▼
    ┌──────────────────┐
    │ 3D Reconstruction│
    │ (Math Happens)   │
    └──────┬───────────┘
           │
           ▼
    ┌──────────────────┐
    │ TF Transform     │
    │ "Hey Arm, It's   │
    │  Over There ->"  │
    └──────────────────┘
```

We publish the 3D coordinates. If the camera calibration is off by 1mm, the arm punches the conveyor belt. Fun times.

---

## Part 3: Robotic Arm Manipulation (Gymnastics)

### The Challenge: 6-DOF
The arm has 6 joints. To move the gripper to `(x,y,z)`, we have to solve **Inverse Kinematics**.
- **Forward Kinematics:** "If I move my shoulder 30°, where is my hand?" (Easy, high school trig).
- **Inverse Kinematics:** "I want my hand *here*. How do I twist my elbow without breaking it?" (Pain, suffering, matrices).

### Motion Planning with MoveIt
I used **MoveIt**, which is a piece of software that essentially plays "Operation" with the robot arm, trying not to touch the sides (collisions).

**Pick-and-Place Sequence:**

```
┌───────────┐      ┌───────────┐      ┌───────────┐
│   HOME    │─────►│ PRE-GRASP │─────►│ APPROACH  │
│ (Safety)  │      │ (Hovering)│      │ (Sneaky)  │
└───────────┘      └───────────┘      └─────┬─────┘
                                            │
                                            ▼
┌───────────┐      ┌───────────┐      ┌───────────┐
│ RELEASE   │◄─────│   PLACE   │◄─────│   GRASP   │
│ (Yeet)    │      │ (Drop it) │      │ (Gotcha!) │
└─────┬─────┘      └───────────┘      └───────────┘
      │
      ▼
┌───────────┐
│   HOME    │
└───────────┘
```

When it works, it's a ballet of precision. When it fails, it looks like a drunk octopus trying to fold a fitted sheet.

---

## System Integration: Herding Cats

The real challenge wasn't the individual parts—it was making them talk to each other without insulting each other's ancestry. We used **ROS 2** as the middleware/therapist.

### Key Learnings (The "Character Building" Part)

1.  **Coordinate Frames are Evil:** I spent 3 days debugging why the arm was reaching *behind* itself. Turns out the camera was mounted upside down in software. Always draw your frames.
2.  **Simulation is a Lie:** In Gazebo simulation, physics is perfect. In reality, friction exists, motors have backlash, and gravity is a harsh mistress.
3.  **Visualization Saves Sanity:** If you can't see what the robot is thinking (via RViz), you are just guessing why it's driving into a wall.

### Future Improvements
-   **SLAM:** Let the robot get lost in new places, not just familiar ones.
-   **Deep Learning:** Teach it to recognize fruits using neural networks instead of "if pixel is grey-ish".
-   **Multi-Robot Coordination:** Because one robot failing isn't enough, let's have two colliding.

---

**Project Duration:** ~3 months of actual work, 10 years of aging  
**Tech Stack:** ROS 2, Python, OpenCV, MoveIt, Gazebo, Coffee  
**Satisfaction:** Seeing the robot autonomously execute a task is pure magic. Then it crashes 5 minutes later, but for those 5 minutes? Magic.
