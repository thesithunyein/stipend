import type { Metadata } from "next";
import { Toaster } from "sonner";
import { WalletProvider } from "@/components/wallet-provider";
import { Navbar } from "@/components/navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stipend — Private Payroll on Solana",
  description:
    "Confidential payroll powered by Umbra. Employees get paid, amounts stay hidden, compliance stays possible.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen antialiased">
        <WalletProvider>
          <Navbar />
          <main className="pt-16">{children}</main>
          <Toaster
            theme="dark"
            position="bottom-right"
            toastOptions={{
              style: {
                background: "hsl(224 71% 6%)",
                border: "1px solid hsl(216 34% 17%)",
                color: "hsl(213 31% 91%)",
              },
            }}
          />
        </WalletProvider>
      </body>
    </html>
  );
}
