# EchoNote 🎙️

> AI-powered meeting intelligence for modern teams.  
> Upload meetings → get transcripts, summaries, action items, and autonomous reminders.

Link: https://echonote-three.vercel.app/
---

## 🚀 Overview

EchoNote is a production-ready AI SaaS platform that transforms raw meeting recordings into structured, actionable intelligence.

Upload an audio recording or paste a transcript, and EchoNote automatically:

- Transcribes meetings using Groq Whisper
- Generates AI summaries using Gemini Flash
- Extracts action items and deadlines
- Stores searchable meeting history
- Sends autonomous reminder emails for overdue tasks

Built with a modern full-stack AI architecture using Next.js 14, TypeScript, Supabase, and Vercel.

---

# ✨ Features

## 🎧 Audio Upload & Processing

- Upload MP3 / WAV / M4A recordings
- Secure cloud storage with Supabase Storage
- Real-time processing pipeline

---

## 🤖 AI Meeting Intelligence

- Ultra-fast transcription using Groq Whisper
- AI-generated executive summaries
- Key decision extraction
- Automatic action-item detection

---

## 📌 Task & Reminder System

AI extracts:
- task owner
- deadlines
- priorities

Autonomous reminder agent:
- scheduled reminders
- overdue notifications
- email follow-ups

---

## 📊 Dashboard Experience

- Searchable meeting history
- Meeting detail pages
- Transcript viewer
- Status tracking
- Responsive SaaS UI

---

## 🔒 Authentication & Security

- Supabase Authentication
- Row Level Security (RLS)
- Protected dashboard routes
- Secure server-side APIs

---

# 🧠 AI Workflow

```text
Audio Upload
    ↓
Groq Whisper Transcription
    ↓
Gemini Flash Summarization
    ↓
Structured JSON Extraction
    ↓
Action Items + Deadlines
    ↓
Dashboard + Reminder Agent
```

---

# 🏗️ Tech Stack

| Category | Technology |
|---|---|
| Frontend | Next.js 14, React, TypeScript |
| Styling | Tailwind CSS, shadcn/ui |
| Backend | Next.js API Routes |
| Database | Supabase PostgreSQL |
| Authentication | Supabase Auth |
| Storage | Supabase Storage |
| AI Transcription | Groq Whisper |
| AI Summarization | Gemini Flash |
| Validation | Zod |
| Deployment | Vercel |
| Notifications | Nodemailer |

---

# 📂 Architecture

```text
Frontend (Next.js 14)
        │
        ▼
API Routes / Server Actions
        │
 ┌───────────────┬────────────────┐
 ▼               ▼                ▼
Supabase      Groq Whisper     Gemini Flash
(DB/Auth)     (Transcription)  (AI Analysis)
        │
        ▼
 Autonomous Reminder Agent
```

---

# ⚡ Core Functionalities

## 1. Meeting Upload

Users can:
- upload audio recordings
- paste raw transcripts
- track processing status

---

## 2. AI Summarization

EchoNote generates:
- executive summaries
- key discussion points
- decisions
- actionable tasks

---

## 3. Autonomous Agent

A cron-based AI reminder system:
- detects upcoming deadlines
- sends email reminders
- tracks completion states

---

# 🔐 Environment Variables

Create `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

GROQ_API_KEY=
GEMINI_API_KEY=

GMAIL_USER=
GMAIL_APP_PASSWORD=

CRON_SECRET=
NEXT_PUBLIC_APP_URL=
```

---

# 🛠️ Local Development

## Clone Repository

```bash
git clone https://github.com/Devnil434/echonote.git
cd echonote
```

---

## Install Dependencies

```bash
npm install
```

---

## Run Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 🗄️ Database Setup

1. Create a project in Supabase
2. Create a public storage bucket named:

```text
audio
```

3. Run the SQL schema in Supabase SQL Editor

---

# 🚀 Deployment

Deploy using Vercel.

```bash
git push origin main
```

Vercel automatically deploys the latest version.

---

# 📸 Screenshots

## Landing Page

_Add screenshot here_

---

## Dashboard

_Add screenshot here_

---

## Meeting Detail Page

_Add screenshot here_

---

# 🧩 Future Roadmap

- Semantic search with pgvector
- AI chat with meetings (RAG)
- Zoom / Google Meet integrations
- Team workspaces
- Slack integration
- Real-time transcription
- Meeting analytics dashboard

---

# 📈 Resume Highlights

This project demonstrates:

- Full-stack SaaS architecture
- AI engineering workflows
- LLM integration
- Production deployment
- Authentication & security
- Autonomous agents
- Database design
- API architecture

---

# 👨‍💻 Author

## Nilanjan Saha

AI/ML & Full-Stack Developer

- GitHub: https://github.com/Devnil434
- LinkedIn: Add your LinkedIn URL

---

# ⭐ Why EchoNote?

Meetings generate valuable context, but most teams lose it immediately after the call ends.

EchoNote transforms conversations into searchable organizational memory using AI.

---

# 📄 License

MIT License

---

> Built with Next.js 14, Supabase, Groq Whisper, Gemini Flash, and modern AI SaaS architecture.
