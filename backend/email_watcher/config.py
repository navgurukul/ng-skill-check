"""Configuration for the email intake worker, loaded from environment variables."""

from __future__ import annotations

import os
from dataclasses import dataclass, field

from dotenv import load_dotenv

load_dotenv()

# Default naming convention: ng_<name>.pdf  (e.g. ng_aniket.pdf, ng_first_last.pdf)
DEFAULT_FILENAME_REGEX = r"^ng_([a-zA-Z0-9]+(?:_[a-zA-Z0-9]+)*)\.pdf$"


def _get(name: str, default: str = "") -> str:
    value = os.getenv(name)
    return value if value is not None and value != "" else default


def _get_int(name: str, default: int) -> int:
    raw = os.getenv(name)
    if raw is None or raw == "":
        return default
    try:
        return int(raw)
    except ValueError:
        return default


@dataclass
class EmailSettings:
    # Which provider to use: "imap" or "gmail_api"
    provider: str = "imap"

    # Polling / detection
    poll_interval: int = 60
    expected_subject: str = "Pre-Work Submission"
    filename_regex: str = DEFAULT_FILENAME_REGEX

    # Evaluation defaults (track is NOT parsed from the email)
    default_track: str = "ai"
    default_eval_type: str = "prework"

    # IMAP settings
    imap_host: str = "imap.gmail.com"
    imap_port: int = 993
    gmail_address: str = ""
    gmail_app_password: str = ""
    imap_mailbox: str = "INBOX"

    # Gmail API settings
    gmail_api_credentials_path: str = "credentials.json"
    gmail_api_token_path: str = "token.json"
    gmail_user_id: str = "me"

    # Where processed submissions are persisted
    submissions_dir: str = field(default_factory=lambda: os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "submissions"
    ))

    @classmethod
    def from_env(cls) -> "EmailSettings":
        return cls(
            provider=_get("EMAIL_PROVIDER", "imap").strip().lower(),
            poll_interval=_get_int("EMAIL_POLL_INTERVAL", 60),
            expected_subject=_get("EMAIL_EXPECTED_SUBJECT", "Pre-Work Submission"),
            filename_regex=_get("EMAIL_FILENAME_REGEX", DEFAULT_FILENAME_REGEX),
            default_track=_get("DEFAULT_EMAIL_TRACK", "ai"),
            default_eval_type=_get("DEFAULT_EMAIL_EVAL_TYPE", "prework"),
            imap_host=_get("IMAP_HOST", "imap.gmail.com"),
            imap_port=_get_int("IMAP_PORT", 993),
            gmail_address=_get("GMAIL_ADDRESS"),
            gmail_app_password=_get("GMAIL_APP_PASSWORD"),
            imap_mailbox=_get("IMAP_MAILBOX", "INBOX"),
            gmail_api_credentials_path=_get("GMAIL_API_CREDENTIALS_PATH", "credentials.json"),
            gmail_api_token_path=_get("GMAIL_API_TOKEN_PATH", "token.json"),
            gmail_user_id=_get("GMAIL_USER_ID", "me"),
        )

    # Maps the frontend (camelCase) config payload onto settings fields.
    _OVERRIDE_MAP = {
        "provider": "provider",
        "pollInterval": "poll_interval",
        "expectedSubject": "expected_subject",
        "filenameRegex": "filename_regex",
        "defaultTrack": "default_track",
        "defaultEvalType": "default_eval_type",
        "imapHost": "imap_host",
        "imapPort": "imap_port",
        "imapMailbox": "imap_mailbox",
        "gmailAddress": "gmail_address",
        "gmailAppPassword": "gmail_app_password",
        "gmailApiCredentialsPath": "gmail_api_credentials_path",
        "gmailApiTokenPath": "gmail_api_token_path",
        "gmailUserId": "gmail_user_id",
    }

    @classmethod
    def from_overrides(cls, data=None) -> "EmailSettings":
        """Start from env defaults, then apply any provided (camelCase) overrides."""
        settings = cls.from_env()
        if not data:
            return settings
        int_fields = {"poll_interval", "imap_port"}
        for key, attr in cls._OVERRIDE_MAP.items():
            if key not in data or data[key] in (None, ""):
                continue
            value = data[key]
            if attr in int_fields:
                try:
                    value = int(value)
                except (TypeError, ValueError):
                    continue
            if attr == "provider":
                value = str(value).strip().lower()
            setattr(settings, attr, value)
        return settings
