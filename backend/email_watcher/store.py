"""Filesystem persistence for processed email submissions."""

from __future__ import annotations

import json
import logging
import os
import re
from datetime import datetime, timezone
from typing import Optional

logger = logging.getLogger(__name__)


def _slugify(name: str) -> str:
    slug = re.sub(r"[^a-zA-Z0-9]+", "_", name).strip("_")
    return slug or "candidate"


class SubmissionStore:
    def __init__(self, base_dir: str):
        self.base_dir = base_dir
        os.makedirs(self.base_dir, exist_ok=True)
        self.index_path = os.path.join(self.base_dir, "index.jsonl")

    def save(self, *, candidate_name: str, filename: str, pdf_bytes: bytes,
             evaluation: Optional[dict], metadata: dict) -> str:
        """Persist one submission. Returns the created directory path."""
        timestamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
        folder_name = f"{_slugify(candidate_name)}_{timestamp}"
        folder = os.path.join(self.base_dir, folder_name)
        os.makedirs(folder, exist_ok=True)

        with open(os.path.join(folder, filename), "wb") as f:
            f.write(pdf_bytes)

        if evaluation is not None:
            with open(os.path.join(folder, "evaluation.json"), "w") as f:
                json.dump(evaluation, f, indent=2)

        record = {
            "candidate_name": candidate_name,
            "filename": filename,
            "timestamp": timestamp,
            "folder": folder_name,
            "evaluated": evaluation is not None,
            **metadata,
        }
        with open(os.path.join(folder, "metadata.json"), "w") as f:
            json.dump(record, f, indent=2)

        with open(self.index_path, "a") as f:
            f.write(json.dumps(record) + "\n")

        logger.info("Stored submission for '%s' at %s", candidate_name, folder)
        return folder
