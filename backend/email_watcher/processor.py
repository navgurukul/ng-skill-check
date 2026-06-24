"""The provider-agnostic processing pipeline for a single inbox message.

For each message: detect -> validate attachment -> check naming convention ->
extract candidate name -> auto-evaluate -> persist. Invalid messages are logged
and skipped (no reply is sent).
"""

from __future__ import annotations

import logging
import re
from dataclasses import dataclass
from typing import Optional

from email_watcher.config import EmailSettings
from email_watcher.providers.base import EmailMessage
from email_watcher.store import SubmissionStore

logger = logging.getLogger(__name__)


# Outcome categories. `mark` controls whether the email is flagged as handled:
#  - processed / skipped  -> mark, so it is not re-fetched every cycle
#  - error                -> do NOT mark, so a transient failure is retried
#  - would_process (dry)  -> do NOT mark, leave the inbox untouched
@dataclass
class ProcessResult:
    status: str            # "processed" | "skipped" | "error" | "would_process"
    reason: str = ""
    candidate_name: Optional[str] = None
    folder: Optional[str] = None

    @property
    def mark(self) -> bool:
        return self.status in ("processed", "skipped")


def extract_candidate_name(filename: str, pattern: re.Pattern) -> Optional[str]:
    """Apply the naming-convention regex and return a display name.

    'ng_aniket.pdf' -> 'Aniket', 'ng_first_last.pdf' -> 'First Last'.
    Returns None if the filename does not match the convention.
    """
    match = pattern.match(filename.strip())
    if not match:
        return None
    raw = match.group(1)
    return raw.replace("_", " ").title()


class EmailProcessor:
    def __init__(self, settings: EmailSettings, store: SubmissionStore,
                 dry_run: bool = False):
        self.settings = settings
        self.store = store
        self.dry_run = dry_run
        self.filename_pattern = re.compile(settings.filename_regex, re.IGNORECASE)

    def process(self, message: EmailMessage) -> ProcessResult:
        log_id = f"msg {message.id} from {message.sender!r}"

        # 1. Detect — subject must contain the expected phrase.
        if self.settings.expected_subject.lower() not in (message.subject or "").lower():
            reason = f"subject {message.subject!r} does not match '{self.settings.expected_subject}'"
            logger.info("SKIP (%s): %s", log_id, reason)
            return ProcessResult("skipped", reason)

        # 2. Validate attachment — exactly one PDF.
        pdfs = [(name, data) for (name, data) in message.attachments
                if name.lower().endswith(".pdf")]
        if not pdfs:
            reason = "no PDF attachment found"
            logger.info("SKIP (%s): %s", log_id, reason)
            return ProcessResult("skipped", reason)
        if len(pdfs) > 1:
            reason = f"expected exactly one PDF, found {len(pdfs)}"
            logger.info("SKIP (%s): %s", log_id, reason)
            return ProcessResult("skipped", reason)

        filename, pdf_bytes = pdfs[0]

        # 3. Naming convention + 4. candidate name extraction.
        candidate_name = extract_candidate_name(filename, self.filename_pattern)
        if not candidate_name:
            reason = f"filename {filename!r} does not match naming convention"
            logger.info("SKIP (%s): %s", log_id, reason)
            return ProcessResult("skipped", reason)

        # Confirm the PDF is actually readable (shared pdf_utils extractor).
        if not self._is_readable_pdf(pdf_bytes):
            reason = f"attachment {filename!r} is not a readable PDF"
            logger.info("SKIP (%s): %s", log_id, reason)
            return ProcessResult("skipped", reason)

        logger.info("DETECTED valid submission (%s): candidate=%s file=%s",
                    log_id, candidate_name, filename)

        if self.dry_run:
            logger.info("DRY-RUN: would evaluate and store '%s' (no DeepSeek call)",
                        candidate_name)
            return ProcessResult("would_process", "dry-run", candidate_name)

        # 5. Auto-run evaluation through the shared DeepSeek pipeline.
        try:
            from evaluation import evaluate_submission
            evaluation = evaluate_submission(
                file_bytes=pdf_bytes,
                track=self.settings.default_track,
                evaluation_type=self.settings.default_eval_type,
            )
        except Exception as e:  # noqa: BLE001 — keep the worker alive, retry later
            reason = f"evaluation failed: {e}"
            logger.error("ERROR (%s): %s", log_id, reason)
            return ProcessResult("error", reason, candidate_name)

        # 6. Persist the submission + result.
        folder = self.store.save(
            candidate_name=candidate_name,
            filename=filename,
            pdf_bytes=pdf_bytes,
            evaluation=evaluation,
            metadata={
                "message_id": message.id,
                "sender": message.sender,
                "subject": message.subject,
                "track": self.settings.default_track,
                "evaluation_type": self.settings.default_eval_type,
                "overall_score": evaluation.get("overall_score"),
            },
        )
        logger.info("PROCESSED (%s): candidate=%s stored at %s", log_id, candidate_name, folder)
        return ProcessResult("processed", "ok", candidate_name, folder)

    def _is_readable_pdf(self, pdf_bytes: bytes) -> bool:
        try:
            from pdf_utils import extract_text_from_pdf
            text = extract_text_from_pdf(pdf_bytes)
            return bool((text or "").strip())
        except Exception:
            return False
