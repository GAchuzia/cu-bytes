# 🍽️ [CU-Bytes](https://gachuzia.github.io/cu-bytes/)

![Python](https://img.shields.io/badge/Python-3.13-3776AB?style=flat&logo=python&logoColor=white) ![Expo](https://img.shields.io/badge/Expo-SDK_54-000020?style=flat&logo=expo&logoColor=white) ![React Native](https://img.shields.io/badge/React_Native-0.81-20232A?style=flat&logo=react&logoColor=61DAFB) ![Flask](https://img.shields.io/badge/Flask-API-000000?style=flat&logo=flask&logoColor=white) ![PyTorch](https://img.shields.io/badge/PyTorch-ML-EE4C2C?style=flat&logo=pytorch&logoColor=white)

---

## What is CU-Bytes?

CU-Bytes is an AI-powered food tracking app built specifically for **Carleton University** students and faculty. Snap a photo of your meal, get nutritional info, and make smarter dietary choices.

- **Scan food** with your camera and let AI identify it
- **Browse 660+ menu items** across 25 campus dining locations
- **Get allergy warnings** tailored to your dietary profile
- **Track your nutrition** with personal stats and recommendations
- **No install needed** - runs in any browser via GitHub Pages

---

## How It's Built

| Layer | Tech | What It Does |
|-------|------|--------------|
| 🖥️ Frontend | React Native + Expo | Cross-platform UI for web and mobile |
| ⚙️ Backend | Python + Flask | REST API hosted on Azure |
| 🤖 ML Model | PyTorch + ResNet50 | Food classification from images |

---

## Developer Setup

### Clone the repo
```bash
git clone https://github.com/GAchuzia/cu-bytes.git
cd cu-bytes
```

### Run the app
```powershell
.\start-dev.ps1
```

> **Requirements:** PowerShell, Python 3.13, Node.js. Run from the project root directory.



## Documentation

| Doc | Description |
|-----|-------------|
| [DEV_GUIDE.md](docs/DEV_GUIDE.md) | Architecture, endpoints, and database schemas |
| [CONTRIBUTING.md](docs/CONTRIBUTING.md) | Branch rules, PR process, and coding standards |

---


