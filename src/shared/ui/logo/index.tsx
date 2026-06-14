import Link from "next/link";
import { LogoGlyph } from "./logo-glyph";
import styles from "./index.module.css";

interface LogoProps {
  asLink?: boolean;
  className?: string;
}

export function Logo({ asLink = true, className }: LogoProps) {
  const content = (
    <>
      <span className={styles.iconWrap}>
        <LogoGlyph className={styles.icon} />
      </span>
      <span className={styles.text}>TermCAT</span>
    </>
  );

  if (asLink) {
    return (
      <Link href="/" className={[styles.root, className].filter(Boolean).join(" ")}>
        {content}
      </Link>
    );
  }

  return <div className={[styles.root, className].filter(Boolean).join(" ")}>{content}</div>;
}
