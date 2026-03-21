use reqwest::{Client, Method, RequestBuilder};
use serde::{de::DeserializeOwned, Serialize};
use serde_json::Value;

use crate::error::VerifioError;
use crate::types::ApiResponse;

#[derive(Clone, Debug)]
pub struct VerifioClient {
    api_key: String,
    base_url: String,
    client: Client,
}

impl VerifioClient {
    pub fn new(api_key: String, base_url: Option<String>) -> Self {
        Self {
            api_key,
            base_url: base_url.unwrap_or_else(|| "https://verifio.email".to_string()).trim_end_matches('/').to_string(),
            client: Client::builder().build().unwrap_or_default(),
        }
    }

    pub async fn request<T: DeserializeOwned, B: Serialize>(
        &self,
        method: Method,
        path: &str,
        body: Option<&B>,
    ) -> Result<T, VerifioError> {
        let url = format!("{}/api/verify/v1{}", self.base_url, path);

        let mut req_builder: RequestBuilder = self.client.request(method, &url)
            .header("Authorization", format!("Bearer {}", self.api_key));

        if let Some(b) = body {
            req_builder = req_builder.json(b);
        }

        let response = req_builder.send().await?;
        let status = response.status();
        let raw_text = response.text().await?;

        let parsed: Result<ApiResponse<Value>, _> = serde_json::from_str(&raw_text);

        match parsed {
            Ok(api_response) => {
                if status.is_success() && api_response.success {
                    if let Some(data) = api_response.data {
                        let typed_data: T = serde_json::from_value(data)?;
                        return Ok(typed_data);
                    }
                }
                
                // Handle error from API
                self.handle_error(status.as_u16(), api_response.error, api_response.data)
            }
            Err(_) => {
                if status.is_client_error() || status.is_server_error() {
                    self.handle_error(status.as_u16(), Some(format!("HTTP Error {}", status)), None)
                } else {
                    Err(VerifioError::ServerError("Invalid JSON response from server".into()))
                }
            }
        }
    }

    fn handle_error<T>(&self, status: u16, message: Option<String>, data: Option<Value>) -> Result<T, VerifioError> {
        let msg = message.unwrap_or_else(|| "An error occurred".to_string());

        let get_int = |field: &str| -> Option<i32> {
            if let Some(d) = &data {
                d.get(field).and_then(|v| v.as_i64()).map(|v| v as i32)
            } else {
                None
            }
        };

        match status {
            401 => Err(VerifioError::AuthenticationError(msg)),
            402 => Err(VerifioError::InsufficientCreditsError {
                message: msg,
                remaining: get_int("remaining"),
                required: get_int("required"),
            }),
            404 => Err(VerifioError::NotFoundError(msg)),
            429 => Err(VerifioError::RateLimitError {
                message: msg,
                retry_after: get_int("retry_after"),
            }),
            400 => Err(VerifioError::ValidationError(msg)),
            500 | 502 | 503 => Err(VerifioError::ServerError(msg)),
            _ => Err(VerifioError::ApiError { status, message: msg }),
        }
    }
}
