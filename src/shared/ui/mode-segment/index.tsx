"use client";

import { Icon } from "@/shared/ui/icon";
import styles from "./index.module.css";

export function ModeSegment() {
  return (
    <div className={styles.root} role="tablist" aria-label="Режим ввода">
      <div className={styles.itemActive} role="tab" aria-selected="true">
        <FileTextIcon />
        <span>Текстовый режим</span>
      </div>
      <div className={styles.fileGroup}>
        <div className={styles.itemDisabled} role="tab" aria-selected="false" aria-disabled="true">
          <FileIcon />
          <span>Файловый режим</span>
        </div>
        <span className={styles.soon}>Скоро</span>
      </div>
    </div>
  );
}

function FileTextIcon() {
  return (
    <Icon size={16} viewBox="0 0 24 24">
      <path
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M14 2v6h6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </Icon>
  );
}

function FileIcon() {
  return (
    <Icon size={16} viewBox="0 0 24 24">
      <path
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M14 2v6h6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </Icon>
  );
}
