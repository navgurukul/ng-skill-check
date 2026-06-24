"""Provider-agnostic email model and interface."""

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import List, Tuple


@dataclass
class EmailMessage:
    """A single inbox message, normalized across providers."""
    id: str
    subject: str
    sender: str
    # List of (filename, raw_bytes) for every attachment on the message.
    attachments: List[Tuple[str, bytes]] = field(default_factory=list)


class EmailProvider(ABC):
    """Interface every Gmail access method must implement."""

    @abstractmethod
    def fetch_new(self) -> List[EmailMessage]:
        """Return unprocessed (unread) messages, with attachments decoded."""
        raise NotImplementedError

    @abstractmethod
    def mark_processed(self, message_id: str) -> None:
        """Mark a message as handled so it is not returned again."""
        raise NotImplementedError

    def close(self) -> None:
        """Release any open connections. Override if needed."""
        return None
