import type { ReactNode } from "react";

type CalloutType = "info" | "warning" | "error";

interface CalloutProps {
  type?: CalloutType;
  children: ReactNode;
}

const config: Record<
  CalloutType,
  { label: string; border: string; bg: string; icon: string; accent: string }
> = {
  info: {
    label: "NOTE",
    border: "#0066cc",
    bg: "rgba(0, 102, 204, 0.04)",
    icon: "ℹ",
    accent: "#0066cc",
  },
  warning: {
    label: "WARNING",
    border: "#cc6600",
    bg: "rgba(204, 102, 0, 0.04)",
    icon: "▲",
    accent: "#cc6600",
  },
  error: {
    label: "DANGER",
    border: "#cc0000",
    bg: "rgba(204, 0, 0, 0.04)",
    icon: "✕",
    accent: "#cc0000",
  },
};

export function Callout({ type = "info", children }: CalloutProps) {
  const c = config[type] || config.info;

  return (
    <aside
      className="mb-6 relative"
      style={{
        borderLeft: `4px solid ${c.border}`,
        backgroundColor: c.bg,
      }}
    >
      {/* Label strip */}
      <div
        className="flex items-center gap-1.5 px-4 pt-3 pb-0"
        style={{ color: c.accent }}
      >
        <span
          className="text-[10px] font-bold tracking-[0.15em] uppercase"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {c.icon} {c.label}
        </span>
      </div>

      {/* Content */}
      <div
        className="px-4 pt-2 pb-3 text-[14px] leading-[1.75]"
        style={{ color: "#333", fontFamily: "var(--font-serif)" }}
      >
        {children}
      </div>
    </aside>
  );
}
