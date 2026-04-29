export const NETWORK = (process.env.NEXT_PUBLIC_NETWORK || "devnet") as
  | "devnet"
  | "mainnet";

export const RPC_URL =
  process.env.NEXT_PUBLIC_RPC_URL || "https://api.devnet.solana.com";

export const RPC_WS_URL =
  process.env.NEXT_PUBLIC_RPC_WS_URL || "wss://api.devnet.solana.com";

export const UMBRA_INDEXER =
  process.env.NEXT_PUBLIC_UMBRA_INDEXER ||
  "https://utxo-indexer.api-devnet.umbraprivacy.com";

export const UMBRA_RELAYER =
  process.env.NEXT_PUBLIC_UMBRA_RELAYER ||
  "https://relayer.api-devnet.umbraprivacy.com";

export const PAYROLL_MINT = process.env.NEXT_PUBLIC_PAYROLL_MINT || "";

export const UMBRA_PROGRAM_ID =
  NETWORK === "mainnet"
    ? "UMBRAD2ishebJTcgCLkTkNUx1v3GyoAgpTRPeWoLykh"
    : "DSuKkyqGVGgo4QtPABfxKJKygUDACbUhirnuv63mEpAJ";
