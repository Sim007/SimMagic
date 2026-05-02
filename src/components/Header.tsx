"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import type { Locale } from "@/lib/i18n";

type NavItem = {
  key: string;
  label: string;
  href: string;
};

type HeaderProps = {
  locale: Locale;
  siteName: string;
  navItems: NavItem[];
  openMenuLabel: string;
  closeMenuLabel: string;
};

function normalize(pathname: string): string {
  if (pathname.endsWith("/") && pathname !== "/") {
    return pathname.slice(0, -1);
  }
  return pathname;
}

export default function Header({
  locale,
  siteName,
  navItems,
  openMenuLabel,
  closeMenuLabel
}: HeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const current = useMemo(() => normalize(pathname), [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-cyan-900/40 bg-slate-950/85 backdrop-blur">
      <div className="shell flex min-h-16 items-center justify-between gap-4 py-2">
        <Link href={`/${locale}`} className="text-sm font-semibold tracking-[0.14em] text-cyan-300">
          {siteName}
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const active = current === normalize(item.href);
            return (
              <Link
                key={item.key}
                href={item.href}
                className={
                  active
                    ? "rounded-md border border-cyan-500/40 bg-cyan-950/40 px-3 py-2 text-sm text-cyan-300"
                    : "rounded-md px-3 py-2 text-sm text-slate-300 transition hover:bg-cyan-950/20 hover:text-cyan-200"
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher locale={locale} />

          <button
            type="button"
            className="rounded-md border border-cyan-900/60 px-2 py-1 text-xs text-cyan-300 md:hidden"
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            aria-label={open ? closeMenuLabel : openMenuLabel}
          >
            {open ? "X" : "≡"}
          </button>
        </div>
      </div>

      {open ? (
        <nav className="shell pb-3 md:hidden">
          <div className="panel space-y-1 p-2">
            {navItems.map((item) => {
              const active = current === normalize(item.href);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={
                    active
                      ? "block rounded-md border border-cyan-500/40 bg-cyan-950/30 px-3 py-2 text-sm text-cyan-300"
                      : "block rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-cyan-950/20 hover:text-cyan-200"
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
