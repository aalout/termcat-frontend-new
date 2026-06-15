import type { Term } from "@/entities/term/model/types";
import type { AnalysisSession } from "@/entities/analysis/model/types";
import { DEMO_SOURCE_TEXT } from "@/shared/constants/demo-text";

interface TermPattern {
  /** Каноническая EN-фраза */
  enPhrase: string;
  /** Дополнительные EN-формы для поиска в тексте */
  enMatchPhrases?: string[];
  /** Канонический RU-перевод — заголовок карточки */
  ruLabel: string;
  /** Спорные RU-варианты */
  ruVariants: string[];
  description?: string;
}

const TERM_PATTERNS: TermPattern[] = [
  {
    enPhrase: "large language models",
    ruLabel: "большая языковая модель",
    ruVariants: ["большая языковая модель", "БЯМ", "LLM"],
    description:
      "Спор: полный перевод «большая языковая модель», аббревиатура БЯМ или латинская LLM.",
  },
  {
    enPhrase: "machine learning",
    ruLabel: "машинное обучение",
    ruVariants: ["машинное обучение", "автоматическое обучение", "МО"],
    description:
      "Устаревший вариант «автоматическое обучение» до сих пор встречается в нормативных текстах.",
  },
  {
    enPhrase: "deep learning",
    ruLabel: "глубокое обучение",
    ruVariants: ["глубокое обучение", "глубинное обучение", "ГО"],
    description:
      "«Глубинное обучение» — частая калька; в глоссариях чаще «глубокое обучение».",
  },
  {
    enPhrase: "fine-tune",
    enMatchPhrases: ["fine-tune", "fine-tuning", "fine-tuned"],
    ruLabel: "дообучение",
    ruVariants: ["дообучение", "тонкая настройка", "fine-tuning"],
    description:
      "Спор между русским «дообучение» и заимствованием fine-tuning в технической документации.",
  },
  {
    enPhrase: "BLEU score",
    ruLabel: "метрика BLEU",
    ruVariants: ["метрика BLEU", "оценка BLEU", "BLEU"],
    description: "Метрика обычно не переводится; спорят, нужен ли род «метрика» или «оценка».",
  },
  {
    enPhrase: "perplexity",
    ruLabel: "перплексия",
    ruVariants: ["перплексия", "конфузия", "perplexity"],
    description:
      "«Конфузия» — старый калька-вариант; в современных NLP-текстах чаще «перплексия».",
  },
  {
    enPhrase: "neural networks",
    enMatchPhrases: ["neural networks", "neural network"],
    ruLabel: "нейросети",
    ruVariants: ["нейросети", "нейронные сети", "НС"],
    description:
      "Классический спор: разговорное «нейросети» vs нормативное «нейронные сети».",
  },
  {
    enPhrase: "transformer",
    enMatchPhrases: ["transformer", "Transformer", "Transformer-based"],
    ruLabel: "трансформер",
    ruVariants: ["трансформер", "Transformer", "трансформерная архитектура"],
    description:
      "Часто оставляют латиницей Transformer; в русскоязычных статьях закрепляется «трансформер».",
  },
  {
    enPhrase: "natural language processing",
    ruLabel: "обработка естественного языка",
    ruVariants: ["обработка естественного языка", "ОЕЯ", "NLP"],
    description: "Аббревиатуры ОЕЯ и NLP конкурируют с полной русской формой.",
  },
  {
    enPhrase: "embeddings",
    enMatchPhrases: ["embeddings", "embedding"],
    ruLabel: "эмбеддинг",
    ruVariants: ["эмбеддинг", "векторное представление", "вложение"],
    description:
      "«Вложение» из математики vs IT-калька «эмбеддинг» vs «векторное представление».",
  },
  {
    enPhrase: "tokens",
    enMatchPhrases: ["tokens", "token"],
    ruLabel: "токен",
    ruVariants: ["токен", "лексема", "единица текста"],
    description: "В лингводокументации предпочитают «лексема», в ML-доках — «токен».",
  },
  {
    enPhrase: "Retrieval-augmented generation",
    ruLabel: "генерация с поисковым дополнением",
    ruVariants: [
      "генерация с поисковым дополнением",
      "RAG",
      "retrieval-augmented generation",
    ],
    description:
      "Аббревиатура RAG vs полный перевод vs полное сохранение EN-формулировки.",
  },
  {
    enPhrase: "hallucination",
    ruLabel: "галлюцинация",
    ruVariants: ["галлюцинация", "выдумка модели", "hallucination"],
    description:
      "Калька «галлюцинация» закрепилась в ML; альтернатива — «выдумка модели».",
  },
  {
    enPhrase: "LLM",
    ruLabel: "большая языковая модель",
    ruVariants: ["большая языковая модель", "БЯМ", "LLM"],
    description:
      "В русскоязычных текстах часто оставляют латиницей вместо БЯМ или полного перевода.",
  },
];

const SORTED_PATTERNS = [...TERM_PATTERNS].sort(
  (a, b) => b.enPhrase.length - a.enPhrase.length
);

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

function getMatchPhrases(pattern: TermPattern) {
  return pattern.enMatchPhrases ?? [pattern.enPhrase];
}

function findMatch(text: string, phrases: string[]) {
  const lowerText = text.toLowerCase();

  for (const phrase of [...phrases].sort((a, b) => b.length - a.length)) {
    const idx = lowerText.indexOf(phrase.toLowerCase());
    if (idx === -1) continue;

    return {
      start: idx,
      end: idx + phrase.length,
      matched: text.slice(idx, idx + phrase.length),
    };
  }

  return null;
}

export function extractTerms(text: string): Term[] {
  const found: Term[] = [];
  const occupied: Array<{ start: number; end: number }> = [];

  for (const pattern of SORTED_PATTERNS) {
    const match = findMatch(text, getMatchPhrases(pattern));
    if (!match) continue;

    const overlaps = occupied.some(
      (range) => match.start < range.end && match.end > range.start
    );
    if (overlaps) continue;

    occupied.push({ start: match.start, end: match.end });

    found.push({
      id: crypto.randomUUID(),
      phrase: match.matched,
      source: pattern.ruLabel,
      translations: pattern.ruVariants,
      selectedTranslation: pattern.ruVariants[0],
      description: pattern.description,
      sourceStart: match.start,
      sourceEnd: match.end,
      start: match.start,
      end: match.end,
    });
  }

  return found.sort((a, b) => a.sourceStart - b.sourceStart);
}

/** Собирает EN+RU «мешанину»: исходный текст с подставленными RU-терминами */
export function buildMixedText(sourceText: string, terms: Term[]) {
  const sorted = [...terms].sort((a, b) => a.sourceStart - b.sourceStart);
  let result = "";
  let cursor = 0;
  const rebuilt: Term[] = [];

  for (const term of sorted) {
    result += sourceText.slice(cursor, term.sourceStart);
    const start = result.length;
    result += term.selectedTranslation;
    const end = result.length;
    rebuilt.push({ ...term, start, end });
    cursor = term.sourceEnd;
  }

  result += sourceText.slice(cursor);

  return { text: result, terms: rebuilt };
}

export function analyzeText(
  sourceText: string,
  sourceLang = "en",
  targetLang = "ru"
): AnalysisSession {
  const text = sourceText.trim();
  const rawTerms = extractTerms(text);
  const { text: mixedText, terms } = buildMixedText(text, rawTerms);

  return {
    id: crypto.randomUUID(),
    title: buildTitle(text) || "Новый анализ",
    sourceText: text,
    translatedText: mixedText,
    sourceLang,
    targetLang,
    terms,
    wordCount: countWords(mixedText),
    createdAt: new Date().toISOString(),
  };
}

export function isDemoText(text: string) {
  return normalize(text) === normalize(DEMO_SOURCE_TEXT);
}
