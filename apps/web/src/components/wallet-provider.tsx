"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getWallets } from "@wallet-standard/app";
import type { Wallet } from "@wallet-standard/base";
import { StandardConnect, StandardDisconnect } from "@wallet-standard/features";
import { useWalletStore } from "@/lib/store";
import { createUmbraClient } from "@/lib/umbra-client";

// ── Wallet Discovery Context ─────────────────────────────────────────

interface WalletContextValue {
  availableWallets: Wallet[];
  connect: (wallet: Wallet) => Promise<void>;
  disconnect: () => Promise<void>;
}

const WalletContext = createContext<WalletContextValue>({
  availableWallets: [],
  connect: async () => {},
  disconnect: async () => {},
});

export function useWalletContext() {
  return useContext(WalletContext);
}

// ── Provider ─────────────────────────────────────────────────────────

export function WalletProvider({ children }: { children: ReactNode }) {
  const [availableWallets, setAvailableWallets] = useState<Wallet[]>([]);
  const { setWallet, setUmbraClient, setConnecting, disconnect: clearStore } =
    useWalletStore();

  useEffect(() => {
    const { get, on } = getWallets();
    const updateWallets = () => {
      const wallets = get().filter((w) => {
        const features = Object.keys(w.features);
        return (
          features.includes("solana:signTransaction") &&
          features.includes("solana:signMessage")
        );
      });
      setAvailableWallets(wallets);
    };

    updateWallets();
    const unsub = on("register", updateWallets);
    return () => { unsub(); };
  }, []);

  const connect = useCallback(
    async (wallet: Wallet) => {
      setConnecting(true);
      try {
        const connectFeature = wallet.features[StandardConnect] as any;
        const { accounts } = await connectFeature.connect();
        const rawAccount =
          accounts.find((a: any) =>
            (a.chains || []).includes("solana:devnet")
          ) || accounts[0];
        if (!rawAccount) throw new Error("No account returned from wallet");

        // Reorder chains so solana:devnet is first (SDK picks first chain)
        const otherChains = (rawAccount.chains || []).filter(
          (c: string) => c !== "solana:devnet"
        );
        const account: any = {
          ...rawAccount,
          address: rawAccount.address,
          publicKey: rawAccount.publicKey,
          features: rawAccount.features,
          label: rawAccount.label,
          icon: rawAccount.icon,
          chains: ["solana:devnet", ...otherChains],
        };
        console.log("[Stipend] Selected account:", account.address, "chains:", account.chains);

        setWallet(wallet, account);

        const client = await createUmbraClient(wallet, account);
        setUmbraClient(client);
      } finally {
        setConnecting(false);
      }
    },
    [setWallet, setUmbraClient, setConnecting]
  );

  const disconnect = useCallback(async () => {
    const { wallet } = useWalletStore.getState();
    if (wallet) {
      const disconnectFeature = wallet.features[StandardDisconnect] as any;
      if (disconnectFeature) {
        try {
          await disconnectFeature.disconnect();
        } catch {}
      }
    }
    clearStore();
  }, [clearStore]);

  return (
    <WalletContext.Provider value={{ availableWallets, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}

// ── Connect Button ───────────────────────────────────────────────────

export function ConnectButton() {
  const { availableWallets, connect, disconnect } = useWalletContext();
  const { account, connecting } = useWalletStore();
  const [showModal, setShowModal] = useState(false);

  if (account) {
    const addr = account.address;
    const short = addr.slice(0, 4) + "..." + addr.slice(-4);
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-[#6B6F76] font-mono">{short}</span>
        <button
          onClick={disconnect}
          className="text-xs text-[#6B6F76] hover:text-[#B5B5B5] transition-colors duration-150"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        disabled={connecting}
        className="btn-primary text-sm"
      >
        {connecting ? "Connecting..." : "Connect Wallet"}
      </button>

      {showModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60"
          onClick={() => setShowModal(false)}
        >
          <div
            className="wallet-modal-glass p-6 w-full max-w-sm mx-4 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h3 className="text-sm font-medium text-[#F5F5F5]">
                Connect wallet
              </h3>
              <p className="text-xs text-[#6B6F76] mt-1">
                Select a wallet to continue
              </p>
            </div>

            {availableWallets.length === 0 ? (
              <p className="text-sm text-[#6B6F76] py-4">
                No Solana wallets detected. Install Phantom, Backpack, or
                Solflare.
              </p>
            ) : (
              <div className="space-y-1">
                {availableWallets.map((w) => (
                  <button
                    key={w.name}
                    onClick={async () => {
                      await connect(w);
                      setShowModal(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md bg-transparent hover:bg-[#1E1E20] border border-transparent hover:border-[#2A2A2E] transition-colors duration-150"
                  >
                    {w.icon && (
                      <img
                        src={
                          typeof w.icon === "string"
                            ? w.icon
                            : (w.icon as any)?.[0] || ""
                        }
                        alt={w.name}
                        className="w-7 h-7 rounded-md"
                      />
                    )}
                    <span className="text-sm text-[#B5B5B5]">{w.name}</span>
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowModal(false)}
              className="w-full text-xs text-[#6B6F76] hover:text-[#B5B5B5] py-1.5 transition-colors duration-150"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
