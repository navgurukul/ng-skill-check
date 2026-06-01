# NG SkillCheck - AI-Powered Skill Evaluation Engine

An intelligent AI-powered skill evaluation platform designed to benchmark candidates against **NavGurukul's specialized career tracks**: AI Engineer, ML Engineer, and Full Stack Developer. Uses advanced LLM analysis to provide detailed, role-specific skill assessments with actionable hiring recommendations.

## 🎯 What is NG SkillCheck?

NG SkillCheck is an automated evaluation system that:
- ✅ **Analyzes Resumes, Pre-Work documents, and GitHub repositories**
- ✅ **Evaluates against role-specific NavGurukul JDs** (AI, ML, Full Stack)
- ✅ **Provides detailed skill breakdowns** with individual scores for each competency
- ✅ **Identifies critical gaps** and hiring readiness
- ✅ **Generates actionable feedback** for recruitment teams
- ✅ **Uses DeepSeek AI** for intelligent, consistent evaluation

---

## 🚀 Features

### 1. **Three Specialized Role Tracks**

#### 🤖 **AI Engineer Track**
Evaluates candidates for NavGurukul's AI Engineer role focusing on:
- Expert Python programming
- LLM & NLP mastery (GPT, BERT, fine-tuning)
- LangChain & RAG applications
- Vector databases (Pinecone, Weaviate, FAISS)
- MLOps & production deployment
- Prompt engineering at scale
- Mentorship capability

**Key Skills Assessed:** Python, LLM/NLP, ML Frameworks, LangChain, Vector DBs, MLOps, APIs, Evaluation Frameworks

---

#### 📊 **ML Engineer Track**
Evaluates candidates for NavGurukul's ML Engineer role focusing on:
- Deep learning fundamentals (CNNs, RNNs, Transformers)
- Model optimization for edge & on-device deployment
- Lightweight model design (DistilBERT, TinyGPT)
- Data-driven evaluation frameworks
- ML pipeline development
- Research engagement & continuous learning

**Key Skills Assessed:** Python, Deep Learning, PyTorch/TensorFlow, Transformers, Model Optimization, Data Engineering, Evaluation/Benchmarking

---

#### 🌐 **Full Stack Developer Track**
Evaluates candidates for NavGurukul's Full Stack role focusing on:
- Frontend expertise (React, Next.js, TypeScript)
- Backend development (Node.js/Python)
- Database design (SQL & NoSQL)
- RESTful APIs & GraphQL
- System design & scalability
- DevOps & CI/CD practices
- 7+ years preferred for senior roles

**Key Skills Assessed:** React, TypeScript, Backend Frameworks, Database Design, APIs, Cloud Platforms, CI/CD, Security, System Design

---

### 2. **Evaluation Sources**

- **📄 Resume Analysis** - PDF resume evaluation
- **📝 Pre-Work Assessment** - Prework document evaluation
- **🐙 GitHub Repository Analysis** - Evaluate candidate's actual code projects

---

### 3. **Detailed Evaluation Output**

Each evaluation returns:

```json
{
  "overall_score": 65,
  "relevance": 78,
  "confidence": 85,
  "experience_level": "Mid",
  
  "skill_assessment": {
    "skill_name": {
      "score": 75,
      "evidence": "specific example from candidate's work"
    }
  },
  
  "navguruul_fit": {
    "mission_alignment": "assessment",
    "learning_orientation": "assessment",
    "mentorship_capability": "assessment"
  },
  
  "strengths": ["strength 1", "strength 2"],
  "critical_gaps": ["gap 1 affecting role", "gap 2"],
  "next_steps_to_hire": ["interview focus area", "technical assessment"],
  
  "feedback": "comprehensive, actionable feedback"
}
```

---

### 4. **Smart AI Analysis**

- 🧠 **Track-Specific Prompts** - Each role has dedicated JD-based evaluation criteria
- 📍 **Evidence-Based Scoring** - AI explains every score with specific examples
- 🎯 **Strict Evaluation** - No grade inflation; average work scores 50-65
- 🔍 **Production-Focused** - Emphasizes real-world experience over coursework
- 💡 **Actionable Insights** - Hiring team gets clear next steps and interview focus areas

---

## 🏗️ Architecture

### System Design

```
┌─────────────────────────────────────────────┐
│         Frontend (React + Vite)             │
│  User selects track → Uploads content       │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│      FastAPI Backend (Python)               │
│  - Extract text from PDF/GitHub             │
│  - Load track-specific prompt               │
│  - Call DeepSeek AI API                     │
│  - Parse & return evaluation JSON           │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│       DeepSeek AI (deepseek-chat)           │
│  - Evaluate against JD criteria             │
│  - Generate skill assessments               │
│  - Return detailed JSON                     │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│    Dashboard - Display Results              │
│  Skill breakdown, gaps, recommendations     │
└─────────────────────────────────────────────┘
```

### Project Structure

```
Ng-SkillCheck/
├── frontend/                          # React Vite SPA
│   ├── src/
│   │   ├── App.jsx                   # Main app state management
│   │   ├── pages/
│   │   │   ├── TrackSelection.jsx    # Select AI/ML/Full Stack
│   │   │   ├── TypeSelection.jsx     # Select Resume/Prework/Repo
│   │   │   ├── UploadPage.jsx        # Upload files
│   │   │   ├── ProcessingView.jsx    # Loading with progress
│   │   │   └── Dashboard.jsx         # Results display
│   │   └── components/
│   │       └── Navbar.jsx
│   ├── vite.config.js
│   └── package.json
│
├── backend/                           # FastAPI Python Server
│   ├── main.py                       # Core API endpoints
│   ├── prompts/
│   │   ├── __init__.py              # Prompt loader
│   │   ├── ai_engineer_prompt.py    # AI Engineer evaluation
│   │   ├── ml_engineer_prompt.py    # ML Engineer evaluation
│   │   ├── fullstack_engineer_prompt.py  # Full Stack evaluation
│   │   └── README.md                # Prompt documentation
│   ├── requirements.txt
│   ├── .env                         # API keys
│   └── ai_engineer.md, ml_engineer.md, full_stack.md  # Role JDs
│
├── README.md                         # This file
└── .env.example

```

---

## 🛠️ Tech Stack

### Frontend
- **React** - UI framework
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling
- **Lucide Icons** - Icons
- **JavaScript/JSX**

### Backend
- **FastAPI** - Web framework
- **Python 3.10+** - Language
- **pypdf** - PDF extraction
- **requests** - HTTP client for GitHub API
- **python-multipart** - Form data handling

### AI
- **DeepSeek Chat** - LLM for evaluation
- **OpenAI SDK** - DeepSeek client

### Infrastructure
- **CORS** - Cross-origin handling
- **Uvicorn** - ASGI server

---

## 🚀 Quick Local Setup

### Prerequisites
- Node.js v18+
- Python 3.10+
- pip (Python package manager)

### Step 1: Frontend Setup

```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

### Step 2: Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# Linux/macOS:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Step 3: Configure API Keys

Create `.env` file in `backend/` directory:

```env
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

Get DeepSeek API key from: https://api.deepseek.com/

### Step 4: Start Backend Server

```bash
cd backend
python main.py
# Backend runs on http://localhost:8000
# API docs at http://localhost:8000/docs
```

### Step 5: Access Application

Open browser to: **http://localhost:5173**

---

## 📊 How It Works

### Evaluation Flow

1. **Track Selection** → User selects role (AI/ML/Full Stack)
2. **Type Selection** → User chooses evaluation type (Resume/Prework/GitHub Repo)
3. **Content Upload** → User uploads file or GitHub URL
4. **Processing** → Backend:
   - Extracts text from PDF or fetches GitHub repo structure
   - Loads track-specific evaluation prompt
   - Calls DeepSeek API with content + prompt
   - Parses JSON response
5. **Results Display** → Dashboard shows:
   - Overall score (0-100)
   - Individual skill scores
   - Strengths & critical gaps
   - Next steps for hiring
   - Detailed feedback

---

## 🔍 Evaluation Details

### Scoring Scale (All Roles)

| Score Range | Assessment |
|-------------|------------|
| 85-100 | Expert - Strong production experience, mentorship |
| 70-84 | Strong - Solid skills, good production experience |
| 50-69 | Adequate - Core skills present, some gaps |
| 35-49 | Basic - Limited production experience |
| <35 | Insufficient - Lacks required skills |

### Key Evaluation Principles

✅ **Ground Reality** - Only credit explicitly demonstrated skills
✅ **Strict Scoring** - Average work scores 50-65, no inflation
✅ **Production-Focused** - Real-world > coursework
✅ **Evidence-Based** - Every score has supporting evidence
✅ **Honest Feedback** - Clear about gaps for immediate contribution

---

## 📡 API Endpoints

### POST `/api/evaluate`

Evaluate a candidate against track criteria.

**Request:**
```
Content-Type: multipart/form-data

Parameters:
- track: "ai" | "ml" | "fullstack"
- evaluation_type: "resume" | "prework" | "repo"
- file: (PDF file - for resume/prework)
- repo_url: (GitHub URL - for repo evaluation)
```

**Response:**
```json
{
  "overall_score": 65,
  "relevance": 78,
  "confidence": 85,
  "skill_assessment": { ... },
  "navguruul_fit": { ... },
  "strengths": [ ... ],
  "critical_gaps": [ ... ],
  "next_steps_to_hire": [ ... ],
  "feedback": "..."
}
```

---

## 📝 Role Details

### AI Engineer Requirements (2+ years)

**Mission:** Experiment, architect & build AI solutions for learning at scale

**Key Skills:**
- Python (expert)
- LLM/NLP (GPT, BERT, fine-tuning)
- ML Frameworks (TensorFlow, PyTorch, HuggingFace)
- LangChain & RAG
- Vector Databases
- MLOps & Deployment
- FastAPI/Flask
- A/B Testing & Evaluation

**Bonus:**
- Open-source AI contributions
- Thought leadership in AI community

---

### ML Engineer Requirements (3+ years)

**Mission:** Build efficient AI/ML solutions for learning, focusing on lightweight models

**Key Skills:**
- Python (strong fundamentals)
- Deep Learning (CNNs, RNNs, Transformers)
- PyTorch & TensorFlow
- Model Optimization (quantization, pruning, distillation)
- ML Tools (MLFlow, TFX, ONNX)
- Data Engineering & Preprocessing
- Evaluation & Benchmarking
- Production Deployment

**Focus:**
- Edge/on-device optimization
- Resource efficiency
- Model compression

---

### Full Stack Developer Requirements (7+ years for senior)

**Mission:** Design, build, and scale full-stack applications for learning platforms

**Key Skills:**
- Frontend (React, Next.js, TypeScript)
- Backend (Node.js/Express or Python)
- Database Design (PostgreSQL, MongoDB)
- RESTful APIs & GraphQL
- Authentication & Security
- CI/CD & DevOps (Docker, Kubernetes)
- Cloud Platforms (AWS, GCP)
- System Design & Scalability
- Testing (unit, integration, e2e)

**Flexibility:**
- Strong frontend OR strong backend + 60% technical fit = encouraged to apply

---

## 🔄 Logging & Debugging

### Frontend Logs (Browser Console)

```
[PIPELINE START] Initializing evaluation pipeline
[STEP 1] Creating FormData object
[STEP 2] Adding file/repo
[STEP 3] Sending request to backend...
[STEP 4] Response status: 200
[STEP 5] Parsing JSON response
[SUCCESS] Evaluation completed successfully
```

### Backend Logs (Terminal)

```
[BACKEND] Received evaluation request: track=ai, type=resume
[BACKEND] Reading file: resume.pdf
[BACKEND] File size: 245000 bytes
[BACKEND] Extracted text length: 5400 characters
[BACKEND] Calling DeepSeek API with ai role evaluation...
[BACKEND] DeepSeek response received
[BACKEND] Evaluation successful: 65 points
```

---

## 🐛 Troubleshooting

### Backend Won't Start
```bash
# Check Python version
python --version  # Should be 3.10+

# Activate venv
source venv/bin/activate  # Linux/macOS
venv\Scripts\activate     # Windows

# Reinstall requirements
pip install -r requirements.txt

# Start backend
python main.py
```

### Port Already in Use
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9  # Linux/macOS
netstat -ano | findstr :8000   # Windows (find PID, then taskkill)

# Or use different port
uvicorn main:app --port 8001
```

### API Key Issues
- Verify `DEEPSEEK_API_KEY` is set in `.env`
- Check API key is valid at https://api.deepseek.com/
- Ensure no extra spaces in `.env`

### PDF Extraction Fails
- Verify PDF is not corrupted
- Check PDF is actual PDF (not image-based)
- Try with different PDF

---

## 📚 Documentation

- **`backend/prompts/README.md`** - Detailed evaluation criteria for each role
- **`backend/ai_engineer.md`** - AI Engineer JD
- **`backend/ml_engineer.md`** - ML Engineer JD
- **`backend/full_stack.md`** - Full Stack JD

---

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

### Backend (AWS/Heroku/DigitalOcean)
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 main:app
```

---

## 📈 Future Roadmap

- [ ] Multiple file uploads
- [ ] Batch evaluation processing
- [ ] Candidate comparison dashboard
- [ ] Interview question generation based on gaps
- [ ] Salary benchmarking
- [ ] Analytics & hiring funnel tracking
- [ ] Custom role creation
- [ ] Export reports (PDF/CSV)

---

## 🤝 Contributing

Interested in improving NG SkillCheck?

1. Fork the repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit Pull Request

---

## 📞 Support

For issues, questions, or feedback:
- Create an issue on GitHub
- Contact NavGurukul team

---

## 📄 License

MIT License - See LICENSE file for details

---

## ✨ Credits

Built for **NavGurukul** - Empowering 1 crore underserved students through AI-enabled learning.

**Technologies Used:**
- React + Vite
- FastAPI
- DeepSeek AI
- Python

---

**Last Updated:** May 2026
