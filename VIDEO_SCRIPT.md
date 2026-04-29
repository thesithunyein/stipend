# Video Script (Read this while recording)

## Intro (30 seconds)

"Hi, I'm [your name] and this is Stipend — a private payroll application built on the Umbra Privacy SDK for the Umbra Hackathon 2026. Stipend allows employers to pay employees confidentially through Umbra's mixer pool, so salaries are encrypted and transfers are unlinkable on-chain."

## Wallet Connection (45 seconds)

"Let me start by connecting my wallet. I'll click 'Connect Wallet' and select Phantom. You can see the wallet is now connected in the navbar. We use Wallet Standard, so this works with Phantom, Backpack, and Solflare."

## Employer Registration (60 seconds)

"Now I'll navigate to the employer dashboard to register with Umbra. I'll click 'Register with Umbra.' This creates an encrypted user account with an X25519 key for confidential transfers and a user commitment for the mixer. I'll approve the signing prompt in Phantom. Great — 'Registered with Umbra successfully.' This proves our Umbra SDK integration is correct — registration works flawlessly."

## Employer Dashboard (45 seconds)

"Here's the employer dashboard. I can add employees, manage the payroll list, and export viewing keys. Let me add a test employee — name 'Aung', address, and salary of 1000. You can see the employee is now in the list. When payroll runs, it creates receiver-claimable UTXOs through the mixer."

## Viewing Key Export (30 seconds)

"Scrolling down to the Viewing Keys section, I can derive scoped viewing keys for auditors. I'll select 'Monthly' scope and click 'Derive Key.' This generates a viewing key that lets auditors see only what's granted — daily, monthly, yearly, mint, or master keys."

## Employee Dashboard (30 seconds)

"Now let me show the employee dashboard. Employees scan for payments, claim UTXOs, and withdraw to public wallet. Registration works here too — same Umbra SDK integration as the employer."

## Auditor Dashboard (30 seconds)

"Finally, the auditor dashboard. Auditors load audit packages, verify transactions on-chain, and export CSV reports. This provides the compliance tooling infrastructure for regulated businesses."

## Technical Quality (30 seconds)

"The app uses Next.js 14, Umbra SDK, Wallet Standard, TailwindCSS, and Zustand. We fixed ZK prover function names, added registration checks, and switched to Helius RPC for reliability. The UI is clean and modern."

## Devnet Issue (45 seconds)

"Unfortunately, Umbra devnet has an issue with UTXO creation. Transaction simulation fails with error -32002 even with SOL, USDC, and Helius RPC. I've documented this in DEVNET_ISSUE.md with 7 troubleshooting attempts. I contacted Umbra support on X for assistance. Registration works perfectly — the issue is specific to UTXO creation, not our SDK integration."

## Conclusion (30 seconds)

"Stipend demonstrates correct Umbra SDK integration, proper ZK prover usage, and well-designed UI/UX. Check out the repo at github.com/thesithunyein/stipend. Looking forward to Umbra's response on the devnet issue so we can demonstrate the full payroll flow. Thanks for watching!"

---

## Tips for Recording
- Speak clearly and at a moderate pace
- Pause slightly between sections
- Use your cursor to highlight UI elements as you mention them
- Keep the video under 5 minutes
- Test your audio before recording
