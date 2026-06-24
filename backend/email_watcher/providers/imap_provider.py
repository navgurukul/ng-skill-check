"""IMAP-based Gmail provider (uses a Gmail App Password, stdlib only)."""

import email
import imaplib
import logging
from email.header import decode_header, make_header
from typing import List

from email_watcher.config import EmailSettings
from email_watcher.providers.base import EmailMessage, EmailProvider

logger = logging.getLogger(__name__)


def _decode(value) -> str:
    if not value:
        return ""
    try:
        return str(make_header(decode_header(value)))
    except Exception:
        return str(value)


class ImapProvider(EmailProvider):
    def __init__(self, settings: EmailSettings):
        self.settings = settings
        if not settings.gmail_address or not settings.gmail_app_password:
            raise ValueError(
                "IMAP provider requires GMAIL_ADDRESS and GMAIL_APP_PASSWORD."
            )
        self._conn = None

    def _connect(self) -> imaplib.IMAP4_SSL:
        if self._conn is not None:
            try:
                self._conn.noop()
                return self._conn
            except Exception:
                self._conn = None

        conn = imaplib.IMAP4_SSL(self.settings.imap_host, self.settings.imap_port)
        conn.login(self.settings.gmail_address, self.settings.gmail_app_password)
        conn.select(self.settings.imap_mailbox)
        self._conn = conn
        return conn

    def fetch_new(self) -> List[EmailMessage]:
        conn = self._connect()
        # UID SEARCH for unseen messages — UIDs are stable across the session.
        status, data = conn.uid("search", None, "UNSEEN")
        if status != "OK":
            logger.warning("IMAP search failed: %s", status)
            return []

        uids = data[0].split() if data and data[0] else []
        messages: List[EmailMessage] = []

        for uid in uids:
            uid_str = uid.decode() if isinstance(uid, bytes) else str(uid)
            # BODY.PEEK[] fetches without setting the \Seen flag, so a message
            # we fail to process stays unread and gets retried next cycle.
            status, msg_data = conn.uid("fetch", uid, "(BODY.PEEK[])")
            if status != "OK" or not msg_data or msg_data[0] is None:
                logger.warning("IMAP fetch failed for uid %s", uid_str)
                continue

            raw_bytes = msg_data[0][1]
            parsed = email.message_from_bytes(raw_bytes)

            attachments = []
            for part in parsed.walk():
                filename = part.get_filename()
                if not filename:
                    continue
                payload = part.get_payload(decode=True)
                if payload is None:
                    continue
                attachments.append((_decode(filename), payload))

            messages.append(EmailMessage(
                id=uid_str,
                subject=_decode(parsed.get("Subject")),
                sender=_decode(parsed.get("From")),
                attachments=attachments,
            ))

        return messages

    def mark_processed(self, message_id: str) -> None:
        conn = self._connect()
        conn.uid("store", message_id, "+FLAGS", "(\\Seen)")

    def close(self) -> None:
        if self._conn is not None:
            try:
                self._conn.logout()
            except Exception:
                pass
            self._conn = None
