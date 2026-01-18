use anyhow::{Context, Result};
use serde::{Deserialize, Serialize};

use super::token::{self, Session};
use crate::lexicons::{self, com_atproto_server};

#[derive(Debug, Serialize)]
struct CreateSessionRequest {
    identifier: String,
    password: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct CreateSessionResponse {
    did: String,
    handle: String,
    access_jwt: String,
    refresh_jwt: String,
}

/// Login to ATProto PDS
pub async fn login(handle: &str, password: &str, pds: &str) -> Result<()> {
    let client = reqwest::Client::new();
    let url = lexicons::url(pds, &com_atproto_server::CREATE_SESSION);

    let req = CreateSessionRequest {
        identifier: handle.to_string(),
        password: password.to_string(),
    };

    println!("Logging in to {} as {}...", pds, handle);

    let res = client
        .post(&url)
        .json(&req)
        .send()
        .await
        .context("Failed to send login request")?;

    if !res.status().is_success() {
        let status = res.status();
        let body = res.text().await.unwrap_or_default();
        anyhow::bail!("Login failed: {} - {}", status, body);
    }

    let session_res: CreateSessionResponse = res.json().await?;

    let session = Session {
        did: session_res.did,
        handle: session_res.handle,
        access_jwt: session_res.access_jwt,
        refresh_jwt: session_res.refresh_jwt,
        pds: Some(pds.to_string()),
    };

    token::save_session(&session)?;
    println!("Logged in as {} ({})", session.handle, session.did);

    Ok(())
}

/// Refresh access token
pub async fn refresh_session() -> Result<Session> {
    let session = token::load_session()?;
    let pds = session.pds.as_deref().unwrap_or("bsky.social");

    let client = reqwest::Client::new();
    let url = lexicons::url(pds, &com_atproto_server::REFRESH_SESSION);

    let res = client
        .post(&url)
        .header("Authorization", format!("Bearer {}", session.refresh_jwt))
        .send()
        .await
        .context("Failed to refresh session")?;

    if !res.status().is_success() {
        let status = res.status();
        let body = res.text().await.unwrap_or_default();
        anyhow::bail!("Refresh failed: {} - {}. Try logging in again.", status, body);
    }

    let new_session: CreateSessionResponse = res.json().await?;

    let session = Session {
        did: new_session.did,
        handle: new_session.handle,
        access_jwt: new_session.access_jwt,
        refresh_jwt: new_session.refresh_jwt,
        pds: Some(pds.to_string()),
    };

    token::save_session(&session)?;

    Ok(session)
}
