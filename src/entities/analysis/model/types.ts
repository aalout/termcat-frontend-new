export interface AnalysisSession {
  id: string;
  title: string;
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  terms: import("@/entities/term/model/types").Term[];
  wordCount: number;
  createdAt: string;
}
