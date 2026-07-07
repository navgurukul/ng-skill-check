# backend/database.py
import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

CREATE_CANDIDATE_SUBMISSIONS_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS candidate_submissions (
    id serial PRIMARY KEY,
    candidate_name text,
    candidate_email text,
    submission_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    file_name text,
    overall_score integer,
    status text,
    raw_response jsonb
);
"""

def ensure_candidate_submissions_table(conn):
    with conn.cursor() as cursor:
        cursor.execute(CREATE_CANDIDATE_SUBMISSIONS_TABLE_SQL)
    conn.commit()


def get_db_connection():
    conn = psycopg2.connect(
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT")
    )
    ensure_candidate_submissions_table(conn)
    return conn