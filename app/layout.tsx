import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Serif } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { SearchProvider } from "@/components/search/search-provider";
import "katex/dist/katex.min.css";
import "./globals.css";

const plexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin", "cyrillic"],
  variable: "--font-mono",
});

const plexSerif = IBM_Plex_Serif({
  weight: ["400", "500", "600"],
  subsets: ["latin", "cyrillic"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Wikipefia — Educational Portal",
  description:
    "A statically-generated educational portal for university students. Browse subjects, read articles, and find teachers.",
};

async function getSearchMeta(): Promise<{ hash: string }> {
  try {
    const fs = await import("fs/promises");
    const path = await import("path");
    const metaPath = path.join(
      process.cwd(),
      ".content-build",
      "search-meta.json"
    );
    const raw = await fs.readFile(metaPath, "utf-8");
    const meta = JSON.parse(raw);
    return { hash: meta.hash };
  } catch {
    return { hash: "dev" };
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  const searchMeta = await getSearchMeta();

  return (
    <html lang={locale}>
      <body
        className={`${plexMono.variable} ${plexSerif.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <SearchProvider locale={locale} searchMeta={searchMeta}>
            {children}
          </SearchProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
