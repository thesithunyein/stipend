import {
  getMasterViewingKeyDeriver,
  getMintViewingKeyDeriver,
  getYearlyViewingKeyDeriver,
  getMonthlyViewingKeyDeriver,
  getDailyViewingKeyDeriver,
} from "@umbra-privacy/sdk";
import type { UmbraClient } from "./umbra-client";
import { PAYROLL_MINT, UMBRA_INDEXER } from "./constants";
import type { PayrollManifest } from "./payroll";

// ── Viewing Key Derivation ───────────────────────────────────────────

export type ViewingKeyScope = "master" | "mint" | "yearly" | "monthly" | "daily";

export interface ViewingKeyRequest {
  scope: ViewingKeyScope;
  mint?: string;
  year?: number;
  month?: number;
  day?: number;
}

export interface ViewingKeyExport {
  scope: ViewingKeyScope;
  granterAddress: string;
  mint: string;
  period: string;
  viewingKey: string; // hex
}

export async function deriveViewingKey(
  client: UmbraClient,
  request: ViewingKeyRequest
): Promise<ViewingKeyExport> {
  const mint = request.mint || PAYROLL_MINT;
  let vk: bigint;
  let period = "";

  switch (request.scope) {
    case "master": {
      const derive = getMasterViewingKeyDeriver({ client });
      vk = await derive();
      period = "all-time";
      break;
    }
    case "mint": {
      const derive = getMintViewingKeyDeriver({ client });
      vk = await derive(mint as any);
      period = `mint:${mint.slice(0, 8)}`;
      break;
    }
    case "yearly": {
      if (!request.year) throw new Error("Year required for yearly scope");
      const derive = getYearlyViewingKeyDeriver({ client });
      vk = await derive(mint as any, BigInt(request.year) as any);
      period = `${request.year}`;
      break;
    }
    case "monthly": {
      if (!request.year || !request.month)
        throw new Error("Year and month required for monthly scope");
      const derive = getMonthlyViewingKeyDeriver({ client });
      vk = await derive(
        mint as any,
        BigInt(request.year) as any,
        BigInt(request.month) as any
      );
      period = `${request.year}-${String(request.month).padStart(2, "0")}`;
      break;
    }
    case "daily": {
      if (!request.year || !request.month || !request.day)
        throw new Error("Year, month, and day required for daily scope");
      const derive = getDailyViewingKeyDeriver({ client });
      vk = await derive(
        mint as any,
        BigInt(request.year) as any,
        BigInt(request.month) as any,
        BigInt(request.day) as any
      );
      period = `${request.year}-${String(request.month).padStart(2, "0")}-${String(request.day).padStart(2, "0")}`;
      break;
    }
    default:
      throw new Error(`Unknown scope: ${request.scope}`);
  }

  const hex = "0x" + vk.toString(16).padStart(64, "0");

  return {
    scope: request.scope,
    granterAddress: client.signer.address as string,
    mint,
    period,
    viewingKey: hex,
  };
}

// ── Audit Package (for sharing with auditors) ────────────────────────

export interface AuditPackage {
  manifest: PayrollManifest;
  viewingKey: ViewingKeyExport;
  exportedAt: number;
}

export function createAuditPackage(
  manifest: PayrollManifest,
  viewingKey: ViewingKeyExport
): AuditPackage {
  return {
    manifest,
    viewingKey,
    exportedAt: Date.now(),
  };
}

// ── Auditor: verify manifest against on-chain data ───────────────────

export interface AuditVerification {
  entry: PayrollManifest["entries"][number];
  onChainVerified: boolean;
  explorerUrl: string;
}

export async function verifyManifest(
  manifest: PayrollManifest
): Promise<AuditVerification[]> {
  const results: AuditVerification[] = [];

  for (const entry of manifest.entries) {
    let onChainVerified = false;

    if (entry.txSignature && entry.txSignature.length > 20) {
      try {
        const rpcUrl =
          process.env.NEXT_PUBLIC_RPC_URL || "https://api.devnet.solana.com";
        const res = await fetch(rpcUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "getTransaction",
            params: [
              entry.txSignature,
              { encoding: "json", maxSupportedTransactionVersion: 0 },
            ],
          }),
        });
        const data = await res.json();
        onChainVerified = data.result !== null;
      } catch {
        onChainVerified = false;
      }
    }

    const cluster =
      (process.env.NEXT_PUBLIC_NETWORK || "devnet") === "mainnet"
        ? ""
        : "?cluster=devnet";

    results.push({
      entry,
      onChainVerified,
      explorerUrl: `https://solscan.io/tx/${entry.txSignature}${cluster}`,
    });
  }

  return results;
}

// ── CSV Export ────────────────────────────────────────────────────────

export function generateCSV(
  verifications: AuditVerification[],
  manifest: PayrollManifest
): string {
  const header = "Payroll Run,Date,Employee,Address,Amount,TX Signature,On-chain Verified\n";
  const rows = verifications.map((v) => {
    const date = new Date(manifest.timestamp).toISOString();
    const amount = (Number(v.entry.amount) / 1e6).toFixed(2);
    return `${manifest.runId},${date},${v.entry.name},${v.entry.address},${amount},${v.entry.txSignature},${v.onChainVerified}`;
  });
  return header + rows.join("\n");
}
