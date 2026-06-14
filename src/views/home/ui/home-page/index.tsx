"use client";

import { useCallback, useEffect, useState } from "react";
import type { User } from "@/entities/user/model/types";
import type { Term } from "@/entities/term/model/types";
import type { HistoryItem } from "@/shared/api/analysis/client";
import { analysisApi } from "@/shared/api/analysis/client";
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
  const [translatedText, setTranslatedText] = useState("");
  const [terms, setTerms] = useState<Term[]>([]);
  const [activeTermId, setActiveTermId] = useState<string | null>(null);
  const [showSource, setShowSource] = useState(false);
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

  const analyze = async (text: string) => {
    setAnalyzing(true);
    try {
      const result = await analysisApi.analyze({ text });
      setSourceText(result.sourceText);
      setTranslatedText(result.translatedText);
      setTerms(result.terms);
      setActiveTermId(null);
      setShowSource(false);
      setInsertOpen(false);
      await loadHistory();
    } finally {
      setAnalyzing(false);
    }
  };

  const handleTranslationSelect = (termId: string, translation: string) => {
    setTerms((prev) =>
      prev.map((term) =>
        term.id === termId ? { ...term, selectedTranslation: translation } : term
      )
    );
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
          sourceText={sourceText}
          translatedText={translatedText}
          terms={terms}
          activeTermId={activeTermId}
          showSource={showSource}
          hasAnalysis={hasAnalysis}
          onInsertClick={() => setInsertOpen(true)}
          onAnalyzeClick={() => analyze(sourceText)}
          onTermClick={setActiveTermId}
          onLangSwitchClick={() => setShowSource((prev) => !prev)}
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
