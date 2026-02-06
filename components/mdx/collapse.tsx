"use client";

import { useState, type ReactNode } from "react";

interface CollapseProps {
  title: string;
  children: ReactNode;
}

export function Collapse({ title, children }: CollapseProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="mb-6 border-2 border-[#1a1a1a]"
      style={{ backgroundColor: open ? "#fafafa" : "#fff" }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 cursor-pointer text-left transition-colors hover:bg-[#f5f5f5]"
      >
        <span
          className="text-[11px] font-bold uppercase tracking-[0.1em]"
          style={{ fontFamily: "var(--font-mono)", color: "#1a1a1a" }}
        >
          {title}
        </span>
        <span
          className="text-[14px] transition-transform duration-200"
          style={{
            fontFamily: "var(--font-mono)",
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
            color: "#888",
          }}
        >
          ▸
        </span>
      </button>

      {open && (
        <div
          className="px-4 pb-4 text-[14px] leading-[1.75] border-t-2 border-[#1a1a1a]"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
