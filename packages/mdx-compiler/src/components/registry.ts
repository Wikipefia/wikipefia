/**
 * Component registry — defines the contract for all custom MDX components.
 *
 * This is NOT the React implementation. It defines:
 *   - Which components are allowed in MDX
 *   - Required / optional props and their types
 *   - Nesting rules (which component must be a child of which)
 *
 * The actual React components live in the main project (components/mdx/).
 * They must conform to these contracts.
 */

export type PropType = "string" | "number" | "boolean";

export interface PropContract {
  /** Whether this prop is required. */
  required?: boolean;
  /** Expected type of the prop value. */
  type?: PropType;
  /** If set, the prop must be one of these values. */
  enum?: string[];
}

export interface ComponentContract {
  /** Prop contracts for this component. */
  props: Record<string, PropContract>;
  /** If set, this component must be a direct child of the named parent. */
  parent?: string;
  /** Whether this component requires children. */
  childrenRequired?: boolean;
}

/**
 * Registry of all custom MDX components and their contracts.
 *
 * When adding a new component to the main project, add its contract here
 * first, then implement the React component. This ensures content repos
 * can validate against the new component immediately.
 */
export const componentRegistry: Record<string, ComponentContract> = {
  // ── Interactive Quiz ──────────────────────────
  Quiz: {
    props: {},
    childrenRequired: true,
  },
  Question: {
    props: {
      text: { required: true, type: "string" },
    },
    parent: "Quiz",
    childrenRequired: true,
  },
  Option: {
    props: {
      value: { required: true, type: "string" },
      correct: { type: "boolean" },
    },
    parent: "Question",
  },

  // ── Callout ───────────────────────────────────
  Callout: {
    props: {
      type: { type: "string", enum: ["info", "warning", "error"] },
    },
    childrenRequired: true,
  },

  // ── Tabs ──────────────────────────────────────
  Tabs: {
    props: {},
    childrenRequired: true,
  },
  Tab: {
    props: {
      label: { required: true, type: "string" },
    },
    parent: "Tabs",
    childrenRequired: true,
  },

  // ── Collapse ──────────────────────────────────
  Collapse: {
    props: {
      title: { required: true, type: "string" },
    },
    childrenRequired: true,
  },

  // ── Code Playground ───────────────────────────
  CodePlayground: {
    props: {
      language: { type: "string" },
      code: { type: "string" },
    },
  },

  // ── Figure ────────────────────────────────────
  Figure: {
    props: {
      src: { required: true, type: "string" },
      alt: { required: true, type: "string" },
      caption: { type: "string" },
      width: { type: "number" },
      height: { type: "number" },
    },
  },

  // ── Math Block ────────────────────────────────
  MathBlock: {
    props: {},
    childrenRequired: true,
  },
};

/** Set of all known component names for quick lookup. */
export const knownComponentNames = new Set(Object.keys(componentRegistry));
