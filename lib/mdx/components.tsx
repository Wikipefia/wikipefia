/**
 * Custom MDX component map — overrides default HTML elements
 * rendered by MDX with styled versions for the Wikipefia design.
 *
 * Also registers custom interactive components used in article content.
 */

import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { C } from "@/lib/theme";
import {
  Callout,
  Tabs,
  Tab,
  Collapse,
  Quiz,
  Question,
  Option,
  CodePlayground,
  Figure,
  MathBlock,
  Graph,
  Plot,
  Slider,
  Point,
  HLine,
  VLine,
  Area,
  Segment,
  Interactive,
  Value,
  Toggle,
  Timeline,
  TimelineEvent,
  DataTable,
  Comparison,
  ComparisonItem,
  Definition,
  StepByStep,
  Step,
  FlowDiagram,
  FlowNode,
  FlowArrow,
  CycleDiagram,
  CycleNode,
  BarChart,
  Bar,
  Diagram,
  DBox,
  DCircle,
  DArrow,
  DLabel,
} from "@/components/mdx";

export const mdxComponents: MDXComponents = {
  // Custom content components
  Callout,
  Tabs,
  Tab,
  Collapse,
  Quiz,
  Question,
  Option,
  CodePlayground,
  Figure,
  MathBlock,

  // Interactive graphing & sandbox
  Graph,
  Plot,
  Slider,
  Point,
  HLine,
  VLine,
  Area,
  Segment,
  Interactive,
  Value,
  Toggle,

  // Article structure components
  Timeline,
  TimelineEvent,
  DataTable,
  Comparison,
  ComparisonItem,
  Definition,
  StepByStep,
  Step,

  // Diagram components
  FlowDiagram,
  FlowNode,
  FlowArrow,
  CycleDiagram,
  CycleNode,
  BarChart,
  Bar,
  Diagram,
  DBox,
  DCircle,
  DArrow,
  DLabel,

  // Typography
  h1: ({ children, id, ...props }) => (
    <h1
      id={id}
      className="text-2xl md:text-3xl font-bold uppercase mt-10 mb-6 pt-6 scroll-mt-24 tracking-tighter"
      style={{ borderTop: `2px solid ${C.border}` }}
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, id, ...props }) => (
    <h2
      id={id}
      className="text-xl font-bold uppercase mt-10 mb-4 pt-6 scroll-mt-20"
      style={{ borderTop: `2px solid ${C.borderLight}` }}
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, id, ...props }) => (
    <h3
      id={id}
      className="text-base font-bold uppercase mt-8 mb-3 scroll-mt-20"
      {...props}
    >
      {children}
    </h3>
  ),
  h4: ({ children, id, ...props }) => (
    <h4
      id={id}
      className="text-sm font-bold uppercase mt-6 mb-2 scroll-mt-20"
      {...props}
    >
      {children}
    </h4>
  ),

  // Paragraphs
  p: ({ children, ...props }) => (
    <p
      className="text-[15px] leading-[1.8] mb-5"
      style={{ color: C.text, fontFamily: "var(--font-serif)" }}
      {...props}
    >
      {children}
    </p>
  ),

  // Code blocks
  pre: ({ children, ...props }) => (
    <pre
      className="overflow-x-auto rounded-none border-2 mb-6 text-xs leading-relaxed"
      style={{ backgroundColor: C.bg, borderColor: C.border }}
      {...props}
    >
      {children}
    </pre>
  ),
  code: ({ children, className, ...props }) => {
    // Inline code (no className) vs code block (has className from pre)
    if (!className) {
      return (
        <code
          className="px-1.5 py-0.5 text-[13px] font-mono border"
          style={{
            backgroundColor: C.bg,
            borderColor: C.borderLight,
            color: C.text,
          }}
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code className={`${className} block px-4 py-3`} {...props}>
        {children}
      </code>
    );
  },

  // Links (internal vs external)
  a: ({ href, children, ...props }) => {
    const isExternal = href?.startsWith("http");
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-[#ff0000] transition-colors"
          style={{ textDecorationColor: C.red }}
          {...props}
        >
          {children}
        </a>
      );
    }
    return (
      <Link
        href={href || "#"}
        className="underline underline-offset-2 hover:text-[#ff0000] transition-colors"
        style={{ textDecorationColor: C.red }}
        {...props}
      >
        {children}
      </Link>
    );
  },

  // Lists
  ul: ({ children, ...props }) => (
    <ul className="mb-6 space-y-2 ml-4 list-none" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="mb-6 space-y-2 ml-4 list-none" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li
      className="text-[14px] leading-[1.7] pl-3"
      style={{
        color: C.text,
        fontFamily: "var(--font-serif)",
        borderLeft: `2px solid ${C.borderLight}`,
      }}
      {...props}
    >
      {children}
    </li>
  ),

  // Blockquotes (used for callouts in MDX)
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="border-l-4 px-4 py-3 mb-6 text-[13px] leading-[1.7]"
      style={{
        borderLeftColor: "#0066cc",
        backgroundColor: "rgba(0, 102, 204, 0.04)",
        color: C.textMuted,
        fontFamily: "var(--font-serif)",
      }}
      {...props}
    >
      {children}
    </blockquote>
  ),

  // Tables
  table: ({ children, ...props }) => (
    <div className="overflow-x-auto mb-6 border-2" style={{ borderColor: C.border }}>
      <table className="w-full text-[13px]" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead
      className="text-[10px] font-bold uppercase tracking-wider"
      style={{ backgroundColor: C.headerBg, color: C.headerText }}
      {...props}
    >
      {children}
    </thead>
  ),
  th: ({ children, ...props }) => (
    <th className="px-3 py-2 text-left" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td
      className="px-3 py-2 border-t"
      style={{ borderColor: C.borderLight, color: C.text }}
      {...props}
    >
      {children}
    </td>
  ),

  // Horizontal rule
  hr: () => (
    <hr
      className="my-8"
      style={{ borderColor: C.borderLight, borderStyle: "dashed" }}
    />
  ),

  // Strong and emphasis
  strong: ({ children, ...props }) => (
    <strong className="font-bold" style={{ color: C.text }} {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }) => (
    <em className="italic" {...props}>
      {children}
    </em>
  ),
};
