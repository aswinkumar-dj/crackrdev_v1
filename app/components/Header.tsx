"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Problem", href: "#problem" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Career Guidance", href: "#career" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, loading } = useAuth();
  const signedIn = Boolean(user);
  const ctaHref = signedIn ? "/dashboard" : "/auth/login";
  const ctaLabel = loading ? "Loading..." : signedIn ? "Dashboard" : "Get Started";


  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#dcebea] bg-[#f8fbfb]/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between">

        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/crack_logo.png"
            alt="crackrDev.ai"
            width={190}
            height={44}
            priority
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-[15px] font-semibold text-[#4b5d5b] transition-colors hover:text-[#17a1a6]"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-3">

          {/* Hide on mobile, show on desktop */}
          <Link
            href={ctaHref}
            className="hidden rounded-lg bg-[#17a1a6] px-5 py-3 text-sm font-semibold text-white
                       transition-colors hover:bg-[#12898e] md:inline-flex"
            aria-disabled={loading}
          >
            {ctaLabel}
          </Link>

          {/* Hamburger */}
          <button
            className="rounded-md p-3 text-[#4b5d5b] transition-colors hover:bg-[#e8f5f4] hover:text-[#101616] md:hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="flex flex-col gap-1 border-t border-[#dcebea] py-3 md:hidden">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="rounded-md px-4 py-2 text-sm font-semibold text-[#4b5d5b] transition-colors hover:bg-[#e8f5f4] hover:text-[#17a1a6]"
            >
              {label}
            </Link>
          ))}

          {/* CTA inside mobile dropdown */}
          <div className="px-4 pt-2 pb-1">
            <Link
              href={ctaHref}
              onClick={() => setMenuOpen(false)}
              className="block rounded-lg bg-[#17a1a6] px-4 py-2 text-center text-sm font-semibold
                         text-white transition-colors hover:bg-[#12898e]"
              aria-disabled={loading}
            >
              {ctaLabel}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
