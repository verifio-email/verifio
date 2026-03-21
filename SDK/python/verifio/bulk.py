from typing import List, Optional, cast, Dict, Any
from .client import VerifioClient
from .types import (
    BulkVerificationJob, 
    PaginationOptions, 
    VerificationResult, 
    PaginatedData
)

class BulkService:
    def __init__(self, client: VerifioClient):
        self.client = client

    def verify(self, emails: List[str]) -> BulkVerificationJob:
        body: Dict[str, Any] = {"emails": emails}
        
        response_data = self.client.request("POST", "/bulk", body)
        
        if not response_data.get("success") or not response_data.get("data"):
            raise Exception(response_data.get("error") or "Bulk verification failed")
            
        return response_data["data"]

    def get_job(self, job_id: str) -> BulkVerificationJob:
        response_data = self.client.request("GET", f"/bulk-jobs/{job_id}")
        
        if not response_data.get("success") or not response_data.get("data"):
            raise Exception(response_data.get("error") or "Failed to get job")
            
        return response_data["data"]

    def get_results(self, job_id: str, options: Optional[PaginationOptions] = None) -> PaginatedData[VerificationResult]:
        page = options.get("page", 1) if options else 1
        limit = options.get("limit", 20) if options else 20
        
        response_data = self.client.request("GET", f"/bulk-jobs/{job_id}/results?page={page}&limit={limit}")
        
        if not response_data.get("success") or not response_data.get("data"):
            raise Exception(response_data.get("error") or "Failed to get results")
            
        return response_data["data"]
