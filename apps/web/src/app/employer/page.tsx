"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import {
  Plus,
  Play,
  Key,
  Trash2,
  Download,
  CheckCircle2,
  XCircle,
  Loader2,
  Users,
  DollarSign,
  ScrollText,
} from "lucide-react";
import { useWalletStore, useEmployerStore } from "@/lib/store";
import { registerUser, runPayroll, buildManifest } from "@/lib/payroll";
import { deriveViewingKey, createAuditPackage } from "@/lib/compliance";
import { ZkLoadingOverlay } from "@/components/zk-loading-overlay";
import type { Employee } from "@/lib/payroll";
import type { ViewingKeyScope } from "@/lib/compliance";

export default function EmployerPage() {
  const { umbraClient, account } = useWalletStore();
  const store = useEmployerStore();

  const [newName, setNewName] = useState("");
  const [newAddr, setNewAddr] = useState("");
  const [newSalary, setNewSalary] = useState("");

  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const [vkScope, setVkScope] = useState<ViewingKeyScope>("monthly");
  const [vkYear, setVkYear] = useState(new Date().getFullYear().toString());
  const [vkMonth, setVkMonth] = useState(
    (new Date().getMonth() + 1).toString()
  );
  const [isExporting, setIsExporting] = useState(false);

  // ── Register ─────────────────────────────────────────────────────

  const handleRegister = useCallback(async () => {
    if (!umbraClient) return toast.error("Connect wallet first");
    setIsRegistering(true);
    try {
      await registerUser(umbraClient);
      setIsRegistered(true);
      toast.success("Registered with Umbra successfully!");
    } catch (err: any) {
      toast.error(`Registration failed: ${err?.message}`);
    } finally {
      setIsRegistering(false);
    }
  }, [umbraClient]);

  // ── Add Employee ─────────────────────────────────────────────────

  const handleAddEmployee = () => {
    if (!newName || !newAddr || !newSalary) {
      return toast.error("Fill all fields");
    }
    const salary = BigInt(Math.round(parseFloat(newSalary) * 1e6));
    const emp: Employee = {
      id: crypto.randomUUID(),
      name: newName,
      address: newAddr,
      salary,
    };
    store.addEmployee(emp);
    setNewName("");
    setNewAddr("");
    setNewSalary("");
    toast.success(`Added ${newName}`);
  };

  // ── Run Payroll ──────────────────────────────────────────────────

  const handleRunPayroll = useCallback(async () => {
    if (!umbraClient || !account) return toast.error("Connect wallet first");
    if (store.employees.length === 0) return toast.error("No employees added");

    store.setRunning(true);
    store.clearLogs();
    store.addLog("Starting payroll run...");

    try {
      const result = await runPayroll(umbraClient, store.employees, (msg) =>
        store.addLog(msg)
      );

      store.addPayrollRun(result);
      const manifest = buildManifest(result, account.address);
      store.addManifest(manifest);

      const succeeded = result.employees.filter(
        (e) => e.status === "success"
      ).length;
      store.addLog(
        `Payroll complete: ${succeeded}/${result.employees.length} paid.`
      );
      toast.success(`Payroll ${result.runId} complete!`);
    } catch (err: any) {
      store.addLog(`Fatal error: ${err?.message}`);
      toast.error(`Payroll failed: ${err?.message}`);
    } finally {
      store.setRunning(false);
    }
  }, [umbraClient, account, store]);

  // ── Export Viewing Key ───────────────────────────────────────────

  const handleExportVK = useCallback(async () => {
    if (!umbraClient) return toast.error("Connect wallet first");

    setIsExporting(true);
    try {
      const vkExport = await deriveViewingKey(umbraClient, {
        scope: vkScope,
        year: parseInt(vkYear),
        month: parseInt(vkMonth),
      });

      store.addViewingKey(vkExport);

      // Build audit package with latest manifest
      const latestManifest = store.manifests[store.manifests.length - 1];
      if (latestManifest) {
        const pkg = createAuditPackage(latestManifest, vkExport);
        const blob = new Blob([JSON.stringify(pkg, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `stipend-audit-${vkExport.period}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("Audit package downloaded!");
      } else {
        const blob = new Blob([JSON.stringify(vkExport, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `stipend-vk-${vkExport.period}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("Viewing key exported!");
      }
    } catch (err: any) {
      toast.error(`Export failed: ${err?.message}`);
    } finally {
      setIsExporting(false);
    }
  }, [umbraClient, vkScope, vkYear, vkMonth, store]);

  // ── Render ───────────────────────────────────────────────────────

  if (!account) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="glass-card max-w-md w-full text-center space-y-4">
          <Users className="w-12 h-12 text-[#6B6F76] mx-auto" />
          <h2 className="text-xl font-semibold text-[#F5F5F5]">Employer Dashboard</h2>
          <p className="text-[#6B6F76]">
            Connect your wallet to manage payroll.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <ZkLoadingOverlay
        isVisible={store.isRunning}
        label="Running payroll — generating ZK proofs"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-[#F5F5F5] flex items-center gap-2">
            <Users className="w-5 h-5 text-[#6B6F76]" />
            Employer Dashboard
          </h1>
          <p className="text-[#6B6F76] text-sm mt-1">
            Manage employees and run confidential payroll
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
              <CheckCircle2 className="w-4 h-4" />
            )}
            {isRegistering ? "Registering..." : "Register with Umbra"}
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Employees",
            value: store.employees.length,
            icon: Users,
          },
          {
            label: "Total Monthly",
            value: `$${(Number(store.employees.reduce((a, e) => a + e.salary, 0n)) / 1e6).toFixed(2)}`,
            icon: DollarSign,
          },
          {
            label: "Payroll Runs",
            value: store.payrollRuns.length,
            icon: ScrollText,
          },
          {
            label: "Keys Exported",
            value: store.viewingKeys.length,
            icon: Key,
          },
        ].map((stat) => (
          <div key={stat.label} className="glass-card flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#1E1E20] flex items-center justify-center shrink-0">
              <stat.icon className="w-4 h-4 text-[#6B6F76]" />
            </div>
            <div>
              <div className="text-lg font-semibold text-[#F5F5F5]">{stat.value}</div>
              <div className="text-xs text-[#6B6F76]">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Employee */}
      <div className="glass-card space-y-4">
        <h3 className="text-sm font-medium text-[#F5F5F5] flex items-center gap-2">
          <Plus className="w-4 h-4 text-[#6B6F76]" />
          Add Employee
        </h3>
        <div className="grid sm:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="input-field"
          />
          <input
            type="text"
            placeholder="Solana Wallet Address"
            value={newAddr}
            onChange={(e) => setNewAddr(e.target.value)}
            className="input-field sm:col-span-2"
          />
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Amount (USDC)"
              value={newSalary}
              onChange={(e) => setNewSalary(e.target.value)}
              className="input-field flex-1"
            />
            <button onClick={handleAddEmployee} className="btn-primary !px-4">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Employee Table */}
      {store.employees.length > 0 && (
        <div className="glass-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-[#F5F5F5]">Employees</h3>
            <button
              onClick={handleRunPayroll}
              disabled={store.isRunning}
              className="btn-primary flex items-center gap-2"
            >
              {store.isRunning ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              {store.isRunning ? "Running..." : "Run Payroll"}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#6B6F76] border-b border-[#1E1E20]">
                  <th className="pb-3 font-medium text-xs">Name</th>
                  <th className="pb-3 font-medium text-xs">Address</th>
                  <th className="pb-3 font-medium text-xs text-right">Salary</th>
                  <th className="pb-3 font-medium text-xs text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {store.employees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="border-b border-[#1E1E20] hover:bg-[#161618]"
                  >
                    <td className="py-3 text-[#F5F5F5] text-sm">{emp.name}</td>
                    <td className="py-3 text-[#6B6F76] font-mono text-xs">
                      {emp.address.slice(0, 8)}...{emp.address.slice(-6)}
                    </td>
                    <td className="py-3 text-right text-[#F5F5F5] text-sm">
                      ${(Number(emp.salary) / 1e6).toFixed(2)}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => store.removeEmployee(emp.id)}
                        className="text-red-400/60 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Progress Log */}
      {store.progressLog.length > 0 && (
        <div className="glass-card space-y-3">
          <h3 className="text-sm font-medium text-[#F5F5F5]">Payroll Log</h3>
          <div className="bg-[#0A0A0B] border border-[#1E1E20] rounded-lg p-4 font-mono text-xs space-y-1 max-h-48 overflow-y-auto">
            {store.progressLog.map((msg, i) => (
              <div key={i} className="text-[#6B6F76]">
                <span className="text-[#6B6F76] mr-2">
                  [{new Date().toLocaleTimeString()}]
                </span>
                {msg}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payroll History */}
      {store.payrollRuns.length > 0 && (
        <div className="glass-card space-y-4">
          <h3 className="text-sm font-medium text-[#F5F5F5] flex items-center gap-2">
            <ScrollText className="w-4 h-4 text-[#6B6F76]" />
            Payroll History
          </h3>
          <div className="space-y-3">
            {store.payrollRuns.map((run) => (
              <div
                key={run.runId}
                className="bg-[#0A0A0B] rounded-lg p-4 border border-[#1E1E20]"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-sm text-[#6B6F76]">
                    {run.runId}
                  </span>
                  <span className="text-xs text-[#6B6F76]">
                    {new Date(run.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-[#6B6F76] text-xs">Employees</div>
                    <div className="text-[#F5F5F5] text-sm font-medium">
                      {run.employees.length}
                    </div>
                  </div>
                  <div>
                    <div className="text-[#6B6F76] text-xs">Total Paid</div>
                    <div className="text-[#F5F5F5] text-sm font-medium">
                      ${(Number(run.totalPaid) / 1e6).toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[#6B6F76] text-xs">Status</div>
                    <div className="flex items-center gap-1">
                      {run.employees.every((e) => e.status === "success") ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 text-xs font-medium">
                            All Paid
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-amber-400" />
                          <span className="text-amber-400 text-xs font-medium">
                            Partial
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Export Viewing Key */}
      <div className="glass-card space-y-4">
        <h3 className="text-sm font-medium text-[#F5F5F5] flex items-center gap-2">
          <Key className="w-4 h-4 text-[#6B6F76]" />
          Export Viewing Key
        </h3>
        <p className="text-[#6B6F76] text-sm">
          Share scoped viewing keys with auditors so they can verify payroll
          without seeing anything outside the defined scope.
        </p>
        <div className="grid sm:grid-cols-4 gap-3">
          <select
            value={vkScope}
            onChange={(e) => setVkScope(e.target.value as ViewingKeyScope)}
            className="input-field"
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            <option value="daily">Daily</option>
            <option value="mint">All Time (Mint)</option>
            <option value="master">Master (Full Access)</option>
          </select>
          <input
            type="number"
            placeholder="Year"
            value={vkYear}
            onChange={(e) => setVkYear(e.target.value)}
            className="input-field"
          />
          <input
            type="number"
            placeholder="Month (1-12)"
            value={vkMonth}
            onChange={(e) => setVkMonth(e.target.value)}
            className="input-field"
          />
          <button
            onClick={handleExportVK}
            disabled={isExporting}
            className="btn-primary flex items-center justify-center gap-2"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Export
          </button>
        </div>
      </div>
    </div>
  );
}
