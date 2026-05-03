# Stipend

> **Confidential payroll on Solana. Paid in full, public to none.**

Stipend is a production-grade private payroll dApp built on the [Umbra Privacy SDK](https://sdk.umbraprivacy.com). Employers pay employees through Umbra's encrypted mixer pool: amounts are confidential, sender ↔ recipient links are broken, and compliance is preserved through scoped viewing keys that employers can hand to auditors at any granularity (daily, monthly, yearly, per-mint, or master).

**Live demo:** https://stipend-ten.vercel.app
**Demo video:** _(link goes here after recording)_
**Hackathon:** Umbra SDK Hackathon 2026

---

## Why Stipend?

Public salaries are a privacy disaster — anyone can browse a Solana explorer, find a payroll wallet, and see what every employee earns. Existing privacy tools (Tornado, Light Protocol) are built for one-off transfers and don't model recurring B2B payments. Stipend solves payroll specifically:

- **Encrypted amounts on-chain** via Umbra's confidential balance + receiver-claimable UTXOs
- **Unlinkable transfers** — payments route through the Umbra mixer, so the employer's address can't be tied to any individual employee
- **Selective disclosure** — employers can derive a *monthly* viewing key for an auditor without revealing daily payment cadence or other months
- **Zero-knowledge proofs** generated entirely browser-side (no trusted server)
- **Real on-chain settlement** — no L2, no off-chain bookkeeping; every payment is a Solana transaction verifiable via Solscan

---

## Live Devnet Status

| Flow | Status |
| --- | --- |
| Wallet connection (Wallet Standard) | ✅ |
| User registration (confidential + anonymous) | ✅ |
| Payroll (batch receiver-claimable UTXO creation) | ✅ |
| Employee scan via Umbra indexer | ✅ |
| Claim into encrypted balance (ZK proof + relayer) | ✅ |
| Withdraw to public ATA | ✅ |
| Auditor on-chain verification + Solscan link | ✅ |
| CSV audit export | ✅ |

End-to-end tested on devnet with the Umbra dummy USDC mint (`4oG4sjmopf5MzvTHLE8rpVJ2uyczxfsw2K84SUTpNDx7`).

### Wallet compatibility

> **Use Solflare for Umbra transactions.** Phantom modifies transactions post-sign by injecting compute-budget instructions, which invalidates Umbra's signature check (Solana error `#7050012`). The Umbra team has acknowledged this; until Phantom ships a fix, Solflare and Backpack work flawlessly. Stipend supports any Wallet Standard wallet — the dApp itself doesn't care which.

---

## Architecture

```
stipend/
├── apps/web/                       Next.js 14 dApp (Employer / Employee / Auditor)
│   └── src/
│       ├── app/                    Routes: /, /employer, /employee, /auditor
│       ├── components/             Wallet provider, navbar, ZK loading overlay
│       └── lib/
│           ├── umbra-client.ts     getUmbraClient + createSignerFromWalletAccount
│           ├── payroll.ts          Register, runPayroll, scan, claim, withdraw
│           ├── compliance.ts       deriveViewingKey, verifyManifest, CSV export
│           ├── store.ts            Zustand stores (wallet / employer / employee)
│           └── constants.ts        Network, RPC, Umbra endpoints, mint
├── scripts/setup-devnet.sh         Optional: SPL mint + airdrop helpers
├── .devcontainer/                  GitHub Codespaces config
└── VIDEO_SCRIPT.md                 Step-by-step demo recording guide
```

### Tech Stack

- **Umbra SDK** — `@umbra-privacy/sdk` v4 + `@umbra-privacy/web-zk-prover` v2
- **Next.js 14** App Router with WASM enabled (`asyncWebAssembly`) for browser ZK proving
- **Wallet Standard** — `@wallet-standard/app`, `@wallet-standard/features`
- **Solana** — `@solana/kit` (modern web3 client), Helius RPC for devnet
- **UI** — TailwindCSS + a custom dark glass design system, Lucide icons, Sonner toasts
- **State** — Zustand (in-memory; no backend)

---

## Umbra SDK Surface Used

Stipend exercises a wide cross-section of the SDK — not just deposits, but the full receiver-claimable UTXO lifecycle plus the entire compliance key tree.

| Layer | SDK Function | Where |
| --- | --- | --- |
| Client | `getUmbraClient`, `createSignerFromWalletAccount` | `lib/umbra-client.ts` |
| Registration | `getUserRegistrationFunction` (+ `getUserRegistrationProver`) | `lib/payroll.ts` |
| Account state | `getUserAccountQuerierFunction` | `lib/payroll.ts` |
| Payroll | `getPublicBalanceToReceiverClaimableUtxoCreatorFunction` (+ `getCreateReceiverClaimableUtxoFromPublicBalanceProver`) | `lib/payroll.ts` |
| Scan | `getClaimableUtxoScannerFunction` | `lib/payroll.ts` |
| Claim | `getReceiverClaimableUtxoToEncryptedBalanceClaimerFunction` (+ `getClaimReceiverClaimableUtxoIntoEncryptedBalanceProver`) | `lib/payroll.ts` |
| Relayer | `getUmbraRelayer` (used as both `submitClaim` source and fee-payer) | `lib/payroll.ts` |
| Withdraw | `getEncryptedBalanceToPublicBalanceDirectWithdrawerFunction` | `lib/payroll.ts` |
| Compliance | `getMasterViewingKeyDeriver`, `getMintViewingKeyDeriver`, `getYearlyViewingKeyDeriver`, `getMonthlyViewingKeyDeriver`, `getDailyViewingKeyDeriver` | `lib/compliance.ts` |

No mocks, no stubs — every privacy-relevant call hits the real Umbra devnet.

---

## How It Works

### 1. Employer

1. Connect Solflare → register with Umbra (one-time; sets up X25519 + Poseidon commitment).
2. Add employees (name + Solana address + salary in token base units).
3. **Run Payroll** — for every employee:
   - Generate a `ReceiverClaimableUtxoFromPublicBalance` Groth16 proof in the browser.
   - Queue the Arcium MPC computation; wait for callback finalization.
   - Stipend extracts the finalized signature for the audit trail.
4. **Export Viewing Key** — bundle `(manifest + scoped viewing key)` into a JSON audit package and download it.

### 2. Employee

1. Connect Solflare → register with Umbra.
2. **Scan** — `getClaimableUtxoScannerFunction(0n, 0n)` walks the mixer tree from genesis using the user's master viewing key and decrypts every payment addressed to them.
3. **Claim** — generate a second ZK proof, submit through the Umbra relayer (gas-sponsored, ephemeral signer per batch); funds land in the encrypted balance.
4. **Withdraw** — call the direct withdrawer to ship tokens from the encrypted balance to the user's public ATA.

### 3. Auditor

1. Upload the JSON package — no wallet required.
2. **Verify** — for each manifest entry, RPC `getTransaction(sig)` confirms on-chain finality.
3. View tabular report with Solscan links, export CSV for compliance archives.

---

## Quick Start

### Hosted demo
1. Visit https://stipend-ten.vercel.app
2. Use **Solflare on Devnet**
3. Get devnet dUSDC from https://faucet.umbraprivacy.com
4. Follow the flow above (or watch the demo video)

### Run locally / Codespaces

```bash
# clone, then:
pnpm install

# apps/web/.env.local — see Environment Variables below
pnpm --filter web dev
# http://localhost:3000
```

The repo ships a `.devcontainer` so you can press **Code → Codespaces** on GitHub and have a clean Node 22 + pnpm environment in 30 seconds.

---

## Environment Variables

Copy `apps/web/.env.example` → `apps/web/.env.local`:

| Variable | Example | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_RPC_URL` | `https://devnet.helius-rpc.com/?api-key=...` | Helius recommended; default RPC works but is rate-limited |
| `NEXT_PUBLIC_RPC_WS_URL` | `wss://devnet.helius-rpc.com/?api-key=...` | Required for computation monitoring |
| `NEXT_PUBLIC_UMBRA_INDEXER` | `https://utxo-indexer.api-devnet.umbraprivacy.com` | Devnet UTXO indexer |
| `NEXT_PUBLIC_UMBRA_RELAYER` | `https://relayer.api-devnet.umbraprivacy.com` | Sponsors claim transactions |
| `NEXT_PUBLIC_PAYROLL_MINT` | `4oG4sjmopf5MzvTHLE8rpVJ2uyczxfsw2K84SUTpNDx7` | Umbra dummy USDC on devnet |
| `NEXT_PUBLIC_NETWORK` | `devnet` | Or `mainnet` |

---

## Implementation Highlights

- **Browser-side ZK proving with WASM** — `next.config.mjs` enables `asyncWebAssembly` so `@umbra-privacy/web-zk-prover` loads its Groth16 circuits directly in the user's browser. No proving server.
- **Correct claim wiring** — Umbra's `getReceiverClaimableUtxoToEncryptedBalanceClaimerFunction` reads `deps.relayer.{submitClaim, pollClaimStatus, getRelayerAddress}` plus a required `deps.fetchBatchMerkleProof`. Stipend pulls the latter off the `IUmbraClient` so the SDK never has to construct merkle proof fetchers from scratch.
- **Scoped audit packages** — `compliance.ts` bundles a `PayrollManifest` (employer-signed payroll record) with a `ViewingKeyExport` (the actual derived key + its period/scope). The auditor page accepts this single JSON file and verifies signatures on-chain.
- **Real signature extraction** — Umbra returns a multi-step result (`createProofAccountSignature`, `queueSignature`, `callbackSignature`); Stipend prefers the finalized callback signature for explorer links so audit reports show real, queryable transactions.
- **No global state leakage** — wallet, employer, and employee Zustand stores are isolated; switching roles never carries auth state across.

---

## Devnet Reference

| | |
| --- | --- |
| Umbra program | `DSuKkyqGVGgo4QtPABfxKJKygUDACbUhirnuv63mEpAJ` |
| Indexer | https://utxo-indexer.api-devnet.umbraprivacy.com |
| Relayer | https://relayer.api-devnet.umbraprivacy.com |
| Dummy USDC mint | `4oG4sjmopf5MzvTHLE8rpVJ2uyczxfsw2K84SUTpNDx7` |
| Faucet | https://faucet.umbraprivacy.com |

---

## Roadmap

- Mainnet launch (waiting on Umbra mainnet program ID + audited mints).
- Persisted manifests (zustand + IndexedDB with BigInt serialization) so employers can re-export historical audit packages.
- Multisig employer mode (Squads integration) for organizations.
- Recurring payroll scheduler with on-chain trigger account.
- Optional fiat off-ramp via Sphere / Bridge for stablecoin → bank.

---

## Credits

- **Umbra Privacy** for the SDK, indexer, relayer, devnet program, and active Telegram support during the hackathon.
- **Helius** for reliable devnet RPC.

## License

MIT
