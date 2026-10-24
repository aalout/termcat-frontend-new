"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/entities/user/model/types";
import type { Term } from "@/entities/term/model/types";
import type { HistoryItem } from "@/shared/api/analysis/client";
import { analysisApi } from "@/shared/api/analysis/client";
import { ApiError } from "@/shared/api/auth/client";
import { Header } from "@/widgets/header";
import { TextPanel } from "@/widgets/text-panel";
import { TermsSidebar } from "@/widgets/terms-sidebar";
import { HistoryModal } from "@/features/history/ui/history-modal";
import { InsertTextModal } from "@/features/analyze-text/ui/insert-text-modal";
import styles from "./index.module.css";

interface HomePageProps {
  user: User;
}

export function HomePage({ user }: HomePageProps) {
  const router = useRouter();
  const [sourceText, setSourceText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [terms, setTerms] = useState<Term[]>([]);
  const [activeTermId, setActiveTermId] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [insertOpen, setInsertOpen] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [hasAnalysis, setHasAnalysis] = useState(false);

  const loadHistory = useCallback(async () => {
    try {
      const { items } = await analysisApi.history();
      setHistory(items);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        router.replace("/login");
        return;
      }
      setHistory([]);
    }
  }, [router]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadHistory();
  }, [loadHistory]);

  const analyze = async (source: string) => {
    setAnalyzing(true);
    setError("");
    try {
      const result = await analysisApi.analyze({ text: source });
      setSourceText(result.sourceText);
      setOutputText(result.translatedText);
      setTerms(result.terms);
      setHasAnalysis(true);
      setActiveTermId(null);
      setInsertOpen(false);
      await loadHistory();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        router.replace("/login");
        return;
      }
      setError(err instanceof ApiError ? err.message : "Не удалось выполнить анализ");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleTranslationSelect = (termId: string, translation: string) => {
    setTerms((prevTerms) =>
      prevTerms.map((term) =>
        term.id === termId ? { ...term, selectedTranslation: translation } : term
      )
    );
    setActiveTermId(termId);
  };

  return (
    <div className={styles.page}>
      <Header user={user} onHistoryClick={() => setHistoryOpen(true)} />

      <main className={styles.main}>
        <TextPanel
          text={hasAnalysis ? outputText : sourceText}
          terms={terms}
          activeTermId={activeTermId}
          hasAnalysis={hasAnalysis}
          onInsertClick={() => setInsertOpen(true)}
          onAnalyzeClick={() => analyze(sourceText)}
          onTermClick={setActiveTermId}
          analyzing={analyzing}
          error={error}
        />
        <TermsSidebar
          terms={terms}
          activeTermId={activeTermId}
          onTermClick={setActiveTermId}
          onTranslationSelect={handleTranslationSelect}
        />
      </main>

      <HistoryModal
        opened={historyOpen}
        onClose={() => setHistoryOpen(false)}
        items={history}
      />

      <InsertTextModal
        opened={insertOpen}
        onClose={() => setInsertOpen(false)}
        initialText={sourceText}
        onAnalyze={analyze}
        loading={analyzing}
      />
    </div>
  );
}
