use anyhow::{Context, Result};
use serde::Deserialize;
use std::collections::BTreeMap;
use std::fs;
use std::path::Path;

#[derive(Debug, Deserialize)]
struct Lexicon {
    id: String,
    defs: BTreeMap<String, LexiconDef>,
}

#[derive(Debug, Deserialize)]
struct LexiconDef {
    #[serde(rename = "type")]
    def_type: Option<String>,
}

struct EndpointInfo {
    nsid: String,
    method: String, // GET or POST
}

/// Generate lexicon code from ATProto lexicon JSON files
pub fn generate(input: &str, output: &str) -> Result<()> {
    let input_path = Path::new(input);

    if !input_path.exists() {
        anyhow::bail!("Input directory does not exist: {}", input);
    }

    println!("Scanning lexicons from: {}", input);

    // Collect all endpoints grouped by namespace
    let mut namespaces: BTreeMap<String, Vec<EndpointInfo>> = BTreeMap::new();

    // Scan com/atproto directory
    let atproto_path = input_path.join("com/atproto");
    if atproto_path.exists() {
        scan_namespace(&atproto_path, "com.atproto", &mut namespaces)?;
    }

    // Scan app/bsky directory
    let bsky_path = input_path.join("app/bsky");
    if bsky_path.exists() {
        scan_namespace(&bsky_path, "app.bsky", &mut namespaces)?;
    }

    // Generate Rust code
    let rust_code = generate_rust_code(&namespaces);
    let rust_output_path = Path::new(output).join("mod.rs");
    fs::create_dir_all(output)?;
    fs::write(&rust_output_path, &rust_code)?;
    println!("Generated Rust: {}", rust_output_path.display());

    // Generate TypeScript code
    let ts_output = output.replace("src/lexicons", "src/web/lexicons");
    let ts_code = generate_typescript_code(&namespaces);
    let ts_output_path = Path::new(&ts_output).join("index.ts");
    fs::create_dir_all(&ts_output)?;
    fs::write(&ts_output_path, &ts_code)?;
    println!("Generated TypeScript: {}", ts_output_path.display());

    println!("Total namespaces: {}", namespaces.len());
    let total_endpoints: usize = namespaces.values().map(|v| v.len()).sum();
    println!("Total endpoints: {}", total_endpoints);

    Ok(())
}

fn scan_namespace(
    base_path: &Path,
    prefix: &str,
    namespaces: &mut BTreeMap<String, Vec<EndpointInfo>>,
) -> Result<()> {
    for entry in fs::read_dir(base_path)? {
        let entry = entry?;
        let path = entry.path();

        if path.is_dir() {
            let ns_name = path.file_name()
                .and_then(|n| n.to_str())
                .context("Invalid directory name")?;

            let full_ns = format!("{}.{}", prefix, ns_name);
            let mut endpoints = Vec::new();

            // Scan JSON files in this namespace
            for file_entry in fs::read_dir(&path)? {
                let file_entry = file_entry?;
                let file_path = file_entry.path();

                if file_path.extension().map(|e| e == "json").unwrap_or(false) {
                    if let Some(endpoint) = parse_lexicon_file(&file_path)? {
                        endpoints.push(endpoint);
                    }
                }
            }

            if !endpoints.is_empty() {
                endpoints.sort_by(|a, b| a.nsid.cmp(&b.nsid));
                namespaces.insert(full_ns, endpoints);
            }
        }
    }

    Ok(())
}

fn parse_lexicon_file(path: &Path) -> Result<Option<EndpointInfo>> {
    let content = fs::read_to_string(path)
        .with_context(|| format!("Failed to read: {}", path.display()))?;

    let lexicon: Lexicon = serde_json::from_str(&content)
        .with_context(|| format!("Failed to parse: {}", path.display()))?;

    // Get the main definition type
    let main_def = match lexicon.defs.get("main") {
        Some(def) => def,
        None => return Ok(None),
    };

    let method = match main_def.def_type.as_deref() {
        Some("query") => "GET",
        Some("procedure") => "POST",
        Some("subscription") => return Ok(None), // Skip websocket subscriptions
        _ => return Ok(None), // Skip records, tokens, etc.
    };

    Ok(Some(EndpointInfo {
        nsid: lexicon.id,
        method: method.to_string(),
    }))
}

fn generate_rust_code(namespaces: &BTreeMap<String, Vec<EndpointInfo>>) -> String {
    let mut code = String::new();

    // Header
    code.push_str("//! Auto-generated from ATProto lexicons\n");
    code.push_str("//! Run `ailog gen` to regenerate\n");
    code.push_str("//! Do not edit manually\n\n");
    code.push_str("#![allow(dead_code)]\n\n");

    // Endpoint struct
    code.push_str("#[derive(Debug, Clone, Copy)]\n");
    code.push_str("pub struct Endpoint {\n");
    code.push_str("    pub nsid: &'static str,\n");
    code.push_str("    pub method: &'static str,\n");
    code.push_str("}\n\n");

    // URL helper function
    code.push_str("/// Build XRPC URL for an endpoint\n");
    code.push_str("pub fn url(pds: &str, endpoint: &Endpoint) -> String {\n");
    code.push_str("    format!(\"https://{}/xrpc/{}\", pds, endpoint.nsid)\n");
    code.push_str("}\n\n");

    // Generate modules for each namespace
    for (ns, endpoints) in namespaces {
        // Convert namespace to module name: com.atproto.repo -> com_atproto_repo
        let mod_name = ns.replace('.', "_");

        code.push_str(&format!("pub mod {} {{\n", mod_name));
        code.push_str("    use super::Endpoint;\n\n");

        for endpoint in endpoints {
            // Extract the method name from NSID: com.atproto.repo.listRecords -> LIST_RECORDS
            let method_name = endpoint.nsid
                .rsplit('.')
                .next()
                .unwrap_or(&endpoint.nsid);

            // Convert camelCase to SCREAMING_SNAKE_CASE
            let const_name = to_screaming_snake_case(method_name);

            code.push_str(&format!(
                "    pub const {}: Endpoint = Endpoint {{ nsid: \"{}\", method: \"{}\" }};\n",
                const_name, endpoint.nsid, endpoint.method
            ));
        }

        code.push_str("}\n\n");
    }

    code
}

fn generate_typescript_code(namespaces: &BTreeMap<String, Vec<EndpointInfo>>) -> String {
    let mut code = String::new();

    // Header
    code.push_str("// Auto-generated from ATProto lexicons\n");
    code.push_str("// Run `ailog gen` to regenerate\n");
    code.push_str("// Do not edit manually\n\n");

    // Endpoint type
    code.push_str("export interface Endpoint {\n");
    code.push_str("  nsid: string\n");
    code.push_str("  method: 'GET' | 'POST'\n");
    code.push_str("}\n\n");

    // URL helper function
    code.push_str("/** Build XRPC URL for an endpoint */\n");
    code.push_str("export function xrpcUrl(pds: string, endpoint: Endpoint): string {\n");
    code.push_str("  return `https://${pds}/xrpc/${endpoint.nsid}`\n");
    code.push_str("}\n\n");

    // Generate namespaces
    for (ns, endpoints) in namespaces {
        // Convert namespace to object name: com.atproto.repo -> comAtprotoRepo
        let obj_name = to_camel_case(&ns.replace('.', "_"));

        code.push_str(&format!("export const {} = {{\n", obj_name));

        for endpoint in endpoints {
            // Extract the method name from NSID: com.atproto.repo.listRecords -> listRecords
            let method_name = endpoint.nsid
                .rsplit('.')
                .next()
                .unwrap_or(&endpoint.nsid);

            code.push_str(&format!(
                "  {}: {{ nsid: '{}', method: '{}' }} as Endpoint,\n",
                method_name, endpoint.nsid, endpoint.method
            ));
        }

        code.push_str("} as const\n\n");
    }

    code
}

fn to_screaming_snake_case(s: &str) -> String {
    let mut result = String::new();

    for (i, c) in s.chars().enumerate() {
        if c.is_uppercase() && i > 0 {
            result.push('_');
        }
        result.push(c.to_ascii_uppercase());
    }

    result
}

fn to_camel_case(s: &str) -> String {
    let mut result = String::new();
    let mut capitalize_next = false;

    for (i, c) in s.chars().enumerate() {
        if c == '_' {
            capitalize_next = true;
        } else if capitalize_next {
            result.push(c.to_ascii_uppercase());
            capitalize_next = false;
        } else if i == 0 {
            result.push(c.to_ascii_lowercase());
        } else {
            result.push(c);
        }
    }

    result
}
