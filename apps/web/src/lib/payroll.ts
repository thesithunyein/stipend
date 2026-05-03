import {
  getUserRegistrationFunction,
  getUserAccountQuerierFunction,
  getPublicBalanceToReceiverClaimableUtxoCreatorFunction,
  getClaimableUtxoScannerFunction,
  getReceiverClaimableUtxoToEncryptedBalanceClaimerFunction,
  getEncryptedBalanceToPublicBalanceDirectWithdrawerFunction,
  getUmbraRelayer,
} from "@umbra-privacy/sdk";
import {
  getUserRegistrationProver,
  getCreateReceiverClaimableUtxoFromPublicBalanceProver,
  getClaimReceiverClaimableUtxoIntoEncryptedBalanceProver,
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

  // Check if employer is fully registered
  onProgress?.("Checking registration status...");
  const query = getUserAccountQuerierFunction({ client });
  const accountState = await query(client.signer.address);
  const isFullyRegistered =
    accountState.state === "exists" &&
    accountState.data.isUserAccountX25519KeyRegistered &&
    accountState.data.isUserCommitmentRegistered;

  if (!isFullyRegistered) {
    onProgress?.("Employer not fully registered, re-registering...");
    await registerUser(client);
    onProgress?.("Registration complete");
  }

  const zkProver = getCreateReceiverClaimableUtxoFromPublicBalanceProver();
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

      // Verify receiver is registered (required for receiver-claimable UTXOs)
      const receiverState = await query(emp.address as any);
      if (receiverState.state !== "exists") {
        throw new Error(
          `Employee ${emp.name} is not registered with Umbra. They must register first.`
        );
      }

      const result = await createUtxo({
        destinationAddress: emp.address as any,
        mint: mint as any,
        amount: emp.salary as any,
      });

      // Umbra returns CreateUtxoFromPublicBalanceResult with multiple sigs;
      // prefer the finalized MPC callback, then queue, then proof account create.
      const r = result as any;
      const txSig: string =
        (typeof r === "string" && r) ||
        r?.callbackSignature ||
        r?.queueSignature ||
        r?.createProofAccountSignature ||
        r?.signatures?.[0] ||
        "";

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
      console.error("[Stipend] payroll error:", err?.message, err);
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
  // Check registration first
  const query = getUserAccountQuerierFunction({ client });
  const accountState = await query(client.signer.address);
  const isFullyRegistered =
    accountState.state === "exists" &&
    accountState.data.isUserAccountX25519KeyRegistered &&
    accountState.data.isUserCommitmentRegistered;

  if (!isFullyRegistered) {
    await registerUser(client);
  }

  const scan = getClaimableUtxoScannerFunction({ client });
  const result = await scan(0n as any, 0n as any);

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
  // Check registration first
  const query = getUserAccountQuerierFunction({ client });
  const accountState = await query(client.signer.address);
  const isFullyRegistered =
    accountState.state === "exists" &&
    accountState.data.isUserAccountX25519KeyRegistered &&
    accountState.data.isUserCommitmentRegistered;

  if (!isFullyRegistered) {
    await registerUser(client);
  }

  const zkProver = getClaimReceiverClaimableUtxoIntoEncryptedBalanceProver();
  const relayer = getUmbraRelayer({ apiEndpoint: UMBRA_RELAYER });

  // SDK impl reads deps.relayer.{submitClaim,pollClaimStatus,getRelayerAddress}
  // and deps.fetchBatchMerkleProof (no default fallback) — pull from client.
  const claim = getReceiverClaimableUtxoToEncryptedBalanceClaimerFunction(
    { client },
    {
      zkProver,
      relayer,
      fetchBatchMerkleProof: (client as any).fetchBatchMerkleProof,
    } as any
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

  // Check registration first
  const query = getUserAccountQuerierFunction({ client });
  const accountState = await query(client.signer.address);
  const isFullyRegistered =
    accountState.state === "exists" &&
    accountState.data.isUserAccountX25519KeyRegistered &&
    accountState.data.isUserCommitmentRegistered;

  if (!isFullyRegistered) {
    await registerUser(client);
  }

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
