"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { useSearch } from "./search-provider";
import { C } from "@/lib/theme";

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
}

const TYPE_LABELS: Record<string, string> = {
  subject: "SUBJ",
  teacher: "TCHR",
  "subject-article": "ART",
  "teacher-article": "ART",
  "system-article": "SYS",
};

const TYPE_COLORS: Record<string, string> = {
  subject: "#0066cc",
  teacher: "#008800",
  "subject-article": "#cc8800",
  "teacher-article": "#cc8800",
  "system-article": "#ff0000",
};

export function SearchDialog({ open, onClose }: SearchDialogProps) {
  const { search, isReady } = useSearch();
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);

  const results = query.trim() ? search(query) : [];

  useEffect(() => {
    setSelectedIdx(0);
  }, [query]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown")
        setSelectedIdx((i) => Math.min(i + 1, results.length - 1));
      if (e.key === "ArrowUp") setSelectedIdx((i) => Math.max(i - 1, 0));
      if (e.key === "Enter" && results[selectedIdx]) {
        window.location.href = results[selectedIdx].route;
        onClose();
      }
      if (e.key === "Escape") onClose();
    },
    [results, selectedIdx, onClose]
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0"
            style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            className="relative w-full max-w-xl mx-4 border-2 overflow-hidden"
            style={{ backgroundColor: C.bgWhite, borderColor: C.border }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            {/* Header */}
            <div
              className="px-4 py-2 flex items-center justify-between"
              style={{ backgroundColor: C.text, color: C.bgWhite }}
            >
              <span className="text-xs font-bold uppercase tracking-wider">
                SEARCH_QUERY
              </span>
              <button
                onClick={onClose}
                className="text-xs cursor-pointer hover:text-[#ff0000]"
              >
                [CLOSE]
              </button>
            </div>

            {/* Input */}
            <div
              className="flex items-center gap-2 px-4 py-3 border-b-2"
              style={{ borderColor: C.border }}
            >
              <span className="text-sm">&gt;</span>
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="TYPE HERE"
                className="flex-1 bg-transparent text-sm outline-none uppercase placeholder:opacity-30"
                style={{ color: C.text }}
              />
              <span className="text-[10px]" style={{ color: C.textMuted }}>
                {isReady
                  ? `${results.length} RESULTS`
                  : "LOADING..."}
              </span>
            </div>

            {/* Results */}
            {query.trim() && (
              <div className="max-h-80 overflow-y-auto">
                {results.length === 0 ? (
                  <p
                    className="px-4 py-8 text-center text-sm uppercase"
                    style={{ color: C.red }}
                  >
                    NO_RESULTS_FOUND
                  </p>
                ) : (
                  results.map((entry, i) => (
                    <Link
                      key={entry.id}
                      href={entry.route}
                      onClick={onClose}
                      className="block px-4 py-2 cursor-pointer border-b transition-colors"
                      style={{
                        borderColor: C.borderLight,
                        backgroundColor:
                          i === selectedIdx ? C.text : "transparent",
                        color: i === selectedIdx ? C.bgWhite : C.text,
                      }}
                      onMouseEnter={() => setSelectedIdx(i)}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className="text-[10px] uppercase tracking-wider shrink-0 mt-0.5 font-bold"
                          style={{
                            color:
                              i === selectedIdx
                                ? C.bgWhite
                                : TYPE_COLORS[entry.type] || C.red,
                          }}
                        >
                          [{TYPE_LABELS[entry.type] || "???"}]
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium">{entry.title}</p>
                          <p className="text-[11px] opacity-50 mt-0.5">
                            {entry.route}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}

            {/* Empty state */}
            {!query.trim() && (
              <div className="px-4 py-6">
                <p
                  className="text-xs uppercase"
                  style={{ color: C.textMuted }}
                >
                  AWAITING INPUT — TYPE TO SEARCH SUBJECTS, TEACHERS, ARTICLES
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
