from typing import Optional, cast
from .client import VerifioClient
from .types import PaginationOptions, VerificationResult, PaginatedData

class HistoryService:
    def __init__(self, client: VerifioClient):
        self.client = client

    def list(self, options: Optional[PaginationOptions] = None) -> PaginatedData[VerificationResult]:
        page = options.get("page", 1) if options else 1
        limit = options.get("limit", 20) if options else 20

        response_data = self.client.request("GET", f"/history?page={page}&limit={limit}")

        if not response_data.get("success") or not response_data.get("data"):
            raise Exception(response_data.get("error") or "Failed to get history")

        return response_data["data"]
