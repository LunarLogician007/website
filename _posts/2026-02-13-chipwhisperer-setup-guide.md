---
title: "ChipWhisperer Setup Guide"
description: "Step-by-step guide for setting up ChipWhisperer with Docker on Windows and Linux for side-channel analysis experiments."
date: 2026-02-13
tags: [hardware-security, docker, tutorial, chipwhisperer]
icon: "🔐"
---

This guide covers the complete setup process for running ChipWhisperer using Docker on both Windows and Linux, including hardware connectivity for side-channel analysis experiments.

---

## Windows Setup

### Prerequisites

1. Open Command Prompt
2. Install WSL (Windows Subsystem for Linux):
   ```
   wsl --install
   ```
   *Skip this step if WSL is already installed*
3. Install USBIPD:
   ```
   winget install usbipd
   ```
4. Download and install [Docker Desktop](https://docs.docker.com/desktop/setup/install/windows-install/) from the official website
5. **Reboot** your computer after installation

### Running ChipWhisperer Docker Image

1. Open Docker Desktop
2. Navigate to the Docker terminal in the bottom right of the app
3. Enter the following command:

```bash
docker run -it --device=/dev/bus/usb:/dev/bus/usb --privileged -p 8888:8888 saravan29/hhh-notebooks4:latest
```

4. Wait for the docker image to download

![Docker image downloading and running](/assets/images/1_chip.png)

5. After the image downloads and runs, open your browser
6. Navigate to `localhost:8888`
7. Enter the password: **`bob`**

![ChipWhisperer Jupyter running in browser](/assets/images/2_chip.png)

8. To close/open it again, toggle the play button in the container section of Docker Desktop

![Docker Desktop container toggle](/assets/images/3_chip.png)

### Connecting Hardware (Windows)

To connect your ChipWhisperer hardware to the Docker container via WSL:

1. **List** available USB devices:
   ```
   usbipd list
   ```

![USBIPD list output](/assets/images/4_chip.png)

2. **Bind** ChipWhisperer to USBIPD:
   ```
   usbipd bind --busid <BUS_ID of chipwhisperer>
   ```

3. **Attach** ChipWhisperer to WSL:
   ```
   usbipd attach --wsl --busid <BUS_ID of chipwhisperer>
   ```

![USB attached to WSL](/assets/images/5_chip.png)

4. Once these steps are completed, you can proceed with hardware operations

### Important Notes (Windows)

- To install extra libraries, use `pip` in the code block itself and note them down so they can be preinstalled in the final Dockerfile (see `libraries.ipynb` for details)
- When plotting graphs, use `%%matplotlib widget` rather than `%%matplotlib notebook`
- Useful folders:
  - `notebooks_main` inside the `notebooks` folder
  - `sca101`, `sca201`, `sca202` inside `courses/jupyter`

---

## Linux Setup

1. Install [Docker](https://docs.docker.com/desktop/setup/install/linux/ubuntu/) from the official website and follow the installation steps
2. Run the ChipWhisperer Docker image:

```bash
docker run -it --device=/dev/bus/usb:/dev/bus/usb --privileged -p 8888:8888 saravan29/hhh-notebooks4:latest
```

3. Setup is now complete for both simulation and hardware use

### Important Notes (Linux)

- To install extra libraries, use `pip` in the code block itself and note them down so they can be preinstalled in the final Dockerfile (see `libraries.ipynb` for details)
- When plotting graphs, use `%%matplotlib widget` rather than `%%matplotlib notebook`
- Useful folders:
  - `notebooks_main` inside the `notebooks` folder
  - `sca101`, `sca201`, `sca202` inside `courses/jupyter`
