import { create } from "zustand";
import type { Wallet, WalletAccount } from "@wallet-standard/base";
import type { UmbraClient } from "./umbra-client";
import type { Employee, PayrollRunResult, PayrollManifest } from "./payroll";
import type { ViewingKeyExport } from "./compliance";

// ── Wallet Store ─────────────────────────────────────────────────────

interface WalletState {
  wallet: Wallet | null;
  account: WalletAccount | null;
  umbraClient: UmbraClient | null;
  connecting: boolean;
  setWallet: (wallet: Wallet, account: WalletAccount) => void;
  setUmbraClient: (client: UmbraClient) => void;
  setConnecting: (connecting: boolean) => void;
  disconnect: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  wallet: null,
  account: null,
  umbraClient: null,
  connecting: false,
  setWallet: (wallet, account) => set({ wallet, account }),
  setUmbraClient: (client) => set({ umbraClient: client }),
  setConnecting: (connecting) => set({ connecting }),
  disconnect: () =>
    set({ wallet: null, account: null, umbraClient: null, connecting: false }),
}));

// ── Employer Store ───────────────────────────────────────────────────

interface EmployerState {
  employees: Employee[];
  payrollRuns: PayrollRunResult[];
  manifests: PayrollManifest[];
  viewingKeys: ViewingKeyExport[];
  isRunning: boolean;
  progressLog: string[];
  addEmployee: (emp: Employee) => void;
  removeEmployee: (id: string) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  addPayrollRun: (run: PayrollRunResult) => void;
  addManifest: (manifest: PayrollManifest) => void;
  addViewingKey: (vk: ViewingKeyExport) => void;
  setRunning: (running: boolean) => void;
  addLog: (msg: string) => void;
  clearLogs: () => void;
}

export const useEmployerStore = create<EmployerState>((set) => ({
  employees: [],
  payrollRuns: [],
  manifests: [],
  viewingKeys: [],
  isRunning: false,
  progressLog: [],
  addEmployee: (emp) =>
    set((s) => ({ employees: [...s.employees, emp] })),
  removeEmployee: (id) =>
    set((s) => ({ employees: s.employees.filter((e) => e.id !== id) })),
  updateEmployee: (id, updates) =>
    set((s) => ({
      employees: s.employees.map((e) =>
        e.id === id ? { ...e, ...updates } : e
      ),
    })),
  addPayrollRun: (run) =>
    set((s) => ({ payrollRuns: [...s.payrollRuns, run] })),
  addManifest: (manifest) =>
    set((s) => ({ manifests: [...s.manifests, manifest] })),
  addViewingKey: (vk) =>
    set((s) => ({ viewingKeys: [...s.viewingKeys, vk] })),
  setRunning: (running) => set({ isRunning: running }),
  addLog: (msg) =>
    set((s) => ({ progressLog: [...s.progressLog, msg] })),
  clearLogs: () => set({ progressLog: [] }),
}));

// ── Employee Store ───────────────────────────────────────────────────

interface EmployeeState {
  claimableUtxos: any[];
  isScanning: boolean;
  isClaiming: boolean;
  setClaimableUtxos: (utxos: any[]) => void;
  setScanning: (scanning: boolean) => void;
  setClaiming: (claiming: boolean) => void;
}

export const useEmployeeStore = create<EmployeeState>((set) => ({
  claimableUtxos: [],
  isScanning: false,
  isClaiming: false,
  setClaimableUtxos: (utxos) => set({ claimableUtxos: utxos }),
  setScanning: (scanning) => set({ isScanning: scanning }),
  setClaiming: (claiming) => set({ isClaiming: claiming }),
}));
