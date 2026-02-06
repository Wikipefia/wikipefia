"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { C } from "@/lib/theme";
import type { ArticleFrontmatterType } from "@/lib/schemas";
import type { TocEntry } from "@/lib/content/types";

function loc(obj: Record<string, string>, locale: string): string {
  return obj[locale] || obj.en || obj.ru || "";
}

/* ── Table of Contents ── */
function TableOfContents({
  toc,
  activeId,
}: {
  toc: TocEntry[];
  activeId: string;
}) {
  return (
    <nav className="space-y-0.5">
      <div
        className="text-[9px] font-bold uppercase tracking-wider mb-3 pb-2"
        style={{ color: C.red, borderBottom: `1px solid ${C.borderLight}` }}
      >
        TABLE_OF_CONTENTS
      </div>
      {toc.map((entry) => (
        <a
          key={entry.id}
          href={`#${entry.id}`}
          className="block text-[11px] uppercase py-1 transition-colors hover:text-[#ff0000]"
          style={{
            paddingLeft: entry.depth >= 3 ? "12px" : "0",
            color: activeId === entry.id ? C.text : C.textMuted,
            fontWeight: activeId === entry.id ? 700 : 400,
            borderLeft:
              activeId === entry.id
                ? `2px solid ${C.red}`
                : entry.depth >= 3
                ? `1px solid ${C.borderLight}`
                : "none",
          }}
        >
          {entry.text}
        </a>
      ))}
    </nav>
  );
}

/* ── Meta Sidebar ── */
function MetaSidebar({
  frontmatter,
  entitySlug,
  locale,
}: {
  frontmatter: ArticleFrontmatterType;
  entitySlug: string;
  locale: string;
}) {
  const diffColor =
    frontmatter.difficulty === "advanced"
      ? C.red
      : frontmatter.difficulty === "intermediate"
      ? "#cc8800"
      : "#008800";

  return (
    <div className="space-y-0">
      <div
        className="text-[9px] font-bold uppercase tracking-wider mb-3 pb-2"
        style={{ color: C.red, borderBottom: `1px solid ${C.borderLight}` }}
      >
        ARTICLE_META
      </div>
      <div className="border-2" style={{ borderColor: C.border }}>
        {[
          frontmatter.difficulty && {
            label: "DIFFICULTY",
            value: frontmatter.difficulty.toUpperCase(),
            color: diffColor,
          },
          frontmatter.estimatedReadTime && {
            label: "READ_TIME",
            value: `${frontmatter.estimatedReadTime} MIN`,
          },
          frontmatter.author && {
            label: "AUTHOR",
            value: frontmatter.author.toUpperCase(),
          },
          { label: "CREATED", value: frontmatter.created },
          frontmatter.updated && {
            label: "UPDATED",
            value: frontmatter.updated,
          },
        ]
          .filter((x): x is { label: string; value: string; color?: string } => Boolean(x))
          .map((item, i, arr) => (
            <div
              key={item.label}
              className="px-3 py-2 flex items-center justify-between"
              style={{
                borderBottom:
                  i < arr.length - 1
                    ? `1px solid ${C.borderLight}`
                    : "none",
              }}
            >
              <span
                className="text-[9px] uppercase tracking-wider"
                style={{ color: C.textMuted }}
              >
                {item.label}
              </span>
              <span
                className="text-[10px] font-bold uppercase"
                style={{ color: item.color || C.text }}
              >
                {item.value}
              </span>
            </div>
          ))}
      </div>

      {/* Prerequisites */}
      {frontmatter.prerequisites && frontmatter.prerequisites.length > 0 && (
        <div className="mt-4">
          <div
            className="text-[9px] font-bold uppercase tracking-wider mb-2"
            style={{ color: C.textMuted }}
          >
            PREREQUISITES
          </div>
          {frontmatter.prerequisites.map((prereq) => (
            <Link
              key={prereq}
              href={`/${entitySlug}/${prereq}`}
              className="block text-[11px] uppercase py-1 hover:text-[#ff0000] transition-colors"
              style={{ color: C.textMuted }}
            >
              ▸ {prereq}
            </Link>
          ))}
        </div>
      )}

      {/* Author link */}
      {frontmatter.author && (
        <div className="mt-4">
          <Link
            href={`/${frontmatter.author}`}
            className="block border-2 px-3 py-2 text-center text-[10px] font-bold uppercase tracking-wider transition-colors hover:bg-black hover:text-white"
            style={{ borderColor: C.border }}
          >
            VIEW AUTHOR PROFILE →
          </Link>
        </div>
      )}
    </div>
  );
}

/* ── Article Page ── */
interface ArticlePageProps {
  frontmatter: ArticleFrontmatterType;
  toc: TocEntry[];
  entitySlug: string;
  entityType: "subject" | "teacher";
  parentName: string;
  locale: string;
  isFallback?: boolean;
  fallbackLocale?: string;
  children: React.ReactNode; // MDX rendered content
}

export function ArticlePage({
  frontmatter,
  toc,
  entitySlug,
  entityType,
  parentName,
  locale,
  isFallback,
  fallbackLocale,
  children,
}: ArticlePageProps) {
  const [activeId, setActiveId] = useState(toc[0]?.id || "");

  /* Scroll spy for ToC */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px" }
    );

    toc.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [toc]);

  const title = loc(frontmatter.title, locale);

  const diffColor =
    frontmatter.difficulty === "advanced"
      ? C.red
      : frontmatter.difficulty === "intermediate"
      ? "#cc8800"
      : "#008800";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Fallback banner */}
      {isFallback && (
        <div
          className="border-2 border-[#cc8800] bg-[#cc880008] px-4 py-3 mb-6"
        >
          <p className="text-[11px] uppercase tracking-wider" style={{ color: "#cc8800" }}>
            This article is not available in your language. Showing{" "}
            {fallbackLocale?.toUpperCase()} version.
          </p>
        </div>
      )}

      {/* ── Article header ── */}
      <motion.div
        className="mb-8 pb-6"
        style={{ borderBottom: `2px solid ${C.border}` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span
            className="text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider"
            style={{ backgroundColor: C.text, color: C.bgWhite }}
          >
            {entityType === "subject" ? "SUBJECT_ARTICLE" : "TEACHER_ARTICLE"}
          </span>
          {frontmatter.difficulty && (
            <span
              className="text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider border"
              style={{ borderColor: diffColor, color: diffColor }}
            >
              {frontmatter.difficulty.toUpperCase()}
            </span>
          )}
          {frontmatter.estimatedReadTime && (
            <span
              className="text-[10px] px-2 py-0.5 uppercase tracking-wider border"
              style={{ borderColor: C.borderLight, color: C.textMuted }}
            >
              {frontmatter.estimatedReadTime} MIN READ
            </span>
          )}
        </div>

        <h1 className="text-3xl md:text-5xl font-bold leading-tight tracking-tighter uppercase">
          {title}
        </h1>

        <div
          className="flex items-center gap-4 mt-4 text-[10px] uppercase tracking-wider"
          style={{ color: C.textMuted }}
        >
          {frontmatter.author && (
            <>
              <span>
                BY{" "}
                <Link
                  href={`/${frontmatter.author}`}
                  className="font-bold hover:text-[#ff0000] transition-colors"
                  style={{ color: C.text }}
                >
                  {frontmatter.author}
                </Link>
              </span>
              <span>|</span>
            </>
          )}
          {frontmatter.updated && <span>UPDATED {frontmatter.updated}</span>}
        </div>
      </motion.div>

      {/* ── Three-column layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_200px] gap-8">
        {/* Left: Table of Contents */}
        <aside className="hidden lg:block">
          <div className="sticky top-20">
            <TableOfContents toc={toc} activeId={activeId} />
          </div>
        </aside>

        {/* Mobile ToC */}
        <div className="lg:hidden mb-6">
          <details className="border-2" style={{ borderColor: C.border }}>
            <summary
              className="px-4 py-2 cursor-pointer text-[10px] font-bold uppercase tracking-wider"
              style={{ backgroundColor: C.text, color: C.bgWhite }}
            >
              TABLE_OF_CONTENTS [{toc.length}]
            </summary>
            <div className="px-4 py-2">
              {toc.map((entry) => (
                <a
                  key={entry.id}
                  href={`#${entry.id}`}
                  className="block text-[11px] uppercase py-1 hover:text-[#ff0000]"
                  style={{
                    paddingLeft: entry.depth >= 3 ? "12px" : "0",
                    color: C.textMuted,
                  }}
                >
                  {entry.text}
                </a>
              ))}
            </div>
          </details>
        </div>

        {/* Center: Article Content (MDX) */}
        <article className="min-w-0 prose-wiki">{children}</article>

        {/* Right: Meta Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-20">
            <MetaSidebar
              frontmatter={frontmatter}
              entitySlug={entitySlug}
              locale={locale}
            />
          </div>
        </aside>

        {/* Mobile meta */}
        <div className="lg:hidden">
          <MetaSidebar
            frontmatter={frontmatter}
            entitySlug={entitySlug}
            locale={locale}
          />
        </div>
      </div>

      {/* End marker */}
      <div
        className="mt-12 pt-6 text-center"
        style={{ borderTop: `2px solid ${C.border}` }}
      >
        <p
          className="text-[10px] uppercase tracking-wider"
          style={{ color: C.textMuted }}
        >
          — END_OF_ARTICLE —
        </p>
        <Link
          href={`/${entitySlug}`}
          className="inline-block mt-4 border-2 px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors hover:bg-black hover:text-white"
          style={{ borderColor: C.border }}
        >
          ← BACK TO {parentName.toUpperCase()}
        </Link>
      </div>
    </div>
  );
}
