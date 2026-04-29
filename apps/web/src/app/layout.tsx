import type { Metadata } from "next";
import { Toaster } from "sonner";
import { WalletProvider } from "@/components/wallet-provider";
import { Navbar } from "@/components/navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stipend — Private Payroll on Solana",
  description:
    "Confidential payroll powered by Umbra SDK. Employees get paid, amounts stay hidden, compliance stays possible.",
  icons: {
    icon: "/favicon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Stipend — Private Payroll on Solana",
    description:
      "Confidential payroll powered by Umbra SDK. Real devnet deployment, zero mocks.",
    url: "https://stipend.vercel.app",
    siteName: "Stipend",
    type: "website",
    images: [{ url: "/og-image.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stipend — Private Payroll on Solana",
    description:
      "Confidential payroll powered by Umbra SDK. Real devnet deployment, zero mocks.",
    images: ["/og-image.svg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen antialiased">
        {/* Linear-style aurora mesh gradient background */}
        <div className="aurora-bg">
          <div className="aurora-orb aurora-orb-1" />
          <div className="aurora-orb aurora-orb-2" />
        </div>
        <div className="noise-overlay" />

        <WalletProvider>
          <Navbar />
          <main className="pt-20 relative z-0">{children}</main>
          <Toaster
            theme="dark"
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#18181b",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#ffffff",
              },
            }}
          />
        </WalletProvider>
      </body>
    </html>
  );
}
