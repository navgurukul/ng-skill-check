import os
import json
import io
import requests
import pypdf
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from dotenv import load_dotenv
from prompts import get_system_prompt


load_dotenv()


DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY") 
if not DEEPSEEK_API_KEY:
    raise RuntimeError("CRITICAL ERROR: DEEPSEEK_API_KEY is missing in .env file.")

client = OpenAI(
    api_key=DEEPSEEK_API_KEY,
    base_url="https://api.deepseek.com/v1"
)

app = FastAPI(title="NG SkillCheck Clean AI Engine - Optimized")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
    """
    Simple GitHub extraction: README + dependencies only
    """
    try:
        # Parse: https://github.com/owner/repo.git
        repo_url_clean = repo_url.replace("https://github.com/", "").replace(".git", "").strip()
        if "/" not in repo_url_clean:
            return f"Repository: {repo_url_clean}"
        
        owner, repo = repo_url_clean.split("/")[:2]
        base_api = f"https://api.github.com/repos/{owner}/{repo}"
        headers = {"Accept": "application/vnd.github.v3.raw"}
        
        content = []
        
        # Get README
        try:
            for readme_file in ["README.md", "readme.md", "README.txt"]:
                r = requests.get(f"{base_api}/contents/{readme_file}", headers=headers, timeout=5)
                if r.status_code == 200:
                    content.append(r.text[:1500])
                    break
        except:
            pass
        
        # Get requirements.txt or package.json
        try:
            for dep_file in ["requirements.txt", "package.json"]:
                r = requests.get(f"{base_api}/contents/{dep_file}", headers=headers, timeout=5)
                if r.status_code == 200:
                    content.append(f"\nDependencies ({dep_file}):\n" + r.text[:1000])
                    break
        except:
            pass
        
        if content:
            return "\n".join(content)
        else:
            return f"Repository found: {owner}/{repo}"
    except Exception as e:
        return f"Repository: {repo_url}"

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

    # Get appropriate prompt based on track and evaluation type
    system_prompt = get_system_prompt(track=track, evaluation_type=evaluation_type)

    # Adjust temperature and max_tokens based on evaluation type
    if evaluation_type == "repo":
        temperature = 0.2
        max_tokens = 3500  # Repo eval needs more detail
    elif evaluation_type == "prework":
        temperature = 0.2
        max_tokens = 2500  # Prework needs moderate detail
    else:  # resume
        temperature = 0.2
        max_tokens = 2000  # Resume is shorter

    try:
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": optimized_context}
            ],
            temperature=temperature,
            max_tokens=max_tokens 
        )
        
        raw_output = response.choices[0].message.content.strip()
        return json.loads(raw_output)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Invalid JSON from DeepSeek: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)