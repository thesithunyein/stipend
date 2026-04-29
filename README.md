# Stipend

**Private payroll on Solana. Paid in full, public to none.**

Stipend is a confidential payroll application built on the [Umbra Privacy SDK](https://sdk.umbraprivacy.com). Employers pay employees through Umbra's mixer pool — salaries are encrypted, transfers are unlinkable, and compliance is optional via scoped viewing keys.

> Built for the Umbra SDK Hackathon 2026.

---

## Current Status

### ✅ Working Features
- **Wallet connection** — Phantom, Backpack, Solflare via Wallet Standard
- **User registration** — Full Umbra registration (confidential + anonymous mode) works correctly
- **Employer dashboard** — Add employees, manage payroll list
- **Employee dashboard** — Wallet connection, registration UI
- **Auditor dashboard** — Audit package loading, verification UI
- **Viewing key derivation** — Master, mint, yearly, monthly, daily keys
- **UI/UX** — Modern glass design, responsive, intuitive flows
- **Helius RPC integration** — Reliable RPC endpoint for devnet

### ⚠️ Known Issue: Umbra Devnet Transaction Failure

**Problem**: UTXO creation fails with Solana error -32002 on Umbra devnet
- Error: `CreatePublicUtxoProofAccount: Failed to send transaction: Solana error #-32002`
- Transaction simulation fails with empty logs and 0 compute units consumed
- Issue persists even with: Helius RPC, devnet USDC, SOL (native token)
- Registration works correctly — the issue is specific to UTXO creation

**Troubleshooting Attempted**:
1. ✅ Fixed ZK prover function names to match SDK exports
2. ✅ Switched from public devnet RPC to Helius
3. ✅ Switched from custom SPL mint to official devnet USDC
4. ✅ Added registration checks before payroll
5. ✅ Tested with SOL (native token) instead of SPL tokens
6. ✅ Verified Umbra devnet program ID is correct

**Conclusion**: The Umbra devnet program appears to have a fundamental issue with UTXO creation. Contacted Umbra support on X (@UmbraPrivacy) for assistance. See [DEVNET_ISSUE.md](./DEVNET_ISSUE.md) for full technical details.

**Impact**: The core privacy feature (anonymous payroll via UTXO mixer) cannot be tested on devnet. However, the application demonstrates:
- Correct Umbra SDK integration (registration works)
- Proper ZK prover usage
- Well-designed UI/UX for all three roles
- Complete compliance tooling infrastructure

---

## Features

| Role | Capability |
|------|-----------|
| **Employer** | Add employees, run batch payroll (UTXO creation), export viewing keys |
| **Employee** | Scan for payments, claim UTXOs, withdraw to public wallet |
| **Auditor** | Load audit packages, verify transactions on-chain, export CSV reports |

### Privacy Guarantees (via Umbra SDK)

- **Confidential amounts** — salary values are encrypted in the shielded pool
- **Unlinkable transfers** — payments route through the mixer, breaking sender↔recipient links
- **Scoped viewing keys** — employer derives daily/monthly/yearly keys for auditors; auditors see only what's granted
- **Zero-knowledge proofs** — UTXO creation and claiming use ZK provers (browser-side)

---

## Architecture

```
stipend/
├── apps/web/              Next.js 14 dashboard (Employer / Employee / Auditor)
│   └── src/
│       ├── app/           Pages (/, /employer, /employee, /auditor)
│       ├── components/    Wallet provider, navbar, role-specific UI
│       └── lib/           Umbra client, payroll logic, compliance, stores
├── scripts/
│   └── setup-devnet.sh    Creates SPL mint, airdrops SOL, generates keypairs
├── .devcontainer/         GitHub Codespaces config
└── .env.example           Environment template
```

### Tech Stack

- **Umbra SDK** `@umbra-privacy/sdk` + `@umbra-privacy/web-zk-prover`
- **Next.js 14** App Router, server components
- **Wallet Standard** `@wallet-standard/app` (Phantom, Backpack, Solflare)
- **TailwindCSS** + custom glass design system
- **Zustand** for state management
- **Sonner** for toast notifications

---

## Quick Start (GitHub Codespaces)

1. **Create repo & open in Codespaces**
   ```bash
   # Push this repo to GitHub, then open in Codespaces
   # The devcontainer auto-installs Node 22 + pnpm
   ```

2. **Run devnet setup**
   ```bash
   sh scripts/setup-devnet.sh
   ```
   This creates a test SPL token mint, airdrops SOL, and generates employer + employee keypairs.

3. **Start the app**
   ```bash
   pnpm dev
   ```
   Open `http://localhost:3000` in the Codespaces browser.

4. **Demo the flow** — see [DEMO_SCRIPT.md](./DEMO_SCRIPT.md)

---

## Environment Variables

Copy `.env.example` to `apps/web/.env.local`:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_RPC_URL` | Solana RPC endpoint (devnet) |
| `NEXT_PUBLIC_RPC_WS_URL` | Solana WebSocket endpoint |
| `NEXT_PUBLIC_UMBRA_INDEXER` | Umbra UTXO indexer API |
| `NEXT_PUBLIC_UMBRA_RELAYER` | Umbra relayer API (pays claim tx fees) |
| `NEXT_PUBLIC_PAYROLL_MINT` | SPL token mint address |
| `NEXT_PUBLIC_NETWORK` | `devnet` or `mainnet` |

---

## How It Works

### Employer Flow
1. Connect wallet → Register with Umbra (creates EncryptedUserAccount PDA)
2. Add employees (name + Solana address + salary)
3. Click "Run Payroll" → for each employee, creates a **receiver-claimable UTXO** via the mixer
4. Download audit package (payroll manifest + scoped viewing key) for compliance

### Employee Flow
1. Connect wallet → Register with Umbra
2. "Scan for Payments" → fetches claimable UTXOs from the indexer
3. "Claim" → ZK proof + relayer claim into encrypted balance
4. "Withdraw" → move from encrypted balance to public wallet

### Auditor Flow
1. Upload/paste the audit package JSON from the employer
2. "Verify" → checks each transaction signature on-chain via RPC
3. View verification report + export CSV

---

## Umbra SDK Functions Used

| Function | Purpose |
|----------|---------|
| `getUmbraClient` | Create authenticated client with signer |
| `createSignerFromWalletAccount` | Adapt Wallet Standard wallet to Umbra signer |
| `getUserRegistrationFunction` | Register user (encrypted + anonymous) |
| `getPublicBalanceToReceiverClaimableUtxoCreatorFunction` | Create payroll UTXOs |
| `getClaimableUtxoScannerFunction` | Scan for incoming payments |
| `getReceiverClaimableUtxoToEncryptedBalanceClaimerFunction` | Claim UTXOs |
| `getEncryptedBalanceToPublicBalanceDirectWithdrawerFunction` | Withdraw to public |
| `getMasterViewingKeyDeriver` | Derive master viewing key |
| `getMintViewingKeyDeriver` | Derive mint-scoped viewing key |
| `getYearlyViewingKeyDeriver` | Derive yearly viewing key |
| `getMonthlyViewingKeyDeriver` | Derive monthly viewing key |
| `getDailyViewingKeyDeriver` | Derive daily viewing key |
| `getUmbraRelayer` | Relayer for claim transaction fees |

---

## Devnet Program IDs

- **Umbra Program**: `DSuKkyqGVGgo4QtPABfxKJKygUDACbUhirnuv63mEpAJ`
- **Indexer**: `https://utxo-indexer.api-devnet.umbraprivacy.com`
- **Relayer**: `https://relayer.api-devnet.umbraprivacy.com`

---

## License

MIT
