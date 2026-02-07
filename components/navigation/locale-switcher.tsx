"use client";

import { C } from "@/lib/theme";

const LOCALE_LABELS: Record<string, string> = {
  ru: "RU",
  en: "EN",
  cz: "CZ",
};

export function LocaleSwitcher({ currentLocale }: { currentLocale: string }) {
  function switchLocale(locale: string) {
    document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=31536000`;
    window.location.reload();
  }

  return (
    <div className="flex border-2" style={{ borderColor: C.border }}>
      {Object.entries(LOCALE_LABELS).map(([locale, label], i, arr) => (
        <button
          key={locale}
          onClick={() => switchLocale(locale)}
          className="px-2 py-1 text-[10px] font-bold cursor-pointer transition-colors"
          style={{
            backgroundColor: locale === currentLocale ? C.headerBg : "transparent",
            color: locale === currentLocale ? C.headerText : C.text,
            borderRight:
              i < arr.length - 1 ? `2px solid ${C.border}` : "none",
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
