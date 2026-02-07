import type { ReactNode } from "react";

interface DefinitionProps {
  /** The term being defined. */
  term: string;
  children: ReactNode;
}

/**
 * Definition — highlights a key term with its explanation.
 * Fits naturally into article body text.
 */
export function Definition({ term, children }: DefinitionProps) {
  return (
    <div
      className="mb-6 relative"
      style={{
        borderLeft: "4px solid #1a1a1a",
        backgroundColor: "rgba(0, 0, 0, 0.02)",
      }}
    >
      {/* Term */}
      <div className="px-4 pt-3 pb-0">
        <span
          className="text-[11px] font-bold uppercase tracking-[0.12em]"
          style={{ fontFamily: "var(--font-mono)", color: "#1a1a1a" }}
        >
          ≡ {term}
        </span>
      </div>

      {/* Definition body */}
      <div
        className="px-4 pt-2 pb-3 text-[14px] leading-[1.8]"
        style={{ fontFamily: "var(--font-serif)", color: "#333" }}
      >
        {children}
      </div>
    </div>
  );
}
