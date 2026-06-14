"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/shared/ui/modal";
import { Textarea } from "@/shared/ui/textarea";
import { Button } from "@/shared/ui/button";
import styles from "./index.module.css";

interface InsertTextModalProps {
  opened: boolean;
  onClose: () => void;
  initialText?: string;
  onAnalyze: (text: string) => void;
  loading?: boolean;
}

export function InsertTextModal({
  opened,
  onClose,
  initialText = "",
  onAnalyze,
  loading,
}: InsertTextModalProps) {
  const [text, setText] = useState(initialText);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (opened) setText(initialText);
  }, [opened, initialText]);

  const handleAnalyze = () => {
    if (!text.trim()) return;
    onAnalyze(text.trim());
  };

  return (
    <Modal opened={opened} onClose={onClose} closeLabel="Закрыть">
      <div className={styles.modal}>
        <h2 className={styles.title}>Вставить текст</h2>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Вставьте текст на русском (RU) для перевода…"
          fullWidth
          className={styles.modalTextarea}
        />
        <div className={styles.actions}>
          <Button variant="secondary" onClick={onClose}>
            Отмена
          </Button>
          <Button onClick={handleAnalyze} disabled={loading || !text.trim()}>
            {loading ? "Анализ…" : "Анализировать"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
