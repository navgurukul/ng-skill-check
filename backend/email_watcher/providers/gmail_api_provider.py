"""Gmail API provider (OAuth2). Google libraries are imported lazily so the
IMAP-only path does not require them to be installed."""

import base64
import logging
import os
from typing import List

from email_watcher.config import EmailSettings
from email_watcher.providers.base import EmailMessage, EmailProvider

logger = logging.getLogger(__name__)

# gmail.modify lets us read messages and remove the UNREAD label after handling.
SCOPES = ["https://www.googleapis.com/auth/gmail.modify"]


def _header(headers, name: str) -> str:
    for h in headers or []:
        if h.get("name", "").lower() == name.lower():
            return h.get("value", "")
    return ""


class GmailApiProvider(EmailProvider):
    def __init__(self, settings: EmailSettings):
        self.settings = settings
        self._service = self._build_service()

    def _build_service(self):
        try:
            from google.auth.transport.requests import Request
            from google.oauth2.credentials import Credentials
            from google_auth_oauthlib.flow import InstalledAppFlow
            from googleapiclient.discovery import build
        except ImportError as e:
            raise RuntimeError(
                "Gmail API provider requires google-api-python-client, google-auth, "
                "and google-auth-oauthlib. Install them or use EMAIL_PROVIDER=imap."
            ) from e

        creds = None
        token_path = self.settings.gmail_api_token_path
        creds_path = self.settings.gmail_api_credentials_path

        if os.path.exists(token_path):
            creds = Credentials.from_authorized_user_file(token_path, SCOPES)

        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                if not os.path.exists(creds_path):
                    raise RuntimeError(
                        f"Gmail OAuth client secrets not found at '{creds_path}'. "
                        "Download credentials.json from Google Cloud Console."
                    )
                flow = InstalledAppFlow.from_client_secrets_file(creds_path, SCOPES)
                creds = flow.run_local_server(port=0)
            with open(token_path, "w") as token_file:
                token_file.write(creds.to_json())

        return build("gmail", "v1", credentials=creds)

    def fetch_new(self) -> List[EmailMessage]:
        user_id = self.settings.gmail_user_id
        result = self._service.users().messages().list(
            userId=user_id, q="is:unread", labelIds=["INBOX"]
        ).execute()

        messages: List[EmailMessage] = []
        for ref in result.get("messages", []):
            msg_id = ref["id"]
            full = self._service.users().messages().get(
                userId=user_id, id=msg_id, format="full"
            ).execute()

            payload = full.get("payload", {})
            headers = payload.get("headers", [])
            attachments = self._extract_attachments(user_id, msg_id, payload)

            messages.append(EmailMessage(
                id=msg_id,
                subject=_header(headers, "Subject"),
                sender=_header(headers, "From"),
                attachments=attachments,
            ))

        return messages

    def _extract_attachments(self, user_id: str, msg_id: str, payload: dict):
        attachments = []

        def walk(part):
            filename = part.get("filename")
            body = part.get("body", {})
            if filename:
                data = body.get("data")
                if not data and body.get("attachmentId"):
                    att = self._service.users().messages().attachments().get(
                        userId=user_id, messageId=msg_id, id=body["attachmentId"]
                    ).execute()
                    data = att.get("data")
                if data:
                    raw = base64.urlsafe_b64decode(data.encode("utf-8"))
                    attachments.append((filename, raw))
            for sub in part.get("parts", []) or []:
                walk(sub)

        walk(payload)
        return attachments

    def mark_processed(self, message_id: str) -> None:
        self._service.users().messages().modify(
            userId=self.settings.gmail_user_id,
            id=message_id,
            body={"removeLabelIds": ["UNREAD"]},
        ).execute()
