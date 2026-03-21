use reqwest::Method;
use serde::Serialize;
use std::sync::Arc;

use crate::client::VerifioClient;
use crate::error::VerifioError;
use crate::types::{VerificationResult, VerifyOptions};

#[derive(Clone, Debug)]
pub struct VerifyService {
    client: Arc<VerifioClient>,
}

impl VerifyService {
    pub(crate) fn new(client: Arc<VerifioClient>) -> Self {
        Self { client }
    }

    pub async fn verify(
        &self,
        email: &str,
        options: Option<VerifyOptions>,
    ) -> Result<VerificationResult, VerifioError> {
        #[derive(Serialize)]
        struct VerifyRequest<'a> {
            email: &'a str,
            #[serde(skip_serializing_if = "Option::is_none")]
            options: Option<VerifyOptions>,
        }

        let body = VerifyRequest { email, options };

        self.client
            .request(Method::POST, "/verify", Some(&body))
            .await
    }
}
