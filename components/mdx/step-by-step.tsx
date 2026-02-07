"use client";

import { useState, Children, type ReactNode } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyElement = { props: Record<string, any> };

/* ── Data carrier ── */

interface StepProps {
  /** Step title. */
  title: string;
  children: ReactNode;
}

/** Defines a single step. Used inside `<StepByStep>`. */
export function Step({ children }: StepProps) {
  return <>{children}</>;
}

/* ── StepByStep ── */

interface StepByStepProps {
  /** Title shown in header bar. */
  title?: string;
  children: ReactNode;
}

export function StepByStep({ title, children }: StepByStepProps) {
  const steps: { title: string; content: ReactNode }[] = [];

  Children.forEach(children, (child) => {
    if (!child || typeof child !== "object" || !("props" in child)) return;
    const p = (child as AnyElement).props;
    if (typeof p.title === "string") {
      steps.push({ title: p.title, content: p.children });
    }
  });

  const [revealed, setRevealed] = useState(1); // how many steps shown
  const total = steps.length;

  if (total === 0) return null;

  return (
    <div className="mb-6 border-2 border-[#1a1a1a]">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b-2 border-[#1a1a1a]"
        style={{ backgroundColor: "#1a1a1a" }}
      >
        <span
          className="text-[10px] font-bold uppercase tracking-[0.15em]"
          style={{ fontFamily: "var(--font-mono)", color: "#fafafa" }}
        >
          ■ {title || "Step by Step"}
        </span>
        <span
          className="text-[10px] font-bold tracking-[0.1em]"
          style={{ fontFamily: "var(--font-mono)", color: "#888" }}
        >
          {revealed}/{total}
        </span>
      </div>

      {/* Steps */}
      <div className="px-4 py-3" style={{ backgroundColor: "#fff" }}>
        {steps.map((step, i) => {
          const isVisible = i < revealed;
          const isCurrent = i === revealed - 1;

          return (
            <div
              key={i}
              className="flex gap-3"
              style={{
                opacity: isVisible ? 1 : 0.25,
                transition: "opacity 0.3s ease",
              }}
            >
              {/* Step number + connector */}
              <div className="flex flex-col items-center shrink-0">
                <div
                  className="w-6 h-6 flex items-center justify-center text-[10px] font-bold shrink-0"
                  style={{
                    fontFamily: "var(--font-mono)",
                    backgroundColor: isCurrent
                      ? "#1a1a1a"
                      : isVisible
                        ? "#e5e5e5"
                        : "#f5f5f5",
                    color: isCurrent
                      ? "#fafafa"
                      : isVisible
                        ? "#1a1a1a"
                        : "#ccc",
                  }}
                >
                  {i + 1}
                </div>
                {i < total - 1 && (
                  <div
                    className="w-px flex-1 min-h-3"
                    style={{
                      backgroundColor: isVisible ? "#e5e5e5" : "#f0f0f0",
                    }}
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-4 last:pb-0">
                <p
                  className="text-[11px] font-bold uppercase tracking-[0.08em] mb-1.5 flex items-center gap-2"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: isVisible ? "#1a1a1a" : "#ccc",
                  }}
                >
                  {step.title}
                  {isCurrent && (
                    <span
                      className="text-[8px] px-1.5 py-0.5 uppercase tracking-[0.1em]"
                      style={{
                        backgroundColor: "#ff0000",
                        color: "#fff",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      Current
                    </span>
                  )}
                </p>
                {isVisible && step.content && (
                  <div
                    className="text-[13px] leading-[1.75]"
                    style={{
                      fontFamily: "var(--font-serif)",
                      color: "#555",
                    }}
                  >
                    {step.content}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation footer */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-t-2 border-[#e5e5e5]"
        style={{ backgroundColor: "#fafafa" }}
      >
        <button
          onClick={() => setRevealed((r) => Math.max(1, r - 1))}
          disabled={revealed <= 1}
          className="px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] border-2 cursor-pointer transition-colors disabled:opacity-25 disabled:cursor-not-allowed hover:enabled:bg-[#f0f0f0]"
          style={{
            fontFamily: "var(--font-mono)",
            borderColor: "#1a1a1a",
            color: "#1a1a1a",
          }}
        >
          ◄ Back
        </button>

        {/* Progress dots */}
        <div className="flex items-center gap-1">
          {steps.map((_, i) => (
            <span
              key={i}
              className="block w-1.5 h-1.5"
              style={{
                backgroundColor:
                  i < revealed ? "#1a1a1a" : "#ddd",
                transition: "background-color 0.3s ease",
              }}
            />
          ))}
        </div>

        {revealed < total ? (
          <button
            onClick={() => setRevealed((r) => Math.min(total, r + 1))}
            className="px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] border-2 cursor-pointer transition-colors hover:bg-[#f5f5f5]"
            style={{
              fontFamily: "var(--font-mono)",
              borderColor: "#1a1a1a",
              backgroundColor: "#1a1a1a",
              color: "#fafafa",
            }}
          >
            Next ►
          </button>
        ) : (
          <button
            onClick={() => setRevealed(1)}
            className="px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] border-2 cursor-pointer transition-colors hover:bg-[#f0f0f0]"
            style={{
              fontFamily: "var(--font-mono)",
              borderColor: "#1a1a1a",
              color: "#1a1a1a",
            }}
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
