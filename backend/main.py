import os
import json
import io
import requests
import pypdf
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from dotenv import load_dotenv


load_dotenv()


NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY") 
if not NVIDIA_API_KEY:
    raise RuntimeError("CRITICAL ERROR: NVIDIA_API_KEY is missing in .env file.")

client = OpenAI(
    api_key=NVIDIA_API_KEY,
    base_url="https://integrate.api.nvidia.com/v1"
)

app = FastAPI(title="NG SkillCheck Clean AI Engine - Optimized")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


SYSTEM_PROMPT = """
You are an uncompromising Senior Technical Interviewer and AI Evaluator at NavGurukul. 
Your job is to strictly evaluate the provided text against the standards of the selected career track.

CRITICAL INSTRUCTIONS:
1. Ground Reality Checks: Only give credit for skills explicitly verified in the text.
2. Strict Scoring: Do not generate high or generic scores. Average work must receive scores between 40-60.
3. Rejection Rule: If the text is empty or completely irrelevant, set "is_relevant_document" to false, overall score below 15, and flag "Irrelevant Document Detected".
4. Output Format: Return ONLY a raw, valid JSON object matching the template below. Do not wrap output in ```json markdown formatting block wrappers. No conversational text filler.

Expected JSON Template structure:
{
  "score": 56,
  "relevance": 61,
  "confidence": 82,
  "technical_understanding": 54,
  "problem_solving": 48,
  "project_quality": 45,
  "career_readiness": 43,
  "strengths": ["Clean presentation structure"],
  "weaknesses": ["Limited depth in main stack"],
  "missing_skills": ["LangChain", "Transformers"],
  "feedback": "Evaluation successfully completed against the chosen track rubric rules."
}
"""


def extract_text_from_pdf(file_bytes):
    try:
        pdf_reader = pypdf.PdfReader(io.BytesIO(file_bytes))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() or ""
        return text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read PDF file: {str(e)}")

def extract_context_from_github(repo_url: str):
    if "[github.com/](https://github.com/)" in repo_url:
        clean_path = repo_url.split("[github.com/](https://github.com/)")[-1].strip("/")
        api_url = f"[https://api.github.com/repos/](https://api.github.com/repos/){clean_path}/contents"
        try:
            res = requests.get(api_url, timeout=10)
            if res.status_code == 200:
                files = [item["name"] for item in res.json()]
                return f"GitHub Codebase files detected in root: {', '.join(files)}. Check architecture constraints."
        except Exception:
            pass
    return f"Target GitHub Remote Pointer Repository: {repo_url}"

# 5. The Main Core Route
@app.post("/api/evaluate")
async def handle_evaluation(
    track: str = Form(...),
    evaluation_type: str = Form(...),
    file: UploadFile = File(None),
    repo_url: str = Form(None)
):
    extracted_text = ""

    if evaluation_type in ['resume', 'prework']:
        if not file:
            raise HTTPException(status_code=400, detail="PDF asset file data is missing.")
        file_bytes = await file.read()
        extracted_text = extract_text_from_pdf(file_bytes)
    
    elif evaluation_type == 'repo':
        if not repo_url:
            raise HTTPException(status_code=400, detail="Repository path variable is empty.")
        extracted_text = extract_context_from_github(repo_url)

    if not extracted_text.strip():
        raise HTTPException(status_code=400, detail="Extracted document body content is completely empty.")

    optimized_context = extracted_text[:8000]

   
    try:
        response = client.chat.completions.create(
            model="meta/llama-3.1-70b-instruct",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Track: {track}\nType: {evaluation_type}\n\nContent:\n{optimized_context}"}
            ],
            temperature=0.1,
            max_tokens=1000 
        )
        
        raw_output = response.choices[0].message.content.strip()
        return json.loads(raw_output)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Llama Generation Engine Error: {str(e)}")