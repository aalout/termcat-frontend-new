import { Logo } from "@/shared/ui/logo";
import { QuoteGlyph } from "./quote-glyph";
import styles from "./index.module.css";

export function TextEmptyWelcome() {
  return (
    <div className={styles.root}>
      <div className={styles.textBlock}>
        <h2 className={styles.heading}>
          <span className={styles.headingPrimary}>Добро пожаловать в новый проект!</span>
          <span className={styles.headingAccent}>Какие термины переведём?</span>
        </h2>
        <div className={styles.description}>
          <p>
            Добавьте текст на английском объёмом не более 1600 символов. Термины будут
            переведены на русский прямо в тексте — получится смесь EN и RU с подсветкой
            переведённых фрагментов.
          </p>
          <p>Чем больше текст, тем выше точность!</p>
        </div>
        <Logo asLink={false} className={styles.inlineLogo} />
      </div>
      <QuoteGlyph className={styles.quote} />
    </div>
  );
}
