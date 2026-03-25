# [CU-Bytes](https://gachuzia.github.io/cu-bytes/)

![Python](https://img.shields.io/badge/Python-3.13-3776AB?style=flat&logo=python&logoColor=white) ![Expo](https://img.shields.io/badge/Expo-SDK_54-000020?style=flat&logo=expo&logoColor=white) ![React Native](https://img.shields.io/badge/React_Native-0.81-20232A?style=flat&logo=react&logoColor=61DAFB) ![Flask](https://img.shields.io/badge/Flask-API-000000?style=flat&logo=flask&logoColor=white) ![PyTorch](https://img.shields.io/badge/PyTorch-ML-EE4C2C?style=flat&logo=pytorch&logoColor=white) ![Capstone](https://img.shields.io/badge/Capstone-SYSC_4907-8C1D40?style=flat)

## Overview

CU-Bytes is a comprehensive food tracking system consisting of:

- **Backend:** Flask API server for data management
- **Frontend:** React Native mobile application
- **Machine Learning:** PyTorch food recognition and nutrition analysis

## Developer Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/GAchuzia/cu-bytes.git
   cd cu-bytes
   ```

2. **Set up backend**

   ```bash
   python -m venv backenv
   backenv\Scripts\activate # Windows
   pip install -r requirements.txt
   python -m backend.database.init_user_settings_db
   python -m backend.database.init_auth_db
   python -m backend.database.init_food_db
   python -m backend.database.init_logging_db
   python -m backend.app
   ```

3. **Set up frontend**

   ```bash
   cd frontend/cu-bytes
   npm install
   npm start
   ```

4. **Set up machine learning environment**

   ```bash
   cd machine-learning
   python -m venv mlenv
   mlenv\Scripts\activate  # Windows
   pip install -r requirements.txt
   ```

## Documentation

- **[docs/DEV_GUIDE.md](docs/DEV_GUIDE.md)**  
- **[docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)**