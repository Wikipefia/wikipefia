"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { C } from "@/lib/theme";
import { PageShell } from "@/components/shared/page-shell";

/* ── Types ── */
interface HomeSubject {
  slug: string;
  name: string;
  description: string;
  articleCount: number;
  difficulty: string;
  semester: number;
  credits: number;
}

interface HomeTeacher {
  slug: string;
  name: string;
  description: string;
  ratings: {
    overall: number;
    clarity: number;
    difficulty: number;
    usefulness: number;
    count: number;
  };
  subjects: string[];
}

interface HomeSystemArticle {
  slug: string;
  name: string;
  description: string;
  route: string;
}

interface HomeData {
  subjects: HomeSubject[];
  teachers: HomeTeacher[];
  systemArticles: HomeSystemArticle[];
  fromManifest: boolean;
}

/* ── Animated counter ── */
function Counter({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = value / 72;
    const interval = setInterval(() => {
      start += step;
      if (start >= value) {
        setDisplay(value);
        clearInterval(interval);
      } else {
        setDisplay(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(interval);
  }, [value]);
  return <span>{display}</span>;
}

/* ── Home Page ── */
export function HomePage({ data, locale }: { data: HomeData; locale: string }) {
  const { subjects, teachers, systemArticles } = data;

  const totalArticles = subjects.reduce((acc, s) => acc + s.articleCount, 0);

  return (
    <PageShell locale={locale}>
      {/* ── HERO ── */}
      <section className="border-b-2" style={{ borderColor: C.border }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-[1fr_auto] gap-8 py-16 md:py-24">
            <div>
              <motion.h1
                className="text-6xl md:text-[100px] font-bold leading-none tracking-tighter uppercase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                WIKI
                <br />
                <span style={{ color: C.red }}>PEFIA</span>
              </motion.h1>
              <motion.div
                className="mt-6 max-w-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                <p className="text-sm leading-relaxed uppercase">
                  Educational database for university students. Subjects,
                  articles, faculty profiles. No decoration. No fluff. Just
                  knowledge.
                </p>
              </motion.div>
            </div>

            <Link href="/explore">
              <motion.div
                className="border-2 self-start cursor-pointer group transition-colors hover:bg-black hover:text-white"
                style={{ borderColor: C.border }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div
                  className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider flex items-center justify-between"
                  style={{ backgroundColor: C.text, color: C.bgWhite }}
                >
                  <span>SYSTEM_STATUS</span>
                  <span className="opacity-50">EXPLORE →</span>
                </div>
                {[
                  { label: "SUBJECTS", val: subjects.length },
                  { label: "ARTICLES", val: totalArticles },
                  { label: "FACULTY", val: teachers.length },
                  { label: "LOCALES", val: 3 },
                ].map((s, i) => (
                  <div
                    key={s.label}
                    className="px-4 py-3 flex items-center justify-between gap-12"
                    style={{
                      borderBottom:
                        i < 3 ? `1px solid ${C.borderLight}` : "none",
                    }}
                  >
                    <span className="text-[10px] uppercase tracking-wider">
                      {s.label}
                    </span>
                    <span className="text-2xl font-bold tabular-nums">
                      <Counter value={s.val} />
                    </span>
                  </div>
                ))}
              </motion.div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURED / SYSTEM ARTICLES ── */}
      {systemArticles.length > 0 && (
        <section className="border-b-2" style={{ borderColor: C.border }}>
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div
              className="text-[10px] font-bold uppercase tracking-wider mb-6"
              style={{ color: C.red }}
            >
              // FEATURED
            </div>
            <div className="grid md:grid-cols-2 gap-0">
              {systemArticles.map((item, i) => (
                <Link key={item.slug} href={item.route}>
                  <motion.div
                    className="p-6 border-2 cursor-pointer group transition-colors hover:bg-black hover:text-white"
                    style={{
                      borderColor: C.border,
                      marginLeft: i > 0 ? "-2px" : 0,
                    }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className="text-[10px] font-bold px-1 border"
                        style={{ color: C.red, borderColor: C.red }}
                      >
                        GUIDE
                      </span>
                    </div>
                    <h3 className="text-lg font-bold uppercase mb-2">
                      {item.name}
                    </h3>
                    <p className="text-xs uppercase opacity-60">
                      {item.description}
                    </p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── SUBJECTS ── */}
      <section className="border-b-2" style={{ borderColor: C.border }}>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <div
              className="text-[10px] font-bold uppercase tracking-wider"
              style={{ color: C.red }}
            >
              // SUBJECTS
            </div>
            <div
              className="text-[10px] uppercase tracking-wider"
              style={{ color: C.textMuted }}
            >
              TOTAL: {subjects.length}
            </div>
          </div>

          <div className="border-2" style={{ borderColor: C.border }}>
            <div
              className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-4 py-2 text-[10px] font-bold uppercase tracking-wider"
              style={{ backgroundColor: C.text, color: C.bgWhite }}
            >
              <span>NAME</span>
              <span className="text-right w-16">ARTICLES</span>
              <span className="text-right w-16 hidden md:block">SEMESTER</span>
              <span className="text-right w-16">DIFF</span>
            </div>

            {subjects.map((sub, i) => (
              <Link
                key={sub.slug}
                href={`/${sub.slug}`}
                className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-4 py-4 group transition-colors hover:bg-black hover:text-white"
                style={{
                  borderBottom:
                    i < subjects.length - 1
                      ? `1px solid ${C.borderLight}`
                      : "none",
                }}
              >
                <div>
                  <span className="text-sm font-bold uppercase">
                    {sub.name}
                  </span>
                  <p className="text-[11px] mt-1 opacity-50 uppercase">
                    {sub.description}
                  </p>
                </div>
                <span className="text-sm font-bold tabular-nums text-right w-16">
                  {sub.articleCount}
                </span>
                <span className="text-sm tabular-nums text-right w-16 hidden md:block">
                  S{sub.semester}
                </span>
                <span
                  className="text-[10px] font-bold uppercase text-right w-16"
                  style={{
                    color:
                      sub.difficulty === "hard"
                        ? C.red
                        : sub.difficulty === "medium"
                        ? "#cc8800"
                        : "#008800",
                  }}
                >
                  {sub.difficulty}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEACHERS ── */}
      <section className="border-b-2" style={{ borderColor: C.border }}>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div
            className="text-[10px] font-bold uppercase tracking-wider mb-6"
            style={{ color: C.red }}
          >
            // FACULTY
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {teachers.map((teacher) => (
              <Link
                key={teacher.slug}
                href={`/${teacher.slug}`}
                className="border-2 group cursor-pointer transition-colors hover:bg-black hover:text-white block"
                style={{ borderColor: C.border }}
              >
                <div
                  className="px-4 py-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider"
                  style={{ borderBottom: `1px solid ${C.borderLight}` }}
                >
                  <span>{teacher.name}</span>
                  <span style={{ color: C.red }}>
                    {teacher.ratings.overall}/5.0
                  </span>
                </div>
                <div className="px-4 py-4">
                  <p className="text-xs uppercase mb-3 opacity-60">
                    {teacher.description}
                  </p>
                  <div className="flex gap-4 text-[10px] uppercase">
                    <span>
                      CLARITY:{" "}
                      <span className="font-bold">
                        {teacher.ratings.clarity}
                      </span>
                    </span>
                    <span>
                      USEFUL:{" "}
                      <span className="font-bold">
                        {teacher.ratings.usefulness}
                      </span>
                    </span>
                    <span>
                      REVIEWS:{" "}
                      <span className="font-bold">{teacher.ratings.count}</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
