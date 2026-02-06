import Link from "next/link";
import { PageShell } from "@/components/shared/page-shell";

export default function NotFound() {
  return (
    <PageShell breadcrumbs={[{ label: "Home", href: "/" }, { label: "404" }]} locale="ru">
      <div className="max-w-7xl mx-auto px-4 py-24 md:py-32">
        <div className="max-w-lg">
          <div
            className="text-[10px] font-bold uppercase tracking-wider mb-6"
            style={{ color: "#ff0000", fontFamily: "var(--font-mono)" }}
          >
            // ERROR
          </div>
          <h1
            className="text-8xl md:text-[140px] font-bold leading-none tracking-tighter"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            404
          </h1>
          <div
            className="mt-6 mb-8"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <p
              className="text-sm uppercase mb-2"
              style={{ color: "#ff0000" }}
            >
              PAGE_NOT_FOUND
            </p>
            <p
              className="text-xs uppercase leading-relaxed"
              style={{ color: "#555555" }}
            >
              The requested resource does not exist in the database. Check the
              URL or use the search function to find what you need.
            </p>
          </div>
          <div
            className="flex gap-3"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <Link
              href="/"
              className="border-2 px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors hover:bg-black hover:text-white"
              style={{ borderColor: "#000000" }}
            >
              ← HOME
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
