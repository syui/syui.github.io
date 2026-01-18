mod commands;
mod lexicons;
mod lms;

use anyhow::Result;
use clap::{Parser, Subcommand};

#[derive(Parser)]
#[command(name = "ailog")]
#[command(about = "ATProto blog CLI")]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Login to ATProto PDS
    #[command(alias = "l")]
    Login {
        /// Handle (e.g., user.bsky.social)
        handle: String,
        /// Password
        #[arg(short, long)]
        password: String,
        /// PDS server
        #[arg(short, long, default_value = "bsky.social")]
        server: String,
    },

    /// Update lexicon schema
    Lexicon {
        /// Lexicon JSON file
        file: String,
    },

    /// Post a record
    #[command(alias = "p")]
    Post {
        /// Record JSON file
        file: String,
        /// Collection (e.g., ai.syui.log.post)
        #[arg(short, long)]
        collection: String,
        /// Record key (auto-generated if not provided)
        #[arg(short, long)]
        rkey: Option<String>,
    },

    /// Get records from collection
    #[command(alias = "g")]
    Get {
        /// Collection (e.g., ai.syui.log.post)
        #[arg(short, long)]
        collection: String,
        /// Limit
        #[arg(short, long, default_value = "10")]
        limit: u32,
    },

    /// Delete a record
    #[command(alias = "d")]
    Delete {
        /// Collection (e.g., ai.syui.log.post)
        #[arg(short, long)]
        collection: String,
        /// Record key
        #[arg(short, long)]
        rkey: String,
    },

    /// Sync PDS data to local content directory
    #[command(alias = "s")]
    Sync {
        /// Output directory
        #[arg(short, long, default_value = "public/content")]
        output: String,
    },

    /// Generate lexicon Rust code from ATProto lexicon JSON files
    Gen {
        /// Input directory containing lexicon JSON files
        #[arg(short, long, default_value = "./repos/atproto/lexicons")]
        input: String,
        /// Output directory for generated Rust code
        #[arg(short, long, default_value = "./src/lexicons")]
        output: String,
    },

    /// Translate content files
    Lang {
        /// Input file or directory
        input: String,
        /// Source language
        #[arg(short, long, default_value = "ja")]
        from: String,
        /// Target language
        #[arg(short, long, default_value = "en")]
        to: String,
    },

    /// Resolve handle to DID
    Did {
        /// Handle (e.g., syui.ai)
        handle: String,
        /// Server
        #[arg(short, long, default_value = "bsky.social")]
        server: String,
    },
}

#[tokio::main]
async fn main() -> Result<()> {
    // Load .env file if exists
    dotenvy::dotenv().ok();

    let cli = Cli::parse();

    match cli.command {
        Commands::Login { handle, password, server } => {
            commands::auth::login(&handle, &password, &server).await?;
        }
        Commands::Lexicon { file } => {
            commands::post::put_lexicon(&file).await?;
        }
        Commands::Post { file, collection, rkey } => {
            commands::post::put_record(&file, &collection, rkey.as_deref()).await?;
        }
        Commands::Get { collection, limit } => {
            commands::post::get_records(&collection, limit).await?;
        }
        Commands::Delete { collection, rkey } => {
            commands::post::delete_record(&collection, &rkey).await?;
        }
        Commands::Sync { output } => {
            commands::post::sync_to_local(&output).await?;
        }
        Commands::Gen { input, output } => {
            commands::gen::generate(&input, &output)?;
        }
        Commands::Lang { input, from, to } => {
            commands::lang::translate(&input, &from, &to).await?;
        }
        Commands::Did { handle, server } => {
            commands::did::resolve(&handle, &server).await?;
        }
    }

    Ok(())
}
