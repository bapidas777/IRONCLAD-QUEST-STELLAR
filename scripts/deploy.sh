#!/bin/bash
# Ironclad Quest - Deployment Workflow
# Make sure you have stellar-cli installed and configured.

NETWORK="testnet"
SOURCE_ACCOUNT="alice" # Your funded local identity

echo "🚀 Building contract..."
cargo build --manifest-path contracts/forge-core/Cargo.toml --target wasm32-unknown-unknown --release

echo "📦 Optimizing contract..."
stellar contract optimize --wasm target/wasm32-unknown-unknown/release/forge_core.wasm

echo "🚢 Deploying to Stellar $NETWORK..."
CONTRACT_ID=$(stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/forge_core.optimized.wasm \
  --source $SOURCE_ACCOUNT \
  --network $NETWORK)

echo "✅ Deployment successful!"
echo "📍 Contract ID: $CONTRACT_ID"
echo ""
echo "Make sure to copy this Contract ID and update the frontend configuration in src/lib/stellar.ts if necessary."
