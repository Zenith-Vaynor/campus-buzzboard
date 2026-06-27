# Campus BuzzBoard // Command Center

[![Live Dashboard](https://img.shields.io/badge/Live_Dashboard-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://campus-buzzboard.vercel.app)
[![Live API](https://img.shields.io/badge/Live_API-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://campus-buzzboard.onrender.com/api/)
[![Android APK](https://img.shields.io/badge/Android-APK_Download-3DDC84?style=for-the-badge&logo=android&logoColor=white)](https://expo.dev/artifacts/eas/tmsZ8yPtuJpoCbaLuOct1um4vJvXytsB7EBoen5nkh8.apk)

Campus BuzzBoard is a full-stack, terminal-inspired dashboard designed to streamline campus communication. It provides a clean, high-visibility interface for students and faculty to track trending events and notices in real-time.

---

## Development Status: Production Ready
The project has successfully transitioned from web-only to a native mobile application. The **Android APK** is fully compiled and production-ready, featuring a resilient network-timeout-handling layer and a high-performance heat-tracking algorithm.

---

## Core Features

* ** Heat Score Algorithm:** A custom backend logic that calculates the "liveness" of content, visualized through a highly sensitive, numberless color spectrum.
* ** Dual-Stream Feed:** Rapid toggling between live Event and Notice data streams.
* ** Terminal-Inspired UX:** A high-contrast, distraction-free design focused on readability, utility, and reduced cognitive load.
* ** Live Search:** Real-time filtering capabilities across all data streams.
* ** Native Gestures:** Pull-to-refresh integration for seamless background data fetching.

---

## Tech Stack

### Frontend (The Interface)
* **Framework:** React Native (Built via Expo)
* **Mobile Compilation:** EAS Build (Android APK)
* **Web Compilation:** Expo Web
* **Deployment:** Expo Application Services (EAS) & Vercel

### Backend (The Brain)
* **Framework:** Django & Django REST Framework (DRF)
* **Database:** PostgreSQL (Production) / SQLite (Local)
* **Server:** Gunicorn & WhiteNoise
* **Deployment:** Render

---

## Deployment Architecture

The project utilizes a decoupled architecture where the React Native frontend communicates with a production-grade Django API.

1. **GitHub Vault:** Central version control.
2. **Render:** Hosts the Django API, handling automated startup migrations and database connections.
3. **EAS:** Compiles the native Android binary (APK) for mobile distribution.
4. **Vercel:** Hosts the optimized static frontend, utilizing environment variables to dynamically route API requests.

---

## Local Development Setup

If you wish to run this project locally on your machine, follow these steps:

### 1. Clone the Repository
```bash
git clone [https://github.com/Zenith-Vaynor/campus-buzzboard.git](https://github.com/Zenith-Vaynor/campus-buzzboard.git)
cd campus-buzzboard
```

### 2. Setup the Backend (Terminal 1)
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows use: .venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 3. Setup the Frontend (Terminal 2)
```bash
cd frontend
npm install

# To run on web:
npx expo start --web

# To run on mobile emulator:
npx expo start
```
