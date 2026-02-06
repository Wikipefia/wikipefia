"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { C } from "@/lib/theme";
import type { SubjectManifest } from "@/lib/content/types";
import type { Locale } from "@/lib/i18n/config";

function loc(obj: Record<string, string>, locale: string): string {
  return obj[locale] || obj.en || obj.ru || "";
}

interface SubjectFrontProps {
  subject: SubjectManifest;
  locale: Locale;
  frontMdx?: string | null;
}

export function SubjectFront({ subject, locale }: SubjectFrontProps) {
  const config = subject.config;
  const totalArticles = config.categories.reduce(
    (acc, cat) => acc + cat.articles.length,
    0
  );

  const difficultyColor =
    config.metadata?.difficulty === "hard"
      ? C.red
      : config.metadata?.difficulty === "medium"
      ? "#cc8800"
      : "#008800";

  return (
    <>
      {/* ── HEADER ── */}
      <section className="border-b-2" style={{ borderColor: C.border }}>
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span
                className="text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider"
                style={{ backgroundColor: C.text, color: C.bgWhite }}
              >
                SUBJECT
              </span>
              {config.metadata?.difficulty && (
                <span
                  className="text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider border"
                  style={{ borderColor: difficultyColor, color: difficultyColor }}
                >
                  {config.metadata.difficulty.toUpperCase()}
                </span>
              )}
              {config.metadata?.semester && (
                <span
                  className="text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider border"
                  style={{ borderColor: C.borderLight, color: C.textMuted }}
                >
                  S{config.metadata.semester}
                </span>
              )}
              {config.metadata?.credits && (
                <span
                  className="text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider border"
                  style={{ borderColor: C.borderLight, color: C.textMuted }}
                >
                  {config.metadata.credits} ECTS
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-6xl font-bold leading-none tracking-tighter uppercase mb-4">
              {loc(config.name, locale)}
            </h1>
            <p
              className="text-sm leading-relaxed uppercase max-w-2xl"
              style={{ color: C.textMuted }}
            >
              {loc(config.description, locale)}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── METADATA BAR ── */}
      <section className="border-b-2" style={{ borderColor: C.border }}>
        <div className="max-w-7xl mx-auto px-4">
          <div
            className="grid grid-cols-2 md:grid-cols-4 divide-x"
            style={{ borderColor: C.borderLight }}
          >
            {[
              {
                label: "DEPARTMENT",
                value: config.metadata?.department
                  ? loc(config.metadata.department, locale)
                  : "—",
              },
              { label: "SEMESTER", value: `${config.metadata?.semester || "—"}` },
              {
                label: "CREDITS",
                value: config.metadata?.credits
                  ? `${config.metadata.credits} ECTS`
                  : "—",
              },
              { label: "ARTICLES", value: `${totalArticles}` },
            ].map((item) => (
              <div
                key={item.label}
                className="px-4 py-4"
                style={{ borderColor: C.borderLight }}
              >
                <div
                  className="text-[9px] uppercase tracking-wider mb-1"
                  style={{ color: C.textMuted }}
                >
                  {item.label}
                </div>
                <div className="text-sm font-bold uppercase">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES & ARTICLES ── */}
      <section className="border-b-2" style={{ borderColor: C.border }}>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div
            className="text-[10px] font-bold uppercase tracking-wider mb-8"
            style={{ color: C.red }}
          >
            // CATEGORIES
          </div>

          <div className="space-y-6">
            {config.categories.map((category, ci) => {
              // Find article metadata from manifest
              const categoryArticles = category.articles
                .map((slug) => {
                  const article = subject.articles[slug];
                  if (!article) return null;
                  return {
                    slug,
                    title: loc(article.frontmatter.title, locale),
                    difficulty: article.frontmatter.difficulty,
                    readTime: article.frontmatter.estimatedReadTime,
                  };
                })
                .filter(Boolean) as Array<{
                slug: string;
                title: string;
                difficulty?: string;
                readTime?: number;
              }>;

              return (
                <motion.div
                  key={category.slug}
                  className="border-2"
                  style={{ borderColor: C.border }}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: ci * 0.1 }}
                >
                  <div
                    className="px-4 py-3 flex items-center justify-between"
                    style={{ backgroundColor: C.text, color: C.bgWhite }}
                  >
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {loc(category.name, locale)}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider">
                      [{categoryArticles.length}]
                    </span>
                  </div>

                  {categoryArticles.map((article, ai) => (
                    <Link
                      key={article.slug}
                      href={`/${config.slug}/${article.slug}`}
                      className="flex items-center justify-between px-4 py-3 group transition-colors hover:bg-black hover:text-white"
                      style={{
                        borderBottom:
                          ai < categoryArticles.length - 1
                            ? `1px solid ${C.borderLight}`
                            : "none",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[10px]" style={{ color: C.textMuted }}>
                          ▸
                        </span>
                        <span className="text-sm uppercase font-medium">
                          {article.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        {article.readTime && (
                          <span
                            className="text-[10px] uppercase"
                            style={{ color: C.textMuted }}
                          >
                            {article.readTime} MIN
                          </span>
                        )}
                        {article.difficulty && (
                          <span
                            className="text-[9px] font-bold uppercase px-1.5 py-0.5 border"
                            style={{
                              borderColor:
                                article.difficulty === "advanced"
                                  ? C.red
                                  : article.difficulty === "intermediate"
                                  ? "#cc8800"
                                  : "#008800",
                              color:
                                article.difficulty === "advanced"
                                  ? C.red
                                  : article.difficulty === "intermediate"
                                  ? "#cc8800"
                                  : "#008800",
                            }}
                          >
                            {article.difficulty.slice(0, 4).toUpperCase()}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FACULTY ── */}
      {subject.resolvedTeachers.length > 0 && (
        <section className="border-b-2" style={{ borderColor: C.border }}>
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div
              className="text-[10px] font-bold uppercase tracking-wider mb-6"
              style={{ color: C.red }}
            >
              // FACULTY
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {subject.resolvedTeachers.map((teacher) => (
                <Link
                  key={teacher.slug}
                  href={`/${teacher.slug}`}
                  className="border-2 group transition-colors hover:bg-black hover:text-white block"
                  style={{ borderColor: C.border }}
                >
                  <div
                    className="px-4 py-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider"
                    style={{ borderBottom: `1px solid ${C.borderLight}` }}
                  >
                    <span>{loc(teacher.name, locale)}</span>
                    <span style={{ color: C.red }}>
                      {teacher.ratings.overall}/5.0
                    </span>
                  </div>
                  <div className="px-4 py-4">
                    <div
                      className="text-[10px] uppercase"
                      style={{ color: C.textMuted }}
                    >
                      {teacher.ratings.count} REVIEWS
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
