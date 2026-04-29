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
    color: "from-white/20 to-white/5",
  },
  {
    href: "/employee",
    icon: User,
    title: "Employee",
    description:
      "Scan for incoming payments, claim UTXOs into your encrypted balance, and withdraw.",
    color: "from-white/15 to-white/5",
  },
  {
    href: "/auditor",
    icon: FileSearch,
    title: "Auditor",
    description:
      "Paste an audit package, verify payments on-chain, and export compliance reports.",
    color: "from-white/10 to-white/5",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-24 pb-20 sm:pt-32 sm:pb-28">
        {/* Gradient bg */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-white/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight">
            Private
            <br />
            <span className="gradient-text">Payroll</span>
          </h1>
          <p className="text-xl sm:text-2xl text-white/70 mb-12 max-w-2xl mx-auto font-light">
            Confidential salaries. Unlinkable transfers. Optional compliance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/employer" className="btn-primary">
              Start Paying
            </Link>
            <Link href="/employee" className="btn-secondary">
              Claim Salary
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 py-32 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-20">
            Built for Privacy
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card-hover p-10 text-center">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Confidential</h3>
              <p className="text-white/60 leading-relaxed">
                Salary amounts are encrypted in Umbra's shielded pool. No on-chain visibility into compensation.
              </p>
            </div>
            <div className="glass-card-hover p-10 text-center">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Unlinkable</h3>
              <p className="text-white/60 leading-relaxed">
                Payments route through the mixer using zero-knowledge proofs, breaking sender-receiver links.
              </p>
            </div>
            <div className="glass-card-hover p-10 text-center">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FileSearch className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Compliant</h3>
              <p className="text-white/60 leading-relaxed">
                Export scoped viewing keys (daily/monthly/yearly) for auditors without exposing sensitive data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role Cards */}
      <section className="px-4 py-32 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-20">
            Choose Your Role
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Link href="/employer" className="role-card">
              <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-white/20 transition-all duration-300">
                <Briefcase className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-black text-white mb-4">Employer</h3>
              <p className="text-white/60 mb-6 leading-relaxed">
                Add employees, run batch payroll, export viewing keys for compliance.
              </p>
              <div className="flex items-center justify-center text-white font-medium">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
            
            <Link href="/employee" className="role-card">
              <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-white/20 transition-all duration-300">
                <User className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-black text-white mb-4">Employee</h3>
              <p className="text-white/60 mb-6 leading-relaxed">
                Scan for payments, claim UTXOs, withdraw to public wallet when needed.
              </p>
              <div className="flex items-center justify-center text-white font-medium">
                Claim Salary
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
            
            <Link href="/auditor" className="role-card">
              <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-white/20 transition-all duration-300">
                <FileSearch className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-black text-white mb-4">Auditor</h3>
              <p className="text-white/60 mb-6 leading-relaxed">
                Load audit packages, verify on-chain, export compliance reports.
              </p>
              <div className="flex items-center justify-center text-white font-medium">
                Verify
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="px-4 py-32 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-20">
            Powered By
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="glass-card p-6">
              <div className="text-white/60 text-sm mb-2">Privacy Layer</div>
              <div className="text-white font-semibold">Umbra SDK</div>
            </div>
            <div className="glass-card p-6">
              <div className="text-white/60 text-sm mb-2">Blockchain</div>
              <div className="text-white font-semibold">Solana Devnet</div>
            </div>
            <div className="glass-card p-6">
              <div className="text-white/60 text-sm mb-2">Framework</div>
              <div className="text-white font-semibold">Next.js 14</div>
            </div>
            <div className="glass-card p-6">
              <div className="text-white/60 text-sm mb-2">ZK Proofs</div>
              <div className="text-white font-semibold">Browser Native</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center gap-8 mb-8">
            <a href="https://github.com/thesithunyein/stipend" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
              GitHub
            </a>
            <a href="https://sdk.umbraprivacy.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
              Umbra SDK
            </a>
            <a href="https://solana.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
              Solana
            </a>
          </div>
          <p className="text-white/40 text-sm">
            Built for the Umbra SDK Hackathon 2025 • Real product, no mocks
          </p>
        </div>
      </footer>
    </div>
  );
}
