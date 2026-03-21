# Verifio Rust SDK

Official Rust SDK for Verifio email verification.

## Installation

Add the following to your `Cargo.toml`:

```toml
[dependencies]
verifio = "1.0.0"
tokio = { version = "1", features = ["full"] }
```

## Quick Start

```rust
use verifio::{Verifio, VerificationResult};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let verifio = Verifio::new("your-api-key".to_string());

    let result: VerificationResult = verifio.verify.verify("test@example.com", None).await?;

    println!("Result State: {}", result.state);
    println!("Score: {}", result.score);

    Ok(())
}
```

## Options Configuration

```rust
use verifio::{VerifyOptions, Verifio};

let verifio = Verifio::new("your-api-key".to_string());

let options = VerifyOptions {
    skip_disposable: Some(false),
    skip_role: Some(true),
    skip_typo: None,
};

let result = verifio.verify.verify("test@example.com", Some(options)).await?;
```
