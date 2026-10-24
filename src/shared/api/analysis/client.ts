import type { Term } from "@/entities/term/model/types";
import { ApiError, apiRequest } from "@/shared/api/http";
import { matchApiTerms, type ApiTerm } from "@/shared/lib/match-terms";

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

interface ApiAnalysis {
  id: string;
  createdAt?: string;
  sourceText?: string;
  translatedText?: string;
  topic?: string;
  terms?: ApiTerm[];
  termsCount?: number;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function readString(record: Record<string, unknown>, ...keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string") return value;
  }
  return "";
}

function readNumber(record: Record<string, unknown>, ...keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "number") return value;
  }
  return undefined;
}

function readTerms(record: Record<string, unknown>): ApiTerm[] {
  const raw = record.terms ?? record.Terms;
  if (!Array.isArray(raw)) return [];

  return raw.flatMap((item) => {
    const term = asRecord(item);
    if (!term) return [];
    return [
      {
        id: readString(term, "id", "ID"),
        termSource: readString(term, "termSource", "TermSource"),
        termTranslated: readString(term, "termTranslated", "TermTranslated"),
      },
    ];
  });
}

function readAnalysis(value: unknown): ApiAnalysis | null {
  const record = asRecord(value);
  if (!record) return null;

  const id = readString(record, "id", "ID");
  if (!id) return null;

  return {
    id,
    createdAt: readString(record, "createdAt", "CreatedAt"),
    sourceText: readString(record, "sourceText", "SourceText"),
    translatedText: readString(record, "translatedText", "TranslatedText"),
    topic: readString(record, "topic", "Topic"),
    terms: readTerms(record),
    termsCount: readNumber(record, "termsCount", "TermsCount"),
  };
}

function analysisTitle(analysis: ApiAnalysis) {
  const topic = analysis.topic?.trim();
  if (topic) return topic;

  const source = (analysis.sourceText ?? "").trim().replace(/\s+/g, " ");
  if (!source) return "Анализ";
  return source.length > 80 ? `${source.slice(0, 80)}…` : source;
}

function toAnalyzeResponse(analysis: ApiAnalysis): AnalyzeResponse {
  const sourceText = analysis.sourceText ?? "";
  const translatedText = analysis.translatedText ?? "";
  const terms = matchApiTerms(sourceText, translatedText, analysis.terms ?? []);

  return {
    id: analysis.id,
    title: analysisTitle(analysis),
    sourceText,
    translatedText,
    sourceLang: "en",
    targetLang: "ru",
    terms,
    wordCount: translatedText.trim() ? translatedText.trim().split(/\s+/).length : 0,
  };
}

export const analysisApi = {
  async analyze(payload: AnalyzePayload): Promise<AnalyzeResponse> {
    const text = payload.text.trim();
    if (!text) throw new ApiError("Текст обязателен", 400);

    const data = await apiRequest<Record<string, unknown>>("/analyses", {
      method: "POST",
      body: { text },
    });

    const analysis = readAnalysis(data.analysis ?? data.Analysis);
    if (!analysis) {
      const error = typeof data.error === "string" ? data.error.trim() : "";
      throw new ApiError(error || "Некорректный ответ сервера", 500);
    }

    return toAnalyzeResponse(analysis);
  },

  async history(): Promise<{ items: HistoryItem[] }> {
    const data = await apiRequest<Record<string, unknown>>("/analyses");
    const raw = data.analyses ?? data.Analyses;
    const analyses = Array.isArray(raw)
      ? raw.flatMap((item) => {
          const analysis = readAnalysis(item);
          return analysis ? [analysis] : [];
        })
      : [];

    return {
      items: analyses.map((analysis) => ({
        id: analysis.id,
        title: analysisTitle(analysis),
        createdAt: analysis.createdAt ?? "",
        termCount: analysis.termsCount ?? analysis.terms?.length ?? 0,
      })),
    };
  },
};
