"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { C } from "@/lib/theme";

const COOKIE_NAME = "wikipefia_welcome_seen";
const COOKIE_MAX_AGE = 86400; // 24 hours in seconds

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, maxAge: number) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function WelcomeBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!getCookie(COOKIE_NAME)) {
      setVisible(true);
    }
  }, []);

  function handleAccept() {
    setCookie(COOKIE_NAME, "1", COOKIE_MAX_AGE);
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-xl border-2 overflow-hidden"
            style={{
              borderColor: C.border,
              backgroundColor: C.bgWhite,
              fontFamily: "var(--font-mono)",
            }}
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {/* Header bar */}
            <div
              className="px-5 py-3 border-b-2 flex items-center justify-between"
              style={{
                backgroundColor: C.headerBg,
                borderColor: C.border,
              }}
            >
              <span
                className="text-[11px] font-bold uppercase tracking-[0.15em]"
                style={{ color: C.headerText }}
              >
                <span style={{ color: C.accent }}>&#9632;</span> &nbsp;
                WIKIPEFIA
              </span>
              <span
                className="text-[10px] uppercase tracking-wider"
                style={{ color: C.headerText, opacity: 0.4 }}
              >
                DEMO
              </span>
            </div>

            {/* Content */}
            <div className="px-5 py-6">
              {/* Title */}
              <h2
                className="text-2xl md:text-3xl font-bold uppercase tracking-tighter leading-tight mb-5"
                style={{ color: C.text }}
              >
                {"Добро пожаловать на "}
                <span style={{ color: C.accent }}>Wikipefia</span>!
              </h2>

              {/* Description */}
              <p
                className="text-[13px] leading-[1.75] mb-5"
                style={{ color: C.textMuted, fontFamily: "var(--font-serif)" }}
              >
                Данный портал находится на стадии активной разработки, на данный
                момент здесь нет никакого полезного контента, в данный момент
                портал работает в демо-режиме для демонстрации функционала.
              </p>

              {/* Lists */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* What to test */}
                <div
                  className="border p-4"
                  style={{ borderColor: C.borderLight }}
                >
                  <div
                    className="text-[10px] font-bold uppercase tracking-[0.15em] mb-3 flex items-center gap-2"
                    style={{ color: C.accent }}
                  >
                    <span>&#9654;</span> Что можно тестировать
                  </div>
                  <ul className="space-y-1.5">
                    {[
                      "Быстродейстие сайта",
                      "Поиск",
                      "Дизайн, функиональность",
                      "Демонстрационные виджеты внутри примера контента",
                    ].map((item) => (
                      <li
                        key={item}
                        className="text-[12px] uppercase tracking-wide flex items-start gap-2"
                        style={{ color: C.text }}
                      >
                        <span
                          className="mt-[2px] shrink-0"
                          style={{ color: C.accent, fontSize: "8px" }}
                        >
                          &#9632;
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* What NOT to test */}
                <div
                  className="border p-4"
                  style={{ borderColor: C.borderLight }}
                >
                  <div
                    className="text-[10px] font-bold uppercase tracking-[0.15em] mb-3 flex items-center gap-2"
                    style={{ color: C.textMuted }}
                  >
                    <span>&#9644;</span> Что тестировать не нужно
                  </div>
                  <ul className="space-y-1.5">
                    {["Наполнение статей"].map((item) => (
                      <li
                        key={item}
                        className="text-[12px] uppercase tracking-wide flex items-start gap-2"
                        style={{ color: C.textMuted }}
                      >
                        <span
                          className="mt-[2px] shrink-0"
                          style={{ fontSize: "8px" }}
                        >
                          &#9632;
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Thank you */}
              <p
                className="text-[13px] leading-[1.75] mb-6"
                style={{ color: C.textMuted, fontFamily: "var(--font-serif)" }}
              >
                Спасибо за то что следите за проектом!
              </p>

              {/* Divider */}
              <div
                className="border-t mb-5"
                style={{ borderColor: C.borderLight }}
              />

              {/* Telegram section */}
              <div className="mb-5">
                <p
                  className="text-[11px] font-bold uppercase tracking-wider mb-3"
                  style={{ color: C.textMuted }}
                >
                  Следить за ходом проекта можно здесь:
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <a
                    href="https://t.me/pefwiki"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 border-2 px-4 py-2.5 flex items-center justify-center gap-2 transition-colors cursor-pointer group"
                    style={{ borderColor: C.border }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--c-header-bg)";
                      e.currentTarget.style.color = "var(--c-header-text)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "var(--c-text)";
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4 shrink-0"
                    >
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                    </svg>
                    <span className="text-[11px] font-bold uppercase tracking-wider">
                      Канал Wikipefia
                    </span>
                  </a>
                  <a
                    href="https://t.me/wikipefia_chat"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 border-2 px-4 py-2.5 flex items-center justify-center gap-2 transition-colors cursor-pointer group"
                    style={{ borderColor: C.border }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--c-header-bg)";
                      e.currentTarget.style.color = "var(--c-header-text)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "var(--c-text)";
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4 shrink-0"
                    >
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                    </svg>
                    <span className="text-[11px] font-bold uppercase tracking-wider">
                      Чат Wikipefia
                    </span>
                  </a>
                </div>
              </div>

              {/* Accept button */}
              <button
                onClick={handleAccept}
                className="w-full py-3 border-2 cursor-pointer transition-colors"
                style={{
                  backgroundColor: C.headerBg,
                  borderColor: C.border,
                  color: C.headerText,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--c-accent)";
                  e.currentTarget.style.borderColor = "var(--c-accent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--c-header-bg)";
                  e.currentTarget.style.borderColor = "var(--c-border)";
                }}
              >
                <span className="text-[12px] font-bold uppercase tracking-[0.15em]">
                  Понятно
                </span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
