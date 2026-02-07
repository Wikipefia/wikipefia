/** Design Tokens (CSS Variable-backed) */
export const C = {
  bg: "var(--c-bg)",
  bgWhite: "var(--c-bg-white)",
  text: "var(--c-text)",
  textMuted: "var(--c-text-muted)",
  accent: "var(--c-accent)",
  border: "var(--c-border)",
  borderLight: "var(--c-border-light)",

  /** Inverted surface — always dark bg + light text in both modes */
  headerBg: "var(--c-header-bg)",
  headerText: "var(--c-header-text)",
} as const;

/* ── Subject color coding ── */

export const SUBJECT_PALETTE = [
  { accent: "#6366F1", icon: "∑" }, // Indigo
  { accent: "#D97706", icon: "◈" }, // Amber
  { accent: "#059669", icon: "⬡" }, // Emerald
  { accent: "#DB2777", icon: "✦" }, // Pink
  { accent: "#2563EB", icon: "△" }, // Blue
  { accent: "#7C3AED", icon: "⌬" }, // Violet
  { accent: "#EA580C", icon: "◉" }, // Orange
  { accent: "#0D9488", icon: "❖" }, // Teal
  { accent: "#DC2626", icon: "⊕" }, // Red
  { accent: "#0891B2", icon: "⊿" }, // Cyan
] as const;

export function getSubjectTheme(slug: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = slug.charCodeAt(i) + ((hash << 5) - hash);
  }
  return SUBJECT_PALETTE[Math.abs(hash) % SUBJECT_PALETTE.length];
}
