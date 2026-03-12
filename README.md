# CU-Bytes

AI food tracking app for Carleton Ravens, built as part of SYSC4907 Engineering Capstone Project.

## Overview

CU-Bytes is a comprehensive food tracking system consisting of:

- **Backend:** Flask API server for data management
- **Frontend:** React Native mobile application
- **Machine Learning:** PyTorch food recognition and nutrition analysis

## Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/cu-bytes.git
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
