import { Logo } from "@/shared/ui/logo";
import { QuoteGlyph } from "./quote-glyph";
import styles from "./index.module.css";

export function TextEmptyWelcome() {
  return (
    <div className={styles.root}>
      <div className={styles.textBlock}>
        <h2 className={styles.heading}>
          <span className={styles.headingPrimary}>Добро пожаловать в новый проект!</span>
          <span className={styles.headingAccent}>Что будем сегодня переводить?</span>
        </h2>
        <div className={styles.description}>
          <p>
            Добавьте текст на русском в поле ввода объемом не более 1600 символов. Система
            переведёт его на английский и подсветит термины уже в переведённом тексте.
          </p>
          <p>Чем больше текст, тем выше точность!</p>
        </div>
        <Logo asLink={false} className={styles.inlineLogo} />
      </div>
      <QuoteGlyph className={styles.quote} />
    </div>
  );
}
