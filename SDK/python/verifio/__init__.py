from .client import VerifioClient
from .verify import VerifyService
from .bulk import BulkService
from .history import HistoryService
from .types import VerifioConfig, VerifyOptions, VerificationResult
from typing import Optional

class Verifio:
    """
    Verifio Python SDK

    Example:
        ```python
        from verifio import Verifio

        verifio = Verifio({"apiKey": "your-api-key"})

        # Single verification
        result = verifio.verify('test@example.com')
        print(result["state"]) # 'deliverable' | 'undeliverable' | 'risky' | 'unknown'

        # Bulk verification
        job = verifio.bulk.verify(['a@test.com', 'b@test.com'])
        print(job["id"])
        ```
    """

    def __init__(self, config: VerifioConfig):
        """
        Create a new Verifio SDK instance

        :param config: Configuration options dictionary
        """
        self.client = VerifioClient(config)
        self.verify_service = VerifyService(self.client)
        self.bulk = BulkService(self.client)
        self.history = HistoryService(self.client)

    def verify(self, email: str, options: Optional[VerifyOptions] = None) -> VerificationResult:
        """
        Verify a single email address

        :param email: Email address to verify
        :param options: Optional verification options
        :returns: Verification result with state, score, and detailed checks
        """
        return self.verify_service.verify(email, options)

# Export errors
from .errors import (
    AuthenticationError,
    InsufficientCreditsError,
    NotFoundError,
    RateLimitError,
    ServerError,
    ValidationError,
    VerifioError,
)

__all__ = [
    "Verifio",
    "AuthenticationError",
    "InsufficientCreditsError",
    "NotFoundError",
    "RateLimitError",
    "ServerError",
    "ValidationError",
    "VerifioError",
]
