import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { PageShell } from "@/components/shared/page-shell";
import { ArticlePage } from "@/components/pages/article-page";
import { MDXRenderer } from "@/lib/mdx/renderer";
import {
  getManifest,
  getCompiledMDX,
  getTableOfContents,
} from "@/lib/content/loader";
import { localized, resolveLocale } from "@/lib/i18n/helpers";
import type { Locale } from "@/lib/i18n/config";

interface Props {
  params: Promise<{ entitySlug: string; articleSlug: string }>;
}

export async function generateStaticParams() {
  try {
    const manifest = await getManifest();
    const params: Array<{ entitySlug: string; articleSlug: string }> = [];

    // Subject articles
    for (const [entitySlug, subject] of Object.entries(manifest.subjects)) {
      for (const articleSlug of Object.keys(subject.articles)) {
        if (articleSlug !== "_front") {
          params.push({ entitySlug, articleSlug });
        }
      }
    }

    // Teacher articles
    for (const [entitySlug, teacher] of Object.entries(manifest.teachers)) {
      for (const articleSlug of Object.keys(teacher.articles)) {
        if (articleSlug !== "_front") {
          params.push({ entitySlug, articleSlug });
        }
      }
    }

    return params;
  } catch {
    return [];
  }
}

export default async function ArticleRoute({ params }: Props) {
  const { entitySlug, articleSlug } = await params;
  const locale = (await getLocale()) as Locale;

  let manifest;
  try {
    manifest = await getManifest();
  } catch {
    notFound();
  }

  const entityInfo = manifest.routeMap[entitySlug];
  if (!entityInfo) notFound();

  // Get article from the correct entity type
  let article;
  let parentName: string;
  let entityType: "subject" | "teacher";

  if (entityInfo.type === "subject") {
    const subject = manifest.subjects[entitySlug];
    if (!subject) notFound();
    article = subject.articles[articleSlug];
    parentName = localized(subject.config.name, locale);
    entityType = "subject";
  } else if (entityInfo.type === "teacher") {
    const teacher = manifest.teachers[entitySlug];
    if (!teacher) notFound();
    article = teacher.articles[articleSlug];
    parentName = localized(teacher.config.name, locale);
    entityType = "teacher";
  } else {
    notFound();
  }

  if (!article) notFound();

  // Locale fallback
  const effectiveLocale = resolveLocale(article.locales, locale);
  const isFallback = effectiveLocale !== locale;

  const [compiledSource, toc] = await Promise.all([
    getCompiledMDX(article.compiledPath, effectiveLocale),
    getTableOfContents(article.tocPath, effectiveLocale),
  ]);

  const articleTitle = localized(article.frontmatter.title, locale);

  return (
    <PageShell
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: parentName, href: `/${entitySlug}` },
        { label: articleTitle },
      ]}
      locale={locale}
    >
      <ArticlePage
        frontmatter={article.frontmatter}
        toc={toc}
        entitySlug={entitySlug}
        entityType={entityType}
        parentName={parentName}
        locale={locale}
        isFallback={isFallback}
        fallbackLocale={isFallback ? effectiveLocale : undefined}
      >
        <MDXRenderer compiledSource={compiledSource} />
      </ArticlePage>
    </PageShell>
  );
}
