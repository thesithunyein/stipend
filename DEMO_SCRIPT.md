# Stipend — Demo Script

> **Duration**: ~4 minutes  
> **Environment**: GitHub Codespaces on devnet  
> **Wallets needed**: Phantom (or any Wallet Standard wallet)

---

## Setup (before recording)

1. Open Codespaces, run `sh scripts/setup-devnet.sh`
2. Import the employer keypair (`keys/employer.json`) into Phantom
3. Import at least one employee keypair (`keys/employee1.json`) into a second browser profile
4. Run `pnpm dev` and open `localhost:3000`

---

## Scene 1: Landing Page (30s)

- Show the landing page with the hero and feature cards
- Narrate: *"Stipend is private payroll on Solana, built with the Umbra SDK. Employers pay employees through the mixer — amounts are encrypted, transfers are unlinkable, and compliance is built in."*
- Click through the three role cards

---

## Scene 2: Employer Dashboard (90s)

1. **Connect wallet** (Phantom with employer keypair)
2. **Register** with Umbra — click "Register with Umbra", approve the wallet prompts
3. **Add employees**:
   - Alice — paste employee1 address — $1,000
   - Bob — paste employee2 address — $2,500
   - Carol — paste employee3 address — $750
4. **Run Payroll** — click the button, watch the progress log
   - Narrate: *"Each payment creates a receiver-claimable UTXO through Umbra's mixer. The ZK proof is generated in-browser."*
5. **Export Viewing Key** — select "Monthly", current year/month, click Export
   - Narrate: *"The employer exports a scoped monthly viewing key and payroll manifest as an audit package."*

---

## Scene 3: Employee Dashboard (60s)

1. **Switch browser profile** to employee wallet
2. **Connect wallet** → **Register with Umbra**
3. **Scan for Payments** — shows the claimable UTXO(s)
   - Narrate: *"The employee scans the mixer for incoming payments. No on-chain link to the employer."*
4. **Claim** — click "Claim All"
   - Narrate: *"Claiming uses a ZK proof and the Umbra relayer to move funds into the encrypted balance."*
5. **Withdraw** — enter amount, click Withdraw
   - Narrate: *"Finally, the employee can withdraw to their public wallet when needed."*

---

## Scene 4: Auditor Dashboard (60s)

1. Navigate to `/auditor`
2. **Upload** the audit package JSON (downloaded in Scene 2)
3. Show the **manifest preview** — employer address, date, employee count, total
4. Click **Verify All Transactions**
   - Narrate: *"The auditor verifies each transaction on-chain via RPC. The viewing key proves the employer's authority over these mixer pool entries."*
5. Show the **verification report** — green checkmarks for verified entries
6. **Export CSV** — download the compliance report

---

## Closing (30s)

- Navigate back to landing page
- Narrate: *"Stipend demonstrates how Umbra's privacy primitives enable real financial workflows — confidential payroll with built-in compliance. Every transaction you saw was a real UTXO on Solana devnet. No mocks."*
- Show the GitHub repo link

---

## Key Talking Points

- **Real SDK usage**: Every function call is a real Umbra SDK call — `getPublicBalanceToReceiverClaimableUtxoCreatorFunction`, `getClaimableUtxoScannerFunction`, viewing key derivers
- **ZK proofs in browser**: `@umbra-privacy/web-zk-prover` generates proofs client-side
- **Compliance by design**: Viewing keys are hierarchical (master → mint → yearly → monthly → daily), giving employers fine-grained control over what auditors see
- **Wallet Standard**: Works with Phantom, Backpack, Solflare out of the box
- **Production-ready architecture**: Monorepo, proper state management, beautiful UI
