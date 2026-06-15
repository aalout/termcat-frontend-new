"use client";

import { useCallback, useEffect, useState } from "react";
import type { User } from "@/entities/user/model/types";
import type { Term } from "@/entities/term/model/types";
import type { HistoryItem } from "@/shared/api/analysis/client";
import { analysisApi } from "@/shared/api/analysis/client";
import { buildMixedText } from "@/shared/lib/analysis-core";
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
  const [currentUser, setCurrentUser] = useState(user);
  const [sourceText, setSourceText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [terms, setTerms] = useState<Term[]>([]);
  const [activeTermId, setActiveTermId] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [insertOpen, setInsertOpen] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [analyzing, setAnalyzing] = useState(false);

  const hasAnalysis = terms.length > 0;

  const loadHistory = useCallback(async () => {
    try {
      const { items } = await analysisApi.history();
      setHistory(items);
    } catch {
      setHistory([]);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadHistory();
  }, [loadHistory]);

  const analyze = async (source: string) => {
    setAnalyzing(true);
    try {
      const result = await analysisApi.analyze({ text: source });
      setSourceText(result.sourceText);
      setOutputText(result.translatedText);
      setTerms(result.terms);
      setActiveTermId(null);
      setInsertOpen(false);
      await loadHistory();
    } finally {
      setAnalyzing(false);
    }
  };

  const handleTranslationSelect = (termId: string, translation: string) => {
    setTerms((prevTerms) => {
      const nextTerms = prevTerms.map((term) =>
        term.id === termId ? { ...term, selectedTranslation: translation } : term
      );
      const { text, terms: rebuilt } = buildMixedText(sourceText, nextTerms);
      setOutputText(text);
      return rebuilt;
    });
    setActiveTermId(termId);
  };

  return (
    <div className={styles.page}>
      <Header
        user={currentUser}
        onHistoryClick={() => setHistoryOpen(true)}
        onUserUpdated={setCurrentUser}
      />

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
