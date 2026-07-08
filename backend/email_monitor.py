# import os
# import re
# import io
# import json
# import base64
# import psycopg2
# from psycopg2.extras import Json
# from database import get_db_connection
# import httpx
# from google.auth.transport.requests import Request
# import pickle
# from google_auth_oauthlib.flow import InstalledAppFlow
# from googleapiclient.discovery import build

# # Configuration
# BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# TOKEN_PATH = os.path.join(BASE_DIR, 'token.pickle')
# CREDENTIALS_PATH = os.path.join(BASE_DIR, 'credentials.json')
# SCOPES = ['https://www.googleapis.com/auth/gmail.modify']
# NG_API_URL = "http://localhost:8000/api/evaluate"
# DB_PARAMS = {
#     "dbname": "your_db",
#     "user": "your_user",
#     "password": "your_password",
#     "host": "localhost",
#     "port": "5432"
# }


# def is_prework_submission_subject(subject):
#     """Check whether the email subject matches supported pre-work submission formats."""
#     if not subject:
#         return False

#     normalized = re.sub(r'[^a-z0-9]+', ' ', subject.lower()).strip()
#     patterns = [
#         "ng pre work submission",
#         "submission pre work",
#         "navgurukul pre work submission",
#         "pre work submission navgurukul",
#         "prework submission",
#         "pre work submission",
#     ]
#     return any(re.search(pattern.replace(" ", r"\s+"), normalized) for pattern in patterns)


# def extract_candidate_name_from_filename(filename):
#     """Extract candidate name from supported pre-work filename formats."""
#     if not filename:
#         return None

#     name_without_ext = os.path.splitext(filename)[0]
#     patterns = [
#         r"^ng[_\-\s]+([a-zA-Z0-9_]+)$",
#         r"^([a-zA-Z0-9_]+)[_\-\s]+pre[-_\s]*work$",
#         r"^pre[-_\s]*work[_\-\s]+([a-zA-Z0-9_]+)$",
#         r"^prework[_\-\s]+([a-zA-Z0-9_]+)$",
#         r"^([a-zA-Z0-9_]+)[_\-\s]+prework$",
#         r"^navgurukul[_\-\s]*pre[-_\s]*work[_\-\s]+([a-zA-Z0-9_]+)$",
#         r"^([a-zA-Z0-9_]+)[_\-\s]+navgurukul[_\-\s]*pre[-_\s]*work$",
#         r"^navgurukul[_\-\s]*prework[_\-\s]+([a-zA-Z0-9_]+)$",
#     ]

#     for pattern in patterns:
#         match = re.match(pattern, name_without_ext, re.IGNORECASE)
#         if match:
#             return match.group(1).replace('_', ' ').title()

#     return None


# def get_gmail_service():
#     creds = None
#     if os.path.exists(TOKEN_PATH):
#         with open(TOKEN_PATH, 'rb') as token:
#             creds = pickle.load(token)
#     if not creds or not creds.valid:
#         if creds and creds.expired and creds.refresh_token:
#             creds.refresh(Request())
#         else:
#             flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_PATH, SCOPES)
#             creds = flow.run_local_server(port=0)
#         with open(TOKEN_PATH, 'wb') as token:
#             pickle.dump(creds, token)
#     elif creds and not set(SCOPES).issubset(set(creds.scopes or [])):
#         print("[AUTH] Refreshing Gmail authorization with the required permissions...")
#         if os.path.exists(TOKEN_PATH):
#             os.remove(TOKEN_PATH)
#         flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_PATH, SCOPES)
#         creds = flow.run_local_server(port=0)
#         with open(TOKEN_PATH, 'wb') as token:
#             pickle.dump(creds, token)
#     return build('gmail', 'v1', credentials=creds)

# # def save_to_db(name, email, filename, score, status, raw_data):
# #     """Database mein evaluation ka result save karne ke liye"""
# #     try:
# #         conn = get_db_connection() # Dynamic connection
# #         cur = conn.cursor()
# #         query = """
# #             INSERT INTO candidate_submissions (candidate_name, candidate_email, file_name, overall_score, status, raw_response)
# #             VALUES (%s, %s, %s, %s, %s, %s)
# #         """
# #         cur.execute(query, (name, email, filename, score, status, Json(raw_data)))
# #         conn.commit()
# #         cur.close()
# #         conn.close()
# #         print(f"[DATABASE] Successfully saved record for {name}")
# #     except Exception as e:
# #         print(f"[DATABASE ERROR] Failed to save record: {e}")

# # backend/email_monitor.py ke andar save_to_db function ko aise update karein:
# def save_to_db(name, email, filename, score, status, raw_data):
#     try:
#         conn = get_db_connection()
#         cur = conn.cursor()
        
#         # Ensure raw_data is a proper JSON string before entering DB
#         json_string = json.dumps(raw_data) if isinstance(raw_data, dict) else raw_data
        
#         cur.execute("""
#             SELECT setval(
#                 pg_get_serial_sequence('candidate_submissions', 'id'),
#                 COALESCE((SELECT MAX(id) FROM candidate_submissions), 0),
#                 true
#             )
#         """)

#         query = """
#             INSERT INTO candidate_submissions (candidate_name, candidate_email, file_name, overall_score, status, raw_response)
#             VALUES (%s, %s, %s, %s, %s, %s)
#         """
#         cur.execute(query, (name, email, filename, score, status, json_string))
#         conn.commit()
#         cur.close()
#         conn.close()
#         print(f"[DATABASE] Successfully saved record for {name}")
#     except Exception as e:
#         print(f"[DATABASE ERROR] Failed to save record: {e}")

# def forward_to_ng_skillcheck(file_bytes, filename):
#     """NG SkillCheck core API ko hit karne ke liye function"""
#     print(f"[PIPELINE] Forwarding {filename} to NG SkillCheck Platform...")
    
#     # multipart/form-data ke liye file prepare karna
#     files = {'file': (filename, file_bytes, 'application/pdf')}
#     data = {
#         'track': 'ai', # Default track, ise email body ya subject se bhi dynamic bana sakte hain
#         'evaluation_type': 'prework'
#     }
    
#     try:
#         with httpx.Client() as client:
#             response = client.post(NG_API_URL, data=data, files=files, timeout=60.0)
#             if response.status_code == 200:
#                 return response.json()
#             else:
#                 print(f"[ERROR] NG Platform returned error: {response.status_code}")
#                 return None
#     except Exception as e:
#         print(f"[ERROR] Connection to NG Platform failed: {e}")
#         return None

# def check_and_process_emails():
#     service = get_gmail_service()
#     query = "is:unread"
    
#     results = service.users().messages().list(userId='me', q=query).execute()
#     messages = results.get('messages', [])
    
#     if not messages:
#         print("[MONITOR] No new pre-work submissions found.")
#         return

#     for msg in messages:
#         msg_id = msg['id']
#         message = service.users().messages().get(userId='me', id=msg_id).execute()
#         payload = message['payload']
#         headers = payload['headers']
#         subject = next((h['value'] for h in headers if h['name'].lower() == 'subject'), '')

#         if not is_prework_submission_subject(subject):
#             print(f"[SKIP] Ignoring email with subject: {subject}")
#             try:
#                 service.users().messages().batchModify(
#                     userId='me',
#                     body={'ids': [msg_id], 'removeLabelIds': ['UNREAD']}
#                 ).execute()
#             except Exception as exc:
#                 print(f"[WARNING] Could not mark non-matching email as read: {exc}")
#             continue
        
#         sender = [h['value'] for h in headers if h['name'] == 'From'][0]
#         # Sender string se clean email extract karna (e.g., "Aniket <xyz@gmail.com>" -> "xyz@gmail.com")
#         email_match = re.search(r'[\w\.-]+@[\w\.-]+', sender)
#         candidate_email = email_match.group(0) if email_match else sender

#         print(f"\n[NEW EMAIL] Processing submission from: {candidate_email}")

#         # Parts scan karke attachment dhoodhna
#         parts = payload.get('parts', [])
#         for part in parts:
#             if part.get('filename') and part.get('body', {}).get('attachmentId'):
#                 filename = part['filename']
#                 attachment_id = part['body']['attachmentId']
                
#                 candidate_name = extract_candidate_name_from_filename(filename)
                
#                 if not candidate_name:
#                     print(f"[VALIDATION FAILED] Invalid filename: {filename}. Skipping or marking failed.")
#                     save_to_db("Unknown", candidate_email, filename, 0, "Failed (Invalid Naming)", {})
#                     continue
                
#                 print(f"[VALIDATION PASSED] Candidate Identified: {candidate_name}")

#                 # 2. Attachment Download karna
#                 attachment = service.users().messages().attachments().get(
#                     userId='me', messageId=msg_id, id=attachment_id
#                 ).execute()
                
#                 file_data = base64.urlsafe_b64decode(attachment['data'].encode('UTF-8'))
                
#                 # 3. NG SkillCheck Core API par bhejna
#                 evaluation_result = forward_to_ng_skillcheck(file_data, filename)
                
#                 if evaluation_result:
#                     overall_score = evaluation_result.get('overall_score', 0)
#                     save_to_db(candidate_name, candidate_email, filename, overall_score, "Completed", evaluation_result)
#                 else:
#                     save_to_db(candidate_name, candidate_email, filename, 0, "Failed (Processing Error)", {})
        
#         # Mail ko read mark kar dena taaki dobara process na ho
#         try:
#             service.users().messages().batchModify(
#                 userId='me',
#                 body={'ids': [msg_id], 'removeLabelIds': ['UNREAD']}
#             ).execute()
#         except Exception as exc:
#             print(f"[WARNING] Could not mark email as read: {exc}")

# if __name__ == "__main__":
#     print("[START] Starting Candidate Email Monitoring Service...")
#     check_and_process_emails()





# import os
# import re
# import io
# import json
# import base64
# import psycopg2
# from psycopg2.extras import Json
# import httpx
# from google.auth.transport.requests import Request
# import pickle
# from google_auth_oauthlib.flow import InstalledAppFlow
# from googleapiclient.discovery import build
# from dotenv import load_dotenv  # Env variables load karne ke liye

# # .env file ko load karein
# load_dotenv()

# # Configuration (Env se data uthana)
# BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# TOKEN_PATH = os.path.join(BASE_DIR, 'token.pickle')
# CREDENTIALS_PATH = os.path.join(BASE_DIR, 'credentials.json')
# SCOPES = ['https://www.googleapis.com/auth/gmail.modify']

# # Agar NG_API_URL env me nahi milti toh fallback local URL par rahega
# NG_API_URL = os.getenv("NG_API_URL", "http://localhost:8000/api/evaluate")

# def get_db_connection():
#     """Establishes database connection using environment variables."""
#     try:
#         return psycopg2.connect(
#             dbname=os.getenv("DB_NAME"),
#             user=os.getenv("DB_USER"),
#             password=os.getenv("DB_PASSWORD"),
#             host=os.getenv("DB_HOST", "localhost"),
#             port=os.getenv("DB_PORT", "5432")
#         )
#     except Exception as e:
#         print(f"[CRITICAL ERROR] Failed to connect to PostgreSQL: {e}")
#         raise e

# def is_prework_submission_subject(subject):
#     """Check whether the email subject matches supported pre-work submission formats."""
#     if not subject:
#         return False
#     normalized = re.sub(r'[^a-z0-9]+', ' ', subject.lower()).strip()
#     patterns = [
#         "ng pre work submission",
#         "submission pre work",
#         "navgurukul pre work submission",
#         "pre work submission navgurukul",
#         "prework submission",
#         "pre work submission",
#         "ng prework submission",
#         "submission prework",
#         "navgurukul prework submission",
#         "prework submission navgurukul",
#         "ai engineer prework submission",
#         "submission ai engineer prework",
#         "navgurukul ai engineer prework submission",
#         "ai engineer prework submission navgurukul",
#         "prework submission ai engineer",
#         "pre work submission ai engineer",
#         "ng ai engineer prework submission",
#         "submission ng ai engineer prework",
#         "ml engineer prework submission",
#         "submission ml engineer prework",
#         "navgurukul ml engineer prework submission",
#         "ml engineer prework submission navgurukul",
#         "prework submission ml engineer",
#         "pre work submission ml engineer",
#         "ng ml engineer prework submission",
#         "submission ng ml engineer prework"

#     ]
#     return any(re.search(pattern.replace(" ", r"\s+"), normalized) for pattern in patterns)

# def extract_candidate_name_from_filename(filename):
#     """Extract candidate name from supported pre-work filename formats."""
#     if not filename:
#         return None
#     name_without_ext = os.path.splitext(filename)[0]
#     patterns = [
#         r"^ng[_\-\s]+([a-zA-Z0-9_]+)$",
#         r"^([a-zA-Z0-9_]+)[_\-\s]+pre[-_\s]*work$",
#         r"^pre[-_\s]*work[_\-\s]+([a-zA-Z0-9_]+)$",
#         r"^prework[_\-\s]+([a-zA-Z0-9_]+)$",
#         r"^([a-zA-Z0-9_]+)[_\-\s]+prework$",
#         r"^navgurukul[_\-\s]*pre[-_\s]*work[_\-\s]+([a-zA-Z0-9_]+)$",
#         r"^([a-zA-Z0-9_]+)[_\-\s]+navgurukul[_\-\s]*pre[-_\s]*work$",
#         r"^navgurukul[_\-\s]*prework[_\-\s]+([a-zA-Z0-9_]+)$",
#         r"^([a-zA-Z0-9_]+)[_\-\s]+navgurukul[_\-\s]*prework$",
#         r"^prework[_\-\s]+navgurukul[_\-\s]+([a-zA-Z0-9_]+)$",
#         r"^([a-zA-Z0-9_]+)[_\-\s]+prework[_\-\s]+navgurukul$"
#     ]
#     for pattern in patterns:
#         match = re.match(pattern, name_without_ext, re.IGNORECASE)
#         if match:
#             return match.group(1).replace('_', ' ').title()
#     return None

# def get_gmail_service():
#     creds = None
#     if os.path.exists(TOKEN_PATH):
#         with open(TOKEN_PATH, 'rb') as token:
#             creds = pickle.load(token)
#     if not creds or not creds.valid:
#         if creds and creds.expired and creds.refresh_token:
#             creds.refresh(Request())
#         else:
#             flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_PATH, SCOPES)
#             creds = flow.run_local_server(port=0)
#         with open(TOKEN_PATH, 'wb') as token:
#             pickle.dump(creds, token)
#     elif creds and not set(SCOPES).issubset(set(creds.scopes or [])):
#         print("[AUTH] Refreshing Gmail authorization with the required permissions...")
#         if os.path.exists(TOKEN_PATH):
#             os.remove(TOKEN_PATH)
#         flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_PATH, SCOPES)
#         creds = flow.run_local_server(port=0)
#         with open(TOKEN_PATH, 'wb') as token:
#             pickle.dump(creds, token)
#     return build('gmail', 'v1', credentials=creds)

# def save_to_db(name, email, filename, score, status, raw_data):
#     """Saves evaluation lifecycle statuses securely into PostgreSQL."""
#     try:
#         conn = get_db_connection()
#         cur = conn.cursor()
        
#         json_string = json.dumps(raw_data) if isinstance(raw_data, dict) else raw_data
        
#         cur.execute("""
#             SELECT setval(
#                 pg_get_serial_sequence('candidate_submissions', 'id'),
#                 COALESCE((SELECT MAX(id) FROM candidate_submissions), 0),
#                 true
#             )
#         """)

#         query = """
#             INSERT INTO candidate_submissions (candidate_name, candidate_email, file_name, overall_score, status, raw_response)
#             VALUES (%s, %s, %s, %s, %s, %s)
#         """
#         cur.execute(query, (name, email, filename, score, status, json_string))
#         conn.commit()
#         cur.close()
#         conn.close()
#         print(f"[DATABASE] Successfully saved record for {name}")
#     except Exception as e:
#         print(f"[DATABASE ERROR] Failed to save record: {e}")

# def forward_to_ng_skillcheck(file_bytes, filename):
#     """Hits the core NG SkillCheck platform endpoint for evaluation processing."""
#     print(f"[PIPELINE] Forwarding {filename} to NG SkillCheck Platform...")
#     files = {'file': (filename, file_bytes, 'application/pdf')}
#     data = {
#         'track': 'ai',
#         'evaluation_type': 'prework'
#     }
#     try:
#         with httpx.Client() as client:
#             response = client.post(NG_API_URL, data=data, files=files, timeout=60.0)
#             if response.status_code == 200:
#                 return response.json()
#             else:
#                 print(f"[ERROR] NG Platform returned error: {response.status_code}")
#                 return None
#     except Exception as e:
#         print(f"[ERROR] Connection to NG Platform failed: {e}")
#         return None

# def check_and_process_emails():
#     service = get_gmail_service()
#     query = "is:unread"
    
#     results = service.users().messages().list(userId='me', q=query).execute()
#     messages = results.get('messages', [])
    
#     if not messages:
#         print("[MONITOR] No new pre-work submissions found.")
#         return

#     for msg in messages:
#         msg_id = msg['id']
#         message = service.users().messages().get(userId='me', id=msg_id).execute()
#         payload = message['payload']
#         headers = payload.get('headers', [])
#         subject = next((h['value'] for h in headers if h['name'].lower() == 'subject'), '')

#         if not is_prework_submission_subject(subject):
#             print(f"[SKIP] Ignoring email with subject: {subject}")
#             try:
#                 service.users().messages().batchModify(
#                     userId='me',
#                     body={'ids': [msg_id], 'removeLabelIds': ['UNREAD']}
#                 ).execute()
#             except Exception as exc:
#                 print(f"[WARNING] Could not mark non-matching email as read: {exc}")
#             continue
        
#         sender = next((h['value'] for h in headers if h['name'].lower() == 'from'), 'Unknown Sender')
#         email_match = re.search(r'[\w\.-]+@[\w\.-]+', sender)
#         candidate_email = email_match.group(0) if email_match else sender

#         print(f"\n[NEW EMAIL] Processing submission from: {candidate_email}")

#         def extract_attachments(parts_list):
#             attachments = []
#             for part in parts_list:
#                 if part.get('parts'):
#                     attachments.extend(extract_attachments(part['parts']))
#                 elif part.get('filename') and part.get('body', {}).get('attachmentId'):
#                     attachments.append(part)
#             return attachments

#         all_parts = payload.get('parts', [])
#         found_attachments = extract_attachments(all_parts)
        
#         if not found_attachments:
#             print("[VALIDATION FAILED] No structural attachment found in this email.")
#             save_to_db("Unknown", candidate_email, "No Attachment Found", 0, "Failed (Missing File)", {})

#         for part in found_attachments:
#             filename = part['filename']
#             attachment_id = part['body']['attachmentId']
#             candidate_name = extract_candidate_name_from_filename(filename)
            
#             if not candidate_name:
#                 print(f"[VALIDATION FAILED] Invalid filename structure: {filename}. Logging Failure.")
#                 save_to_db("Unknown", candidate_email, filename, 0, "Failed (Invalid Naming)", {})
#                 continue
            
#             print(f"[VALIDATION PASSED] Candidate Identified: {candidate_name}")

#             attachment = service.users().messages().attachments().get(
#                 userId='me', messageId=msg_id, id=attachment_id
#             ).execute()
            
#             file_data = base64.urlsafe_b64decode(attachment['data'].encode('UTF-8'))
            
#             evaluation_result = forward_to_ng_skillcheck(file_data, filename)
            
#             if evaluation_result:
#                 overall_score = evaluation_result.get('overall_score', 0)
#                 save_to_db(candidate_name, candidate_email, filename, overall_score, "Completed", evaluation_result)
#             else:
#                 save_to_db(candidate_name, candidate_email, filename, 0, "Failed (Processing Error)", {})
        
#         try:
#             service.users().messages().batchModify(
#                 userId='me',
#                 body={'ids': [msg_id], 'removeLabelIds': ['UNREAD']}
#             ).execute()
#         except Exception as exc:
#             print(f"[WARNING] Could not mark processed email as read: {exc}")

# if __name__ == "__main__":
#     print("[START] Starting Candidate Email Monitoring Service...")
#     check_and_process_emails()




import os
import re
import io
import json
import base64
import psycopg2
from psycopg2.extras import Json
import httpx
from google.auth.transport.requests import Request
import pickle
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from dotenv import load_dotenv  # Env variables load karne ke liye

# .env file ko load karein
load_dotenv()

# Configuration (Env se data uthana)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TOKEN_PATH = os.path.join(BASE_DIR, 'token.pickle')
CREDENTIALS_PATH = os.path.join(BASE_DIR, 'credentials.json')
SCOPES = ['https://www.googleapis.com/auth/gmail.modify']

# Agar NG_API_URL env me nahi milti toh fallback local URL par rahega
NG_API_URL = os.getenv("VITE_API_URL", "http://localhost:8000/api/evaluate")

def get_db_connection():
    """Establishes database connection using environment variables."""
    try:
        return psycopg2.connect(
            dbname=os.getenv("DB_NAME"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            host=os.getenv("DB_HOST", "localhost"),
            port=os.getenv("DB_PORT", "5432")
        )
    except Exception as e:
        print(f"[CRITICAL ERROR] Failed to connect to PostgreSQL: {e}")
        raise e

def is_prework_submission_subject(subject):
    """Check whether the email subject matches supported pre-work submission formats."""
    if not subject:
        return False
    normalized = re.sub(r'[^a-z0-9]+', ' ', subject.lower()).strip()
    patterns = [
        "ng pre work submission",
        "submission pre work",
        "navgurukul pre work submission",
        "pre work submission navgurukul",
        "prework submission",
        "pre work submission",
        "ng prework submission",
        "submission prework",
        "navgurukul prework submission",
        "prework submission navgurukul",
        "ai engineer prework submission",
        "submission ai engineer prework",
        "navgurukul ai engineer prework submission",
        "ai engineer prework submission navgurukul",
        "prework submission ai engineer",
        "pre work submission ai engineer",
        "ng ai engineer prework submission",
        "submission ng ai engineer prework",
        "ml engineer prework submission",
        "submission ml engineer prework",
        "navgurukul ml engineer prework submission",
        "ml engineer prework submission navgurukul",
        "prework submission ml engineer",
        "pre work submission ml engineer",
        "ng ml engineer prework submission",
        "submission ng ml engineer prework",
        "full stack engineer prework submission",
        "submission full stack engineer prework",
        "navgurukul full stack engineer prework submission",
        "full stack prework submission"
    ]
    return any(re.search(pattern.replace(" ", r"\s+"), normalized) for pattern in patterns)

def extract_candidate_name_from_filename(filename):
    """Extract candidate name from supported pre-work filename formats."""
    if not filename:
        return None
    name_without_ext = os.path.splitext(filename)[0]
    patterns = [
        r"^ng[_\-\s]+([a-zA-Z0-9_]+)$",
        r"^([a-zA-Z0-9_]+)[_\-\s]+pre[-_\s]*work$",
        r"^pre[-_\s]*work[_\-\s]+([a-zA-Z0-9_]+)$",
        r"^prework[_\-\s]+([a-zA-Z0-9_]+)$",
        r"^([a-zA-Z0-9_]+)[_\-\s]+prework$",
        r"^navgurukul[_\-\s]*pre[-_\s]*work[_\-\s]+([a-zA-Z0-9_]+)$",
        r"^([a-zA-Z0-9_]+)[_\-\s]+navgurukul[_\-\s]*pre[-_\s]*work$",
        r"^navgurukul[_\-\s]*prework[_\-\s]+([a-zA-Z0-9_]+)$",
        r"^([a-zA-Z0-9_]+)[_\-\s]+navgurukul[_\-\s]*prework$",
        r"^prework[_\-\s]+navgurukul[_\-\s]+([a-zA-Z0-9_]+)$",
        r"^([a-zA-Z0-9_]+)[_\-\s]+prework[_\-\s]+navgurukul$"
    ]
    for pattern in patterns:
        match = re.match(pattern, name_without_ext, re.IGNORECASE)
        if match:
            return match.group(1).replace('_', ' ').title()
    return None

def detect_track(subject, filename):
    """Detects the track (ai, ml, or fullstack) based on subject and filename."""
    text_to_search = f"{subject} {filename}".lower()
    
    if "ml engineer" in text_to_search or "machine learning" in text_to_search or "ml" in text_to_search.split():
        return "ml"
    elif "full stack" in text_to_search or "fullstack" in text_to_search or "fs" in text_to_search.split():
        return "fullstack"
    elif "ai engineer" in text_to_search or "artificial intelligence" in text_to_search or "ai" in text_to_search.split():
        return "ai"
    
    # Default fallback track
    return "ai"

def get_gmail_service():
    creds = None
    if os.path.exists(TOKEN_PATH):
        with open(TOKEN_PATH, 'rb') as token:
            creds = pickle.load(token)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_PATH, SCOPES)
            creds = flow.run_local_server(port=0)
        with open(TOKEN_PATH, 'wb') as token:
            pickle.dump(creds, token)
    elif creds and not set(SCOPES).issubset(set(creds.scopes or [])):
        print("[AUTH] Refreshing Gmail authorization with the required permissions...")
        if os.path.exists(TOKEN_PATH):
            os.remove(TOKEN_PATH)
        flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_PATH, SCOPES)
        creds = flow.run_local_server(port=0)
        with open(TOKEN_PATH, 'wb') as token:
            pickle.dump(creds, token)
    return build('gmail', 'v1', credentials=creds)

def save_to_db(name, email, filename, score, status, raw_data):
    """Saves evaluation lifecycle statuses securely into PostgreSQL."""
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        json_string = json.dumps(raw_data) if isinstance(raw_data, dict) else raw_data

        query = """
            INSERT INTO candidate_submissions (candidate_name, candidate_email, file_name, overall_score, status, raw_response)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        cur.execute(query, (name, email, filename, score, status, json_string))
        conn.commit()
        cur.close()
        conn.close()
        print(f"[DATABASE] Successfully saved record for {name}")
    except Exception as e:
        print(f"[DATABASE ERROR] Failed to save record: {e}")

# def forward_to_ng_skillcheck(file_bytes, filename, track):
#     """Hits the core NG SkillCheck platform endpoint for evaluation processing."""
#     print(f"[PIPELINE] Forwarding {filename} to NG SkillCheck Platform with track: '{track}'...")
#     files = {'file': (filename, file_bytes, 'application/pdf')}
#     data = {
#         'track': track,
#         'evaluation_type': 'prework'
#     }
#     try:
#         with httpx.Client() as client:
#             response = client.post(NG_API_URL, data=data, files=files, timeout=60.0)
#             if response.status_code == 200:
#                 return response.json()
#             else:
#                 print(f"[ERROR] NG Platform returned error: {response.status_code}")
#                 return None
#     except Exception as e:
#         print(f"[ERROR] Connection to NG Platform failed: {e}")
#         return None

def forward_to_ng_skillcheck(file_bytes, filename, track):
    """Hits the core NG SkillCheck platform endpoint for evaluation processing."""
    print(f"[PIPELINE] Forwarding {filename} to NG SkillCheck Platform with track: '{track}'...")
    files = {'file': (filename, file_bytes, 'application/pdf')}
    
    # Track ko explicitly string me enforce kar rahe hain aur verify kar rahe hain
    data = {
        'track': str(track).strip().lower(),
        'evaluation_type': 'prework'
    }
    try:
        with httpx.Client() as client:
            # Agar aapko debug karna hai ki exact kya ja raha hai, toh yahan print kar sakte hain
            response = client.post(NG_API_URL, data=data, files=files, timeout=60.0)
            if response.status_code == 200:
                return response.json()
            else:
                print(f"[ERROR] NG Platform returned error: {response.status_code}")
                return None
    except Exception as e:
        print(f"[ERROR] Connection to NG Platform failed: {e}")
        return None

def check_and_process_emails():
    service = get_gmail_service()
    query = "is:unread"
    
    results = service.users().messages().list(userId='me', q=query).execute()
    messages = results.get('messages', [])
    
    if not messages:
        print("[MONITOR] No new pre-work submissions found.")
        return {
            "processed": 0,
            "failed": 0,
            "skipped": 0,
            "message": "No new pre-work submissions found."
        }

    processed_count = 0
    failed_count = 0
    skipped_count = 0

    for msg in messages:
        msg_id = msg['id']
        message = service.users().messages().get(userId='me', id=msg_id).execute()
        payload = message['payload']
        headers = payload.get('headers', [])
        subject = next((h['value'] for h in headers if h['name'].lower() == 'subject'), '')

        if not is_prework_submission_subject(subject):
            skipped_count += 1
            print(f"[SKIP] Ignoring email with subject: {subject}")
            try:
                service.users().messages().batchModify(
                    userId='me',
                    body={'ids': [msg_id], 'removeLabelIds': ['UNREAD']}
                ).execute()
            except Exception as exc:
                print(f"[WARNING] Could not mark non-matching email as read: {exc}")
            continue
        
        sender = next((h['value'] for h in headers if h['name'].lower() == 'from'), 'Unknown Sender')
        email_match = re.search(r'[\w\.-]+@[\w\.-]+', sender)
        candidate_email = email_match.group(0) if email_match else sender

        print(f"\n[NEW EMAIL] Processing submission from: {candidate_email}")

        def extract_attachments(parts_list):
            attachments = []
            for part in parts_list:
                if part.get('parts'):
                    attachments.extend(extract_attachments(part['parts']))
                elif part.get('filename') and part.get('body', {}).get('attachmentId'):
                    attachments.append(part)
            return attachments

        all_parts = payload.get('parts', [])
        found_attachments = extract_attachments(all_parts)
        
        if not found_attachments:
            failed_count += 1
            print("[VALIDATION FAILED] No structural attachment found in this email.")
            save_to_db("Unknown", candidate_email, "No Attachment Found", 0, "Failed (Missing File)", {})

        for part in found_attachments:
            filename = part['filename']
            attachment_id = part['body']['attachmentId']
            candidate_name = extract_candidate_name_from_filename(filename)
            
            if not candidate_name:
                failed_count += 1
                print(f"[VALIDATION FAILED] Invalid filename structure: {filename}. Logging Failure.")
                save_to_db("Unknown", candidate_email, filename, 0, "Failed (Invalid Naming)", {})
                continue
            
            print(f"[VALIDATION PASSED] Candidate Identified: {candidate_name}")

            detected_track = detect_track(subject, filename)
            print(f"[TRACK DETECTION] Track identified as: {detected_track.upper()}")

            attachment = service.users().messages().attachments().get(
                userId='me', messageId=msg_id, id=attachment_id
            ).execute()
            
            file_data = base64.urlsafe_b64decode(attachment['data'].encode('UTF-8'))
            
            evaluation_result = forward_to_ng_skillcheck(file_data, filename, detected_track)
            
            if evaluation_result:
                if isinstance(evaluation_result, dict):
                    evaluation_result.setdefault('track', detected_track)

                overall_score = evaluation_result.get('overall_score', 0)
                save_to_db(candidate_name, candidate_email, filename, overall_score, "Completed", evaluation_result)
                processed_count += 1
            else:
                failed_count += 1
                save_to_db(candidate_name, candidate_email, filename, 0, "Failed (Processing Error)", {})
        
        try:
            service.users().messages().batchModify(
                userId='me',
                body={'ids': [msg_id], 'removeLabelIds': ['UNREAD']}
            ).execute()
        except Exception as exc:
            print(f"[WARNING] Could not mark processed email as read: {exc}")

    return {
        "processed": processed_count,
        "failed": failed_count,
        "skipped": skipped_count,
        "message": f"Processed {processed_count} submission(s)."
    }

if __name__ == "__main__":
    print("[START] Starting Candidate Email Monitoring Service...")
    check_and_process_emails()
