use anyhow::{Context, Result};
use serde::Deserialize;

use crate::lexicons::{self, com_atproto_identity};

#[derive(Debug, Deserialize)]
struct ResolveHandleResponse {
    did: String,
}

/// Resolve handle to DID
pub async fn resolve(handle: &str, server: &str) -> Result<()> {
    let client = reqwest::Client::new();
    let url = format!(
        "{}?handle={}",
        lexicons::url(server, &com_atproto_identity::RESOLVE_HANDLE),
        handle
    );

    let res = client.get(&url).send().await?;

    if !res.status().is_success() {
        let status = res.status();
        let body = res.text().await.unwrap_or_default();
        anyhow::bail!("Failed to resolve handle: {} - {}", status, body);
    }

    let result: ResolveHandleResponse = res.json().await
        .context("Failed to parse response")?;

    println!("{}", result.did);

    Ok(())
}
