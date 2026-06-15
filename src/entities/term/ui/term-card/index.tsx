import { Icon } from "@/shared/ui/icon";
import type { Term } from "@/entities/term/model/types";
import styles from "./index.module.css";

interface TermCardProps {
  term: Term;
  active?: boolean;
  onClick?: () => void;
  onTranslationSelect?: (translation: string) => void;
}

export function TermCard({ term, active, onClick, onTranslationSelect }: TermCardProps) {
  return (
    <article
      className={[styles.card, active ? styles.active : ""].filter(Boolean).join(" ")}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") onClick?.();
      }}
    >
      <div className={styles.top}>
        <div className={styles.titleBlock}>
          <h3 className={styles.title}>{term.source}</h3>
          <p className={styles.phrase}>{term.phrase}</p>
        </div>
        <span className={styles.termTag}>термин</span>
      </div>

      <div className={styles.tags}>
        {term.translations.map((translation) => {
          const isSelected = translation === term.selectedTranslation;
          return (
            <button
              key={translation}
              type="button"
              className={[styles.tagBtn, isSelected ? styles.tagPrimary : styles.tag]
                .filter(Boolean)
                .join(" ")}
              onClick={(event) => {
                event.stopPropagation();
                if (!isSelected) onTranslationSelect?.(translation);
              }}
            >
              {translation}
            </button>
          );
        })}
      </div>

      {term.description ? (
        <div className={styles.descriptionWrap}>
          <InfoIcon />
          <p className={styles.description}>{term.description}</p>
        </div>
      ) : null}
    </article>
  );
}

function InfoIcon() {
  return (
    <Icon size={16} viewBox="0 0 24 24" className={styles.infoIcon}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path d="M12 16v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </Icon>
  );
}
