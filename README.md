# NG SkillCheck - AI-Powered Skill Evaluation Engine

An intelligent AI-powered skill evaluation platform designed to benchmark candidates against **NavGurukul's specialized career tracks**: AI Engineer, ML Engineer, and Full Stack Developer. It supports manual uploads (Resume, Pre-Work, GitHub repo) as well as automated email processing from Gmail, storing all results in a PostgreSQL database for a complete hiring pipeline dashboard.

---

## 🎯 What is NG SkillCheck?

NG SkillCheck is an automated evaluation system that:
- ✅ **Analyzes Resumes, Pre-Work documents, and GitHub repositories** using DeepSeek AI.
- ✅ **Monitors Gmail Submissions** automatically, checking for incoming pre-work submissions.
- ✅ **Stores Evaluations in PostgreSQL** for persistent logging and tracking.
- ✅ **Evaluates against role-specific NavGurukul JDs** (AI, ML, Full Stack).
- ✅ **Provides detailed skill breakdowns** with individual scores and evidence for each competency.
- ✅ **Identifies critical gaps** and hiring readiness recommendations.

---

## 🚀 Features

### 1. **Three Specialized Role Tracks**

*   🤖 **AI Engineer Track**
    *   **Focus:** Expert Python programming, LLM/NLP mastery (GPT, BERT, fine-tuning), LangChain/RAG, Vector DBs (Pinecone, FAISS), MLOps, Prompt engineering, Mentorship.
    *   **Key Skills:** Python, LLM/NLP, ML Frameworks, LangChain, Vector DBs, MLOps, APIs, Evaluation.
*   📊 **ML Engineer Track**
    *   **Focus:** Deep learning fundamentals (CNNs, RNNs, Transformers), model optimization (quantization, pruning, distillation), lightweight model design, benchmarks.
    *   **Key Skills:** Python, Deep Learning, PyTorch/TensorFlow, Transformers, Model Optimization, Data Engineering, Evaluation/Benchmarking.
*   🌐 **Full Stack Developer Track**
    *   **Focus:** Frontend (React, Next.js, TypeScript), Backend (Node.js/Python), Database design (SQL & NoSQL), RESTful APIs, DevOps, System design.
    *   **Key Skills:** React, TypeScript, Backend Frameworks, Database Design, APIs, Cloud Platforms, CI/CD, Security, System Design.

### 2. **Flexible Evaluation Sources**
*   **📄 Resume Analysis** - PDF resume evaluation.
*   **📝 Pre-Work Assessment** - Pre-work document evaluation.
*   **🐙 GitHub Repository Analysis** - Evaluates candidate's actual repository structure and codebase.

### 3. **✉️ Automated Gmail Integration & Monitor**
*   Monitors an inbox for incoming candidate submissions.
*   Parses emails, processes attachments, and automatically identifies the candidate's name and track using smart filename matching.
*   Invokes the AI evaluation pipeline and logs the results directly into the database.
*   Flags processed emails to prevent duplicate evaluations.

### 4. **📊 Persistent Dashboard & Admin Panel**
*   **Sync from Inbox:** A button in the UI lets team members trigger a sync to process recent Gmail submissions.
*   **Candidate List:** Shows all processed evaluations sorted chronologically with name, email, submission date, track, overall score, and status.
*   **Detailed View:** Click on any record to view the comprehensive skill score breakdown, strengths, gaps, and next steps.
*   **Record Management:** Delete old or unwanted records directly from the database.

---

## 🏗️ Architecture

### System Design

```
┌────────────────────────────────────────────────────────┐
│               Frontend (React + Vite)                  │
│  - Select Role & Upload Files manually                 │
│  - View historical email submissions from Database     │
│  - Trigger "Sync Emails" to fetch/process new submissions│
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│              FastAPI Backend (Python)                  │
│  - Manual /api/evaluate endpoint                       │
│  - Automated Gmail processing (/api/process-emails)    │
│  - PostgreSQL interaction (database.py)                │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│      OpenAI SDK client → DeepSeek (deepseek-chat)      │
│  - JD-specific prompts loaded                          │
│  - Generates detailed JSON skill breakdown & fit       │
└────────────────────────────────────────────────────────┘
```

### Project Structure

```text
Ng-SkillCheck/
├── frontend/                          # React Vite SPA
│   ├── src/
│   │   ├── App.jsx                   # Main app dashboard entry
│   │   ├── pages/
│   │   │   ├── TrackSelection.jsx    # Select AI/ML/Full Stack
│   │   │   ├── TypeSelection.jsx     # Select Resume/Prework/Repo
│   │   │   ├── UploadPage.jsx        # Upload files
│   │   │   ├── ProcessingView.jsx    # Loading with progress
│   │   │   └── Dashboard.jsx         # Submissions database table & detailed report view
│   │   └── components/
│   │       └── Navbar.jsx
│   ├── vite.config.js
│   └── package.json
│
├── backend/                           # FastAPI Python Server
│   ├── main.py                       # Core FastAPI application endpoints
│   ├── database.py                   # PostgreSQL connection & migrations
│   ├── email_monitor.py              # Gmail API sync, filename parsing & mail loop
│   ├── credentials.json              # [NEW/SETUP] Gmail API OAuth credentials (gitignore)
│   ├── token.pickle                  # [NEW/SETUP] Generated OAuth token for Gmail (gitignore)
│   ├── prompts/
│   │   ├── __init__.py              # Prompt loader utility
│   │   ├── ai_engineer_prompt.py    # AI Engineer evaluation criteria
│   │   ├── ml_engineer_prompt.py    # ML Engineer evaluation criteria
│   │   ├── fullstack_engineer_prompt.py  # Full Stack evaluation criteria
│   │   └── README.md                # Documentation on prompt format
│   ├── requirements.txt              # Pin packages (incl. psycopg2, google APIs)
│   ├── .env                         # Environment keys & secrets (gitignore)
│   └── ai_engineer.md, ml_engineer.md, full_stack.md  # NavGurukul role JDs
│
├── .env.example                      # Configuration template
├── README.md                         # This documentation
└── .gitignore
```

---

## 🛠️ Tech Stack

### Frontend
- **React 19** & **Vite 8**
- **Tailwind CSS 4**
- **Lucide Icons**

### Backend
- **FastAPI** & **Uvicorn**
- **PostgreSQL** & **Psycopg2-binary** (Persistence layer)
- **Google API Client Library** & **Google Auth OAuthlib** (Gmail reading)
- **DeepSeek API** (via OpenAI SDK client)
- **pypdf** (PDF parsing)
- **httpx** & **requests**

---

## 🚀 Quick Local Setup

### Prerequisites
- Node.js v18+
- Python 3.10+
- PostgreSQL instance running

### Step 1: Clone and Set Up Frontend
```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

### Step 2: Set Up Backend Environment
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Step 3: Database Configuration
Make sure you have a PostgreSQL database running. Create the tables by starting the backend server (it automatically runs migrations on startup from `database.py`).

### Step 4: Configure Environment Variables
Copy `.env.example` in the root directory to `backend/.env` and fill in the values:
```env
DEEPSEEK_API_KEY=your_deepseek_api_key_here
VITE_API_URL=http://localhost:8000

# PostgreSQL Configuration
DB_NAME=preworkanalyzer
DB_USER=preworkanalyzer
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

### Step 5: Setup Gmail API (For Email Sync)
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Enable the **Gmail API** for your project.
3. Configure OAuth consent screen and create **OAuth 2.0 Client ID credentials** (Application type: Desktop App).
4. Download the JSON credentials file, rename it to `credentials.json`, and place it in the `backend/` directory.
5. The first time you sync emails via the UI or call `/api/process-emails`, a browser window will open to authenticate the app and save authorization to `token.pickle`.

### Step 6: Start Backend Server
```bash
cd backend
python main.py
# Backend runs on http://localhost:8000
```

---

## 📁 File Naming Conventions for Candidate Submissions

To process Gmail attachments successfully, filenames must match specific regex patterns (case-insensitive). The script parses the filename to extract the candidate's name (replacing `_` with spaces and title-casing it) and determine their track.

### Valid Filename Formats (using "Rahul Sharma" as candidate name)

| Pattern Description | Example Filenames |
| :--- | :--- |
| **`ng` prefix** | `ng_rahul_sharma.pdf`, `ng-rahul-sharma.zip`, `ng rahul sharma.pdf` |
| **`prework` suffix** | `rahul_sharma_prework.pdf`, `rahul_sharma-pre-work.docx` |
| **`prework` prefix** | `prework_rahul_sharma.zip`, `pre-work-rahul-sharma.pdf` |
| **NavGurukul + Prework combos** | `navgurukul_prework_rahul_sharma.pdf`, `rahul_sharma_navgurukul_prework.pdf` |
| **Alternative combinations** | `prework_navgurukul_rahul_sharma.pdf`, `rahul_sharma_prework_navgurukul.pdf` |

*Note: The script cleans file extensions (e.g. `.pdf`, `.zip`) before checking patterns.*

---

## 📡 API Endpoints

### 1. `POST /api/evaluate`
Evaluate a manual upload.
- **Request:** `multipart/form-data`
  - `track`: `"ai" | "ml" | "fullstack"`
  - `evaluation_type`: `"resume" | "prework" | "repo"`
  - `file`: (PDF file for resume/prework)
  - `repo_url`: (GitHub URL for repo evaluation)

### 2. `POST /api/process-emails`
Connects to Gmail, scans unread emails matching submission subjects, extracts attachments, runs AI evaluations, and saves records to the database.

### 3. `GET /api/email-submissions`
Fetches all historical and synced candidate evaluations from PostgreSQL.
- **Response:** List of submission objects containing parsed JSON evaluations and candidate info.

### 4. `DELETE /api/email-submissions/{id}`
Deletes a specific submission record from PostgreSQL.

---

## 📊 Evaluation Details & Principles

*   **No Grade Inflation:** A standard submission scores between **50-65**. Excellent production experience and mentorship skills are required to cross **85+**.
*   **Evidence-Based:** Every metric includes direct snippets or architecture citations from the candidate's document.
*   **Strict Grounding:** AI does not assume skills. If a skill isn't demonstrated, it isn't scored.

---

## 🤝 Contributing
1. Fork the repo and create your feature branch: `git checkout -b feature/amazing-feature`.
2. Commit your changes: `git commit -m 'feat: add amazing feature'`.
3. Push to the branch: `git push origin feature/amazing-feature`.
4. Open a Pull Request.

---

## 📄 License
MIT License.
