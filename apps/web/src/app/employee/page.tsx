"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import {
  Search,
  Download,
  ArrowDownToLine,
  Loader2,
  Wallet,
  ShieldCheck,
  CheckCircle2,
  Inbox,
} from "lucide-react";
import { useWalletStore, useEmployeeStore } from "@/lib/store";
import {
  registerUser,
  scanForPayments,
  claimPayments,
  withdrawToPublic,
} from "@/lib/payroll";
import { ZkLoadingOverlay } from "@/components/zk-loading-overlay";

export default function EmployeePage() {
  const { umbraClient, account } = useWalletStore();
  const store = useEmployeeStore();

  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [claimedCount, setClaimedCount] = useState(0);

  // ── Register ─────────────────────────────────────────────────────

  const handleRegister = useCallback(async () => {
    if (!umbraClient) return toast.error("Connect wallet first");
    setIsRegistering(true);
    try {
      await registerUser(umbraClient);
      setIsRegistered(true);
      toast.success("Registered with Umbra!");
    } catch (err: any) {
      toast.error(`Registration failed: ${err?.message}`);
    } finally {
      setIsRegistering(false);
    }
  }, [umbraClient]);

  // ── Scan ─────────────────────────────────────────────────────────

  const handleScan = useCallback(async () => {
    if (!umbraClient) return toast.error("Connect wallet first");
    store.setScanning(true);
    try {
      const result = await scanForPayments(umbraClient);
      const allUtxos = [
        ...result.received,
        ...result.publicReceived,
      ];
      store.setClaimableUtxos(allUtxos);
      toast.success(`Found ${allUtxos.length} claimable payment(s)`);
    } catch (err: any) {
      toast.error(`Scan failed: ${err?.message}`);
    } finally {
      store.setScanning(false);
    }
  }, [umbraClient, store]);

  // ── Claim ────────────────────────────────────────────────────────

  const handleClaim = useCallback(async () => {
    if (!umbraClient) return toast.error("Connect wallet first");
    if (store.claimableUtxos.length === 0)
      return toast.error("No UTXOs to claim");

    store.setClaiming(true);
    try {
      const result = await claimPayments(umbraClient, store.claimableUtxos);
      setClaimedCount((c) => c + store.claimableUtxos.length);
      store.setClaimableUtxos([]);
      toast.success("Payments claimed into encrypted balance!");
    } catch (err: any) {
      toast.error(`Claim failed: ${err?.message}`);
    } finally {
      store.setClaiming(false);
    }
  }, [umbraClient, store]);

  // ── Withdraw ─────────────────────────────────────────────────────

  const handleWithdraw = useCallback(async () => {
    if (!umbraClient) return toast.error("Connect wallet first");
    if (!withdrawAmount) return toast.error("Enter amount");

    setIsWithdrawing(true);
    try {
      const amount = BigInt(Math.round(parseFloat(withdrawAmount) * 1e6));
      await withdrawToPublic(umbraClient, amount);
      toast.success("Withdrawn to public wallet!");
      setWithdrawAmount("");
    } catch (err: any) {
      toast.error(`Withdraw failed: ${err?.message}`);
    } finally {
      setIsWithdrawing(false);
    }
  }, [umbraClient, withdrawAmount]);

  // ── Render ───────────────────────────────────────────────────────

  if (!account) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="glass-card max-w-md w-full text-center space-y-4">
          <Wallet className="w-12 h-12 text-[#6B6F76] mx-auto" />
          <h2 className="text-xl font-semibold text-[#F5F5F5]">Employee Dashboard</h2>
          <p className="text-[#6B6F76]">
            Connect your wallet to receive and claim payments.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <ZkLoadingOverlay
        isVisible={store.isClaiming}
        label="Claiming payments — generating ZK proofs"
      />
      <ZkLoadingOverlay
        isVisible={isWithdrawing}
        label="Withdrawing — generating ZK proof"
      />
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-[#F5F5F5] flex items-center gap-2">
            <Wallet className="w-5 h-5 text-[#6B6F76]" />
            Employee Dashboard
          </h1>
          <p className="text-[#6B6F76] text-sm mt-1">
            Scan, claim, and withdraw your private payments
          </p>
        </div>

        {!isRegistered && (
          <button
            onClick={handleRegister}
            disabled={isRegistering}
            className="btn-primary flex items-center gap-2"
          >
            {isRegistering ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ShieldCheck className="w-4 h-4" />
            )}
            {isRegistering ? "Registering..." : "Register with Umbra"}
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card text-center">
          <div className="text-2xl font-semibold text-[#F5F5F5]">
            {store.claimableUtxos.length}
          </div>
          <div className="text-xs text-[#6B6F76] mt-1">Pending Payments</div>
        </div>
        <div className="glass-card text-center">
          <div className="text-2xl font-semibold text-[#B5B5B5]">
            {claimedCount}
          </div>
          <div className="text-xs text-[#6B6F76] mt-1">Claimed</div>
        </div>
        <div className="glass-card text-center">
          <div className="text-[#B5B5B5]">
            <ShieldCheck className="w-7 h-7 mx-auto" />
          </div>
          <div className="text-xs text-[#6B6F76] mt-1">Encrypted Balance</div>
        </div>
      </div>

      {/* Scan & Claim */}
      <div className="glass-card space-y-4">
        <h3 className="text-sm font-medium text-[#F5F5F5]">Incoming Payments</h3>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleScan}
            disabled={store.isScanning}
            className="btn-primary flex items-center justify-center gap-2 flex-1"
          >
            {store.isScanning ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            {store.isScanning ? "Scanning..." : "Scan for Payments"}
          </button>

          {store.claimableUtxos.length > 0 && (
            <button
              onClick={handleClaim}
              disabled={store.isClaiming}
              className="btn-secondary flex items-center justify-center gap-2 flex-1"
            >
              {store.isClaiming ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowDownToLine className="w-4 h-4" />
              )}
              {store.isClaiming
                ? "Claiming..."
                : `Claim ${store.claimableUtxos.length} Payment(s)`}
            </button>
          )}
        </div>

        {/* UTXO List */}
        {store.claimableUtxos.length > 0 ? (
          <div className="space-y-2">
            {store.claimableUtxos.map((utxo, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg bg-[#111113] border border-[#1E1E20]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#1E1E20] flex items-center justify-center">
                    <Inbox className="w-4 h-4 text-[#6B6F76]" />
                  </div>
                  <div>
                    <div className="text-sm text-[#F5F5F5]">
                      Payment #{i + 1}
                    </div>
                    <div className="text-xs text-[#6B6F76] font-mono">
                      {utxo.amount
                        ? `${(Number(utxo.amount / 1000000n)).toFixed(2)} tokens`
                        : "Encrypted amount"}
                    </div>
                  </div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-[#6B6F76]" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-[#2A2A2E]">
            <Inbox className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">
              No pending payments. Hit &ldquo;Scan&rdquo; to check.
            </p>
          </div>
        )}
      </div>

      {/* Withdraw */}
      <div className="glass-card space-y-4">
        <h3 className="text-sm font-medium text-[#F5F5F5] flex items-center gap-2">
          <Download className="w-4 h-4 text-[#6B6F76]" />
          Withdraw to Public Wallet
        </h3>
        <p className="text-[#6B6F76] text-sm">
          Move tokens from your encrypted balance back to your public wallet.
        </p>
        <div className="flex gap-3">
          <input
            type="number"
            placeholder="Amount (USDC)"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            className="input-field flex-1"
          />
          <button
            onClick={handleWithdraw}
            disabled={isWithdrawing}
            className="btn-primary flex items-center gap-2"
          >
            {isWithdrawing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Withdraw
          </button>
        </div>
      </div>
    </div>
  );
}
