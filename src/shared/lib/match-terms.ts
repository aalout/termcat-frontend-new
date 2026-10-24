import type { Term } from "@/entities/term/model/types";

export interface ApiTerm {
  id: string;
  termSource: string;
  termTranslated: string;
}

interface Range {
  start: number;
  end: number;
}

function occurrences(text: string, phrase: string): Range[] {
  const needle = phrase.trim();
  if (!needle) return [];

  const haystack = text.toLowerCase();
  const target = needle.toLowerCase();
  const found: Range[] = [];
  let from = 0;

  while (from < haystack.length) {
    const index = haystack.indexOf(target, from);
    if (index < 0) break;
    found.push({ start: index, end: index + needle.length });
    from = index + target.length;
  }

  return found;
}

function claim(ranges: Range[], occupied: Range[]) {
  for (const range of ranges) {
    const overlaps = occupied.some((item) => range.start < item.end && range.end > item.start);
    if (overlaps) continue;
    occupied.push(range);
    return range;
  }

  return null;
}

/** Ставит терминам позиции в исходнике и в переводе по точному вхождению строки. */
export function matchApiTerms(sourceText: string, translatedText: string, apiTerms: ApiTerm[]): Term[] {
  const sourceOccupied: Range[] = [];
  const translatedOccupied: Range[] = [];
  const matched = new Map<number, Term>();

  const ordered = apiTerms
    .map((term, index) => ({ term, index }))
    .sort((a, b) => b.term.termTranslated.length - a.term.termTranslated.length);

  for (const { term, index } of ordered) {
    const phrase = term.termSource.trim();
    const translation = term.termTranslated.trim();
    const source = claim(occurrences(sourceText, phrase), sourceOccupied);
    const translated = claim(occurrences(translatedText, translation), translatedOccupied);

    matched.set(index, {
      id: term.id,
      phrase,
      source: translation || phrase,
      translations: translation ? [translation] : [],
      selectedTranslation: translation,
      sourceStart: source?.start ?? 0,
      sourceEnd: source?.end ?? 0,
      start: translated?.start ?? -1,
      end: translated?.end ?? -1,
    });
  }

  return [...matched.entries()]
    .sort((a, b) => {
      const aStart = a[1].start < 0 ? Number.MAX_SAFE_INTEGER : a[1].start;
      const bStart = b[1].start < 0 ? Number.MAX_SAFE_INTEGER : b[1].start;
      return aStart - bStart || a[0] - b[0];
    })
    .map(([, term]) => term);
}
