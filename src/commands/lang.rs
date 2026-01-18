use anyhow::Result;
use std::path::Path;

use crate::lms;

/// Translate content files from one language to another
pub async fn translate(input: &str, from: &str, to: &str) -> Result<()> {
    let path = Path::new(input);
    lms::translate::run(path, from, to).await
}
