# ⚡ VOLTRIX — Smart EV Charging Network Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://voltix-nine.vercel.app)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.8-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Python ML](https://img.shields.io/badge/Python-scikit--learn-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://scikit-learn.org/)
[![Leaflet Maps](https://img.shields.io/badge/Leaflet-Maps-199900?style=for-the-badge&logo=leaflet&logoColor=white)](https://leafletjs.com/)

A modern electric vehicle charging network platform that integrates interactive station discovery, real-time availability tracking, and a **Python Machine Learning module** for charging demand forecasting.

---

## 🌐 Live Demo
🔗 **[https://voltix-nine.vercel.app](https://voltix-nine.vercel.app)**

---

## 🚀 Key Features

- **📍 Interactive Station Finder:** Dynamic Leaflet map integration displaying nearby EV charging stations with live status indicators.
- **🤖 SmartCharge ML Insights:** Machine learning feature processing (`SmartCharge-ML/api.py`) trained on historical charging data (`ChargingRecords.csv`) to predict station load and optimal charging times.
- **⚡ Modern Responsive UI:** Premium dark-accent theme with custom typography (`@fontsource/space-grotesk` & `@fontsource/inter`).
- **💳 SaaS & Station Services:** Complete portal showcasing charging solutions for home, enterprise fleet management, and public station operators.

---

## 🛠️ Project Architecture

```
voltix/
├── src/                      # React Frontend Source Code
│   ├── components/           # Navbar, Footer, StationCard, MapView
│   ├── pages/                # Home, Solutions, Analytics, About
│   └── App.jsx
├── SmartCharge-ML/           # Python Machine Learning Backend
│   ├── api.py                # Flask API Endpoint for ML Predictions
│   ├── historical_features.py# Feature Engineering & Preprocessing
│   ├── check_data.py         # Data Inspection Utilities
│   └── data/                 # Charging Records Dataset
└── package.json
```

---

## ⚙️ Setup & Installation

### 1. Frontend Setup
```bash
git clone https://github.com/harshitasingh108/voltix.git
cd voltix
npm install
npm run dev
```

### 2. Machine Learning API Setup
```bash
cd SmartCharge-ML
python -m venv venv
# On Windows:
venv\Scripts\activate
pip install -r requirements.txt
python api.py
```

---

## 👤 Author

**Harshita Singh**  
- GitHub: [@harshitasingh108](https://github.com/harshitasingh108)  
- Email: harshi786108@gmail.com
