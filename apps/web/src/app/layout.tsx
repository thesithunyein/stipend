import type { Metadata } from "next";
import { Toaster } from "sonner";
import { WalletProvider } from "@/components/wallet-provider";
import { Navbar } from "@/components/navbar";
import { PhantomWarning } from "@/components/phantom-warning";
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
        <div className="linear-glow" />
        <WalletProvider>
          <Navbar />
          <PhantomWarning />
          <main className="pt-16">{children}</main>
          <Toaster
            theme="dark"
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#161618",
                border: "1px solid #2A2A2E",
                color: "#F5F5F5",
                fontSize: "0.875rem",
              },
            }}
          />
        </WalletProvider>
      </body>
    </html>
  );
}
