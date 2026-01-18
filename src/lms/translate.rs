use anyhow::{anyhow, Result};
use serde::{Deserialize, Serialize};
use std::env;
use std::fs;
use std::path::Path;

#[derive(Debug, Serialize)]
struct ChatMessage {
    role: String,
    content: String,
}

#[derive(Debug, Serialize)]
struct ChatRequest {
    model: String,
    messages: Vec<ChatMessage>,
}

#[derive(Debug, Deserialize)]
struct ChatChoice {
    message: ChatMessageResponse,
}

#[derive(Debug, Deserialize)]
struct ChatMessageResponse {
    content: String,
}

#[derive(Debug, Deserialize)]
struct ChatResponse {
    choices: Vec<ChatChoice>,
}

/// Translate a file or folder
pub async fn run(input: &Path, from: &str, to: &str) -> Result<()> {
    if input.is_dir() {
        translate_folder(input, from, to).await
    } else {
        translate_file(input, from, to).await
    }
}

async fn translate_text(
    client: &reqwest::Client,
    url: &str,
    model: &str,
    text: &str,
    from: &str,
    to: &str,
) -> Result<String> {
    let from_lang = lang_name(from);
    let to_lang = lang_name(to);

    let system_content = "<|plamo:op|>dataset\ntranslation".to_string();
    let user_content = format!(
        "<|plamo:op|>input lang={}\n{}\n<|plamo:op|>output lang={}",
        from_lang, text, to_lang
    );

    let req = ChatRequest {
        model: model.to_string(),
        messages: vec![
            ChatMessage {
                role: "system".to_string(),
                content: system_content,
            },
            ChatMessage {
                role: "user".to_string(),
                content: user_content,
            },
        ],
    };

    let res = client.post(url).json(&req).send().await?;

    if !res.status().is_success() {
        let status = res.status();
        let body = res.text().await?;
        return Err(anyhow!("Translation failed ({}): {}", status, body));
    }

    let chat_res: ChatResponse = res.json().await?;
    chat_res
        .choices
        .first()
        .map(|c| c.message.content.trim().to_string())
        .ok_or_else(|| anyhow!("No translation result"))
}

async fn translate_file(input: &Path, from: &str, to: &str) -> Result<()> {
    let translate_url =
        env::var("TRANSLATE_URL").unwrap_or_else(|_| "http://127.0.0.1:1234/v1".to_string());
    let model =
        env::var("TRANSLATE_MODEL").unwrap_or_else(|_| "plamo-2-translate".to_string());

    println!("Translating: {}", input.display());

    // Read input JSON
    let content = fs::read_to_string(input)?;
    let mut record: serde_json::Value = serde_json::from_str(&content)?;

    // Handle both direct format and wrapped format (with "value" field)
    let value = if record.get("value").is_some() {
        record.get_mut("value").unwrap()
    } else {
        &mut record
    };

    // Check if already translated
    if value
        .get("translations")
        .and_then(|t| t.get(to))
        .is_some()
    {
        println!("  Skipped (already has {} translation)", to);
        return Ok(());
    }

    let client = reqwest::Client::new();
    let url = format!("{}/chat/completions", translate_url);

    // Translate title if exists
    let translated_title = if let Some(title) = value.get("title").and_then(|v| v.as_str()) {
        if !title.is_empty() {
            Some(translate_text(&client, &url, &model, title, from, to).await?)
        } else {
            None
        }
    } else {
        None
    };

    // Get and translate content
    let text = value
        .get("content")
        .and_then(|v| v.as_str())
        .ok_or_else(|| anyhow!("No 'content' field in JSON"))?;

    let translated_content = translate_text(&client, &url, &model, text, from, to).await?;

    // Add translation to value
    let translations = value
        .as_object_mut()
        .ok_or_else(|| anyhow!("Invalid JSON"))?
        .entry("translations")
        .or_insert_with(|| serde_json::json!({}));

    let mut translation_entry = serde_json::json!({
        "content": translated_content
    });

    if let Some(title) = translated_title {
        translation_entry
            .as_object_mut()
            .unwrap()
            .insert("title".to_string(), serde_json::json!(title));
    }

    translations
        .as_object_mut()
        .ok_or_else(|| anyhow!("Invalid translations field"))?
        .insert(to.to_string(), translation_entry);

    // Write back
    let output = serde_json::to_string_pretty(&record)?;
    fs::write(input, output)?;

    println!("  OK");

    Ok(())
}

fn collect_json_files(dir: &Path, files: &mut Vec<std::path::PathBuf>) -> Result<()> {
    for entry in fs::read_dir(dir)? {
        let entry = entry?;
        let path = entry.path();
        if path.is_dir() {
            collect_json_files(&path, files)?;
        } else if path.extension().map(|e| e == "json").unwrap_or(false) {
            // Skip non-post files (describe.json, self.json, index.json)
            let filename = path.file_name().and_then(|n| n.to_str()).unwrap_or("");
            if filename != "describe.json" && filename != "self.json" && filename != "index.json" {
                files.push(path);
            }
        }
    }
    Ok(())
}

async fn translate_folder(dir: &Path, from: &str, to: &str) -> Result<()> {
    let mut files = Vec::new();
    collect_json_files(dir, &mut files)?;
    files.sort();

    println!("Translating {} files ({} -> {})", files.len(), from, to);

    let mut success = 0;
    let mut skipped = 0;
    let mut failed = 0;

    for path in &files {
        match translate_file(path, from, to).await {
            Ok(_) => {
                // Check if it was actually translated or skipped
                let content = fs::read_to_string(&path)?;
                let record: serde_json::Value = serde_json::from_str(&content)?;
                let value = record.get("value").unwrap_or(&record);
                if value
                    .get("translations")
                    .and_then(|t| t.get(to))
                    .is_some()
                {
                    success += 1;
                } else {
                    skipped += 1;
                }
            }
            Err(e) => {
                eprintln!("  ERROR {}: {}", path.display(), e);
                failed += 1;
            }
        }
    }

    println!(
        "\nDone: {} translated, {} skipped, {} failed",
        success, skipped, failed
    );

    Ok(())
}

fn lang_name(code: &str) -> &str {
    match code {
        "ja" => "Japanese",
        "en" => "English",
        "zh" => "Chinese",
        "ko" => "Korean",
        "fr" => "French",
        "de" => "German",
        "es" => "Spanish",
        _ => code,
    }
}
