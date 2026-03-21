from typing import Optional, cast, Dict, Any
from .client import VerifioClient
from .types import VerificationResult, VerifyOptions

class VerifyService:
    def __init__(self, client: VerifioClient):
        self.client = client

    def verify(self, email: str, options: Optional[VerifyOptions] = None) -> VerificationResult:
        body: Dict[str, Any] = {"email": email}
        if options:
            body["options"] = options
            
        response_data = self.client.request("POST", "/verify", body)
        
        if not response_data.get("success") or not response_data.get("data"):
            raise Exception(response_data.get("error") or "Verification failed")
            
        return response_data["data"]
