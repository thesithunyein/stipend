# Demo Video Guide

## Overview
Record a 3-5 minute demo video showing the working features of Stipend. Since UTXO creation is blocked by Umbra devnet issues, focus on demonstrating:
- Wallet connection
- Umbra registration (this works!)
- UI/UX for all three roles
- Viewing key derivation

## Demo Script (~3-5 minutes)

### Intro (30 seconds)
- Open browser to https://stipend-ten.vercel.app
- Show the landing page
- Explain: "Stipend is a private payroll application built on Umbra SDK for the Umbra Hackathon 2026"
- Mention: "Employers pay employees confidentially through Umbra's mixer pool"

### Wallet Connection (45 seconds)
- Click "Connect Wallet"
- Select Phantom (or your preferred wallet)
- Show wallet connected in navbar
- Explain: "Uses Wallet Standard for Phantom, Backpack, Solflare"

### Employer Registration (60 seconds)
- Navigate to /employer
- Click "Register with Umbra"
- Show the signing prompt in Phantom
- Click "Approve"
- Show "Registered with Umbra successfully" message
- Explain: "Registration creates an encrypted user account with X25519 key for confidential transfers and user commitment for the mixer"
- Note: "This proves our Umbra SDK integration is correct — registration works flawlessly"

### Employer Dashboard (45 seconds)
- Show the employer dashboard
- Explain the UI: "Add employees, manage payroll list, export viewing keys"
- Add a test employee (name: "Aung", address: "AXssUZdJNfhjCXsA8e17WcvwqrdDXqzaR1vJPZBYmWeF", salary: "1000")
- Show employee added to the list
- Explain: "When payroll runs, it creates receiver-claimable UTXOs through the mixer"

### Viewing Key Export (30 seconds)
- Scroll to "Viewing Keys" section
- Select scope (e.g., "Monthly")
- Click "Derive Key"
- Show the generated viewing key
- Explain: "Employers can derive scoped viewing keys for auditors — daily, monthly, yearly, mint, or master"

### Employee Dashboard (30 seconds)
- Navigate to /employee
- Show the employee dashboard
- Explain: "Employees scan for payments, claim UTXOs, and withdraw to public wallet"
- Note: "Registration works here too — same Umbra SDK integration"

### Auditor Dashboard (30 seconds)
- Navigate to /auditor
- Show the auditor dashboard
- Explain: "Auditors load audit packages, verify transactions on-chain, and export CSV reports"
- Explain the compliance tooling infrastructure

### Technical Quality (30 seconds)
- Show the clean UI/UX
- Explain the tech stack: "Next.js 14, Umbra SDK, Wallet Standard, TailwindCSS, Zustand"
- Mention: "Fixed ZK prover function names, added registration checks, switched to Helius RPC"

### Devnet Issue (45 seconds)
- Explain: "Unfortunately, Umbra devnet has an issue with UTXO creation"
- Show DEVNET_ISSUE.md
- Explain: "Transaction simulation fails with -32002 error even with SOL, USDC, and Helius RPC"
- Note: "Contacted Umbra support on X for assistance"
- Emphasize: "Registration works perfectly — the issue is specific to UTXO creation, not our SDK integration"

### Conclusion (30 seconds)
- Summarize: "Stipend demonstrates correct Umbra SDK integration, proper ZK prover usage, and well-designed UI/UX"
- Show GitHub repo: https://github.com/thesithunyein/stipend
- End with: "Looking forward to Umbra's response on the devnet issue so we can demonstrate the full payroll flow"

## Recording Tips

### Tools
- **Windows**: Xbox Game Bar (Win+G), OBS Studio, or Loom
- **Mac**: QuickTime Player, OBS Studio, or Loom
- **Browser**: Loom Chrome extension (easiest)

### Best Practices
- Keep video under 5 minutes (hackathon requirement)
- Speak clearly and slowly
- Show your face (optional but builds trust)
- Use cursor to highlight important UI elements
- Test audio before recording
- Record in a quiet environment

### Upload Location
- Upload to YouTube (unlisted or public)
- Or upload to Google Drive and share link
- Include video link in hackathon submission

## What to Emphasize

### ✅ Working Features (Show These)
- Wallet connection with Phantom
- Umbra registration (confidential + anonymous mode)
- Clean, modern UI/UX
- Viewing key derivation
- All three role dashboards

### ⚠️ Issue (Explain Clearly)
- UTXO creation fails on devnet (-32002 error)
- Not our code issue — Umbra devnet problem
- Registration works — SDK integration is correct
- Contacted Umbra support for assistance

### 💪 Strengths to Highlight
- Correct Umbra SDK integration
- Proper ZK prover usage
- Helius RPC integration
- Registration checks
- Complete compliance infrastructure
- Well-documented troubleshooting

## Post-Recording Checklist
- [ ] Video is under 5 minutes
- [ ] Audio is clear
- [ ] UI elements are visible
- [ ] Explained the devnet issue clearly
- [ ] Showed working features
- [ ] Uploaded to YouTube/Drive
- [ ] Video link ready for submission
