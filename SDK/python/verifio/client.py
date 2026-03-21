import requests
from typing import TypeVar, Any, Dict, Optional, cast
from .errors import (
    AuthenticationError,
    InsufficientCreditsError,
    NotFoundError,
    RateLimitError,
    ServerError,
    ValidationError,
    VerifioError,
)
from .types import VerifioConfig

DEFAULT_BASE_URL = "https://verifio.email"

T = TypeVar("T")

class VerifioClient:
    def __init__(self, config: VerifioConfig):
        if not config.get("apiKey"):
            raise ValidationError("API key is required")

        self.api_key = config["apiKey"]
        base_url = str(config.get("baseUrl") or DEFAULT_BASE_URL)
        self.base_url = base_url.rstrip("/")

    def request(self, method: str, path: str, body: Optional[Dict[str, Any]] = None) -> Any:
        url = f"{self.base_url}/api/verify/v1{path}"
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}",
        }

        try:
            if method.upper() == "GET":
                response = requests.get(url, headers=headers)
            elif method.upper() == "POST":
                response = requests.post(url, headers=headers, json=body)
            elif method.upper() == "PUT":
                response = requests.put(url, headers=headers, json=body)
            elif method.upper() == "DELETE":
                response = requests.delete(url, headers=headers, json=body)
            else:
                response = requests.request(method, url, headers=headers, json=body)
                
            data = response.json()
            
            if not response.ok:
                self._handle_error(response.status_code, data)
                
            return data
            
        except requests.exceptions.RequestException as e:
            raise VerifioError(str(e))
        except ValueError:
            # Handle JSON decode error if response is not JSON
            if not response.ok:
                raise VerifioError(f"HTTP Error {response.status_code}", status_code=response.status_code)
            raise VerifioError("Invalid JSON response from server")
            
    def _handle_error(self, status: int, data: Dict[str, Any]) -> None:
        message = data.get("error", "An error occurred")
        error_data = data.get("data") or {}
        
        if status == 401:
            raise AuthenticationError(message)
        elif status == 402:
            remaining = error_data.get("remaining") if isinstance(error_data, dict) else None
            required = error_data.get("required") if isinstance(error_data, dict) else None
            raise InsufficientCreditsError(message, remaining=remaining, required=required)
        elif status == 404:
            raise NotFoundError(message)
        elif status == 429:
            raise RateLimitError(message)
        elif status == 400:
            raise ValidationError(message)
        elif status in (500, 502, 503):
            raise ServerError(message)
        else:
            raise VerifioError(message, status_code=status)
