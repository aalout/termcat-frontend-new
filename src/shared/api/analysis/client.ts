import { DemoBackendError, demoBackend } from "@/shared/lib/demo-backend";
import { ApiError } from "@/shared/api/auth/client";
import type { Term } from "@/entities/term/model/types";

export interface AnalyzePayload {
  text: string;
  sourceLang?: string;
  targetLang?: string;
}

export interface AnalyzeResponse {
  id: string;
  title: string;
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  terms: Term[];
  wordCount: number;
}

export interface HistoryItem {
  id: string;
  title: string;
  createdAt: string;
  termCount: number;
}

function wrap<T>(fn: () => T): Promise<T> {
  return Promise.resolve().then(() => {
    try {
      return fn();
    } catch (error) {
      if (error instanceof DemoBackendError) {
        throw new ApiError(error.message, error.status);
      }
      throw error;
    }
  });
}

export const analysisApi = {
  analyze(payload: AnalyzePayload) {
    return wrap<AnalyzeResponse>(() => demoBackend.analyze(payload));
  },

  history() {
    return wrap<{ items: HistoryItem[] }>(() => demoBackend.history());
  },
};
