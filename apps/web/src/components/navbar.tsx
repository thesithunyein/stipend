"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Briefcase, User, FileSearch } from "lucide-react";
import { ConnectButton } from "./wallet-provider";

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="navbar-blur fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-lg">
              <svg viewBox="0 0 64 64" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
                <rect width="64" height="64" rx="14" fill="#000"/>
                <text x="32" y="46" fontFamily="system-ui,-apple-system,sans-serif" fontWeight="900" fontSize="44" textAnchor="middle" fill="#fff">$</text>
                <rect x="12" y="29" width="40" height="6" rx="3" fill="#fff"/>
              </svg>
            </div>
            <div>
              <span className="text-xl font-black text-white">Stipend</span>
              <div className="text-xs text-white/60 font-medium">Private Payroll</div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            <Link href="/" className="text-white/70 hover:text-white px-4 py-2 rounded-xl hover:bg-white/10 transition-all duration-200 font-medium">
              Home
            </Link>
            <Link href="/employer" className="text-white/70 hover:text-white px-4 py-2 rounded-xl hover:bg-white/10 transition-all duration-200 font-medium">
              Employer
            </Link>
            <Link href="/employee" className="text-white/70 hover:text-white px-4 py-2 rounded-xl hover:bg-white/10 transition-all duration-200 font-medium">
              Employee
            </Link>
            <Link href="/auditor" className="text-white/70 hover:text-white px-4 py-2 rounded-xl hover:bg-white/10 transition-all duration-200 font-medium">
              Auditor
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <ConnectButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
