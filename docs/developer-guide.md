# CU-Bytes Developer Guide

## Table of Contents

- [Prerequisites](#prerequisites)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Machine Learning Setup](#machine-learning-setup)
- [Running the Application](#running-the-application)
- [Development Workflow](#development-workflow)

## Prerequisites

- Python 3.8+ (for backend and ML)
- Node.js 16+ and npm (for frontend)
- Git
- Windows/macOS/Linux

## Backend Setup

### 1. Create Virtual Environment

```bash
cd backend
python -m venv backenv
```

### 2. Activate Virtual Environment

**Windows:**

```bash
backenv\Scripts\activate
```

**macOS/Linux:**

```bash
source backenv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment

Create `.env` file in backend directory:

```env
FLASK_APP=app.py
FLASK_ENV=development
PORT=5000
```

### 5. Run Backend Server

```bash
python app.py
```

The server will start on `http://localhost:5000`

**Documentation:** [Flask Documentation](https://flask.palletsprojects.com/)

## Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd frontend/cu-bytes
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create `.env` file in `frontend/cu-bytes/` directory:

```env
EXPO_PUBLIC_API_IP=YOUR_COMPUTER_IP_ADDRESS
```

**Find your IP address:**

- Windows: `ipconfig`
- macOS/Linux: `ifconfig`

### 4. Start Development Server

```bash
npm start
```

**Documentation:**

- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)

## Machine Learning Setup

### 1. Create Virtual Environment

```bash
cd machine-learning
python -m venv mlenv
```

### 2. Activate Virtual Environment

**Windows:**

```bash
mlenv\Scripts\activate
```

**macOS/Linux:**

```bash
source mlenv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

## Running the Application

### 1. Start Backend Server

```bash
cd backend
backenv\Scripts\activate  # Windows
python app.py
```

### 2. Start Frontend Development Server

```bash
cd frontend/cu-bytes
npm start
```

### 3. Access Application

- **Web:** Open browser to Expo development URL
- **Mobile:** Scan QR code with Expo Go app
- **API:** `http://localhost:5000/api/health`



