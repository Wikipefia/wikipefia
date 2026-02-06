"use client";

import { C } from "@/lib/theme";
import type { SystemArticleManifest, TocEntry } from "@/lib/content/types";
import type { Locale } from "@/lib/i18n/config";

function loc(obj: Record<string, string>, locale: string): string {
  return obj[locale] || obj.en || obj.ru || "";
}

interface SystemArticlePageProps {
  article: SystemArticleManifest;
  compiledSource: string;
  toc: TocEntry[];
  locale: Locale;
}

// This is a wrapper that accepts children in the server component.
// The actual MDX content is rendered by the server-side MDXRenderer
// and passed through the page component.
export function SystemArticlePage({
  article,
  locale,
}: SystemArticlePageProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <span
          className="text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider"
          style={{ backgroundColor: C.red, color: C.bgWhite }}
        >
          SYSTEM_ARTICLE
        </span>
        <h1 className="text-3xl md:text-5xl font-bold leading-tight tracking-tighter uppercase mt-4">
          {loc(article.config.name, locale)}
        </h1>
        {article.config.description && (
          <p
            className="text-sm uppercase mt-4"
            style={{ color: C.textMuted }}
          >
            {loc(article.config.description, locale)}
          </p>
        )}
      </div>
      <div
        className="pt-6"
        style={{ borderTop: `2px solid ${C.border}` }}
      >
        {/* MDX content is rendered in the server component and streamed */}
        <p
          className="text-[10px] uppercase tracking-wider"
          style={{ color: C.textMuted }}
        >
          Article content rendered via MDX
        </p>
      </div>
    </div>
  );
}
