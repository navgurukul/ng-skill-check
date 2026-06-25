import os
import re
import io
import json
import base64
import psycopg2
from psycopg2.extras import Json
from database import get_db_connection
import httpx
from google.auth.transport.requests import Request
import pickle
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

# Configuration
SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']
NG_API_URL = "http://localhost:8000/api/evaluate"
DB_PARAMS = {
    "dbname": "your_db",
    "user": "your_user",
    "password": "your_password",
    "host": "localhost",
    "port": "5432"
}

def get_gmail_service():
    creds = None
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)
    return build('gmail', 'v1', credentials=creds)

# def save_to_db(name, email, filename, score, status, raw_data):
#     """Database mein evaluation ka result save karne ke liye"""
#     try:
#         conn = get_db_connection() # Dynamic connection
#         cur = conn.cursor()
#         query = """
#             INSERT INTO candidate_submissions (candidate_name, candidate_email, file_name, overall_score, status, raw_response)
#             VALUES (%s, %s, %s, %s, %s, %s)
#         """
#         cur.execute(query, (name, email, filename, score, status, Json(raw_data)))
#         conn.commit()
#         cur.close()
#         conn.close()
#         print(f"[DATABASE] Successfully saved record for {name}")
#     except Exception as e:
#         print(f"[DATABASE ERROR] Failed to save record: {e}")

# backend/email_monitor.py ke andar save_to_db function ko aise update karein:
def save_to_db(name, email, filename, score, status, raw_data):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Ensure raw_data is a proper JSON string before entering DB
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

def forward_to_ng_skillcheck(file_bytes, filename):
    """NG SkillCheck core API ko hit karne ke liye function"""
    print(f"[PIPELINE] Forwarding {filename} to NG SkillCheck Platform...")
    
    # multipart/form-data ke liye file prepare karna
    files = {'file': (filename, file_bytes, 'application/pdf')}
    data = {
        'track': 'ai', # Default track, ise email body ya subject se bhi dynamic bana sakte hain
        'evaluation_type': 'prework'
    }
    
    try:
        with httpx.Client() as client:
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
    # Sirf wahi unread emails uthao jinka subject 'Pre-Work Submission' ho
    query = "is:unread subject:'Pre-Work Submission'"
    
    results = service.users().messages().list(userId='me', q=query).execute()
    messages = results.get('messages', [])
    
    if not messages:
        print("[MONITOR] No new pre-work submissions found.")
        return

    for msg in messages:
        msg_id = msg['id']
        message = service.users().messages().get(userId='me', id=msg_id).execute()
        payload = message['payload']
        headers = payload['headers']
        
        sender = [h['value'] for h in headers if h['name'] == 'From'][0]
        # Sender string se clean email extract karna (e.g., "Aniket <xyz@gmail.com>" -> "xyz@gmail.com")
        email_match = re.search(r'[\w\.-]+@[\w\.-]+', sender)
        candidate_email = email_match.group(0) if email_match else sender

        print(f"\n[NEW EMAIL] Processing submission from: {candidate_email}")

        # Parts scan karke attachment dhoodhna
        parts = payload.get('parts', [])
        for part in parts:
            if part.get('filename') and part.get('body', {}).get('attachmentId'):
                filename = part['filename']
                attachment_id = part['body']['attachmentId']
                
                # 1. Naming Convention Validation (ng_<name>.pdf)
                match = re.match(r'^ng_([a-zA-Z0-9_]+)\.pdf$', filename, re.IGNORECASE)
                
                if not match:
                    print(f"[VALIDATION FAILED] Invalid filename: {filename}. Skipping or marking failed.")
                    save_to_db("Unknown", candidate_email, filename, 0, "Failed (Invalid Naming)", {})
                    continue
                
                # Candidate ka naam extract karna filename se
                candidate_name = match.group(1).replace('_', ' ').title()
                print(f"[VALIDATION PASSED] Candidate Identified: {candidate_name}")

                # 2. Attachment Download karna
                attachment = service.users().messages().attachments().get(
                    userId='me', messageId=msg_id, id=attachment_id
                ).execute()
                
                file_data = base64.urlsafe_b64decode(attachment['data'].encode('UTF-8'))
                
                # 3. NG SkillCheck Core API par bhejna
                evaluation_result = forward_to_ng_skillcheck(file_data, filename)
                
                if evaluation_result:
                    overall_score = evaluation_result.get('overall_score', 0)
                    save_to_db(candidate_name, candidate_email, filename, overall_score, "Completed", evaluation_result)
                else:
                    save_to_db(candidate_name, candidate_email, filename, 0, "Failed (Processing Error)", {})
        
        # Mail ko read mark kar dena taaki dobara process na ho
        service.users().messages().batchModify(
            userId='me',
            body={'ids': [msg_id], 'removeLabelIds': ['UNREAD']}
        ).execute()

if __name__ == "__main__":
    print("[START] Starting Candidate Email Monitoring Service...")
    check_and_process_emails()