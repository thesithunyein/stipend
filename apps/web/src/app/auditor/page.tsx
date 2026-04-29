"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import {
  FileSearch,
  Upload,
  CheckCircle2,
  XCircle,
  Download,
  Loader2,
  ExternalLink,
  ShieldCheck,
  FileText,
  Key,
} from "lucide-react";
import {
  verifyManifest,
  generateCSV,
  type AuditPackage,
  type AuditVerification,
} from "@/lib/compliance";
import type { PayrollManifest } from "@/lib/payroll";

export default function AuditorPage() {
  const [auditJson, setAuditJson] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [manifest, setManifest] = useState<PayrollManifest | null>(null);
  const [viewingKeyHex, setViewingKeyHex] = useState("");
  const [verifications, setVerifications] = useState<AuditVerification[]>([]);
  const [isVerified, setIsVerified] = useState(false);

  // ── Load Audit Package ───────────────────────────────────────────

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setAuditJson(text);
      try {
        const pkg = JSON.parse(text) as AuditPackage;
        setManifest(pkg.manifest);
        setViewingKeyHex(pkg.viewingKey?.viewingKey || "");
        toast.success("Audit package loaded!");
      } catch {
        toast.error("Invalid JSON — try pasting directly");
      }
    };
    reader.readAsText(file);
  };

  const handlePasteJson = () => {
    try {
      const pkg = JSON.parse(auditJson);
      if (pkg.manifest) {
        setManifest(pkg.manifest);
        setViewingKeyHex(pkg.viewingKey?.viewingKey || "");
      } else if (pkg.runId) {
        setManifest(pkg as PayrollManifest);
      } else {
        throw new Error("Unrecognized format");
      }
      toast.success("Audit data loaded!");
    } catch (err: any) {
      toast.error(`Parse error: ${err?.message}`);
    }
  };

  // ── Verify ───────────────────────────────────────────────────────

  const handleVerify = useCallback(async () => {
    if (!manifest) return toast.error("Load an audit package first");

    setIsVerifying(true);
    try {
      const results = await verifyManifest(manifest);
      setVerifications(results);
      setIsVerified(true);

      const verified = results.filter((r) => r.onChainVerified).length;
      toast.success(
        `Verification complete: ${verified}/${results.length} confirmed on-chain`
      );
    } catch (err: any) {
      toast.error(`Verification failed: ${err?.message}`);
    } finally {
      setIsVerifying(false);
    }
  }, [manifest]);

  // ── Export CSV ───────────────────────────────────────────────────

  const handleExportCSV = () => {
    if (!manifest || verifications.length === 0) return;
    const csv = generateCSV(verifications, manifest);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stipend-audit-report-${manifest.runId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV downloaded!");
  };

  // ── Summary Stats ────────────────────────────────────────────────

  const totalAmount = verifications.reduce(
    (sum, v) => sum + Number(v.entry.amount),
    0
  );
  const verifiedCount = verifications.filter((v) => v.onChainVerified).length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <FileSearch className="w-6 h-6 text-white/60" />
          Auditor Dashboard
        </h1>
        <p className="text-white/40 text-sm mt-1">
          Verify payroll manifests against on-chain data. No wallet needed.
        </p>
      </div>

      {/* Upload / Paste */}
      <div className="glass-card space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Upload className="w-5 h-5 text-white/60" />
          Load Audit Package
        </h3>

        <div className="flex flex-col sm:flex-row gap-3">
          <label className="btn-secondary flex items-center justify-center gap-2 cursor-pointer flex-1">
            <FileText className="w-4 h-4" />
            Upload JSON File
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
          <span className="text-white/20 self-center text-sm">or</span>
          <button
            onClick={handlePasteJson}
            disabled={!auditJson.trim()}
            className="btn-secondary flex items-center justify-center gap-2 flex-1"
          >
            Parse Below
          </button>
        </div>

        <textarea
          placeholder={"Paste the full audit package JSON here (from employer's Export Viewing Key)..."}
          value={auditJson}
          onChange={(e) => setAuditJson(e.target.value)}
          className="input-field w-full h-32 resize-y font-mono text-xs"
        />
      </div>

      {/* Manifest Preview */}
      {manifest && (
        <div className="glass-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              Manifest Preview
            </h3>
            <span className="text-xs font-mono text-white/80">
              {manifest.runId}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-white/40 text-xs">Employer</div>
              <div className="text-white font-mono text-xs">
                {manifest.employerAddress.slice(0, 8)}...
              </div>
            </div>
            <div>
              <div className="text-white/40 text-xs">Date</div>
              <div className="text-white">
                {new Date(manifest.timestamp).toLocaleDateString()}
              </div>
            </div>
            <div>
              <div className="text-white/40 text-xs">Employees</div>
              <div className="text-white">{manifest.entries.length}</div>
            </div>
            <div>
              <div className="text-white/40 text-xs">Total</div>
              <div className="text-white font-medium">
                ${(Number(manifest.totalPaid) / 1e6).toFixed(2)}
              </div>
            </div>
          </div>

          {viewingKeyHex && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-white/10 border border-white/10">
              <Key className="w-4 h-4 text-white/60 shrink-0" />
              <div className="text-xs">
                <span className="text-white/80 font-medium">
                  Viewing Key Included
                </span>
                <span className="text-white/40 ml-2 font-mono">
                  {viewingKeyHex.slice(0, 16)}...
                </span>
              </div>
            </div>
          )}

          <button
            onClick={handleVerify}
            disabled={isVerifying}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {isVerifying ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ShieldCheck className="w-4 h-4" />
            )}
            {isVerifying ? "Verifying on-chain..." : "Verify All Transactions"}
          </button>
        </div>
      )}

      {/* Verification Results */}
      {isVerified && (
        <div className="glass-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              Verification Report
            </h3>
            <button
              onClick={handleExportCSV}
              className="btn-secondary text-sm flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/[0.02] rounded-xl p-4 text-center border border-white/[0.04]">
              <div className="text-2xl font-bold text-white">
                {verifications.length}
              </div>
              <div className="text-xs text-white/40">Total Entries</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center border border-white/10">
              <div className="text-2xl font-bold text-emerald-400">
                {verifiedCount}
              </div>
              <div className="text-xs text-white/40">
                On-chain Verified
              </div>
            </div>
            <div className="bg-white/[0.02] rounded-xl p-4 text-center border border-white/[0.04]">
              <div className="text-2xl font-bold text-white">
                ${(totalAmount / 1e6).toFixed(2)}
              </div>
              <div className="text-xs text-white/40">Total Amount</div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-white/40 border-b border-white/[0.06]">
                  <th className="pb-3 font-medium">Employee</th>
                  <th className="pb-3 font-medium">Address</th>
                  <th className="pb-3 font-medium text-right">Amount</th>
                  <th className="pb-3 font-medium text-center">Status</th>
                  <th className="pb-3 font-medium text-right">Explorer</th>
                </tr>
              </thead>
              <tbody>
                {verifications.map((v, i) => (
                  <tr
                    key={i}
                    className="border-b border-white/[0.04] hover:bg-white/[0.02]"
                  >
                    <td className="py-3 text-white font-medium">
                      {v.entry.name}
                    </td>
                    <td className="py-3 text-white/60 font-mono text-xs">
                      {v.entry.address.slice(0, 6)}...
                      {v.entry.address.slice(-4)}
                    </td>
                    <td className="py-3 text-right text-white">
                      ${(Number(v.entry.amount) / 1e6).toFixed(2)}
                    </td>
                    <td className="py-3 text-center">
                      {v.onChainVerified ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-400 text-xs font-medium">
                          <XCircle className="w-3.5 h-3.5" />
                          Unverified
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      <a
                        href={v.explorerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/60 hover:text-white/80 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 inline" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
