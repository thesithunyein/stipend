import {
  getUserRegistrationFunction,
  getPublicBalanceToReceiverClaimableUtxoCreatorFunction,
  getClaimableUtxoScannerFunction,
  getReceiverClaimableUtxoToEncryptedBalanceClaimerFunction,
  getEncryptedBalanceToPublicBalanceDirectWithdrawerFunction,
  getUmbraRelayer,
} from "@umbra-privacy/sdk";
import {
  getUserRegistrationProver,
  getPublicBalanceToReceiverClaimableUtxoCreatorProver,
  getReceiverClaimableUtxoToEncryptedBalanceClaimerProver,
} from "@umbra-privacy/web-zk-prover";
import type { UmbraClient } from "./umbra-client";
import { UMBRA_RELAYER, PAYROLL_MINT } from "./constants";

// ── Types ────────────────────────────────────────────────────────────

export interface Employee {
  id: string;
  name: string;
  address: string;
  salary: bigint; // in token native units (6 decimals)
}

export interface PayrollRunResult {
  runId: string;
  timestamp: number;
  mint: string;
  employees: {
    address: string;
    name: string;
    amount: bigint;
    txSignature: string;
    status: "success" | "failed";
    error?: string;
  }[];
  totalPaid: bigint;
}

export interface PayrollManifest {
  runId: string;
  timestamp: number;
  employerAddress: string;
  mint: string;
  entries: {
    name: string;
    address: string;
    amount: string; // stringified bigint for JSON
    txSignature: string;
  }[];
  totalPaid: string;
}

// ── Registration ─────────────────────────────────────────────────────

export async function registerUser(client: UmbraClient) {
  const zkProver = getUserRegistrationProver();
  const register = getUserRegistrationFunction({ client }, { zkProver } as any);
  const signatures = await register({
    confidential: true,
    anonymous: true,
  });
  return signatures;
}

// ── Payroll Execution ────────────────────────────────────────────────

export async function runPayroll(
  client: UmbraClient,
  employees: Employee[],
  onProgress?: (msg: string) => void
): Promise<PayrollRunResult> {
  const mint = PAYROLL_MINT;
  if (!mint) throw new Error("NEXT_PUBLIC_PAYROLL_MINT not configured");

  const zkProver = getPublicBalanceToReceiverClaimableUtxoCreatorProver();
  const createUtxo = getPublicBalanceToReceiverClaimableUtxoCreatorFunction(
    { client },
    { zkProver }
  );

  const runId = `PR-${Date.now().toString(36).toUpperCase()}`;
  const results: PayrollRunResult["employees"] = [];
  let totalPaid = 0n;

  for (const emp of employees) {
    try {
      onProgress?.(`Paying ${emp.name} (${emp.address.slice(0, 8)}...)...`);

      const result = await createUtxo({
        destinationAddress: emp.address as any,
        mint: mint as any,
        amount: emp.salary as any,
      });

      const txSig =
        typeof result === "object" && result !== null
          ? (result as any).signatures?.[0] ||
            (result as any).queueSignature ||
            JSON.stringify(result)
          : String(result);

      results.push({
        address: emp.address,
        name: emp.name,
        amount: emp.salary,
        txSignature: txSig,
        status: "success",
      });
      totalPaid += emp.salary;

      onProgress?.(`Paid ${emp.name} successfully.`);
    } catch (err: any) {
      results.push({
        address: emp.address,
        name: emp.name,
        amount: emp.salary,
        txSignature: "",
        status: "failed",
        error: err?.message || "Unknown error",
      });
      onProgress?.(`Failed to pay ${emp.name}: ${err?.message}`);
    }
  }

  return { runId, timestamp: Date.now(), mint, employees: results, totalPaid };
}

// ── Build manifest for auditor ───────────────────────────────────────

export function buildManifest(
  runResult: PayrollRunResult,
  employerAddress: string
): PayrollManifest {
  return {
    runId: runResult.runId,
    timestamp: runResult.timestamp,
    employerAddress,
    mint: runResult.mint,
    entries: runResult.employees
      .filter((e) => e.status === "success")
      .map((e) => ({
        name: e.name,
        address: e.address,
        amount: e.amount.toString(),
        txSignature: e.txSignature,
      })),
    totalPaid: runResult.totalPaid.toString(),
  };
}

// ── Employee: scan & claim ───────────────────────────────────────────

export async function scanForPayments(client: UmbraClient) {
  const scan = getClaimableUtxoScannerFunction({ client });
  const result = await scan(0 as any, 0 as any);

  return {
    received: result.received || [],
    publicReceived: result.publicReceived || [],
    selfBurnable: result.selfBurnable || [],
    publicSelfBurnable: result.publicSelfBurnable || [],
  };
}

export async function claimPayments(
  client: UmbraClient,
  utxos: any[]
) {
  const zkProver = getReceiverClaimableUtxoToEncryptedBalanceClaimerProver();
  const relayer = getUmbraRelayer({ apiEndpoint: UMBRA_RELAYER });

  const claim = getReceiverClaimableUtxoToEncryptedBalanceClaimerFunction(
    { client },
    { zkProver, relayer } as any
  );

  const result = await claim(utxos);
  return result;
}

export async function withdrawToPublic(
  client: UmbraClient,
  amount: bigint
) {
  const mint = PAYROLL_MINT;
  if (!mint) throw new Error("NEXT_PUBLIC_PAYROLL_MINT not configured");

  const withdraw = getEncryptedBalanceToPublicBalanceDirectWithdrawerFunction({
    client,
  });

  const result = await withdraw(
    client.signer.address,
    mint as any,
    amount as any
  );

  return result;
}
