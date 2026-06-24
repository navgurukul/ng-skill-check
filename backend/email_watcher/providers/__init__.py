"""Provider factory: selects the Gmail access method from settings."""

from email_watcher.config import EmailSettings
from email_watcher.providers.base import EmailMessage, EmailProvider

__all__ = ["EmailMessage", "EmailProvider", "get_provider"]


def get_provider(settings: EmailSettings) -> EmailProvider:
    provider = (settings.provider or "imap").strip().lower()

    if provider == "imap":
        from email_watcher.providers.imap_provider import ImapProvider
        return ImapProvider(settings)

    if provider in ("gmail_api", "gmail", "api"):
        from email_watcher.providers.gmail_api_provider import GmailApiProvider
        return GmailApiProvider(settings)

    raise ValueError(
        f"Unknown EMAIL_PROVIDER '{settings.provider}'. Use 'imap' or 'gmail_api'."
    )
