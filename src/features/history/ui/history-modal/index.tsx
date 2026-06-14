"use client";

import { Icon } from "@/shared/ui/icon";
import { Modal } from "@/shared/ui/modal";
import type { HistoryItem } from "@/shared/api/analysis/client";
import styles from "./index.module.css";

interface HistoryModalProps {
  opened: boolean;
  onClose: () => void;
  items: HistoryItem[];
}

function formatDate(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const time = date.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isToday) return `Сегодня, ${time}`;
  if (isYesterday) return `Вчера, ${time}`;
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function HistoryModal({ opened, onClose, items }: HistoryModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} closeLabel="Закрыть">
      <div className={styles.modal}>
        <h2 className={styles.title}>История анализов</h2>
        <ul className={styles.list}>
          {items.length === 0 ? (
            <li className={styles.empty}>История пока пуста</li>
          ) : (
            items.map((item) => (
              <li key={item.id} className={styles.item}>
                <span className={styles.icon} aria-hidden>
                  <DocIcon />
                </span>
                <div className={styles.content}>
                  <p className={styles.itemTitle}>{item.title}</p>
                  <p className={styles.meta}>
                    {formatDate(item.createdAt)} · {item.termCount} терминов
                  </p>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </Modal>
  );
}

function DocIcon() {
  return (
    <Icon size={18} viewBox="0 0 24 24">
      <path
        d="M8 3H16L19 6V21H8V3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M16 3V7H19" stroke="currentColor" strokeWidth="1.5" />
    </Icon>
  );
}
