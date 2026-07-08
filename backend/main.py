# import os
# import json
# import io
# import requests
# import pypdf
# from fastapi import FastAPI, UploadFile, File, Form, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from openai import OpenAI
# from dotenv import load_dotenv
# from prompts import get_system_prompt


# load_dotenv()


# DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY") 
# if not DEEPSEEK_API_KEY:
#     raise RuntimeError("CRITICAL ERROR: DEEPSEEK_API_KEY is missing in .env file.")

# client = OpenAI(
#     api_key=DEEPSEEK_API_KEY,
#     base_url="https://api.deepseek.com/v1"
# )

# app = FastAPI(title="NG SkillCheck Clean AI Engine - Optimized")


# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[
#         "http://localhost:5173",
#         "https://dev.dtaell0zoz93v.amplifyapp.com/",
#         "https://main.dtaell0zoz93v.amplifyapp.com"  
#     ],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# def extract_text_from_pdf(file_bytes):
#     try:
#         pdf_reader = pypdf.PdfReader(io.BytesIO(file_bytes))
#         text = ""
#         for page in pdf_reader.pages:
#             text += page.extract_text() or ""
#         return text
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=f"Failed to read PDF file: {str(e)}")

# def extract_context_from_github(repo_url: str):
#     """
#     Simple GitHub extraction: README + dependencies only
#     """
#     try:
#         # Parse: https://github.com/owner/repo.git
#         repo_url_clean = repo_url.replace("https://github.com/", "").replace(".git", "").strip()
#         if "/" not in repo_url_clean:
#             return f"Repository: {repo_url_clean}"
        
#         owner, repo = repo_url_clean.split("/")[:2]
#         base_api = f"https://api.github.com/repos/{owner}/{repo}"
#         headers = {"Accept": "application/vnd.github.v3.raw"}
        
#         content = []
        
#         # Get README
#         try:
#             for readme_file in ["README.md", "readme.md", "README.txt"]:
#                 r = requests.get(f"{base_api}/contents/{readme_file}", headers=headers, timeout=5)
#                 if r.status_code == 200:
#                     content.append(r.text[:1500])
#                     break
#         except:
#             pass
        
#         # Get requirements.txt or package.json
#         try:
#             for dep_file in ["requirements.txt", "package.json"]:
#                 r = requests.get(f"{base_api}/contents/{dep_file}", headers=headers, timeout=5)
#                 if r.status_code == 200:
#                     content.append(f"\nDependencies ({dep_file}):\n" + r.text[:1000])
#                     break
#         except:
#             pass
        
#         if content:
#             return "\n".join(content)
#         else:
#             return f"Repository found: {owner}/{repo}"
#     except Exception as e:
#         return f"Repository: {repo_url}"


# def normalize_json_text(raw_text: str) -> str:
#     text = (raw_text or "").strip()

#     if text.startswith("```"):
#         text = text.split("\n", 1)[1] if "\n" in text else ""
#         text = text.rsplit("```", 1)[0].strip() if "```" in text else text.strip()

#     if text.endswith("```"):
#         text = text[:-3].strip()

#     return text


# def extract_json_substring(raw_text: str):
#     text = raw_text or ""
#     start_candidates = [index for index in (text.find("{"), text.find("[")) if index != -1]
#     if not start_candidates:
#         return None

#     start_index = min(start_candidates)
#     opening_char = text[start_index]
#     closing_char = "}" if opening_char == "{" else "]"
#     depth = 0
#     in_string = False
#     escape_next = False

#     for index in range(start_index, len(text)):
#         char = text[index]

#         if in_string:
#             if escape_next:
#                 escape_next = False
#             elif char == "\\":
#                 escape_next = True
#             elif char == '"':
#                 in_string = False
#             continue

#         if char == '"':
#             in_string = True
#         elif char == opening_char:
#             depth += 1
#         elif char == closing_char:
#             depth -= 1
#             if depth == 0:
#                 return text[start_index:index + 1]

#     return None


# def parse_llm_json(raw_output: str):
#     candidates = [
#         raw_output,
#         normalize_json_text(raw_output),
#         extract_json_substring(raw_output),
#     ]

#     for candidate in candidates:
#         if not candidate:
#             continue

#         try:
#             return json.loads(candidate)
#         except json.JSONDecodeError:
#             continue

#     raise ValueError("Could not parse a valid JSON payload from the model response.")


# def repair_json_output(raw_output: str, max_tokens: int):
#     repair_prompt = (
#         "Convert the following text into valid JSON only. "
#         "Do not add markdown, commentary, or extra keys. "
#         "Preserve the intended schema and all recoverable fields. "
#         "If the text is already valid JSON, return it unchanged.\n\n"
#         f"TEXT:\n{raw_output}"
#     )

#     repair_response = client.chat.completions.create(
#         model="deepseek-chat",
#         messages=[
#             {"role": "system", "content": "You are a strict JSON repair engine."},
#             {"role": "user", "content": repair_prompt},
#         ],
#         temperature=0,
#         max_tokens=max_tokens,
#     )

#     repaired_output = repair_response.choices[0].message.content or ""
#     return parse_llm_json(repaired_output.strip())

# # 5. The Main Core Route
# @app.post("/api/evaluate")
# async def handle_evaluation(
#     track: str = Form(...),
#     evaluation_type: str = Form(...),
#     file: UploadFile = File(None),
#     repo_url: str = Form(None)
# ):
#     extracted_text = ""

#     if evaluation_type in ['resume', 'prework']:
#         if not file:
#             raise HTTPException(status_code=400, detail="PDF asset file data is missing.")
#         file_bytes = await file.read()
#         extracted_text = extract_text_from_pdf(file_bytes)
    
#     elif evaluation_type == 'repo':
#         if not repo_url:
#             raise HTTPException(status_code=400, detail="Repository path variable is empty.")
#         extracted_text = extract_context_from_github(repo_url)

#     if not extracted_text.strip():
#         raise HTTPException(status_code=400, detail="Extracted document body content is completely empty.")

#     optimized_context = extracted_text[:8000]

#     # Get appropriate prompt based on track and evaluation type
#     system_prompt = get_system_prompt(track=track, evaluation_type=evaluation_type)

#     # Adjust temperature and max_tokens based on evaluation type
#     if evaluation_type == "repo":
#         temperature = 0.2
#         max_tokens = 3500  # Repo eval needs more detail
#     elif evaluation_type == "prework":
#         temperature = 0.2
#         max_tokens = 2500  # Prework needs moderate detail
#     else:  # resume
#         temperature = 0.2
#         max_tokens = 2000  # Resume is shorter

#     try:
#         response = client.chat.completions.create(
#             model="deepseek-chat",
#             messages=[
#                 {"role": "system", "content": system_prompt},
#                 {"role": "user", "content": optimized_context}
#             ],
#             temperature=temperature,
#             max_tokens=max_tokens 
#         )
        
#         raw_output = (response.choices[0].message.content or "").strip()

#         try:
#             return parse_llm_json(raw_output)
#         except Exception:
#             return repair_json_output(raw_output, max_tokens)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Invalid JSON from DeepSeek: {str(e)}")


# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)


# import os
# import json
# import io
# import requests
# import pypdf
# from fastapi import FastAPI, UploadFile, File, Form, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from openai import OpenAI
# from dotenv import load_dotenv
# from prompts import get_system_prompt

# # --- DATABASE INTEGRATION IMPORTS ---
# from database import get_db_connection
# import psycopg2
# from psycopg2.extras import RealDictCursor

# load_dotenv()

# DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY") 
# if not DEEPSEEK_API_KEY:
#     raise RuntimeError("CRITICAL ERROR: DEEPSEEK_API_KEY is missing in .env file.")

# client = OpenAI(
#     api_key=DEEPSEEK_API_KEY,
#     base_url="https://api.deepseek.com/v1"
# )

# app = FastAPI(title="NG SkillCheck Clean AI Engine - Optimized")

# # Updated CORS allowed origins to include localhost and your production deployment URL
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[
#         "http://localhost:5173",
#         "https://dev.dtaell0zoz93v.amplifyapp.com",
#         "https://main.dtaell0zoz93v.amplifyapp.com"  
#     ],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# def extract_text_from_pdf(file_bytes):
#     try:
#         pdf_reader = pypdf.PdfReader(io.BytesIO(file_bytes))
#         text = ""
#         for page in pdf_reader.pages:
#             text += page.extract_text() or ""
#         return text
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=f"Failed to read PDF file: {str(e)}")

# def extract_context_from_github(repo_url: str):
#     """
#     Simple GitHub extraction: README + dependencies only
#     """
#     try:
#         repo_url_clean = repo_url.replace("https://github.com/", "").replace(".git", "").strip()
#         if "/" not in repo_url_clean:
#             return f"Repository: {repo_url_clean}"
        
#         owner, repo = repo_url_clean.split("/")[:2]
#         base_api = f"https://api.github.com/repos/{owner}/{repo}"
#         headers = {"Accept": "application/vnd.github.v3.raw"}
        
#         content = []
        
#         # Get README
#         try:
#             for readme_file in ["README.md", "readme.md", "README.txt"]:
#                 r = requests.get(f"{base_api}/contents/{readme_file}", headers=headers, timeout=5)
#                 if r.status_code == 200:
#                     content.append(r.text[:1500])
#                     break
#         except:
#             pass
        
#         # Get requirements.txt or package.json
#         try:
#             for dep_file in ["requirements.txt", "package.json"]:
#                 r = requests.get(f"{base_api}/contents/{dep_file}", headers=headers, timeout=5)
#                 if r.status_code == 200:
#                     content.append(f"\nDependencies ({dep_file}):\n" + r.text[:1000])
#                     break
#         except:
#             pass
        
#         if content:
#             return "\n".join(content)
#         else:
#             return f"Repository found: {owner}/{repo}"
#     except Exception as e:
#         return f"Repository: {repo_url}"

# def normalize_json_text(raw_text: str) -> str:
#     text = (raw_text or "").strip()

#     if text.startswith("```"):
#         text = text.split("\n", 1)[1] if "\n" in text else ""
#         text = text.rsplit("```", 1)[0].strip() if "```" in text else text.strip()

#     if text.endswith("```"):
#         text = text[:-3].strip()

#     return text

# def extract_json_substring(raw_text: str):
#     text = raw_text or ""
#     start_candidates = [index for index in (text.find("{"), text.find("[")) if index != -1]
#     if not start_candidates:
#         return None

#     start_index = min(start_candidates)
#     opening_char = text[start_index]
#     closing_char = "}" if opening_char == "{" else "]"
#     depth = 0
#     in_string = False
#     escape_next = False

#     for index in range(start_index, len(text)):
#         char = text[index]

#         if in_string:
#             if escape_next:
#                 escape_next = False
#             elif char == "\\":
#                 escape_next = True
#             elif char == '"':
#                 in_string = False
#             continue

#         if char == '"':
#             in_string = True
#         elif char == opening_char:
#             depth += 1
#         elif char == closing_char:
#             depth -= 1
#             if depth == 0:
#                 return text[start_index:index + 1]

#     return None

# def parse_llm_json(raw_output: str):
#     candidates = [
#         raw_output,
#         normalize_json_text(raw_output),
#         extract_json_substring(raw_output),
#     ]

#     for candidate in candidates:
#         if not candidate:
#             continue

#         try:
#             return json.loads(candidate)
#         except json.JSONDecodeError:
#             continue

#     raise ValueError("Could not parse a valid JSON payload from the model response.")

# def repair_json_output(raw_output: str, max_tokens: int):
#     repair_prompt = (
#         "Convert the following text into valid JSON only. "
#         "Do not add markdown, commentary, or extra keys. "
#         "Preserve the intended schema and all recoverable fields. "
#         "If the text is already valid JSON, return it unchanged.\n\n"
#         f"TEXT:\n{raw_output}"
#     )

#     repair_response = client.chat.completions.create(
#         model="deepseek-chat",
#         messages=[
#             {"role": "system", "content": "You are a strict JSON repair engine."},
#             {"role": "user", "content": repair_prompt},
#         ],
#         temperature=0,
#         max_tokens=max_tokens,
#     )

#     repaired_output = repair_response.choices[0].message.content or ""
#     return parse_llm_json(repaired_output.strip())

# # --- Core Evaluation Route ---
# @app.post("/api/evaluate")
# async def handle_evaluation(
#     track: str = Form(...),
#     evaluation_type: str = Form(...),
#     file: UploadFile = File(None),
#     repo_url: str = Form(None)
# ):
#     extracted_text = ""

#     if evaluation_type in ['resume', 'prework']:
#         if not file:
#             raise HTTPException(status_code=400, detail="PDF asset file data is missing.")
#         file_bytes = await file.read()
#         extracted_text = extract_text_from_pdf(file_bytes)
    
#     elif evaluation_type == 'repo':
#         if not repo_url:
#             raise HTTPException(status_code=400, detail="Repository path variable is empty.")
#         extracted_text = extract_context_from_github(repo_url)

#     if not extracted_text.strip():
#         raise HTTPException(status_code=400, detail="Extracted document body content is completely empty.")

#     optimized_context = extracted_text[:8000]
#     system_prompt = get_system_prompt(track=track, evaluation_type=evaluation_type)

#     if evaluation_type == "repo":
#         temperature = 0.2
#         max_tokens = 3500 
#     elif evaluation_type == "prework":
#         temperature = 0.2
#         max_tokens = 2500 
#     else: 
#         temperature = 0.2
#         max_tokens = 2000 

#     try:
#         response = client.chat.completions.create(
#             model="deepseek-chat",
#             messages=[
#                 {"role": "system", "content": system_prompt},
#                 {"role": "user", "content": optimized_context}
#             ],
#             temperature=temperature,
#             max_tokens=max_tokens 
#         )
        
#         raw_output = (response.choices[0].message.content or "").strip()

#         try:
#             return parse_llm_json(raw_output)
#         except Exception:
#             return repair_json_output(raw_output, max_tokens)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Invalid JSON from DeepSeek: {str(e)}")


# # --- NEW DATABASE BACKEND ENDPOINT FOR DASHBOARD DISPLAY ---
# @app.get("/api/email-submissions")
# def get_email_submissions():
#     """
#     Fetches processed candidate records from PostgreSQL database
#     to render inside the React + Vite frontend workspace.
#     """
#     try:
#         conn = get_db_connection()
#         cur = conn.cursor(cursor_factory=RealDictCursor)
        
#         # Pull records in descending chronological sequence
#         cur.execute("""
#             SELECT id, candidate_name, candidate_email, submission_date, file_name, overall_score, status 
#             FROM candidate_submissions 
#             ORDER BY id DESC;
#         """)
        
#         rows = cur.fetchall()
#         cur.close()
#         conn.close()
#         return rows
        
#     except Exception as e:
#         print(f"[API CORE ERROR] Failed database fetch transaction: {e}")
#         raise HTTPException(status_code=500, detail="Database log indexing query operation failed.")


# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)






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
from email_monitor import check_and_process_emails as process_emails_from_gmail

# --- DATABASE INTEGRATION IMPORTS ---
from database import get_db_connection
import psycopg2
from psycopg2.extras import RealDictCursor

load_dotenv()

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY") 
if not DEEPSEEK_API_KEY:
    raise RuntimeError("CRITICAL ERROR: DEEPSEEK_API_KEY is missing in .env file.")

client = OpenAI(
    api_key=DEEPSEEK_API_KEY,
    base_url="https://api.deepseek.com/v1"
)

app = FastAPI(title="NG SkillCheck Clean AI Engine - Optimized")

# Bulletproof CORS Configurations
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://dev.dtaell0zoz93v.amplifyapp.com",
        "https://main.dtaell0zoz93v.amplifyapp.com"  
    ],
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
    try:
        repo_url_clean = repo_url.replace("https://github.com/", "").replace(".git", "").strip()
        if "/" not in repo_url_clean:
            return f"Repository: {repo_url_clean}"
        
        owner, repo = repo_url_clean.split("/")[:2]
        base_api = f"https://api.github.com/repos/{owner}/{repo}"
        headers = {"Accept": "application/vnd.github.v3.raw"}
        
        content = []
        
        try:
            for readme_file in ["README.md", "readme.md", "README.txt"]:
                r = requests.get(f"{base_api}/contents/{readme_file}", headers=headers, timeout=5)
                if r.status_code == 200:
                    content.append(r.text[:1500])
                    break
        except:
            pass
        
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

def normalize_json_text(raw_text: str) -> str:
    text = (raw_text or "").strip()
    if text.startswith("```"):
        text = text.split("\n", 1)[1] if "\n" in text else ""
        text = text.rsplit("```", 1)[0].strip() if "```" in text else text.strip()
    if text.endswith("```"):
        text = text[:-3].strip()
    return text

def extract_json_substring(raw_text: str):
    text = raw_text or ""
    start_candidates = [index for index in (text.find("{"), text.find("[")) if index != -1]
    if not start_candidates:
        return None

    start_index = min(start_candidates)
    opening_char = text[start_index]
    closing_char = "}" if opening_char == "{" else "]"
    depth = 0
    in_string = False
    escape_next = False

    for index in range(start_index, len(text)):
        char = text[index]
        if in_string:
            if escape_next:
                escape_next = False
            elif char == "\\":
                escape_next = True
            elif char == '"':
                in_string = False
            continue

        if char == '"':
            in_string = True
        elif char == opening_char:
            depth += 1
        elif char == closing_char:
            depth -= 1
            if depth == 0:
                return text[start_index:index + 1]
    return None

def parse_llm_json(raw_output: str):
    candidates = [
        raw_output,
        normalize_json_text(raw_output),
        extract_json_substring(raw_output),
    ]
    for candidate in candidates:
        if not candidate:
            continue
        try:
            return json.loads(candidate)
        except json.JSONDecodeError:
            continue
    raise ValueError("Could not parse a valid JSON payload from the model response.")

def repair_json_output(raw_output: str, max_tokens: int):
    repair_prompt = (
        "Convert the following text into valid JSON only. "
        "Do not add markdown, commentary, or extra keys. "
        "Preserve the intended schema and all recoverable fields. "
        "If the text is already valid JSON, return it unchanged.\n\n"
        f"TEXT:\n{raw_output}"
    )
    repair_response = client.chat.completions.create(
        model="deepseek-chat",
        messages=[
            {"role": "system", "content": "You are a strict JSON repair engine."},
            {"role": "user", "content": repair_prompt},
        ],
        temperature=0,
        max_tokens=max_tokens,
    )
    repaired_output = repair_response.choices[0].message.content or ""
    return parse_llm_json(repaired_output.strip())

# --- Core Evaluation Route ---
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
    system_prompt = get_system_prompt(track=track, evaluation_type=evaluation_type)

    if evaluation_type == "repo":
        temperature = 0.2
        max_tokens = 3500 
    elif evaluation_type == "prework":
        temperature = 0.2
        max_tokens = 2500 
    else: 
        temperature = 0.2
        max_tokens = 2000 

    try:
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": "You are a helpful AI collaborator."},
                {"role": "user", "content": f"{system_prompt}\n\nCandidate Document Context:\n{optimized_context}"}
            ],
            temperature=temperature,
            max_tokens=max_tokens 
        )
        raw_output = (response.choices[0].message.content or "").strip()
        try:
            return parse_llm_json(raw_output)
        except Exception:
            return repair_json_output(raw_output, max_tokens)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Invalid JSON from DeepSeek: {str(e)}")

@app.post("/api/process-emails")
def process_emails():
    try:
        result = process_emails_from_gmail()
        return {"success": True, **result}
    except Exception as e:
        print(f"[API CORE ERROR] Failed to process emails: {e}")
        raise HTTPException(status_code=500, detail="Email processing failed.")

# --- NEW FULLY NORMALIZED BACKEND ENDPOINT ---
@app.get("/api/email-submissions")
def get_email_submissions():
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute("""
            SELECT id, candidate_name, candidate_email, submission_date, file_name, overall_score, status, raw_response 
            FROM candidate_submissions 
            ORDER BY id DESC;
        """)
        
        rows = cur.fetchall()
        
        # Backend-level serialization layer to ensure frontend gets ready-to-use JSON objects
        normalized_rows = []
        for row in rows:
            row_dict = dict(row)
            if 'raw_response' in row_dict and row_dict['raw_response']:
                if isinstance(row_dict['raw_response'], str):
                    try:
                        row_dict['raw_response'] = json.loads(row_dict['raw_response'])
                    except Exception:
                        pass

                if isinstance(row_dict['raw_response'], dict):
                    # Expose track metadata at top level for easier dashboard rendering.
                    row_dict['track'] = row_dict['raw_response'].get('track') or row_dict.get('track')
                    if isinstance(row_dict['raw_response'].get('raw_response'), str):
                        try:
                            nested = json.loads(row_dict['raw_response'].get('raw_response'))
                            if isinstance(nested, dict):
                                row_dict['track'] = row_dict['track'] or nested.get('track')
                        except Exception:
                            pass

            normalized_rows.append(row_dict)
            
        cur.close()
        conn.close()
        return normalized_rows
        
    except Exception as e:
        print(f"[API CORE ERROR] Failed database fetch transaction: {e}")
        raise HTTPException(status_code=500, detail="Database log indexing query operation failed.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
