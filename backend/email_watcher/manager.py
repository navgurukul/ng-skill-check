"""In-process controller that runs the email worker as a background thread.

Lets the FastAPI app start/stop the poller and report its status, so the
frontend can drive it with a button. For multi-worker deployments (gunicorn -w N)
run the standalone `python -m email_watcher.runner` process instead, to avoid one
poller per web worker.
"""

from __future__ import annotations

import logging
import threading
from datetime import datetime, timezone

from email_watcher.config import EmailSettings
from email_watcher.processor import EmailProcessor
from email_watcher.providers import get_provider
from email_watcher.store import SubmissionStore

logger = logging.getLogger("email_watcher.manager")


def run_cycle(provider, processor) -> int:
    """Process one batch of new messages. Returns the number handled."""
    messages = provider.fetch_new()
    if not messages:
        logger.debug("No new messages.")
        return 0

    logger.info("Fetched %d new message(s).", len(messages))
    for message in messages:
        try:
            result = processor.process(message)
        except Exception:  # noqa: BLE001 — one bad message must not kill the loop
            logger.exception("Unexpected error processing message %s", message.id)
            continue

        if result.mark:
            try:
                provider.mark_processed(message.id)
            except Exception:  # noqa: BLE001
                logger.exception("Failed to mark message %s as processed", message.id)

    return len(messages)


class WorkerManager:
    """Singleton controlling a single background polling thread."""

    def __init__(self):
        self._lock = threading.Lock()
        self._thread = None
        self._stop = None
        self._settings = None
        self._started_at = None
        self._last_cycle_at = None
        self._cycles = 0
        self._processed_total = 0
        self._last_error = None

    def is_running(self) -> bool:
        return self._thread is not None and self._thread.is_alive()

    def start(self, settings: EmailSettings) -> dict:
        with self._lock:
            if self.is_running():
                return self._status_locked()

            self._last_error = None
            # Building the provider validates credentials and may raise.
            provider = get_provider(settings)
            store = SubmissionStore(settings.submissions_dir)
            processor = EmailProcessor(settings, store, dry_run=False)

            self._settings = settings
            self._stop = threading.Event()
            self._started_at = datetime.now(timezone.utc)
            self._last_cycle_at = None
            self._cycles = 0
            self._processed_total = 0
            self._thread = threading.Thread(
                target=self._loop, args=(provider, processor, self._stop),
                name="email-watcher", daemon=True,
            )
            self._thread.start()
            logger.info("Worker started (provider=%s, interval=%ss)",
                        settings.provider, settings.poll_interval)
            return self._status_locked()

    def _loop(self, provider, processor, stop: threading.Event):
        interval = max(5, int(self._settings.poll_interval))
        while not stop.is_set():
            try:
                handled = run_cycle(provider, processor)
                self._cycles += 1
                self._processed_total += handled
                self._last_cycle_at = datetime.now(timezone.utc)
            except Exception as e:  # noqa: BLE001 — survive provider hiccups
                self._last_error = str(e)
                logger.exception("Polling cycle failed; will retry next interval.")
            stop.wait(interval)
        try:
            provider.close()
        except Exception:  # noqa: BLE001
            pass
        logger.info("Worker loop exited.")

    def stop(self) -> dict:
        with self._lock:
            running = self.is_running()
            if running:
                self._stop.set()
            thread = self._thread
        if thread:
            thread.join(timeout=10)
        with self._lock:
            self._thread = None
            self._stop = None
            return self._status_locked()

    def status(self) -> dict:
        with self._lock:
            return self._status_locked()

    def _status_locked(self) -> dict:
        s = self._settings
        return {
            "running": self.is_running(),
            "provider": s.provider if s else None,
            "poll_interval": s.poll_interval if s else None,
            "expected_subject": s.expected_subject if s else None,
            "mailbox": (f"{s.imap_host} · {s.imap_mailbox}" if s and s.provider == "imap" else None),
            "started_at": self._started_at.isoformat() if self._started_at else None,
            "last_cycle_at": self._last_cycle_at.isoformat() if self._last_cycle_at else None,
            "cycles": self._cycles,
            "processed_total": self._processed_total,
            "last_error": self._last_error,
        }


# Module-level singleton shared by the API endpoints.
worker_manager = WorkerManager()
