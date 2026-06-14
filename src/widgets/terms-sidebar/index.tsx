"use client";

import Image from "next/image";
import type { Term } from "@/entities/term/model/types";
import { TermCard } from "@/entities/term/ui/term-card";
import { ASSETS } from "@/shared/config/assets";
import { Icon } from "@/shared/ui/icon";
import { Button } from "@/shared/ui/button";
import styles from "./index.module.css";

interface TermsSidebarProps {
  terms: Term[];
  activeTermId: string | null;
  onTermClick: (termId: string) => void;
  onTranslationSelect: (termId: string, translation: string) => void;
}

export function TermsSidebar({
  terms,
  activeTermId,
  onTermClick,
  onTranslationSelect,
}: TermsSidebarProps) {
  const orderedTerms = activeTermId
    ? [
        ...terms.filter((term) => term.id === activeTermId),
        ...terms.filter((term) => term.id !== activeTermId),
      ]
    : terms;

  const isEmpty = terms.length === 0;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h2 className={styles.title}>Терминология</h2>
        {!isEmpty ? (
          <span className={styles.badge}>{terms.length} терминов</span>
        ) : null}
      </div>

      <div className={styles.body}>
        {isEmpty ? (
          <div className={styles.emptyWrap}>
            <Image
              src={ASSETS.emptyTerms}
              alt=""
              width={244}
              height={244}
              className={styles.emptyImage}
            />
          </div>
        ) : (
          <div className={styles.list}>
            {orderedTerms.map((term) => (
              <TermCard
                key={term.id}
                term={term}
                active={term.id === activeTermId}
                onClick={() => onTermClick(term.id)}
                onTranslationSelect={(translation) =>
                  onTranslationSelect(term.id, translation)
                }
              />
            ))}
          </div>
        )}

        <Button variant="soon" className={styles.exportBtn} disabled leftIcon={<ExportIcon />}>
          Экспорт терминов
          <span className={styles.soonBadge}>Скоро</span>
        </Button>
      </div>
    </aside>
  );
}

function ExportIcon() {
  return (
    <Icon size={16} viewBox="0 0 24 24">
      <path
        d="M12 3v12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8 11l4 4 4-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Icon>
  );
}
