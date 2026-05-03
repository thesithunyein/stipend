"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, X } from "lucide-react";

const DISMISS_KEY = "stipend:phantom-warning-dismissed";

/**
 * Detects Phantom wallet extension and shows a banner explaining that
 * Phantom is incompatible with Umbra (it rewrites transactions post-sign,
 * which invalidates Umbra's signature verification, Solana error #7050012).
 *
 * We recommend Solflare or Backpack, both of which work flawlessly.
 */
export function PhantomWarning() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(DISMISS_KEY) === "1") return;

    // Phantom injects window.phantom.solana on page load.
    const hasPhantom = Boolean(
      (window as any).phantom?.solana || (window as any).solana?.isPhantom
    );
    if (hasPhantom) setShow(true);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed top-16 left-0 right-0 z-40 px-4 py-3 bg-amber-500/10 border-b border-amber-500/30 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex items-start gap-3 text-sm">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="flex-1 text-amber-100/90">
          <strong className="text-amber-200">Phantom detected.</strong>{" "}
          Phantom modifies transactions post-sign, which breaks Umbra's signature
          verification (Solana error <code className="px-1 rounded bg-black/30">#7050012</code>
          ). Please use{" "}
          <a
            href="https://solflare.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-amber-50"
          >
            Solflare
          </a>{" "}
          or{" "}
          <a
            href="https://backpack.app"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-amber-50"
          >
            Backpack
          </a>{" "}
          for payroll transactions. The Umbra team is aware and working on a
          Phantom-side fix.
        </div>
        <button
          onClick={() => {
            localStorage.setItem(DISMISS_KEY, "1");
            setShow(false);
          }}
          className="text-amber-300/70 hover:text-amber-200 shrink-0"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
