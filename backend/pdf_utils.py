"""PDF text extraction shared by the API evaluation core and the email worker.

Kept free of any FastAPI / OpenAI imports so it can be used for lightweight
validation without constructing the DeepSeek client or requiring an API key.
"""

import io

import pypdf


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Return all extractable text from a PDF. Raises ValueError if unreadable."""
    try:
        pdf_reader = pypdf.PdfReader(io.BytesIO(file_bytes))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() or ""
        return text
    except Exception as e:
        raise ValueError(f"Failed to read PDF file: {str(e)}")
