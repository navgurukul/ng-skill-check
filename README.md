#NG SkillCheck - AI Evaluation Engine

An AI-powered skill evaluation application designed to benchmark Resumes, Pre-Work documents, and GitHub repositories against custom career tracks.

🛠️ Prerequisites (What to Install First)

Before running the application, make sure you have the following installed on your machine:

Node.js (v18 or higher)

Python (v3.10 or higher)

🚀 Quick Local Setup (How to Run)

Follow these simple steps to run the application on your local machine:

1. Frontend Setup

Open your terminal, navigate to the frontend folder, and run:

## Navigate to frontend folder
cd frontend

## Install all dependencies
npm install

## Start the frontend server (Runs on http://localhost:5173)
npm run dev


2. Backend Setup

Open a new terminal window, navigate to the backend folder, and run:

## Navigate to backend folder
cd backend

## Create a virtual environment
python3 -m venv venv

## Activate the virtual environment
## On Linux/macOS:
source venv/bin/activate
## On Windows (CMD):
## venv\Scripts\activate

## Install Python packages
pip install -r requirements.txt


3. API Keys Configuration

Create a file named .env inside the backend folder and add your keys:

NVIDIA_API_KEY=your_nvidia_api_key_here
DEEPSEEK_API_KEY=your_deepseek_api_key_here


4. Start the Backend Server

With your virtual environment activated, run the FastAPI server:

uvicorn main:app --reload


The API will be live at http://localhost:8000 and docs at http://localhost:8000/docs.

📁 Repository Structure

/frontend - Vite + React SPA Dashboard UI.

/backend - FastAPI server handling PDF extraction and LLM (Llama-3.1-70B & DeepSeek R1) logic.
