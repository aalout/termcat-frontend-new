"use client";



import type { Term } from "@/entities/term/model/types";

import { TermHighlightedText } from "@/entities/term/ui/term-highlighted-text";

import { TextEmptyWelcome } from "@/features/analyze-text/ui/text-empty-welcome";

import { Icon } from "@/shared/ui/icon";

import { Button } from "@/shared/ui/button";

import styles from "./index.module.css";



interface TextPanelProps {

  sourceText: string;

  translatedText: string;

  terms: Term[];

  activeTermId: string | null;

  showSource: boolean;

  hasAnalysis: boolean;

  onInsertClick: () => void;

  onAnalyzeClick: () => void;

  onTermClick: (termId: string) => void;

  onLangSwitchClick: () => void;

  analyzing?: boolean;

}



export function TextPanel({

  sourceText,

  translatedText,

  terms,

  activeTermId,

  showSource,

  hasAnalysis,

  onInsertClick,

  onAnalyzeClick,

  onTermClick,

  onLangSwitchClick,

  analyzing,

}: TextPanelProps) {

  const displayText = showSource ? sourceText : translatedText;

  const wordCount = displayText.trim() ? displayText.trim().split(/\s+/).length : 0;

  const isEmpty = !sourceText.trim() && !hasAnalysis;



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



          <button

            type="button"

            className={[styles.langSwitch, showSource ? styles.langSwitchSource : ""].filter(Boolean).join(" ")}

            onClick={onLangSwitchClick}

            disabled={!hasAnalysis}

            aria-label={showSource ? "Показать перевод" : "Показать исходный текст"}

          >

            <span className={[styles.langLabel, showSource ? styles.langActive : ""].join(" ")}>

              EN

            </span>

            <ArrowIcon />

            <span className={[styles.langLabel, !showSource && hasAnalysis ? styles.langActive : ""].join(" ")}>

              RU

            </span>

          </button>

        </div>



        <Button

          variant="gradient"

          size="small"

          leftIcon={<LightningIcon />}

          onClick={onAnalyzeClick}

          disabled={!sourceText.trim() || analyzing}

        >

          {analyzing ? "Анализ…" : "Анализировать"}

        </Button>

      </div>



      <div className={styles.content}>

        <div className={styles.textCard}>

          <div className={styles.meta}>

            <span>{showSource ? "Исходный текст" : "Перевод"}</span>

            {!isEmpty && hasAnalysis ? (

              <span>

                {wordCount} слов · {terms.length} терминов

              </span>

            ) : null}

          </div>



          <div className={styles.textBox}>

            {isEmpty ? (

              <TextEmptyWelcome />

            ) : hasAnalysis && !showSource ? (

              <TermHighlightedText

                text={translatedText}

                terms={terms}

                activeTermId={activeTermId}

                onTermClick={onTermClick}

              />

            ) : (

              <p className={styles.rawText}>{displayText}</p>

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

function ArrowIcon() {
  return (
    <Icon size={24} viewBox="0 0 24 24" className={styles.arrowIcon}>
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}


