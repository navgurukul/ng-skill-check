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
    print(f"[BACKEND] Received evaluation request: track={track}, type={evaluation_type}")
    print(f"[BACKEND] File present: {file is not None}, Repo URL present: {repo_url is not None}")
    
    extracted_text = ""

    try:
        if evaluation_type in ['resume', 'prework']:
            print(f"[BACKEND] Processing {evaluation_type} PDF")
            if not file:
                raise HTTPException(status_code=400, detail="PDF asset file data is missing.")
            print(f"[BACKEND] Reading file: {file.filename}")
            file_bytes = await file.read()
            print(f"[BACKEND] File size: {len(file_bytes)} bytes")
            extracted_text = extract_text_from_pdf(file_bytes)
            print(f"[BACKEND] Extracted text length: {len(extracted_text)} characters")
        
        elif evaluation_type == 'repo':
            print(f"[BACKEND] Processing GitHub repository: {repo_url}")
            if not repo_url:
                raise HTTPException(status_code=400, detail="Repository path variable is empty.")
            extracted_text = extract_context_from_github(repo_url)
            print(f"[BACKEND] Repository context: {extracted_text[:100]}...")

        if not extracted_text.strip():
            raise HTTPException(status_code=400, detail="Extracted document body content is completely empty.")

        print(f"[BACKEND] Text extraction successful, length: {len(extracted_text)}")
        optimized_context = extracted_text[:8000]
        print(f"[BACKEND] Optimized context length: {len(optimized_context)}")

        print(f"[BACKEND] Calling DeepSeek API with {track} role evaluation...")
        system_prompt = get_system_prompt(track)
        print(f"[BACKEND] Using {track.upper()} Engineer evaluation criteria")
        
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Track: {track}\nEvaluation Type: {evaluation_type}\n\nContent to Evaluate:\n{optimized_context}"}
            ],
            temperature=0.2,
            max_tokens=2500,
            top_p=0.9
        )
        
        print(f"[BACKEND] DeepSeek response received")
        raw_output = response.choices[0].message.content.strip()
        print(f"[BACKEND] Raw output length: {len(raw_output)}")
        print(f"[BACKEND] Parsing JSON...")
        result = json.loads(raw_output)
        print(f"[BACKEND] Evaluation successful: {result.get('score', 'N/A')} points")
        return result
    except json.JSONDecodeError as je:
        print(f"[BACKEND] JSON parsing error: {str(je)}")
        raise HTTPException(status_code=500, detail=f"Invalid JSON from DeepSeek: {str(je)}")
    except Exception as e:
        print(f"[BACKEND] Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Evaluation Error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)