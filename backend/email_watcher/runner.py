"""Entry point for the email intake worker.

Run from the backend/ directory:
    python -m email_watcher.runner            # continuous polling loop
    python -m email_watcher.runner --once     # one cycle, then exit
    python -m email_watcher.runner --dry-run  # validate + log, no DeepSeek call
"""

import argparse
import logging
import time

from email_watcher.config import EmailSettings
from email_watcher.manager import run_cycle
from email_watcher.processor import EmailProcessor
from email_watcher.providers import get_provider
from email_watcher.store import SubmissionStore

logger = logging.getLogger("email_watcher")


def main():
    parser = argparse.ArgumentParser(description="NG Skills Check email intake worker")
    parser.add_argument("--once", action="store_true",
                        help="Run a single polling cycle and exit.")
    parser.add_argument("--dry-run", action="store_true",
                        help="Validate and log only; skip the DeepSeek evaluation.")
    parser.add_argument("--log-level", default="INFO",
                        help="Logging level (default: INFO).")
    args = parser.parse_args()

    logging.basicConfig(
        level=getattr(logging, args.log_level.upper(), logging.INFO),
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    )

    settings = EmailSettings.from_env()
    store = SubmissionStore(settings.submissions_dir)
    processor = EmailProcessor(settings, store, dry_run=args.dry_run)
    provider = get_provider(settings)

    logger.info(
        "Email watcher started: provider=%s mailbox=%s subject=%r interval=%ss dry_run=%s",
        settings.provider, settings.imap_mailbox, settings.expected_subject,
        settings.poll_interval, args.dry_run,
    )

    try:
        if args.once:
            run_cycle(provider, processor)
            return

        while True:
            try:
                run_cycle(provider, processor)
            except Exception:  # noqa: BLE001 — survive provider/connection hiccups
                logger.exception("Polling cycle failed; will retry next interval.")
            time.sleep(settings.poll_interval)
    except KeyboardInterrupt:
        logger.info("Email watcher stopped.")
    finally:
        provider.close()


if __name__ == "__main__":
    main()
