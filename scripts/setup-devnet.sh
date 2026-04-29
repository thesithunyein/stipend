#!/usr/bin/env bash
set -euo pipefail

# ── Stipend Devnet Setup ─────────────────────────────────────────────
# Creates a test SPL token mint on devnet and airdrops SOL + tokens
# to the employer keypair for demo purposes.
#
# Prerequisites: solana-cli, spl-token CLI
# Run inside Codespaces: sh scripts/setup-devnet.sh
# ─────────────────────────────────────────────────────────────────────

KEYPAIR_DIR="./keys"
mkdir -p "$KEYPAIR_DIR"

echo "==> Configuring Solana CLI for devnet..."
solana config set --url https://api.devnet.solana.com

# Generate employer keypair if not exists
if [ ! -f "$KEYPAIR_DIR/employer.json" ]; then
  echo "==> Generating employer keypair..."
  solana-keygen new --outfile "$KEYPAIR_DIR/employer.json" --no-bip39-passphrase --force
fi

EMPLOYER=$(solana-keygen pubkey "$KEYPAIR_DIR/employer.json")
echo "==> Employer address: $EMPLOYER"

# Generate 3 test employee keypairs
for i in 1 2 3; do
  if [ ! -f "$KEYPAIR_DIR/employee${i}.json" ]; then
    echo "==> Generating employee${i} keypair..."
    solana-keygen new --outfile "$KEYPAIR_DIR/employee${i}.json" --no-bip39-passphrase --force
  fi
  ADDR=$(solana-keygen pubkey "$KEYPAIR_DIR/employee${i}.json")
  echo "    Employee${i}: $ADDR"
done

# Airdrop SOL to employer
echo "==> Airdropping 2 SOL to employer..."
solana airdrop 2 "$EMPLOYER" || echo "    (airdrop may fail on rate limit, retry manually)"

# Create SPL token mint (6 decimals, like USDC)
echo "==> Creating test USDC-like token mint..."
MINT=$(spl-token create-token --decimals 6 --keypair "$KEYPAIR_DIR/employer.json" 2>&1 | grep "Creating token" | awk '{print $3}')

if [ -z "$MINT" ]; then
  echo "    Failed to parse mint address. Check spl-token output above."
  echo "    You may need to run: spl-token create-token --decimals 6 --keypair $KEYPAIR_DIR/employer.json"
  exit 1
fi

echo "==> Mint address: $MINT"

# Create token account + mint 100,000 tokens to employer
echo "==> Creating employer token account and minting 100,000 tokens..."
spl-token create-account "$MINT" --keypair "$KEYPAIR_DIR/employer.json"
spl-token mint "$MINT" 100000 --keypair "$KEYPAIR_DIR/employer.json"

# Airdrop SOL to employees (they need SOL for registration + claim tx fees)
for i in 1 2 3; do
  EMP=$(solana-keygen pubkey "$KEYPAIR_DIR/employee${i}.json")
  echo "==> Airdropping 1 SOL to employee${i} ($EMP)..."
  solana airdrop 1 "$EMP" || echo "    (airdrop may fail on rate limit, retry manually)"
  sleep 2
done

# Write .env.local
echo "==> Writing .env.local..."
cat > apps/web/.env.local << EOF
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_RPC_WS_URL=wss://api.devnet.solana.com
NEXT_PUBLIC_UMBRA_INDEXER=https://utxo-indexer.api-devnet.umbraprivacy.com
NEXT_PUBLIC_UMBRA_RELAYER=https://relayer.api-devnet.umbraprivacy.com
NEXT_PUBLIC_PAYROLL_MINT=$MINT
NEXT_PUBLIC_NETWORK=devnet
EOF

echo ""
echo "============================================"
echo "  Stipend Devnet Setup Complete!"
echo "============================================"
echo "  Employer:  $EMPLOYER"
echo "  Mint:      $MINT"
echo "  Employees: $(solana-keygen pubkey $KEYPAIR_DIR/employee1.json)"
echo "             $(solana-keygen pubkey $KEYPAIR_DIR/employee2.json)"
echo "             $(solana-keygen pubkey $KEYPAIR_DIR/employee3.json)"
echo ""
echo "  Next: cd apps/web && pnpm dev"
echo "============================================"
