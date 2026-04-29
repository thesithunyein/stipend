import Link from "next/link";
import {
  Shield,
  Briefcase,
  User,
  FileSearch,
  ArrowRight,
  Lock,
  Eye,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Lock,
    title: "Confidential Amounts",
    description:
      "Salary amounts are encrypted via Umbra's shielded pool. Nobody sees what you pay.",
  },
  {
    icon: Shield,
    title: "Unlinkable Transfers",
    description:
      "Employee payments go through Umbra's mixer — no on-chain link between sender and recipient.",
  },
  {
    icon: Eye,
    title: "Viewing Keys for Compliance",
    description:
      "Share scoped viewing keys with auditors. They see exactly what you allow — nothing more.",
  },
  {
    icon: Zap,
    title: "Real Devnet Deployment",
    description:
      "Not a mock. Every payment is a real UTXO on Solana devnet via the Umbra SDK.",
  },
];

const roles = [
  {
    href: "/employer",
    icon: Briefcase,
    title: "Employer",
    description:
      "Add employees, run payroll in one click, and export viewing keys for auditors.",
    color: "from-brand-500 to-indigo-600",
  },
  {
    href: "/employee",
    icon: User,
    title: "Employee",
    description:
      "Scan for incoming payments, claim UTXOs into your encrypted balance, and withdraw.",
    color: "from-emerald-500 to-teal-600",
  },
  {
    href: "/auditor",
    icon: FileSearch,
    title: "Auditor",
    description:
      "Paste an audit package, verify payments on-chain, and export compliance reports.",
    color: "from-amber-500 to-orange-600",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-24 pb-20 sm:pt-32 sm:pb-28">
        {/* Gradient bg */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-brand-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-600/10 border border-brand-500/20 text-brand-300 text-sm font-medium">
            <Shield className="w-4 h-4" />
            Built on Umbra Privacy SDK
          </div>

          <h1 className="text-5xl sm:text-7xl font-black tracking-tight">
            <span className="gradient-text">Private Payroll</span>
            <br />
            <span className="text-white">on Solana</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
            Pay your team in stablecoins. Salaries stay confidential. Compliance
            stays possible. Powered by Umbra&apos;s confidential transfer layer
            and zero-knowledge proofs.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/employer" className="btn-primary text-base !px-8 !py-3 flex items-center gap-2">
              Launch App <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-base !px-8 !py-3"
            >
              View Source
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            How It Works
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="glass-card space-y-3">
                <div className="w-10 h-10 rounded-xl bg-brand-600/20 flex items-center justify-center">
                  <f.icon className="w-5 h-5 text-brand-400" />
                </div>
                <h3 className="text-white font-semibold">{f.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Cards */}
      <section className="px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-4">
            Choose Your Role
          </h2>
          <p className="text-center text-white/40 mb-12">
            Each role has a dedicated dashboard tailored to its needs.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            {roles.map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="glass-card group space-y-4 hover:scale-[1.02]"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${r.color} flex items-center justify-center`}
                >
                  <r.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg">{r.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  {r.description}
                </p>
                <div className="flex items-center gap-1 text-brand-400 text-sm font-medium group-hover:gap-2 transition-all">
                  Open Dashboard <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] px-4 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/30">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>Stipend — Umbra Hackathon 2025</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Devnet: DSuKkyq...Uhirnuv</span>
            <a
              href="https://sdk.umbraprivacy.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/60 transition-colors"
            >
              Umbra SDK Docs
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
