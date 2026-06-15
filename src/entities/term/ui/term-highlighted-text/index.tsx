"use client";

import type { Term } from "@/entities/term/model/types";
import styles from "./index.module.css";

interface TermHighlightedTextProps {
  text: string;
  terms: Term[];
  activeTermId?: string | null;
  onTermClick?: (termId: string) => void;
}

export function TermHighlightedText({
  text,
  terms,
  activeTermId,
  onTermClick,
}: TermHighlightedTextProps) {
  if (!terms.length) {
    return <p className={styles.text}>{text}</p>;
  }

  const segments: Array<
    | { type: "text"; value: string }
    | { type: "term"; value: string; term: Term }
  > = [];

  let cursor = 0;

  for (const term of terms) {
    if (term.start > cursor) {
      segments.push({ type: "text", value: text.slice(cursor, term.start) });
    }
    segments.push({
      type: "term",
      value: text.slice(term.start, term.end),
      term,
    });
    cursor = term.end;
  }

  if (cursor < text.length) {
    segments.push({ type: "text", value: text.slice(cursor) });
  }

  return (
    <p className={styles.text}>
      {segments.map((segment, index) =>
        segment.type === "text" ? (
          <span key={index}>{segment.value}</span>
        ) : (
          <button
            key={segment.term.id}
            type="button"
            className={[
              styles.term,
              activeTermId === segment.term.id ? styles.termActive : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => onTermClick?.(segment.term.id)}
          >
            {segment.value}
          </button>
        )
      )}
    </p>
  );
}
