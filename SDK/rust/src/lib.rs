pub mod bulk;
pub mod client;
pub mod error;
pub mod history;
pub mod types;
pub mod verify;

use std::sync::Arc;

pub use bulk::BulkService;
pub use client::VerifioClient;
pub use error::VerifioError;
pub use history::HistoryService;
pub use types::*;
pub use verify::VerifyService;

#[derive(Clone, Debug)]
pub struct Verifio {
    pub verify: VerifyService,
    pub bulk: BulkService,
    pub history: HistoryService,
}

impl Verifio {
    pub fn new(api_key: String) -> Self {
        Self::new_with_base_url(api_key, None)
    }

    pub fn new_with_base_url(api_key: String, base_url: Option<String>) -> Self {
        let client = Arc::new(VerifioClient::new(api_key, base_url));

        Self {
            verify: VerifyService::new(client.clone()),
            bulk: BulkService::new(client.clone()),
            history: HistoryService::new(client),
        }
    }
}
