"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { C } from "@/lib/theme";
import { PageShell } from "@/components/shared/page-shell";
import type {
  ExploreData,
  ExploreSubject,
  ExploreTeacher,
  ExploreSystemArticle,
} from "@/app/explore/page";

/* ── Tab types ── */
type Tab = "all" | "subjects" | "faculty" | "articles" | "system";

const TABS: { id: Tab; label: string }[] = [
  { id: "all", label: "ALL" },
  { id: "subjects", label: "SUBJECTS" },
  { id: "faculty", label: "FACULTY" },
  { id: "articles", label: "ARTICLES" },
  { id: "system", label: "SYSTEM" },
];

/* ── Difficulty badge ── */
function DiffBadge({ d }: { d?: string }) {
  if (!d) return null;
  const color =
    d === "hard" || d === "advanced"
      ? C.red
      : d === "medium" || d === "intermediate"
      ? "#cc8800"
      : "#008800";
  return (
    <span
      className="text-[9px] font-bold uppercase px-1 py-px border"
      style={{ borderColor: color, color }}
    >
      {d.slice(0, 4)}
    </span>
  );
}

/* ── Locale pills ── */
function LocalePills({ locales }: { locales: string[] }) {
  return (
    <div className="flex gap-1">
      {locales.map((l) => (
        <span
          key={l}
          className="text-[8px] font-bold uppercase px-1 py-px border"
          style={{ borderColor: C.borderLight, color: C.textMuted }}
        >
          {l}
        </span>
      ))}
    </div>
  );
}

/* ── Section header ── */
function SectionHeader({
  label,
  count,
  id,
}: {
  label: string;
  count: number;
  id?: string;
}) {
  return (
    <div id={id} className="flex items-center justify-between mb-6 scroll-mt-24">
      <div
        className="text-[10px] font-bold uppercase tracking-wider"
        style={{ color: C.red }}
      >
        // {label}
      </div>
      <div
        className="text-[10px] uppercase tracking-wider tabular-nums"
        style={{ color: C.textMuted }}
      >
        [{count}]
      </div>
    </div>
  );
}

/* ── Expandable subject row ── */
function SubjectRow({ sub, idx }: { sub: ExploreSubject; idx: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      className="border-2"
      style={{ borderColor: C.border }}
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.04 }}
    >
      {/* Header row */}
      <div
        className="grid grid-cols-[1fr_auto] items-center cursor-pointer transition-colors hover:bg-black hover:text-white"
        onClick={() => setOpen(!open)}
      >
        <Link
          href={`/${sub.slug}`}
          className="px-4 py-4 transition-colors hover:text-[#ff0000]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 mb-1">
            <span className="text-sm font-bold uppercase">{sub.name}</span>
            <DiffBadge d={sub.difficulty} />
          </div>
          <p
            className="text-[11px] uppercase"
            style={{ color: C.textMuted }}
          >
            {sub.description}
          </p>
        </Link>
        <div className="px-4 flex items-center gap-6 shrink-0">
          <div className="hidden md:flex items-center gap-4 text-[10px] uppercase" style={{ color: C.textMuted }}>
            <span>S{sub.semester}</span>
            <span>{sub.credits} ECTS</span>
            <span>{sub.department}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] tabular-nums" style={{ color: C.textMuted }}>
              {sub.articles.length} ART
            </span>
            <button
              className="w-6 h-6 flex items-center justify-center border text-[10px] font-bold cursor-pointer transition-transform"
              style={{
                borderColor: C.border,
                transform: open ? "rotate(45deg)" : "rotate(0deg)",
              }}
              onClick={(e) => {
                e.stopPropagation();
                setOpen(!open);
              }}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Expanded articles */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div
              style={{ borderTop: `2px solid ${C.border}` }}
            >
              {sub.articles.map((article, ai) => (
                <Link
                  key={article.slug}
                  href={`/${sub.slug}/${article.slug}`}
                  className="flex items-center justify-between px-4 py-2.5 pl-8 transition-colors hover:bg-black hover:text-white"
                  style={{
                    borderBottom:
                      ai < sub.articles.length - 1
                        ? `1px solid ${C.borderLight}`
                        : "none",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px]" style={{ color: C.textMuted }}>
                      ▸
                    </span>
                    <span className="text-xs uppercase">{article.title}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <LocalePills locales={article.locales} />
                    {article.readTime && (
                      <span className="text-[10px]" style={{ color: C.textMuted }}>
                        {article.readTime}m
                      </span>
                    )}
                    <DiffBadge d={article.difficulty} />
                  </div>
                </Link>
              ))}
              {sub.teachers.length > 0 && (
                <div
                  className="px-4 py-2 pl-8 text-[10px] uppercase"
                  style={{
                    borderTop: `1px solid ${C.borderLight}`,
                    color: C.textMuted,
                  }}
                >
                  FACULTY: {sub.teachers.join(" · ")}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Teacher row ── */
function TeacherRow({ t, idx }: { t: ExploreTeacher; idx: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      className="border-2"
      style={{ borderColor: C.border }}
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.04 }}
    >
      <div
        className="grid grid-cols-[1fr_auto] items-center cursor-pointer transition-colors hover:bg-black hover:text-white"
        onClick={() => setOpen(!open)}
      >
        <Link
          href={`/${t.slug}`}
          className="px-4 py-4 transition-colors hover:text-[#ff0000]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 mb-1">
            <span className="text-sm font-bold uppercase">{t.name}</span>
            <span
              className="text-[10px] font-bold tabular-nums"
              style={{ color: C.red }}
            >
              {t.ratings.overall}/5.0
            </span>
          </div>
          <p className="text-[11px] uppercase" style={{ color: C.textMuted }}>
            {t.description}
          </p>
        </Link>
        <div className="px-4 flex items-center gap-4 shrink-0">
          <div className="hidden md:flex gap-3 text-[10px] uppercase tabular-nums" style={{ color: C.textMuted }}>
            <span>CLR {t.ratings.clarity}</span>
            <span>USE {t.ratings.usefulness}</span>
            <span>DIF {t.ratings.difficulty}</span>
            <span>{t.ratings.count} REV</span>
          </div>
          {t.articles.length > 0 && (
            <button
              className="w-6 h-6 flex items-center justify-center border text-[10px] font-bold cursor-pointer transition-transform"
              style={{
                borderColor: C.border,
                transform: open ? "rotate(45deg)" : "rotate(0deg)",
              }}
              onClick={(e) => {
                e.stopPropagation();
                setOpen(!open);
              }}
            >
              +
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {open && t.articles.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div style={{ borderTop: `2px solid ${C.border}` }}>
              {t.articles.map((article, ai) => (
                <Link
                  key={article.slug}
                  href={`/${t.slug}/${article.slug}`}
                  className="flex items-center justify-between px-4 py-2.5 pl-8 transition-colors hover:bg-black hover:text-white"
                  style={{
                    borderBottom:
                      ai < t.articles.length - 1
                        ? `1px solid ${C.borderLight}`
                        : "none",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px]" style={{ color: C.textMuted }}>
                      ▸
                    </span>
                    <span className="text-xs uppercase">{article.title}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <LocalePills locales={article.locales} />
                  </div>
                </Link>
              ))}
              {t.subjects.length > 0 && (
                <div
                  className="px-4 py-2 pl-8 text-[10px] uppercase"
                  style={{
                    borderTop: `1px solid ${C.borderLight}`,
                    color: C.textMuted,
                  }}
                >
                  TEACHES: {t.subjects.join(" · ")}
                </div>
              )}
              {t.contact && (
                <div
                  className="px-4 py-2 pl-8 text-[10px] uppercase"
                  style={{
                    borderTop: `1px solid ${C.borderLight}`,
                    color: C.textMuted,
                  }}
                >
                  {t.contact.email && <span>✉ {t.contact.email}</span>}
                  {t.contact.office && <span className="ml-4">⌂ {t.contact.office}</span>}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── All articles flat list ── */
function AllArticlesTable({
  subjects,
  teachers,
}: {
  subjects: ExploreSubject[];
  teachers: ExploreTeacher[];
}) {
  const allArticles = [
    ...subjects.flatMap((s) =>
      s.articles.map((a) => ({
        ...a,
        parentName: s.name,
        parentType: "subject" as const,
      }))
    ),
    ...teachers.flatMap((t) =>
      t.articles.map((a) => ({
        ...a,
        parentName: t.name,
        parentType: "teacher" as const,
      }))
    ),
  ];

  return (
    <div className="border-2" style={{ borderColor: C.border }}>
      <div
        className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-4 py-2 text-[10px] font-bold uppercase tracking-wider"
        style={{ backgroundColor: C.headerBg, color: C.headerText }}
      >
        <span>TITLE</span>
        <span className="text-right w-24 hidden md:block">PARENT</span>
        <span className="text-right w-12">TIME</span>
        <span className="text-right w-16">LANG</span>
      </div>
      {allArticles.map((a, i) => (
        <Link
          key={`${a.parentSlug}/${a.slug}`}
          href={`/${a.parentSlug}/${a.slug}`}
          className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-4 py-3 items-center transition-colors hover:bg-black hover:text-white"
          style={{
            borderBottom:
              i < allArticles.length - 1
                ? `1px solid ${C.borderLight}`
                : "none",
          }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs uppercase truncate">{a.title}</span>
            <DiffBadge d={a.difficulty} />
          </div>
          <span
            className="text-[10px] uppercase text-right w-24 truncate hidden md:block"
            style={{ color: C.textMuted }}
          >
            {a.parentName}
          </span>
          <span
            className="text-[10px] tabular-nums text-right w-12"
            style={{ color: C.textMuted }}
          >
            {a.readTime ? `${a.readTime}m` : "—"}
          </span>
          <div className="flex justify-end w-16">
            <LocalePills locales={a.locales} />
          </div>
        </Link>
      ))}
    </div>
  );
}

/* ── Main component ── */
export function ExplorePage({
  data,
  locale,
}: {
  data: ExploreData;
  locale: string;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const { subjects, teachers, systemArticles, buildTime, buildHash } = data;

  const totalArticles =
    subjects.reduce((acc, s) => acc + s.articles.length, 0) +
    teachers.reduce((acc, t) => acc + t.articles.length, 0);

  const show = (tab: Tab) => activeTab === "all" || activeTab === tab;

  return (
    <PageShell
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Explore" },
      ]}
      locale={locale}
    >
      {/* ── HEADER ── */}
      <section className="border-b-2" style={{ borderColor: C.border }}>
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider"
                    style={{ backgroundColor: C.red, color: "#fff" }}
                  >
                    FULL_INDEX
                  </span>
                  <span
                    className="text-[10px] uppercase tracking-wider"
                    style={{ color: C.textMuted }}
                  >
                    BUILD {buildHash.slice(0, 8)}
                  </span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold leading-none tracking-tighter uppercase">
                  EXPLORE
                </h1>
                <p
                  className="text-sm uppercase mt-3 max-w-lg"
                  style={{ color: C.textMuted }}
                >
                  Complete index of all subjects, articles, faculty, and system
                  resources. Everything in the database, one page.
                </p>
              </div>

              {/* Stats block */}
              <div className="border-2 shrink-0" style={{ borderColor: C.border }}>
                <div
                  className="px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider"
                  style={{ backgroundColor: C.headerBg, color: C.headerText }}
                >
                  MANIFEST
                </div>
                {[
                  { k: "SUBJECTS", v: subjects.length },
                  { k: "FACULTY", v: teachers.length },
                  { k: "ARTICLES", v: totalArticles },
                  { k: "SYSTEM", v: systemArticles.length },
                ].map((row, i) => (
                  <div
                    key={row.k}
                    className="px-3 py-1.5 flex items-center justify-between gap-8 text-[10px]"
                    style={{
                      borderBottom: i < 3 ? `1px solid ${C.borderLight}` : "none",
                    }}
                  >
                    <span className="uppercase tracking-wider">{row.k}</span>
                    <span className="font-bold tabular-nums">{row.v}</span>
                  </div>
                ))}
                <div
                  className="px-3 py-1.5 text-[9px] uppercase"
                  style={{
                    borderTop: `1px solid ${C.borderLight}`,
                    color: C.textMuted,
                  }}
                >
                  {new Date(buildTime).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TAB BAR ── */}
      <section
        className="border-b-2 sticky top-12 z-30"
        style={{ borderColor: C.border, backgroundColor: C.bg }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                style={{
                  backgroundColor:
                    activeTab === tab.id ? C.headerBg : "transparent",
                  color: activeTab === tab.id ? C.headerText : C.textMuted,
                  borderRight: `1px solid ${C.borderLight}`,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-12">
        {/* Subjects */}
        {show("subjects") && (
          <section>
            <SectionHeader
              label="SUBJECTS"
              count={subjects.length}
              id="subjects"
            />
            <div className="space-y-3">
              {subjects.map((sub, i) => (
                <SubjectRow key={sub.slug} sub={sub} idx={i} />
              ))}
            </div>
          </section>
        )}

        {/* Faculty */}
        {show("faculty") && (
          <section>
            <SectionHeader
              label="FACULTY"
              count={teachers.length}
              id="faculty"
            />
            <div className="space-y-3">
              {teachers.map((t, i) => (
                <TeacherRow key={t.slug} t={t} idx={i} />
              ))}
            </div>
          </section>
        )}

        {/* All articles flat table */}
        {show("articles") && (
          <section>
            <SectionHeader
              label="ALL_ARTICLES"
              count={totalArticles}
              id="articles"
            />
            <AllArticlesTable subjects={subjects} teachers={teachers} />
          </section>
        )}

        {/* System articles */}
        {show("system") && (
          <section>
            <SectionHeader
              label="SYSTEM_ARTICLES"
              count={systemArticles.length}
              id="system"
            />
            <div className="border-2" style={{ borderColor: C.border }}>
              <div
                className="grid grid-cols-[1fr_auto_auto] gap-4 px-4 py-2 text-[10px] font-bold uppercase tracking-wider"
                style={{ backgroundColor: C.headerBg, color: C.headerText }}
              >
                <span>NAME</span>
                <span className="text-right w-16">PINNED</span>
                <span className="text-right w-16">LANG</span>
              </div>
              {systemArticles.map((sa, i) => (
                <Link
                  key={sa.slug}
                  href={sa.route}
                  className="grid grid-cols-[1fr_auto_auto] gap-4 px-4 py-3 items-center transition-colors hover:bg-black hover:text-white"
                  style={{
                    borderBottom:
                      i < systemArticles.length - 1
                        ? `1px solid ${C.borderLight}`
                        : "none",
                  }}
                >
                  <div>
                    <span className="text-xs font-bold uppercase">
                      {sa.name}
                    </span>
                    {sa.description && (
                      <p
                        className="text-[11px] uppercase mt-0.5"
                        style={{ color: C.textMuted }}
                      >
                        {sa.description}
                      </p>
                    )}
                  </div>
                  <div className="text-right w-16">
                    {sa.pinned && (
                      <span
                        className="text-[9px] font-bold px-1 py-px border"
                        style={{ borderColor: C.red, color: C.red }}
                      >
                        PIN
                      </span>
                    )}
                  </div>
                  <div className="flex justify-end w-16">
                    <LocalePills locales={sa.locales} />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </PageShell>
  );
}
