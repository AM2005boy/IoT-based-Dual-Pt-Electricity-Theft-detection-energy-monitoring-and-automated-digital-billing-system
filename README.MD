# IoT-Based Smart Energy Monitoring and Electricity Theft Detection System

An IoT-based retrofit-oriented system for real-time electricity monitoring, electricity theft and illegal hooking detection, meter tampering detection, daily energy analysis, cost estimation, cloud monitoring, and automated digital billing using ESP32, CT sensors, LoRa, Wi-Fi, Firebase, and a web dashboard.

---

## 📌 Overview

Electricity theft, illegal hooking, meter tampering, manual meter reading, and limited consumer awareness of daily energy consumption are important challenges in conventional electricity monitoring systems.

This project proposes an **IoT-based Smart Energy Monitoring and Electricity Theft Detection System** that combines electrical sensing, embedded processing, wireless communication, cloud storage, web-based monitoring, tamper detection, energy calculation, and digital billing into a unified platform.

The system uses **dual-point electrical monitoring**, where electrical parameters are monitored at:

1. **Transformer/Distribution Side**
2. **Consumer Side**

The measurements from these two points are comparatively evaluated. When an abnormal difference beyond the configured permissible condition is detected, the system indicates a possible **electricity theft or illegal hooking condition**.

The system also incorporates a separate **tamper detection mechanism** for detecting unauthorized physical interference with the electricity meter.

---

## ✨ Key Features

- ⚡ Real-time electrical parameter monitoring
- 🔌 Dual-point electricity measurement
- 🔍 Possible electricity theft detection
- 🪝 Illegal hooking detection
- 🛡️ Meter tampering detection
- 📡 LoRa-based long-range communication
- 🌐 Wi-Fi connectivity
- ☁️ Firebase cloud storage and synchronization
- 📊 Web-based monitoring dashboard
- 📈 Energy consumption monitoring
- 📅 Daily energy consumption calculation
- 💰 Daily electricity cost estimation
- 🧾 Automated digital billing
- 📄 PDF-based bill/report generation
- 🔔 Theft and tamper status indication
- 🔧 Retrofit-oriented implementation
- 👨‍💻 ESP32-based embedded processing

---

## 🏗️ System Architecture

```text
                 ELECTRICAL DISTRIBUTION SYSTEM
                           │
                           │
                 ┌─────────▼─────────┐
                 │ Transformer /     │
                 │ Distribution Side │
                 │                   │
                 │ CT Sensor         │
                 │ Voltage Sensor    │
                 │ ESP32             │
                 └─────────┬─────────┘
                           │
                           │ Electrical Supply
                           │
                           ▼
                 ┌───────────────────┐
                 │ Consumer Premises │
                 │                   │
                 │ CT Sensor         │
                 │ Voltage Sensor    │
                 │ Tamper Sensor     │
                 │ ESP32             │
                 └─────────┬─────────┘
                           │
                           │ LoRa
                           ▼
                 ┌───────────────────┐
                 │ LoRa Receiver /   │
                 │ Gateway            │
                 │                   │
                 │ ESP32             │
                 └─────────┬─────────┘
                           │
                           │ Wi-Fi
                           ▼
                 ┌───────────────────┐
                 │ Flask / Backend   │
                 │ Server            │
                 └─────────┬─────────┘
                           │
                           ▼
                 ┌───────────────────┐
                 │ Firebase Cloud    │
                 │ Database          │
                 └─────────┬─────────┘
                           │
                           ▼
                 ┌───────────────────┐
                 │ Web Dashboard     │
                 │                   │
                 │ Power             │
                 │ Energy            │
                 │ Cost              │
                 │ Theft Status      │
                 │ Tamper Status     │
                 │ Digital Bill      │
                 └───────────────────┘

                 ## ⚙️ Working Principle

The proposed system works by continuously monitoring electrical parameters at two points of the electricity supply path: the **transformer/distribution side** and the **consumer side**. The measured information is processed by ESP32-based controllers and transmitted through LoRa to a remote gateway. The gateway forwards the data to the cloud through Wi-Fi, where it is stored, analyzed and displayed on the web dashboard.

### Step 1: Electrical Measurement

CT sensors are installed at the transformer/distribution side and consumer side to measure the current flowing through the respective points. Voltage-sensing circuits are used to obtain voltage information.

The ESP32 controllers acquire the sensor values and process them to determine parameters such as:

- Voltage
- Current
- Power
- Energy consumption

### Step 2: Dual-Point Comparison

The system obtains electrical measurements from both the transformer/distribution side and consumer side.

The measurements are compared to determine whether the difference between the two points remains within the configured permissible condition, while considering normal electrical losses and measurement variations.

```text
Transformer / Distribution Side
             │
             │ Measurement
             ▼
       ┌─────────────┐
       │             │
       │ Comparison  │
       │   Logic     │
       │             │
       └─────────────┘
             ▲
             │ Measurement
             │
      Consumer Side



      Dual-Point Measurements
          ↓
Comparative Evaluation
          ↓
Is difference within
permissible condition?
       /          \
     YES           NO
      ↓             ↓
 Normal Status   Possible Theft /
                 Illegal Hooking



                 Consumer ESP32
      │
      │ LoRa
      ▼
LoRa Receiver / Gateway
      │
      │ Wi-Fi
      ▼
Cloud Backend



Daily Energy Consumption
          ↓
     Tariff Information
          ↓
   Cost Calculation
          ↓
Estimated Daily Cost