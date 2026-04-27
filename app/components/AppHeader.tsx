"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const APP_LINKS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Start Interview", href: "/interview" },
];

export default function AppHeader() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#dfe9ea] bg-white/96 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between">
        <Link href="/" className="shrink-0">
          <Image
            src="/crack_logo.png"
            alt="crackrDev.ai"
            width={158}
            height={36}
            priority
          />
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {APP_LINKS.map(({ label, href }) => {
            const isActive =
              href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith("/interview");

            return (
              <Link
                key={label}
                href={href}
                className={`rounded-lg px-3 py-2 text-sm transition-colors sm:px-4 ${
                  isActive
                    ? "bg-[#17a1a6] text-white"
                    : "text-[#425868] hover:bg-[#edf6f6] hover:text-[#17a1a6]"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
