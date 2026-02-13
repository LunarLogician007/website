---
title: "macOS Setup Guide: Keil µVision & Lab Tools"
description: "Complete guide for installing Keil µVision on macOS using Wine, along with DFU Programmer and serial communication tools for EE337 lab experiments."
date: 2026-02-14
tags: [embedded, macos, tutorial, 8051]
icon: "🖥️"
---

This guide outlines the installation process for Keil µVision on macOS using the Wine compatibility layer, along with necessary drivers and flashing tools for the EE337 lab experiments.

---

## 1. Install Homebrew

Homebrew is a package manager for macOS required to install the necessary tools.

1. Open **Terminal** (`Applications` → `Utilities` → `Terminal`).
2. Run the following command to install Homebrew:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

3. Follow the on-screen prompts and enter your password when requested.
4. Verify the installation:

```bash
brew --version
```

---

## 2. Install Wine (Sikarugir)

Since Keil is a Windows application, we use a Wine wrapper to run it on macOS.

Run the following command in Terminal:

```bash
brew install --cask Sikarugir-App/sikarugir/sikarugir
```

---

## 3. Install Keil µVision (C51)

1. **Download:** Get the **C51** installer from [ARM's official website](https://www.keil.com/demo/eval/c51.htm).
2. **Install:** Follow the setup instructions demonstrated in the video guide below.
   - [🎥 Watch Installation Guide](https://drive.google.com/file/d/1dCbQKq_vxq2rW5-cpNZmwz3437tNbkod/view?usp=sharing)

---

## 4. DFU Programmer

The **DFU (Device Firmware Update) Programmer** is used to flash `.hex` files onto the 8051 microcontroller.

### Installation

Install the tool via Homebrew:

```bash
brew install dfu-programmer
```

Verify the installation:

```bash
dfu-programmer --version
```

### Usage Guide

**1. Erase Flash**

Before programming, clear the existing firmware:

```bash
sudo dfu-programmer at89c5131 erase
```

**2. Program Flash**

Upload your new code:

```bash
sudo dfu-programmer at89c5131 flash <your_file.hex>
```

> **Note:** Execute these commands in the directory containing your `.hex` file. When using `sudo`, your password will not appear on screen as you type.

---

## 5. Serial Communication Setup

To enable UART communication between the microcontroller and your Mac, you must install the Prolific driver and a serial terminal.

### A. Install Prolific PL2303 Driver

1. Open the **App Store**.
2. Search for **"Prolific PL2303 Serial"**.
3. Install the application.

![Prolific PL2303 Serial in Mac App Store](/assets/images/1_keil.png)

### B. Install CoolTerm

CoolTerm is the serial terminal used to view UART output.

1. Install via Homebrew:

```bash
brew install --cask coolterm
```

2. Once installed, open the application to verify.

![CoolTerm application window](/assets/images/2_keil.png)

---

## 6. Troubleshooting

If you encounter issues during installation or flashing, consult the solutions below.

### 🛑 "App cannot be opened because the developer cannot be verified"

macOS Gatekeeper may block Wine or CoolTerm initially.

1. Go to **System Settings** → **Privacy & Security**.
2. Scroll down to the **Security** section.
3. You will see a message saying the app was blocked. Click **Open Anyway**.
4. Alternatively, right-click the app in Finder and select **Open**.

### 🔌 `dfu-programmer: no device present`

This error means the computer cannot see the microcontroller.

1. Ensure the board is in **Bootloader Mode**:
   - Hold down the **boot** button.
   - Press and release the **RESET** button.
   - Release the **boot** button.
2. Run the command again.
