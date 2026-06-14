import type { Term } from "@/entities/term/model/types";
import type { AnalysisSession } from "@/entities/analysis/model/types";
import {
  DEMO_SOURCE_TEXT,
  DEMO_TRANSLATED_TEXT,
} from "@/shared/constants/demo-text";

interface TermPattern {
  source: string;
  translations: string[];
  matchPhrase: string;
  description?: string;
}

const TERM_PATTERNS: TermPattern[] = [
  {
    source: "машинного обучения",
    translations: ["machine learning", "ML"],
    matchPhrase: "machine learning",
    description: "Раздел искусственного интеллекта, обучающий модели на данных",
  },
  {
    source: "глубокого обучения",
    translations: ["deep learning", "DL"],
    matchPhrase: "deep learning",
    description:
      "Подраздел МО, использующий многослойные нейронные сети для обучения представлениям",
  },
  {
    source: "нейронных сетей",
    translations: ["neural networks", "NN"],
    matchPhrase: "neural networks",
    description: "Вычислительные модели, вдохновлённые биологическими нейронами",
  },
  {
    source: "трансформера",
    translations: ["transformer", "Transformer"],
    matchPhrase: "transformer",
    description: "Архитектура нейросети на механизме внимания",
  },
  {
    source: "BLEU оценка",
    translations: ["BLEU score", "BLEU"],
    matchPhrase: "BLEU score",
    description: "Метрика качества машинного перевода",
  },
  {
    source: "перплексия",
    translations: ["perplexity", "PPL"],
    matchPhrase: "perplexity",
    description: "Мера неопределённости языковой модели",
  },
];

function countWords(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function buildTitle(text: string) {
  const snippet = text.trim().slice(0, 48);
  return snippet.length < text.trim().length ? `${snippet}…` : snippet;
}

function normalize(text: string) {
  return text.trim().replace(/\s+/g, " ").toLowerCase();
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function mockTranslate(sourceText: string): string {
  if (normalize(sourceText) === normalize(DEMO_SOURCE_TEXT)) {
    return DEMO_TRANSLATED_TEXT;
  }

  let translated = sourceText;
  for (const pattern of TERM_PATTERNS) {
    const re = new RegExp(escapeRegExp(pattern.source), "gi");
    translated = translated.replace(re, pattern.translations[0]);
  }

  return translated;
}

export function extractTerms(translatedText: string): Term[] {
  const lowerText = translatedText.toLowerCase();
  const found: Term[] = [];

  for (const pattern of TERM_PATTERNS) {
    const idx = lowerText.indexOf(pattern.matchPhrase.toLowerCase());
    if (idx === -1) continue;

    const matched = translatedText.slice(idx, idx + pattern.matchPhrase.length);

    found.push({
      id: crypto.randomUUID(),
      source: pattern.source,
      translations: pattern.translations,
      selectedTranslation: matched,
      description: pattern.description,
      start: idx,
      end: idx + pattern.matchPhrase.length,
    });
  }

  return found.sort((a, b) => a.start - b.start);
}

export function analyzeText(
  sourceText: string,
  sourceLang = "ru",
  targetLang = "en"
): AnalysisSession {
  const translatedText = mockTranslate(sourceText);
  const terms = extractTerms(translatedText);

  return {
    id: crypto.randomUUID(),
    title: buildTitle(sourceText) || "Новый анализ",
    sourceText,
    translatedText,
    sourceLang,
    targetLang,
    terms,
    wordCount: countWords(translatedText),
    createdAt: new Date().toISOString(),
  };
}
