#!/bin/bash
# Ironclad Quest - Deployment Workflow
# Make sure you have stellar-cli installed and configured.

NETWORK="testnet"
SOURCE_ACCOUNT="alice" # Your funded local identity

echo "🚀 Building contract..."
cargo build --manifest-path contracts/forge-core/Cargo.toml --target wasm32v1-none --release

echo "📦 Optimizing contract..."
stellar contract optimize --wasm target/wasm32v1-none/release/forge_core.wasm

echo "🚢 Deploying to Stellar $NETWORK..."
CONTRACT_ID=$(stellar contract deploy \
  --wasm target/wasm32v1-none/release/forge_core.optimized.wasm \
  --source $SOURCE_ACCOUNT \
  --network $NETWORK)

echo "✅ Deployment successful!"
echo "📍 Contract ID: $CONTRACT_ID"
echo ""
echo "🔥 Next Steps:"
echo "1. Initialize the contract with an admin and token address:"
echo "   stellar contract invoke --id $CONTRACT_ID --network $NETWORK --source $SOURCE_ACCOUNT -- init --admin <ADMIN_PUBKEY> --token <XLM_TESTNET_TOKEN>"
echo "2. Configure the quizzes using configure_quiz."
echo "3. Copy the Contract ID to frontend/src/lib/stellar.ts if necessary."
