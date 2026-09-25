# KrishiMitra (कृषि मित्र) – AI-Powered Multi-Crop Disease Detection & Farmer Assistance Platform

[![Python](https://img.shields.io/badge/Python-3.11%20%7C%203.12%20%7C%203.13-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0.3-emerald.svg)](https://flask.palletsprojects.com/)
[![TensorFlow / Keras](https://img.shields.io/badge/Keras%203-TensorFlow%202.x-orange.svg)](https://keras.io/)
[![React](https://img.shields.io/badge/React-19%20%7C%20TypeScript-blue.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-teal.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**KrishiMitra** is a production-grade, full-stack, AI-powered agricultural intelligence platform designed to empower smallholder and commercial farmers with instant plant disease diagnostics, multi-lingual voice & text advisory, real-time hyper-local agricultural weather telemetry, and nearby market/agri-resource discovery.

---

## 🌾 Core Capabilities

1. **AI Neural Multi-Crop Disease Detection**:
   - High-precision Convolutional Neural Network (CNN) trained across **25 distinct conditions** covering major staple and vegetable crops: **Potato, Tomato, Rice, Wheat, and Pea**.
   - Input options: Live camera capture via HTML5 MediaDevices, drag-and-drop, or device gallery upload.
   - Comprehensive diagnostic reports with **Confidence percentage**, **Severity rating**, **Symptom signatures**, **Organic treatments**, **Chemical sprays (with exact dosages)**, and **Preventative management strategies**.
   - Responsible-use agronomic notice to ensure farmers cross-verify high-severity outbreaks with local agricultural officers.

2. **Multilingual Kisan AI Assistant**:
   - Conversational agricultural advisor supporting **10 Indian languages**: English, Hindi (हिन्दी), Bengali (বাংলা), Marathi (मराठी), Punjabi (ਪੰਜਾਬੀ), Gujarati (ગુજરાતી), Tamil (தமிழ்), Telugu (తెలుగు), Kannada (ಕನ್ನಡ), and Urdu (اردو).
   - **Speech-to-Text (STT)** voice questioning and **Text-to-Speech (TTS)** voice answer playback with active listening animations.
   - Dual-mode intelligence: Works completely offline with a rich ICAR-aligned Agronomy Knowledge Engine, and connects to Google Gemini or Groq Llama-3 when an API key is configured.

3. **Hyper-Local Agricultural Weather & Spray Advisories**:
   - Live telemetry powered by Open-Meteo (Zero API key needed) and OpenWeatherMap.
   - Provides Temperature, Feels-Like, Relative Humidity, Wind Speed, and Precipitation Probability.
   - Intelligent Spraying Advisory: Automatically alerts farmers whether current wind and rain conditions are safe for foliar fungicide application.

4. **Nearby Agricultural Resources & Verified Helplines**:
   - Real-time geolocation reverse-geocoding via OpenStreetMap Nominatim.
   - Live discovery of nearby APMC Mandis, certified seed stores, and fertilizer dealers via OpenStreetMap Overpass.
   - Direct click-to-call integration with national emergency resources, including the **All-India Kisan Call Center (1800-180-1551)** and **e-NAM**.

5. **Diagnostic History & Secure Farmer Accounts**:
   - Secure authentication via BCrypt password hashing and JSON Web Tokens (JWT).
   - Full diagnostic timeline enabling farmers to track disease re-occurrences, review past treatments, and delete past records.

---

## 🏛️ System Architecture

```
KrishiMitra/
├── frontend/                     # React + Vite + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── components/           # Navbar, Footer, WeatherWidget, ConfidenceBar
│   │   ├── context/              # AuthContext, LanguageContext (i18n)
│   │   ├── i18n/                 # Complete English & Hindi dictionaries (10 languages)
│   │   ├── pages/                # Home, Dashboard, Predict, Assistant, History, Resources, Auth
│   │   ├── services/             # Typed API Client (Axios/Fetch wrapper with JWT)
│   │   └── utils/                # Web Speech API helpers (STT / TTS)
│   ├── package.json
│   ├── vite.config.ts
│   └── nginx.conf                # Production SPA reverse proxy
│
├── backend/                      # Python 3 + Flask REST API
│   ├── app.py                    # Flask factory, blueprint registration & error handlers
│   ├── config.py                 # Configuration loader (PostgreSQL, SQLite, JWT)
│   ├── wsgi.py                   # Gunicorn WSGI production entrypoint
│   ├── data/
│   │   ├── diseases.json         # Agronomy knowledge base (25 conditions, symptoms & remedies)
│   │   └── class_indices.json    # Ordered model classification index mapping
│   ├── model/
│   │   └── crop_disease_model.keras # Native Keras 3 CNN model weights
│   ├── models/
│   │   └── database.py           # SQLAlchemy ORM models (User, Prediction, AssistantMessage)
│   ├── routes/                   # Modular REST blueprints (/auth, /predict, /history, /weather, etc.)
│   ├── services/                 # ModelService (Singleton), Weather, Location, Resources, Assistant
│   ├── utils/                    # init_model.py, helpers.py
│   └── uploads/                  # User leaf image storage directory
│
├── tests/
│   ├── test_backend.py           # Pytest backend unit & integration tests
│   └── verify_e2e.py             # Complete automated 10-step E2E simulation script
│
├── docker-compose.yml            # Multi-container production deployment (DB + Backend + Frontend)
├── Dockerfile.backend
├── .env.example                  # Environment configuration template
└── README.md
```

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- **Python**: 3.11, 3.12, or 3.13
- **Node.js**: v18+ or v20+ with `npm`
- **Git**

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/KrishiMitra.git
cd KrishiMitra
```

---

### Step 2: Backend Setup

1. **Create and activate a virtual environment (recommended)**:
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # Linux / macOS
   python3 -m venv venv
   source venv/bin/activate
   ```

2. **Install Python dependencies**:
   ```bash
   pip install -r backend/requirements.txt
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   *(Note: The defaults in `.env.example` work out of the box with zero external configuration! SQLite is used as the default database and Open-Meteo as the default weather provider).*

4. **Verify / Initialize the AI Model**:
   If `backend/model/crop_disease_model.keras` does not exist, initialize it:
   ```bash
   python backend/utils/init_model.py
   ```

5. **Run the Flask Backend Server**:
   ```bash
   # Method 1 (Direct Python):
   python -m backend.app

   # Method 2 (Production Gunicorn on Linux/Mac):
   gunicorn --bind 0.0.0.0:5000 backend.wsgi:app
   ```
   The backend API will start on: **`http://localhost:5000`**
   - Health check: `http://localhost:5000/api/health`

---

### Step 3: Frontend Setup

1. **Navigate to the frontend directory and install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Start the Vite Development Server**:
   ```bash
   npm run dev
   ```
   The web application will launch at: **`http://localhost:3000`**

---

## 🧪 Testing & Verification

### Running Backend Unit & Integration Tests
The repository includes a comprehensive `pytest` test suite:
```bash
python -m pytest tests/test_backend.py -v
```

### Running the End-to-End API Simulation
Verify all 10 core user flows (Signup -> Login -> Leaf Upload -> CNN Inference -> History Recording -> Weather -> Geocoding -> Resources -> Bilingual Assistant):
```bash
python tests/verify_e2e.py
```

### Building Frontend for Production
```bash
cd frontend
npm run build
```
This produces an optimized production bundle in `frontend/dist/`.

---

## 📡 REST API Reference

All responses follow a consistent standard JSON envelope:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional status message"
}
```

### 1. Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Register a new farmer account | No |
| `POST` | `/api/auth/login` | Login with email or phone + password | No |
| `GET` | `/api/auth/me` | Fetch authenticated farmer profile | Yes (Bearer) |
| `PUT` | `/api/auth/profile` | Update profile (name, language, state, district) | Yes (Bearer) |

### 2. Disease Detection (`/api/predict`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/predict` | Upload leaf image (`multipart/form-data`) + optional `crop_hint` | Optional (links to history if logged in) |
| `GET` | `/api/predict/crops` | List supported crops and cataloged conditions | No |

### 3. Diagnostic History (`/api/history`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/history` | Paginated past predictions of the authenticated user | Yes (Bearer) |
| `GET` | `/api/history/<id>` | Full agronomy treatment breakdown for a specific record | Yes (Bearer) |
| `DELETE` | `/api/history/<id>` | Delete a diagnostic record | Yes (Bearer) |

### 4. Telemetry & Utilities
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/weather?lat={lat}&lon={lon}` | Real-time weather, humidity, wind & spray safety | No |
| `GET` | `/api/location/reverse?lat={lat}&lon={lon}` | Reverse geocode coordinates to village/district/state | No |
| `GET` | `/api/resources?lat={lat}&lon={lon}&category={cat}` | Nearby Mandis, seed & fertilizer shops + helplines | No |
| `POST` | `/api/assistant/chat` | Multilingual agricultural reasoning dialogue | Optional |
| `GET` | `/api/health` | Service health status check | No |

---

## 🐳 Docker & Production Deployment

### Multi-Container Deployment via Docker Compose
To run PostgreSQL, the Flask backend, and the Nginx React frontend together:
```bash
docker-compose up --build -d
```
The application will be accessible at `http://localhost` (Port 80).

### Deploying Frontend and Backend Separately
- **Backend**: Can be deployed to Render, Railway, AWS ECS, Google Cloud Run, or any VPS with Gunicorn (`backend.wsgi:app`).
- **Frontend**: Can be deployed to Vercel, Netlify, Cloudflare Pages, or AWS S3/CloudFront by deploying the `frontend/dist` directory. Set `VITE_API_URL` to point to your live backend domain.

---

## 🛡️ Responsible Agricultural AI Notice
KrishiMitra provides initial identification based on deep learning neural models trained on plant pathology datasets. While highly accurate, environmental conditions, lighting, and co-infections can introduce variance. For critical commercial crop emergencies or prior to applying high-potency chemical pesticides, farmers are strongly encouraged to verify findings with their local Krishi Vigyan Kendra (KVK) or block agricultural officer.

---

## 📄 License
This project is open-source and licensed under the [MIT License](LICENSE).
