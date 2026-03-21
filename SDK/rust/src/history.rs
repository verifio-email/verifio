use reqwest::Method;
use std::sync::Arc;

use crate::client::VerifioClient;
use crate::error::VerifioError;
use crate::types::{PaginatedData, PaginationOptions, VerificationResult};

#[derive(Clone, Debug)]
pub struct HistoryService {
    client: Arc<VerifioClient>,
}

impl HistoryService {
    pub(crate) fn new(client: Arc<VerifioClient>) -> Self {
        Self { client }
    }

    pub async fn list(
        &self,
        options: Option<PaginationOptions>,
    ) -> Result<PaginatedData<VerificationResult>, VerifioError> {
        let page = options.as_ref().and_then(|o| o.page).unwrap_or(1);
        let limit = options.as_ref().and_then(|o| o.limit).unwrap_or(20);

        let path = format!("/history?page={}&limit={}", page, limit);

        self.client.request::<_, ()>(Method::GET, &path, None).await
    }
}
