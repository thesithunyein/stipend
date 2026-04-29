"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Briefcase, User, FileSearch } from "lucide-react";
import { ConnectButton } from "./wallet-provider";

const navItems = [
  { href: "/employer", label: "Employer", icon: Briefcase },
  { href: "/employee", label: "Employee", icon: User },
  { href: "/auditor", label: "Auditor", icon: FileSearch },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 glass !rounded-none border-t-0 border-l-0 border-r-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">Stipend</span>
          </Link>

          <div className="hidden sm:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-brand-600/20 text-brand-300 border border-brand-500/30"
                      : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <ConnectButton />
        </div>
      </div>
    </nav>
  );
}
