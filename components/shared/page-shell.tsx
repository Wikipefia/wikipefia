"use client";

import { useState, useEffect, Fragment } from "react";
import Link from "next/link";
import { C } from "@/lib/theme";
import { SearchDialog } from "@/components/search/search-dialog";
import { LocaleSwitcher } from "@/components/navigation/locale-switcher";

// ── Types ──────────────────────────────────────────────

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageShellProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  locale: string;
}

// ── PageShell ──────────────────────────────────────────

export function PageShell({ children, breadcrumbs, locale }: PageShellProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: C.bg,
        color: C.text,
        fontFamily: "var(--font-mono)",
      }}
    >
      {/* ── HEADER ── */}
      <header
        className="border-b-2 sticky top-0 z-40"
        style={{ borderColor: C.border, backgroundColor: C.bg }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-12 flex items-center justify-between">
            <Link
              href="/"
              className="text-sm font-bold tracking-wider uppercase"
            >
              WIKIPEFIA
            </Link>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-1 border-2 cursor-pointer transition-colors hover:bg-black hover:text-white"
                style={{ borderColor: C.border }}
              >
                <span className="text-xs uppercase font-bold">Search</span>
                <span
                  className="text-[10px] border px-1"
                  style={{ borderColor: C.borderLight }}
                >
                  ⌘K
                </span>
              </button>
              <LocaleSwitcher currentLocale={locale} />
            </div>
          </div>
        </div>
      </header>

      {/* ── BREADCRUMBS ── */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav
          className="border-b"
          style={{ borderColor: C.borderLight, backgroundColor: C.bg }}
        >
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-2 text-[10px] uppercase tracking-wider">
            {breadcrumbs.map((item, i) => (
              <Fragment key={i}>
                {i > 0 && <span className="opacity-30">/</span>}
                {item.href ? (
                  <Link
                    href={item.href}
                    className="hover:text-[#ff0000] transition-colors"
                    style={{ color: C.textMuted }}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="font-bold">{item.label}</span>
                )}
              </Fragment>
            ))}
          </div>
        </nav>
      )}

      {/* ── CONTENT ── */}
      <main className="flex-1">{children}</main>

      {/* ── FOOTER ── */}
      <footer className="border-t-2 mt-auto" style={{ borderColor: C.border }}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider">
            <div>
              <span className="font-bold">WIKIPEFIA V0.2.0</span>
              <span className="mx-3 opacity-20">|</span>
              <span style={{ color: C.textMuted }}>EDUCATIONAL_DATABASE</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/explore"
                className="hover:text-[#ff0000] transition-colors"
                style={{ color: C.textMuted }}
              >
                EXPLORE
              </Link>
              <span style={{ color: C.textMuted }}>© 2026</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ── SEARCH ── */}
      <SearchDialog
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </div>
  );
}
