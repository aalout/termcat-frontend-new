import type { Term } from "@/entities/term/model/types";
import type { AnalysisSession } from "@/entities/analysis/model/types";
import {
  DEMO_SOURCE_TEXT,
  DEMO_TRANSLATED_TEXT,
} from "@/shared/constants/demo-text";

interface TermPattern {
  /** Фраза в EN-исходнике (для частичного mock-перевода) */
  enPhrase: string;
  /** Канонический RU-термин — заголовок карточки */
  ruLabel: string;
  /** Спорные RU-варианты перевода */
  ruVariants: string[];
  /** Формы, которые ищем в RU-переводе (падежи, написания) */
  matchPhrases: string[];
  /** Подстановка при частичном mock-переводе */
  mockReplacement: string;
  description?: string;
}

const TERM_PATTERNS: TermPattern[] = [
  {
    enPhrase: "large language models",
    ruLabel: "большая языковая модель",
    ruVariants: ["большая языковая модель", "БЯМ", "LLM"],
    matchPhrases: ["Большие языковые модели", "большие языковые модели"],
    mockReplacement: "Большие языковые модели",
    description:
      "EN: large language models. Спор: полный перевод «большая языковая модель», аббревиатура БЯМ или латинская LLM.",
  },
  {
    enPhrase: "machine learning",
    ruLabel: "машинное обучение",
    ruVariants: ["машинное обучение", "автоматическое обучение", "МО"],
    matchPhrases: ["машинное обучение", "машинного обучения"],
    mockReplacement: "машинное обучение",
    description:
      "EN: machine learning. Устаревший вариант «автоматическое обучение» до сих пор встречается в нормативных текстах.",
  },
  {
    enPhrase: "deep learning",
    ruLabel: "глубокое обучение",
    ruVariants: ["глубокое обучение", "глубинное обучение", "ГО"],
    matchPhrases: ["глубокого обучения", "глубокое обучение"],
    mockReplacement: "глубокого обучения",
    description:
      "EN: deep learning. «Глубинное обучение» — частая калька; в ГОST-подобных глоссариях закреплено «глубокое обучение».",
  },
  {
    enPhrase: "fine-tune",
    ruLabel: "дообучение",
    ruVariants: ["дообучение", "тонкая настройка", "fine-tuning"],
    matchPhrases: ["дообучают", "дообучение"],
    mockReplacement: "дообучают",
    description:
      "EN: fine-tune / fine-tuning. Спор между русским «дообучение» и заимствованием fine-tuning в технической документации.",
  },
  {
    enPhrase: "BLEU score",
    ruLabel: "метрика BLEU",
    ruVariants: ["метрика BLEU", "оценка BLEU", "BLEU"],
    matchPhrases: ["метрики BLEU", "метрика BLEU", "оценка BLEU"],
    mockReplacement: "метрики BLEU",
    description:
      "EN: BLEU score. Метрика обычно не переводится; спорят, нужен ли род «метрика» или «оценка».",
  },
  {
    enPhrase: "perplexity",
    ruLabel: "перплексия",
    ruVariants: ["перплексия", "конфузия", "perplexity"],
    matchPhrases: ["перплексии", "перплексия"],
    mockReplacement: "перплексии",
    description:
      "EN: perplexity. «Конфузия» — старый калька-вариант; в современных NLP-текстах чаще «перплексия».",
  },
  {
    enPhrase: "neural networks",
    ruLabel: "нейросети",
    ruVariants: ["нейросети", "нейронные сети", "НС"],
    matchPhrases: ["Нейросети", "нейросетей", "нейронных сетей"],
    mockReplacement: "Нейросети",
    description:
      "EN: neural networks. Классический спор: разговорное «нейросети» vs нормативное «нейронные сети».",
  },
  {
    enPhrase: "transformer",
    ruLabel: "трансформер",
    ruVariants: ["трансформер", "Transformer", "трансформерная архитектура"],
    matchPhrases: ["трансформера", "трансформер", "Transformer"],
    mockReplacement: "трансформера",
    description:
      "EN: transformer. Часто оставляют латиницей Transformer; в русскоязычных статьях закрепляется «трансформер».",
  },
  {
    enPhrase: "natural language processing",
    ruLabel: "обработка естественного языка",
    ruVariants: ["обработка естественного языка", "ОЕЯ", "NLP"],
    matchPhrases: [
      "обработки естественного языка",
      "обработка естественного языка",
    ],
    mockReplacement: "обработки естественного языка",
    description:
      "EN: natural language processing. Аббревиатуры ОЕЯ и NLP конкурируют с полной русской формой.",
  },
  {
    enPhrase: "embeddings",
    ruLabel: "эмбеддинг",
    ruVariants: ["эмбеддинг", "векторное представление", "вложение"],
    matchPhrases: ["эмбеддингов", "эмбеддинги", "эмбеддинг"],
    mockReplacement: "эмбеддингов",
    description:
      "EN: embeddings. «Вложение» из математики vs устоявшийся IT-калька «эмбеддинг» vs описательное «векторное представление».",
  },
  {
    enPhrase: "tokens",
    ruLabel: "токен",
    ruVariants: ["токен", "лексема", "единица текста"],
    matchPhrases: ["токены", "токенов", "токен"],
    mockReplacement: "токены",
    description:
      "EN: tokens. В лингводокументации предпочитают «лексема», в ML-доках — «токен».",
  },
  {
    enPhrase: "Retrieval-augmented generation",
    ruLabel: "генерация с поисковым дополнением",
    ruVariants: [
      "генерация с поисковым дополнением",
      "RAG",
      "retrieval-augmented generation",
    ],
    matchPhrases: ["Retrieval-augmented generation"],
    mockReplacement: "Retrieval-augmented generation",
    description:
      "EN: retrieval-augmented generation. Аббревиатура RAG vs полный перевод vs полное сохранение EN-формулировки.",
  },
  {
    enPhrase: "hallucination",
    ruLabel: "галлюцинация",
    ruVariants: ["галлюцинация", "выдумка модели", "hallucination"],
    matchPhrases: ["галлюцинации", "галлюцинация"],
    mockReplacement: "галлюцинации",
    description:
      "EN: hallucination. Калька «галлюцинация» закрепилась в ML; альтернатива — описательное «выдумка модели».",
  },
  {
    enPhrase: "LLM",
    ruLabel: "большая языковая модель",
    ruVariants: ["большая языковая модель", "БЯМ", "LLM"],
    matchPhrases: ["LLM"],
    mockReplacement: "LLM",
    description:
      "EN: LLM. В русскоязычных текстах часто оставляют латиницей вместо БЯМ или полного перевода.",
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

function findMatch(translatedText: string, phrases: string[]) {
  const lowerText = translatedText.toLowerCase();

  for (const phrase of phrases) {
    const idx = lowerText.indexOf(phrase.toLowerCase());
    if (idx === -1) continue;

    return {
      start: idx,
      end: idx + phrase.length,
      matched: translatedText.slice(idx, idx + phrase.length),
    };
  }

  return null;
}

function mockTranslate(sourceText: string): string {
  if (normalize(sourceText) === normalize(DEMO_SOURCE_TEXT)) {
    return DEMO_TRANSLATED_TEXT;
  }

  let translated = sourceText;
  for (const pattern of SORTED_PATTERNS) {
    const re = new RegExp(escapeRegExp(pattern.enPhrase), "gi");
    translated = translated.replace(re, pattern.mockReplacement);
  }

  return translated;
}

export function extractTerms(translatedText: string): Term[] {
  const found: Term[] = [];
  const occupied: Array<{ start: number; end: number }> = [];

  for (const pattern of TERM_PATTERNS) {
    const match = findMatch(translatedText, pattern.matchPhrases);
    if (!match) continue;

    const overlaps = occupied.some(
      (range) => match.start < range.end && match.end > range.start
    );
    if (overlaps) continue;

    occupied.push({ start: match.start, end: match.end });

    found.push({
      id: crypto.randomUUID(),
      source: pattern.ruLabel,
      translations: Array.from(
        new Set(
          pattern.ruVariants.includes(match.matched)
            ? pattern.ruVariants
            : [match.matched, ...pattern.ruVariants]
        )
      ),
      selectedTranslation: match.matched,
      description: pattern.description,
      start: match.start,
      end: match.end,
    });
  }

  return found.sort((a, b) => a.start - b.start);
}

export function analyzeText(
  sourceText: string,
  sourceLang = "en",
  targetLang = "ru"
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
