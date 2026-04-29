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
        const account = accounts[0];
        if (!account) throw new Error("No account returned from wallet");

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
      <div className="flex items-center gap-3">
        <span className="text-sm text-white/60 font-mono">{short}</span>
        <button
          onClick={disconnect}
          className="btn-secondary text-sm !px-4 !py-1.5"
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
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md"
          onClick={() => setShowModal(false)}
        >
          <div
            className="wallet-modal-glass p-8 w-full max-w-sm mx-4 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-1">
                Connect Wallet
              </h3>
              <p className="text-white/40 text-sm">
                Select a wallet to continue
              </p>
            </div>

            {availableWallets.length === 0 ? (
              <p className="text-white/50 text-sm text-center py-4">
                No Solana wallets detected. Please install Phantom, Backpack, or
                Solflare.
              </p>
            ) : (
              <div className="space-y-2">
                {availableWallets.map((w) => (
                  <button
                    key={w.name}
                    onClick={async () => {
                      await connect(w);
                      setShowModal(false);
                    }}
                    className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.08] hover:border-indigo-500/30 transition-all duration-200"
                  >
                    {w.icon && (
                      <img
                        src={
                          typeof w.icon === "string"
                            ? w.icon
                            : (w.icon as any)?.[0] || ""
                        }
                        alt={w.name}
                        className="w-9 h-9 rounded-xl"
                      />
                    )}
                    <span className="text-white font-medium">{w.name}</span>
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowModal(false)}
              className="w-full text-white/50 hover:text-white/80 text-sm py-2 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
