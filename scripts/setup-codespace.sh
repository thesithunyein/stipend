#!/usr/bin/env bash
set -euo pipefail

# ── Stipend Codespace Bootstrap ──────────────────────────────────────
# Installs all dependencies for the Codespace environment:
#   1. pnpm (package manager)
#   2. Solana CLI + SPL Token CLI (for devnet setup)
#   3. Node dependencies (pnpm install)
#   4. Devnet tokens + keypairs (setup-devnet.sh)
# ─────────────────────────────────────────────────────────────────────

echo "==> Installing pnpm..."
npm i -g pnpm@9

echo "==> Installing Solana CLI (v1.18.26)..."
sh -c "$(curl -sSfL https://release.anza.xyz/v1.18.26/install)"
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"

# Persist PATH for future terminal sessions
echo 'export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"' >> "$HOME/.bashrc"

echo "==> Verifying Solana CLI..."
solana --version
spl-token --version

echo "==> Installing Node dependencies..."
pnpm install

echo "==> Running devnet setup..."
bash scripts/setup-devnet.sh

echo ""
echo "==> All done! Run: pnpm dev"
