import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="max-w-[1200px] mx-auto px-6 pt-24 pb-20 sm:pt-36 sm:pb-28">
        <h1 className="text-[2.75rem] sm:text-[3.5rem] lg:text-[4.25rem] font-semibold text-[#F5F5F5] leading-[1.1] tracking-[-0.03em] max-w-3xl">
          The private payroll system for modern teams
        </h1>
        <p className="mt-6 text-base sm:text-lg text-[#6B6F76] max-w-xl leading-relaxed">
          Confidential salaries. Unlinkable transfers. Optional compliance.
          Purpose-built with the Umbra SDK on Solana, zero mocks.
        </p>
        <div className="flex items-center gap-3 mt-10">
          <Link href="/employer" className="btn-primary">
            Get started
          </Link>
          <Link href="/employee" className="btn-secondary">
            Claim salary
          </Link>
        </div>
      </section>

      {/* ── Divider ──────────────────────────────────────────────────── */}
      <div className="border-t border-[#1E1E20]" />

      {/* ── How it works ─────────────────────────────────────────────── */}
      <section className="max-w-[1200px] mx-auto px-6 py-20 sm:py-28">
        <p className="text-xs font-medium text-[#6B6F76] uppercase tracking-widest mb-12">
          How it works
        </p>
        <div className="grid md:grid-cols-3 gap-px bg-[#1E1E20] rounded-lg overflow-hidden">
          {[
            {
              step: "01",
              title: "Register & add employees",
              desc: "Connect your wallet, register with Umbra, and add employee wallet addresses to your roster.",
            },
            {
              step: "02",
              title: "Run confidential payroll",
              desc: "Execute batch payroll in one click. Each payment creates a receiver-claimable UTXO with ZK proofs.",
            },
            {
              step: "03",
              title: "Claim & audit",
              desc: "Employees scan and claim payments. Auditors verify with scoped viewing keys — nothing more.",
            },
          ].map((item) => (
            <div key={item.step} className="bg-[#0A0A0B] p-8">
              <span className="text-xs font-mono text-[#5E6AD2]">{item.step}</span>
              <h3 className="text-[#F5F5F5] font-medium mt-3 mb-2">{item.title}</h3>
              <p className="text-sm text-[#6B6F76] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Divider ──────────────────────────────────────────────────── */}
      <div className="border-t border-[#1E1E20]" />

      {/* ── Features ─────────────────────────────────────────────────── */}
      <section className="max-w-[1200px] mx-auto px-6 py-20 sm:py-28">
        <p className="text-xs font-medium text-[#6B6F76] uppercase tracking-widest mb-4">
          Built for privacy
        </p>
        <h2 className="text-2xl sm:text-3xl font-semibold text-[#F5F5F5] tracking-[-0.02em] max-w-lg mb-16">
          A new standard for payroll.{" "}
          <span className="text-[#6B6F76]">
            Privacy by default, compliance when needed.
          </span>
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: (
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="14" height="14" rx="3" />
                  <path d="M7 10h6M10 7v6" />
                </svg>
              ),
              title: "Confidential",
              desc: "Salary amounts encrypted in Umbra's shielded pool.",
            },
            {
              icon: (
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M10 3v4m0 6v4M3 10h4m6 0h4" />
                  <circle cx="10" cy="10" r="3" />
                </svg>
              ),
              title: "Unlinkable",
              desc: "ZK proofs break sender-receiver links on-chain.",
            },
            {
              icon: (
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M10 2l7 4v5c0 4-3 6.5-7 8-4-1.5-7-4-7-8V6l7-4z" />
                </svg>
              ),
              title: "Compliant",
              desc: "Scoped viewing keys for daily, monthly, or yearly audits.",
            },
            {
              icon: (
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 10h12M4 6h12M4 14h8" />
                </svg>
              ),
              title: "Real deployment",
              desc: "Every payment is a real UTXO on Solana devnet.",
            },
          ].map((f) => (
            <div key={f.title} className="group">
              <div className="text-[#6B6F76] group-hover:text-[#5E6AD2] transition-colors duration-150 mb-3">
                {f.icon}
              </div>
              <h3 className="text-sm font-medium text-[#F5F5F5] mb-1">{f.title}</h3>
              <p className="text-sm text-[#6B6F76] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Divider ──────────────────────────────────────────────────── */}
      <div className="border-t border-[#1E1E20]" />

      {/* ── Role cards ───────────────────────────────────────────────── */}
      <section className="max-w-[1200px] mx-auto px-6 py-20 sm:py-28">
        <p className="text-xs font-medium text-[#6B6F76] uppercase tracking-widest mb-4">
          Choose your role
        </p>
        <h2 className="text-2xl sm:text-3xl font-semibold text-[#F5F5F5] tracking-[-0.02em] mb-12">
          Three interfaces, one protocol.
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              href: "/employer",
              title: "Employer",
              desc: "Add employees, run batch payroll, export viewing keys for compliance.",
            },
            {
              href: "/employee",
              title: "Employee",
              desc: "Scan for incoming payments, claim UTXOs, withdraw to public wallet.",
            },
            {
              href: "/auditor",
              title: "Auditor",
              desc: "Load audit packages, verify payments on-chain, export reports.",
            },
          ].map((role) => (
            <Link key={role.href} href={role.href} className="role-card group">
              <h3 className="text-[#F5F5F5] font-medium mb-2">{role.title}</h3>
              <p className="text-sm text-[#6B6F76] leading-relaxed mb-4">{role.desc}</p>
              <span className="inline-flex items-center gap-1 text-sm text-[#5E6AD2] group-hover:gap-2 transition-all duration-150">
                Open
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Divider ──────────────────────────────────────────────────── */}
      <div className="border-t border-[#1E1E20]" />

      {/* ── Tech stack ───────────────────────────────────────────────── */}
      <section className="max-w-[1200px] mx-auto px-6 py-20 sm:py-28">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-[#6B6F76]">
          <span className="text-[#F5F5F5] font-medium">Powered by</span>
          <span>Umbra SDK</span>
          <span className="text-[#2A2A2E]">·</span>
          <span>Solana Devnet</span>
          <span className="text-[#2A2A2E]">·</span>
          <span>Next.js 14</span>
          <span className="text-[#2A2A2E]">·</span>
          <span>Browser-native ZK proofs</span>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="border-t border-[#1E1E20] max-w-[1200px] mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#6B6F76]">
            Built for the Umbra SDK Hackathon 2025
          </p>
          <div className="flex items-center gap-6 text-sm">
            <a href="https://github.com/thesithunyein/stipend" target="_blank" rel="noopener noreferrer" className="text-[#6B6F76] hover:text-[#B5B5B5] transition-colors duration-150">
              GitHub
            </a>
            <a href="https://sdk.umbraprivacy.com" target="_blank" rel="noopener noreferrer" className="text-[#6B6F76] hover:text-[#B5B5B5] transition-colors duration-150">
              Umbra SDK
            </a>
            <a href="https://solana.com" target="_blank" rel="noopener noreferrer" className="text-[#6B6F76] hover:text-[#B5B5B5] transition-colors duration-150">
              Solana
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
