"use client";

import type { Term } from "@/entities/term/model/types";
import { TermHighlightedText } from "@/entities/term/ui/term-highlighted-text";
import { TextEmptyWelcome } from "@/features/analyze-text/ui/text-empty-welcome";
import { Icon } from "@/shared/ui/icon";
import { Button } from "@/shared/ui/button";
import styles from "./index.module.css";

interface TextPanelProps {
  text: string;
  terms: Term[];
  activeTermId: string | null;
  hasAnalysis: boolean;
  onInsertClick: () => void;
  onAnalyzeClick: () => void;
  onTermClick: (termId: string) => void;
  analyzing?: boolean;
}

export function TextPanel({
  text,
  terms,
  activeTermId,
  hasAnalysis,
  onInsertClick,
  onAnalyzeClick,
  onTermClick,
  analyzing,
}: TextPanelProps) {
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const isEmpty = !text.trim() && !hasAnalysis;

  return (
    <section className={styles.panel}>
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <Button
            variant="secondary"
            size="small"
            className={styles.insertBtn}
            leftIcon={<CopyIcon />}
            onClick={onInsertClick}
          >
            <span className={styles.insertLabel}>Вставить текст</span>
          </Button>
        </div>

        <Button
          variant="gradient"
          size="small"
          leftIcon={<LightningIcon />}
          onClick={onAnalyzeClick}
          disabled={!text.trim() || analyzing}
        >
          {analyzing ? "Анализ…" : "Анализировать"}
        </Button>
      </div>

      <div className={styles.content}>
        <div className={styles.textCard}>
          <div className={styles.meta}>
            <span>Текст с переводом терминов</span>
            {!isEmpty && hasAnalysis ? (
              <span>
                {wordCount} слов · {terms.length} терминов
              </span>
            ) : null}
          </div>

          <div className={styles.textBox}>
            {isEmpty ? (
              <TextEmptyWelcome />
            ) : hasAnalysis ? (
              <TermHighlightedText
                text={text}
                terms={terms}
                activeTermId={activeTermId}
                onTermClick={onTermClick}
              />
            ) : (
              <p className={styles.rawText}>{text}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function CopyIcon() {
  return (
    <Icon size={16} viewBox="0 0 24 24">
      <rect
        x="9"
        y="9"
        width="13"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Icon>
  );
}

function LightningIcon() {
  return (
    <Icon size={16} viewBox="0 0 24 24">
      <path
        d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </Icon>
  );
}
