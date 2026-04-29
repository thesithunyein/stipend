"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "./wallet-provider";

export function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/employer", label: "Employer" },
    { href: "/employee", label: "Employee" },
    { href: "/auditor", label: "Auditor" },
  ];

  return (
    <nav className="navbar-blur fixed top-0 left-0 right-0 z-50">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="24" height="24" rx="6" fill="#5E6AD2"/>
              <text x="12" y="17" fontFamily="Inter,system-ui,sans-serif" fontWeight="700" fontSize="14" textAnchor="middle" fill="#fff">$</text>
            </svg>
            <span className="text-[#F5F5F5] font-semibold text-sm tracking-tight">Stipend</span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors duration-150 ${
                  pathname === link.href
                    ? "text-[#F5F5F5]"
                    : "text-[#6B6F76] hover:text-[#B5B5B5]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <ConnectButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
