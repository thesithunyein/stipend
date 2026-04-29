# Submission Checklist

## Required
- [ ] Public GitHub repository
- [ ] Clear README with description, setup instructions, architecture
- [ ] Demo video (< 5 minutes)
- [ ] Real Umbra SDK usage (no mocks)
- [ ] Devnet deployment

## Repository
- [x] `.devcontainer/` for Codespaces
- [x] `scripts/setup-devnet.sh` for devnet setup
- [x] `.env.example` with all required variables
- [x] `README.md` with full documentation
- [x] `DEMO_SCRIPT.md` for recording guide

## Umbra SDK Integration
- [x] `getUmbraClient` with devnet config
- [x] `createSignerFromWalletAccount` for Wallet Standard
- [x] `getUserRegistrationFunction` (confidential + anonymous)
- [x] `getPublicBalanceToReceiverClaimableUtxoCreatorFunction` for payroll
- [x] `getClaimableUtxoScannerFunction` for payment scanning
- [x] `getReceiverClaimableUtxoToEncryptedBalanceClaimerFunction` for claiming
- [x] `getEncryptedBalanceToPublicBalanceDirectWithdrawerFunction` for withdrawal
- [x] `getMasterViewingKeyDeriver` / `getMintViewingKeyDeriver` / `getYearlyViewingKeyDeriver` / `getMonthlyViewingKeyDeriver` / `getDailyViewingKeyDeriver` for compliance
- [x] `getUmbraRelayer` for claim fee relay
- [x] `@umbra-privacy/web-zk-prover` for browser ZK proofs

## Web Application
- [x] Landing page with value proposition
- [x] Employer dashboard (add employees, run payroll, export viewing keys)
- [x] Employee dashboard (scan, claim, withdraw)
- [x] Auditor dashboard (load audit package, verify on-chain, export CSV)
- [x] Wallet Standard integration (Phantom, Backpack, Solflare)
- [x] Dark theme with modern UI

## Before Submitting
- [ ] Test full employer → employee → auditor flow on devnet
- [ ] Record demo video following DEMO_SCRIPT.md
- [ ] Push all code to GitHub
- [ ] Deploy frontend (Vercel recommended)
- [ ] Submit on hackathon platform
