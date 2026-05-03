# Stipend — Demo Video Script

**Target length:** 3–4 minutes
**Tools:** Solflare wallet (Phantom is incompatible — see note), Solflare on Devnet, devnet dUSDC from `https://faucet.umbraprivacy.com`

---

## Pre-recording checklist

1. Solflare on **Devnet**, employer wallet has SOL + dUSDC, employee wallet has SOL
2. Both wallets registered with Umbra (do this off-camera or skip showing it)
3. Open https://stipend-ten.vercel.app — clean browser tab, hide bookmarks
4. Have employee wallet address copied: `AXssUZdJNfhjCXsA8e17WcvwqrdDXqzaR1vJPZBYmWeF`
5. Have devnet Solscan ready in another tab

---

## Step 1 — Intro (0:00–0:25)

**Show:** Landing page at `/`

> "Hi, I'm Sithu. This is **Stipend** — confidential payroll on Solana, built with the Umbra Privacy SDK. Employers pay salaries that are encrypted and unlinkable on-chain, while auditors keep full compliance access via scoped viewing keys. Everything runs live on Solana devnet right now. Let me show you."

---

## Step 2 — Connect employer wallet (0:25–0:45)

**Show:** Click **Connect Wallet** in navbar → pick **Solflare** → approve.

> "I'm connecting Solflare here. Stipend uses Wallet Standard, so it works with Solflare, Backpack, and any other compliant wallet."

---

## Step 3 — Employer dashboard: add employee + run payroll (0:45–1:40)

**Show:** Navigate to **Employer**.

> "This is the employer dashboard. I'll add an employee — paste their devnet address, name them 'John', salary 1 USDC."

**Action:** Add employee → click **Run Payroll** → approve Solflare signature(s).

> "Behind the scenes, Stipend is calling Umbra's `getPublicBalanceToReceiverClaimableUtxoCreatorFunction` — it generates a Groth16 ZK proof in the browser via the web-zk-prover, queues the Arcium MPC computation, and submits the transaction. The amount and the recipient's identity inside the mixer pool are encrypted."

**Show:** Success toast + new entry in Recent Runs.

---

## Step 4 — Export Viewing Key (1:40–2:00)

**Show:** Scroll to **Viewing Keys** section → select **Monthly** scope → click **Export Viewing Key**.

> "Now I'll derive a monthly viewing key — this is the audit package an employer hands to a regulator. Stipend supports five scopes: master, mint, yearly, monthly, and daily — so disclosure stays minimal."

**Action:** JSON file downloads.

---

## Step 5 — Employee dashboard: scan + claim + withdraw (2:00–2:50)

**Show:** Disconnect → connect employee Solflare → navigate to **Employee**.

> "Switching to the employee. I click **Scan for Payments** — this scans the Umbra mixer tree using my private viewing key."

**Action:** Click Scan → "Found 1 claimable payment" toast → 1 USDC entry appears.

> "Found it. Now I claim — this generates a second ZK proof to move the UTXO into my encrypted balance. The relayer pays gas, so my main wallet never appears as fee payer on-chain."

**Action:** Click **Claim** → approve → success toast.

> "And finally I'll withdraw 1 USDC from the encrypted balance into my public wallet."

**Action:** Enter `1` → click **Withdraw** → approve → success toast.

---

## Step 6 — Auditor dashboard (2:50–3:30)

**Show:** Navigate to **Auditor**.

> "Last piece — the auditor view. No wallet connection needed. I upload the audit package the employer just exported."

**Action:** Upload JSON → manifest preview appears → click **Verify All Transactions**.

> "Stipend pulls the transaction signatures from the manifest, verifies each one against the Solana RPC, and produces a report. One out of one verified on-chain."

**Action:** Click the Solscan icon on the row → switches to Solscan devnet.

> "And there's the actual transaction on Solscan devnet — signed by my employer wallet, interacting with the Umbra program. Real on-chain proof."

---

## Step 7 — Wrap (3:30–4:00)

**Show:** Back to landing page or GitHub repo.

> "Stipend ships a complete confidential payroll workflow on Umbra: registration, payroll, claim, withdraw, and auditor verification — all on devnet, all using the real Umbra SDK with no mocks. Repo is at github.com/thesithunyein/stipend, live demo at stipend-ten.vercel.app. Thanks for watching."

---

## Important notes for recording

- **Use Solflare, not Phantom.** Phantom modifies transactions post-sign and breaks Umbra signature verification (error #7050012). The Umbra team is aware. README documents this.
- Keep employer and employee on **separate Solflare profiles** or import both seeds into one Solflare with account switcher.
- If Umbra faucet shows cooldown, employer must wait — schedule recording around faucet availability.
- Pre-register both wallets before recording so you don't burn airtime on registration prompts.
- Speak at a moderate pace. Cursor-highlight every UI element as you mention it.
- Aim for under 4 minutes total.
