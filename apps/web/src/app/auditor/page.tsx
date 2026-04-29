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
        <h1 className="text-lg font-semibold text-[#F5F5F5] flex items-center gap-2">
          <FileSearch className="w-5 h-5 text-[#6B6F76]" />
          Auditor Dashboard
        </h1>
        <p className="text-[#6B6F76] text-sm mt-1">
          Verify payroll manifests against on-chain data. No wallet needed.
        </p>
      </div>

      {/* Upload / Paste */}
      <div className="glass-card space-y-4">
        <h3 className="text-sm font-medium text-[#F5F5F5] flex items-center gap-2">
          <Upload className="w-4 h-4 text-[#6B6F76]" />
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
          <span className="text-[#2A2A2E] self-center text-sm">or</span>
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
            <h3 className="text-sm font-medium text-[#F5F5F5]">
              Manifest Preview
            </h3>
            <span className="text-xs font-mono text-[#B5B5B5]">
              {manifest.runId}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-[#6B6F76] text-xs">Employer</div>
              <div className="text-[#F5F5F5] font-mono text-xs">
                {manifest.employerAddress.slice(0, 8)}...
              </div>
            </div>
            <div>
              <div className="text-[#6B6F76] text-xs">Date</div>
              <div className="text-[#F5F5F5] text-sm">
                {new Date(manifest.timestamp).toLocaleDateString()}
              </div>
            </div>
            <div>
              <div className="text-[#6B6F76] text-xs">Employees</div>
              <div className="text-[#F5F5F5] text-sm">{manifest.entries.length}</div>
            </div>
            <div>
              <div className="text-[#6B6F76] text-xs">Total</div>
              <div className="text-[#F5F5F5] text-sm font-medium">
                ${(Number(manifest.totalPaid) / 1e6).toFixed(2)}
              </div>
            </div>
          </div>

          {viewingKeyHex && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-[#111113] border border-[#1E1E20]">
              <Key className="w-4 h-4 text-[#6B6F76] shrink-0" />
              <div className="text-xs">
                <span className="text-[#B5B5B5] font-medium">
                  Viewing Key Included
                </span>
                <span className="text-[#6B6F76] ml-2 font-mono">
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
            <h3 className="text-sm font-medium text-[#F5F5F5]">
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
            <div className="bg-[#111113] rounded-lg p-4 text-center border border-[#1E1E20]">
              <div className="text-xl font-semibold text-[#F5F5F5]">
                {verifications.length}
              </div>
              <div className="text-xs text-[#6B6F76]">Total Entries</div>
            </div>
            <div className="bg-[#111113] rounded-lg p-4 text-center border border-[#1E1E20]">
              <div className="text-xl font-semibold text-[#4ADE80]">
                {verifiedCount}
              </div>
              <div className="text-xs text-[#6B6F76]">
                On-chain Verified
              </div>
            </div>
            <div className="bg-[#111113] rounded-lg p-4 text-center border border-[#1E1E20]">
              <div className="text-xl font-semibold text-[#F5F5F5]">
                ${(totalAmount / 1e6).toFixed(2)}
              </div>
              <div className="text-xs text-[#6B6F76]">Total Amount</div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#6B6F76] border-b border-[#1E1E20]">
                  <th className="pb-3 font-medium text-xs">Employee</th>
                  <th className="pb-3 font-medium text-xs">Address</th>
                  <th className="pb-3 font-medium text-xs text-right">Amount</th>
                  <th className="pb-3 font-medium text-xs text-center">Status</th>
                  <th className="pb-3 font-medium text-xs text-right">Explorer</th>
                </tr>
              </thead>
              <tbody>
                {verifications.map((v, i) => (
                  <tr
                    key={i}
                    className="border-b border-[#1E1E20] hover:bg-[#161618]"
                  >
                    <td className="py-3 text-[#F5F5F5] text-sm">
                      {v.entry.name}
                    </td>
                    <td className="py-3 text-[#6B6F76] font-mono text-xs">
                      {v.entry.address.slice(0, 6)}...
                      {v.entry.address.slice(-4)}
                    </td>
                    <td className="py-3 text-right text-[#F5F5F5] text-sm">
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
                        className="text-[#6B6F76] hover:text-[#B5B5B5] transition-colors duration-150"
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
