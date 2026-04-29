# Umbra Devnet Issue

## Problem
Transaction simulation fails with Solana error -32002 when attempting to create UTXOs on Umbra devnet.

**Error:**
```
CreatePublicUtxoProofAccount: Failed to send transaction: Solana error #-32002
```

**Decoded error details:**
- `logs=[]` - No program logs
- `unitsConsumed=0` - No compute units used
- Transaction simulation failed before any instructions executed

**Base64 decoded error:**
```
code=-32002
accounts=null
fee=null
innerInstructions=null
loadedAccountDataSize=0
loadedAddresses=null
logs=[]
postBalances=null
postTokenBalances=null
preBalances=null
preTokenBalances=null
replacementBlockhash=null
returnData=null
unitsConsumed=0
```

## Technical Context

### SDK Version
- `@umbra-privacy/sdk`: Latest
- `@umbra-privacy/web-zk-prover`: Latest

### Code Context
The error occurs in `apps/web/src/lib/payroll.ts` when calling:
```typescript
const zkProver = getCreateReceiverClaimableUtxoFromPublicBalanceProver();
const createUtxo = getPublicBalanceToReceiverClaimableUtxoCreatorFunction(
  { client },
  { zkProver }
);
await createUtxo(...);
```

The function `getPublicBalanceToReceiverClaimableUtxoCreatorFunction` attempts to create a `CreatePublicUtxoProofAccount` instruction, but the transaction simulation fails immediately.

### Registration Status
The employer wallet is **fully registered**:
- `state === "exists"` ✅
- `isUserAccountX25519KeyRegistered === true` ✅
- `isUserCommitmentRegistered === true` ✅
- `isActiveForAnonymousUsage === true` ✅

Registration works correctly — the issue is specific to UTXO creation.

## Troubleshooting Timeline

### Attempt 1: Initial Testing
- Used public devnet RPC (`https://api.devnet.solana.com`)
- Custom SPL token mint (`HzDHzcfqZzQZVZcsSRrMQJPv4JMZ5ysGyWZoXHKAPzVB`)
- Result: -32002 error

### Attempt 2: Fix ZK Prover Names
- Fixed incorrect ZK prover function names to match SDK exports
- Changed from `getPublicBalanceToReceiverClaimableUtxoCreatorProver` to `getCreateReceiverClaimableUtxoFromPublicBalanceProver`
- Result: -32002 error persisted

### Attempt 3: Switch to Helius RPC
- Changed to Helius devnet RPC for reliability
- API key: `a6f633b9-f95b-4e8a-a9f9-752440cb80ca`
- Result: -32002 error persisted

### Attempt 4: Switch to Devnet USDC
- Changed from custom SPL mint to official devnet USDC
- Mint: `4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU`
- Airdropped 3000 USDC-Dev to employer wallet
- Result: -32002 error persisted

### Attempt 5: Add Registration Checks
- Added `getUserAccountQuerierFunction` before payroll
- Employer verified fully registered (no re-register needed)
- Result: -32002 error persisted

### Attempt 6: Test with SOL (Native Token)
- Removed mint requirement to test with SOL instead of SPL tokens
- Commented out `PAYROLL_MINT` validation
- Result: -32002 error persisted

### Attempt 7: Verify Program ID
- Confirmed using correct devnet program ID: `DSuKkyqGVGgo4QtPABfxKJKygUDACbUhirnuv63mEpAJ`
- Matches Umbra SDK documentation
- Result: -32002 error persisted

## Conclusion
The Umbra devnet program appears to have a fundamental issue with UTXO creation. The error:
- Occurs before any instructions execute (0 units consumed)
- Persists across different RPC providers (public, Helius)
- Persists across different tokens (custom SPL, devnet USDC, SOL)
- Persists despite full registration
- Shows empty logs, indicating program-level failure

This suggests either:
1. The Umbra devnet program is down or has a bug
2. The proof account is in a bad state from previous failed attempts
3. There's a fundamental incompatibility with the current SDK version

## Support Contact
Contacted Umbra support on X (@UmbraPrivacy) on Apr 29, 2026 at 11:42 PM UTC+06:30 with:
- Description of the error
- Full troubleshooting timeline
- Request for devnet status or workaround
- Link to repo: https://github.com/thesithunyein/stipend

## Environment
- Network: Solana Devnet
- RPC: Helius (https://devnet.helius-rpc.com/?api-key=a6f633b9-f95b-4e8a-a9f9-752440cb80ca)
- RPC WS: wss://devnet.helius-rpc.com/?api-key=a6f633b9-f95b-4e8a-a9f9-752440cb80ca
- Umbra Indexer: https://utxo-indexer.api-devnet.umbraprivacy.com
- Umbra Relayer: https://relayer.api-devnet.umbraprivacy.com
- Umbra Program ID: DSuKkyqGVGgo4QtPABfxKJKygUDACbUhirnuv63mEpAJ
- Employer Wallet: D3u8qWpun6GePtuCWZuzaotCaJ2NaBhfp5Pr7HS6KfaR
- Deployed App: https://stipend-ten.vercel.app
