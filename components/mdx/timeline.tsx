import { Children, type ReactNode } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyElement = { props: Record<string, any> };

/* ── Data carrier ── */

interface TimelineEventProps {
  /** Date or year label (e.g., "1776", "March 2020"). */
  date: string;
  /** Event title. */
  title: string;
  /** Optional accent color for the dot marker. */
  color?: string;
  children?: ReactNode;
}

/** Defines an event on the timeline. Used inside `<Timeline>`. */
export function TimelineEvent({ children }: TimelineEventProps) {
  return <>{children}</>;
}

/* ── Timeline ── */

interface TimelineProps {
  /** Optional title shown in header bar. */
  title?: string;
  children: ReactNode;
}

export function Timeline({ title, children }: TimelineProps) {
  /* Extract events */
  const events: (TimelineEventProps & { content: ReactNode })[] = [];

  Children.forEach(children, (child) => {
    if (!child || typeof child !== "object" || !("props" in child)) return;
    const p = (child as AnyElement).props;
    if (typeof p.date === "string" && typeof p.title === "string") {
      events.push({
        date: p.date,
        title: p.title,
        color: p.color,
        content: p.children,
      });
    }
  });

  if (events.length === 0) return null;

  return (
    <div className="mb-6 border-2 border-[#1a1a1a]">
      {/* Header */}
      {title && (
        <div
          className="px-4 py-2.5 border-b-2 border-[#1a1a1a]"
          style={{ backgroundColor: "#1a1a1a" }}
        >
          <span
            className="text-[10px] font-bold uppercase tracking-[0.15em]"
            style={{ fontFamily: "var(--font-mono)", color: "#fafafa" }}
          >
            ■ {title}
          </span>
        </div>
      )}

      {/* Events */}
      <div className="px-4 py-4" style={{ backgroundColor: "#fff" }}>
        {events.map((ev, i) => {
          const isLast = i === events.length - 1;
          const dotColor = ev.color || "#ff0000";

          return (
            <div key={i} className="flex gap-4">
              {/* Date column */}
              <div
                className="shrink-0 w-16 text-right pt-0.5"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                <span
                  className="text-[11px] font-bold tabular-nums"
                  style={{ color: "#1a1a1a" }}
                >
                  {ev.date}
                </span>
              </div>

              {/* Connector line + dot */}
              <div className="flex flex-col items-center shrink-0">
                {/* Dot */}
                <div
                  className="w-3 h-3 border-2 mt-1 shrink-0"
                  style={{
                    borderColor: dotColor,
                    backgroundColor: dotColor,
                  }}
                />
                {/* Line */}
                {!isLast && (
                  <div
                    className="w-px flex-1 min-h-6"
                    style={{ backgroundColor: "#e5e5e5" }}
                  />
                )}
              </div>

              {/* Content */}
              <div className={`flex-1 pb-5 ${isLast ? "pb-0" : ""}`}>
                <p
                  className="text-[12px] font-bold uppercase tracking-[0.08em] mb-1"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: "#1a1a1a",
                  }}
                >
                  {ev.title}
                </p>
                {ev.content && (
                  <div
                    className="text-[13px] leading-[1.7]"
                    style={{
                      fontFamily: "var(--font-serif)",
                      color: "#555",
                    }}
                  >
                    {ev.content}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
