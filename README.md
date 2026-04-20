# 🤖 Brno Data Chatbot

A conversational AI assistant for exploring Brno city data — transit, weather, and more — powered by Google ADK, FastAPI, and React.

---

## 📐 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Docker Compose                        │
│                                                             │
│   ┌──────────┐     ┌──────────────┐     ┌───────────────┐  │
│   │          │     │              │     │               │  │
│   │  React   │────▶│   FastAPI    │────▶│  Google ADK   │  │
│   │ Frontend │◀────│   Backend    │◀────│    Agent      │  │
│   │  :5173   │     │   :8001      │     │    :8000      │  │
│   │          │     │      │       │     │      │        │  │
│   └──────────┘     └──────┼───────┘     └──────┼────────┘  │
│                           │                    │            │
│                           ▼                    ▼            │
│                    ┌─────────────────────────────────┐      │
│                    │          PostgreSQL :5432        │      │
│                    │   (sessions, events, users)      │      │
│                    └─────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Request Flow

```
User types message
       │
       ▼
 React Frontend
       │  POST /api/chat/ask-llm
       │  Authorization: Bearer <jwt>
       ▼
 FastAPI Backend
       │  Validates JWT
       │  Looks up / creates ADK session
       │
       ├──── POST /run_sse ────▶ Google ADK Agent
       │                               │
       │                               │  Calls tools
       │                               │  (GTFS, weather API...)
       │                               │
       │◀─── SSE stream ───────────────┘
       │
       │  Streams response chunks
       ▼
 React Frontend
  (live typewriter effect)
```

---

## 🧱 Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript + Tailwind CSS |
| Backend API | FastAPI + SQLAlchemy (async) + JWT auth |
| AI Agent | Google ADK (Gemini 2.5 Flash) |
| Database | PostgreSQL 18 |
| Containerization | Docker Compose |


---

## 🚀 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose
- A Google AI API key (for Gemini)

### 1. Clone the repo

```bash
git clone https://github.com/your-username/brno-data-chatbot.git
cd brno-data-chatbot
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
# PostgreSQL
POSTGRES_USER=postgres
POSTGRES_PASSWORD=yourpassword
POSTGRES_DB=brno_chatbot

# JWT
SECRET_JWT_KEY=your-secret-key

# Google ADK
GOOGLE_API_KEY=your-google-api-key

# Services
ADK_BASE_URL=http://agent:8000
ADK_APP_NAME=brno-llm
```

### 3. Start all services

```bash
docker compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| FastAPI docs | http://localhost:8001/docs |
| ADK Agent | http://localhost:8000 |

---

## 🔐 Authentication

The API uses JWT tokens. All protected routes require:

```
Authorization: Bearer <token>
```

| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/register` | POST | Create account |
| `/api/auth/token` | POST | Login (form-encoded) |
| `/api/auth/me` | GET | Current user info |

---

## 🤖 Agent

The AI agent is built with [Google ADK](https://google.github.io/adk-docs/) and runs as a separate service. It has access to custom tools:

- **`get_weather_in_brno`** — fetches live temperature data across Brno districts
- More tools for GTFS transit data (routes, stops, departures)

The agent uses **Gemini 2.5 Flash** and maintains conversation history via ADK sessions stored in PostgreSQL.

---

## 🗄️ Database

Both the FastAPI server and the ADK agent share the same PostgreSQL instance.

```
users
  id, username, email, hashed_password

sessions
  id, app_name, user_id, update_time, ...

events
  id, app_name, user_id, session_id,
  invocation_id, timestamp, event_data (JSONB)
```

The `event_data` column stores the full ADK event payload as JSONB, which is filtered server-side to return only user/model text messages to the frontend.

---

## 🧪 Development

### Run the API locally (without Docker)

```bash
cd api
pip install -r requirements.txt
uvicorn api.main:app --reload --port 8001
```

### Run the agent locally

```bash
cd agent
adk api_server --agents_dir . --port 8000
```

### Run the frontend locally

```bash
cd frontend
npm install
npm run dev
```
