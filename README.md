<div align="center">

# 🚇 Predictive Commute Pro

### AI-powered urban mobility intelligence for smarter, stress-free commuting.

*Built for the **Urban Mobility Hackathon** 🏙️*

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Vite](https://img.shields.io/badge/Bundler-Vite_5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

</div>

---

## 🌟 What is Predictive Commute Pro?

**Predictive Commute Pro** is a full-stack web application that gives commuters a real-time **GO** or **WAIT** decision for any destination — powered by an AI-driven traffic scoring engine. Instead of scrolling through maps and guessing, users simply type their destination and get an instant, data-backed recommendation.

Built in 24 hours for the Urban Mobility Hackathon, this MVP demonstrates a clean separation of concerns between a **FastAPI** prediction engine and a **React + Tailwind** glassmorphic frontend.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔮 **GO / WAIT Engine** | Real-time traffic score simulation (pluggable with live data APIs) |
| 🎨 **Glassmorphic UI** | Animated, dark-mode glass card with floating gradient orbs |
| 📊 **Traffic Score Bar** | Visual representation of congestion level |
| 🛰️ **Modular REST API** | Versioned FastAPI backend (`/api/v1/`) with OpenAPI docs |
| 🤖 **ML-Ready Services** | Pluggable service layer — swap stubs for scikit-learn models |
| ⚡ **Vite HMR** | Sub-second hot module replacement for rapid development |

---

## 🗂️ Project Structure

```
Predictive-Commute-Pro/
├── backend/                     # FastAPI application
│   ├── app/
│   │   ├── main.py              # App entry point + CORS config
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── routes.py    # Top-level v1 router
│   │   │       └── endpoints/
│   │   │           ├── commute.py      # /commute routes
│   │   │           ├── predictions.py  # /predictions routes (GO/WAIT)
│   │   │           └── routes.py       # /routes transit data
│   │   ├── schemas/             # Pydantic request/response models
│   │   │   ├── commute.py
│   │   │   └── prediction.py
│   │   └── services/            # Business logic layer (ML-pluggable)
│   │       ├── commute_service.py
│   │       └── prediction_service.py
│   └── requirements.txt
│
├── frontend/                    # React + Vite application
│   ├── src/
│   │   ├── App.jsx              # Main glassmorphic UI
│   │   ├── main.jsx             # React entry point
│   │   └── index.css            # Tailwind directives + global styles
│   ├── index.html
│   ├── vite.config.js           # Vite + API proxy config
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Python** 3.11+
- **Node.js** 18+
- **pip** and **npm**

---

### 🐍 Backend (FastAPI)

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Create and activate a virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Start the development server
uvicorn app.main:app --reload --port 8000
```

The API will be live at **`http://localhost:8000`**

📖 Interactive API docs: **`http://localhost:8000/docs`**

---

### ⚛️ Frontend (React + Vite)

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be live at **`http://localhost:5173`**

> The Vite dev server automatically proxies all `/api/*` requests to the FastAPI backend on port 8000 — no CORS configuration needed during development.

---

## 🔌 API Reference

### `GET /api/v1/predictions/recommend`

Returns a **GO** or **WAIT** commute decision for a destination.

**Query Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `destination` | `string` | ✅ | The destination to evaluate |

**Example Request:**
```bash
curl "http://localhost:8000/api/v1/predictions/recommend?destination=Central+Station"
```

**Example Response:**
```json
{
  "destination": "Central Station",
  "traffic_score": 0.4823,
  "decision": "GO"
}
```

> `decision` is `"GO"` when `traffic_score < 0.7`, otherwise `"WAIT"`.

---

### `POST /api/v1/commute/summary`

Returns a full AI-generated commute summary.

**Request Body:**
```json
{
  "origin": "Home",
  "destination": "Tech Park",
  "departure_time": "2026-04-15T08:30:00",
  "mode": "metro"
}
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Backend** | FastAPI 0.111 | REST API framework |
| **Runtime** | Python 3.11 | Server-side language |
| **Validation** | Pydantic v2 | Schema validation |
| **Server** | Uvicorn | ASGI server |
| **ML Engine** | scikit-learn | (Pluggable) Delay prediction |
| **Frontend** | React 18 | UI framework |
| **Bundler** | Vite 5 | Build tool + HMR |
| **Styling** | Tailwind CSS 3 | Utility-first CSS |
| **Font** | Inter | Typography |

---

## 🔮 Roadmap

- [ ] Integrate live traffic APIs (Google Maps / TomTom)
- [ ] Train scikit-learn delay prediction model on GTFS data
- [ ] Add user authentication and saved routes
- [ ] Push notifications for departure time alerts
- [ ] Mobile-responsive PWA support
- [ ] Docker Compose for one-command startup

---

## 👥 Team

Built with ❤️ for the **Urban Mobility Hackathon** — April 2026.

---

## 📄 License

MIT © 2026 Predictive Commute Pro Team
