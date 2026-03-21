use reqwest::Method;
use serde::Serialize;
use std::sync::Arc;

use crate::client::VerifioClient;
use crate::error::VerifioError;
use crate::types::{BulkVerificationJob, PaginatedData, PaginationOptions, VerificationResult};

#[derive(Clone, Debug)]
pub struct BulkService {
    client: Arc<VerifioClient>,
}

impl BulkService {
    pub(crate) fn new(client: Arc<VerifioClient>) -> Self {
        Self { client }
    }

    pub async fn verify(&self, emails: Vec<String>) -> Result<BulkVerificationJob, VerifioError> {
        #[derive(Serialize)]
        struct BulkRequest {
            emails: Vec<String>,
        }

        let body = BulkRequest { emails };

        self.client
            .request(Method::POST, "/bulk", Some(&body))
            .await
    }

    pub async fn get_job(&self, job_id: &str) -> Result<BulkVerificationJob, VerifioError> {
        let path = format!("/bulk-jobs/{}", job_id);
        self.client.request::<_, ()>(Method::GET, &path, None).await
    }

    pub async fn get_results(
        &self,
        job_id: &str,
        options: Option<PaginationOptions>,
    ) -> Result<PaginatedData<VerificationResult>, VerifioError> {
        let page = options.as_ref().and_then(|o| o.page).unwrap_or(1);
        let limit = options.as_ref().and_then(|o| o.limit).unwrap_or(20);

        let path = format!("/bulk-jobs/{}/results?page={}&limit={}", job_id, page, limit);

        self.client.request::<_, ()>(Method::GET, &path, None).await
    }
}
