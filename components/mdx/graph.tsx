"use client";

import { useState, Children, type ReactNode } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyElement = { props: Record<string, any> };

/* ── Default color palette for plot lines ── */
const PALETTE = [
  "#ff0000",
  "#0066cc",
  "#22863a",
  "#cc6600",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
  "#f59e0b",
];

/* ═══════════════════════════════════════════════════
   Data-carrier components (rendered by Graph parent)
   ═══════════════════════════════════════════════════ */

interface PlotProps {
  /** JS function: (x, vars) => y. `vars` contains current slider values. */
  fn: (x: number, vars: Record<string, number>) => number;
  /** Line color. Auto-assigned from palette if omitted. */
  color?: string;
  /** Legend label. */
  label?: string;
  /** Dashed line style. */
  dashed?: boolean;
  /** Line thickness (default 2.5). */
  strokeWidth?: number;
}

/** Defines a function to plot on the graph. Used inside `<Graph>`. */
export function Plot(_: PlotProps) {
  return null;
}

interface SliderProps {
  /** Variable name — accessible in Plot/Value fn as `vars.name`. */
  name: string;
  min?: number;
  max?: number;
  default?: number;
  step?: number;
  /** Display label. Falls back to `name` if omitted. */
  label?: string;
}

/** Defines a parameter slider. Used inside `<Graph>` or `<Interactive>`. */
export function Slider(_: SliderProps) {
  return null;
}

/* ═══════════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════════ */

/** Pick "nice" grid intervals (1, 2, 5 × 10^n). */
function niceStep(range: number, targetLines: number): number {
  if (range <= 0) return 1;
  const rough = range / targetLines;
  const mag = Math.pow(10, Math.floor(Math.log10(rough)));
  const r = rough / mag;
  if (r <= 1.5) return mag;
  if (r <= 3) return 2 * mag;
  if (r <= 7) return 5 * mag;
  return 10 * mag;
}

/** Format a number for axis labels. */
function fmtNum(n: number): string {
  if (n === 0) return "0";
  const a = Math.abs(n);
  if (a >= 10000) return n.toExponential(1);
  if (a >= 100) return n.toFixed(0);
  if (Number.isInteger(n)) return String(n);
  if (a >= 1) return n.toFixed(1);
  return n.toPrecision(2);
}

/** Generate grid line positions, avoiding floating-point drift. */
function gridLines(min: number, max: number, step: number): number[] {
  const lines: number[] = [];
  const start = Math.ceil(min / step) * step;
  for (let i = 0; ; i++) {
    const v = start + i * step;
    if (v > max + step * 0.001) break;
    // Round to step precision to avoid 0.30000000000000004
    lines.push(parseFloat(v.toPrecision(10)));
  }
  return lines;
}

/* ═══════════════════════════════════════════════════
   Graph component
   ═══════════════════════════════════════════════════ */

interface GraphProps {
  /** Graph title (shown in header bar). */
  title?: string;
  /** X axis label. */
  xLabel?: string;
  /** Y axis label. */
  yLabel?: string;
  /** X domain as [min, max]. Default: [-10, 10]. */
  xDomain?: [number, number];
  /** Y domain as [min, max]. Auto-computed from functions if omitted. */
  yDomain?: [number, number];
  /** SVG viewBox width (default 600). */
  width?: number;
  /** SVG viewBox height (default 380). */
  height?: number;
  children: ReactNode;
}

export function Graph({
  title,
  xLabel,
  yLabel,
  xDomain: xDomainProp,
  yDomain: yDomainProp,
  width = 600,
  height = 380,
  children,
}: GraphProps) {
  /* ── Unique clip-path ID ── */
  const [clipId] = useState(
    () => `gc${Math.random().toString(36).slice(2, 8)}`
  );

  /* ── Extract child definitions ── */
  const plots: PlotProps[] = [];
  const sliderDefs: SliderProps[] = [];

  Children.forEach(children, (child) => {
    if (!child || typeof child !== "object" || !("props" in child)) return;
    const p = (child as AnyElement).props;

    if (typeof p.fn === "function") {
      plots.push(p as PlotProps);
    } else if (typeof p.name === "string" && p.min !== undefined) {
      sliderDefs.push(p as SliderProps);
    }
  });

  /* ── Slider state ── */
  const [vars, setVars] = useState<Record<string, number>>(() => {
    const v: Record<string, number> = {};
    for (const s of sliderDefs) v[s.name] = s.default ?? 0;
    return v;
  });

  /* ── Domains ── */
  const [xMin, xMax] = xDomainProp ?? [-10, 10];

  let yMin: number;
  let yMax: number;

  if (yDomainProp) {
    [yMin, yMax] = yDomainProp;
  } else {
    // Auto-compute Y domain from function outputs
    let lo = Infinity;
    let hi = -Infinity;
    const dx = (xMax - xMin) / 200;
    for (const plot of plots) {
      for (let i = 0; i <= 200; i++) {
        try {
          const y = plot.fn(xMin + i * dx, vars);
          if (isFinite(y) && Math.abs(y) < 1e8) {
            lo = Math.min(lo, y);
            hi = Math.max(hi, y);
          }
        } catch {
          /* skip evaluation errors */
        }
      }
    }
    if (!isFinite(lo)) {
      lo = -10;
      hi = 10;
    }
    const range = hi - lo || 2;
    yMin = lo - range * 0.15;
    yMax = hi + range * 0.15;
  }

  /* ── Layout calculations ── */
  const pad = {
    top: title ? 12 : 20,
    right: 25,
    bottom: xLabel ? 55 : 40,
    left: 55,
  };
  const pW = width - pad.left - pad.right;
  const pH = height - pad.top - pad.bottom;

  /** Map math X → SVG X. */
  const toX = (x: number) => pad.left + ((x - xMin) / (xMax - xMin)) * pW;
  /** Map math Y → SVG Y (inverted). */
  const toY = (y: number) =>
    pad.top + pH - ((y - yMin) / (yMax - yMin)) * pH;

  /* ── Grid lines ── */
  const xStep = niceStep(xMax - xMin, 8);
  const yStep = niceStep(yMax - yMin, 6);
  const xLines = gridLines(xMin, xMax, xStep);
  const yLines = gridLines(yMin, yMax, yStep);

  /* ── Generate SVG paths ── */
  const SAMPLES = 500;
  const pathStrings = plots.map((plot) => {
    const dx = (xMax - xMin) / SAMPLES;
    const parts: string[] = [];
    let inPath = false;
    let prevPy = 0;

    for (let i = 0; i <= SAMPLES; i++) {
      const x = xMin + i * dx;
      let y: number;
      try {
        y = plot.fn(x, vars);
      } catch {
        inPath = false;
        continue;
      }

      if (!isFinite(y)) {
        inPath = false;
        continue;
      }

      const px = toX(x);
      const py = toY(y);

      // Detect discontinuity (vertical jump > 70% of plot height)
      if (inPath && Math.abs(py - prevPy) > pH * 0.7) {
        inPath = false;
      }

      if (!inPath) {
        parts.push(`M${px.toFixed(1)},${py.toFixed(1)}`);
        inPath = true;
      } else {
        parts.push(`L${px.toFixed(1)},${py.toFixed(1)}`);
      }
      prevPy = py;
    }

    return parts.join(" ");
  });

  /* ── Zero-axis positions ── */
  const zeroX = xMin <= 0 && xMax >= 0 ? toX(0) : null;
  const zeroY = yMin <= 0 && yMax >= 0 ? toY(0) : null;

  /* ── Render ── */
  return (
    <div className="mb-6 border-2 border-[#1a1a1a]">
      {/* ── Header bar ── */}
      {title && (
        <div
          className="flex items-center justify-between px-4 py-2.5 border-b-2 border-[#1a1a1a]"
          style={{ backgroundColor: "#1a1a1a" }}
        >
          <span
            className="text-[10px] font-bold uppercase tracking-[0.15em]"
            style={{ fontFamily: "var(--font-mono)", color: "#fafafa" }}
          >
            ■ {title}
          </span>

          {/* Legend */}
          <div className="flex items-center gap-3 flex-wrap">
            {plots.map((p, i) =>
              p.label ? (
                <div key={i} className="flex items-center gap-1.5">
                  <span
                    className="inline-block w-3.5"
                    style={{
                      height: p.dashed ? 1 : 2,
                      backgroundColor:
                        p.color || PALETTE[i % PALETTE.length],
                      borderTop: p.dashed
                        ? `2px dashed ${p.color || PALETTE[i % PALETTE.length]}`
                        : undefined,
                    }}
                  />
                  <span
                    className="text-[9px] uppercase tracking-[0.1em]"
                    style={{
                      fontFamily: "var(--font-mono)",
                      color: "#888",
                    }}
                  >
                    {p.label}
                  </span>
                </div>
              ) : null
            )}
          </div>
        </div>
      )}

      {/* ── SVG graph ── */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto block select-none"
        style={{ backgroundColor: "#fafafa" }}
        aria-label={title || "Mathematical graph"}
      >
        <defs>
          <clipPath id={clipId}>
            <rect x={pad.left} y={pad.top} width={pW} height={pH} />
          </clipPath>
        </defs>

        {/* Grid lines */}
        {xLines.map((v) => (
          <line
            key={`gx${v}`}
            x1={toX(v)}
            y1={pad.top}
            x2={toX(v)}
            y2={pad.top + pH}
            stroke="#eaeaea"
            strokeWidth={0.5}
          />
        ))}
        {yLines.map((v) => (
          <line
            key={`gy${v}`}
            x1={pad.left}
            y1={toY(v)}
            x2={pad.left + pW}
            y2={toY(v)}
            stroke="#eaeaea"
            strokeWidth={0.5}
          />
        ))}

        {/* Zero axes (heavier lines at x=0, y=0) */}
        {zeroX !== null && (
          <line
            x1={zeroX}
            y1={pad.top}
            x2={zeroX}
            y2={pad.top + pH}
            stroke="#c0c0c0"
            strokeWidth={1.5}
          />
        )}
        {zeroY !== null && (
          <line
            x1={pad.left}
            y1={zeroY}
            x2={pad.left + pW}
            y2={zeroY}
            stroke="#c0c0c0"
            strokeWidth={1.5}
          />
        )}

        {/* Plot curves (clipped to plot area) */}
        <g clipPath={`url(#${clipId})`}>
          {pathStrings.map((d, i) => (
            <path
              key={i}
              d={d}
              fill="none"
              stroke={plots[i]?.color || PALETTE[i % PALETTE.length]}
              strokeWidth={plots[i]?.strokeWidth || 2.5}
              strokeDasharray={plots[i]?.dashed ? "8 4" : undefined}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </g>

        {/* Plot area border */}
        <rect
          x={pad.left}
          y={pad.top}
          width={pW}
          height={pH}
          fill="none"
          stroke="#1a1a1a"
          strokeWidth={2}
        />

        {/* X axis labels */}
        {xLines.map((v) => (
          <text
            key={`lx${v}`}
            x={toX(v)}
            y={pad.top + pH + 18}
            textAnchor="middle"
            fontSize={9}
            fontFamily="var(--font-mono)"
            fill="#999"
          >
            {fmtNum(v)}
          </text>
        ))}

        {/* Y axis labels */}
        {yLines.map((v) => (
          <text
            key={`ly${v}`}
            x={pad.left - 8}
            y={toY(v) + 3}
            textAnchor="end"
            fontSize={9}
            fontFamily="var(--font-mono)"
            fill="#999"
          >
            {fmtNum(v)}
          </text>
        ))}

        {/* X axis title */}
        {xLabel && (
          <text
            x={pad.left + pW / 2}
            y={height - 6}
            textAnchor="middle"
            fontSize={10}
            fontFamily="var(--font-mono)"
            fill="#555"
            fontWeight="bold"
          >
            {xLabel.toUpperCase()}
          </text>
        )}

        {/* Y axis title */}
        {yLabel && (
          <text
            x={14}
            y={pad.top + pH / 2}
            textAnchor="middle"
            fontSize={10}
            fontFamily="var(--font-mono)"
            fill="#555"
            fontWeight="bold"
            transform={`rotate(-90 14 ${pad.top + pH / 2})`}
          >
            {yLabel.toUpperCase()}
          </text>
        )}
      </svg>

      {/* ── Sliders ── */}
      {sliderDefs.length > 0 && (
        <div
          className="px-4 py-3 border-t-2 border-[#e5e5e5] space-y-3"
          style={{ backgroundColor: "#fff" }}
        >
          {sliderDefs.map((s) => {
            const val = vars[s.name] ?? s.default ?? 0;
            const step = s.step ?? 0.1;
            const decimals = step >= 1 ? 0 : step >= 0.1 ? 1 : 2;

            return (
              <div key={s.name} className="flex items-center gap-3">
                <label
                  className="shrink-0 text-[10px] font-bold uppercase tracking-[0.1em] min-w-24"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: "#1a1a1a",
                  }}
                >
                  {s.label || s.name}
                </label>
                <input
                  type="range"
                  min={s.min ?? -10}
                  max={s.max ?? 10}
                  step={step}
                  value={val}
                  onChange={(e) =>
                    setVars((p) => ({
                      ...p,
                      [s.name]: parseFloat(e.target.value),
                    }))
                  }
                  className="flex-1 h-1.5 cursor-pointer accent-[#ff0000]"
                />
                <span
                  className="shrink-0 text-[11px] font-bold tabular-nums w-14 text-right"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: "#ff0000",
                  }}
                >
                  {val.toFixed(decimals)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
