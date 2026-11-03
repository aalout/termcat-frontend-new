export interface RawTerm {
  id: string;
  termSource: string;
  termTranslated: string;
}

export interface ParsedAnalysis {
  id: string;
  sourceText: string;
  translatedText: string;
  topic: string;
  termsCount: number | null;
  termsPresent: boolean;
  terms: RawTerm[];
}

export type AlignmentKind = "exact" | "case" | "partial" | "missing";

export interface PhraseHit {
  kind: AlignmentKind;
  count: number;
  start: number;
  end: number;
}

export interface TermCheck {
  id: string;
  termSource: string;
  termTranslated: string;
  source: PhraseHit;
  translated: PhraseHit;
  status: "pass" | "warn" | "fail";
}

export interface TextCheck {
  terms: TermCheck[];
  termsPresent: boolean;
  translatedPresent: boolean;
  countMatches: boolean;
  status: "pass" | "warn" | "fail";
}

const emptyHit = (): PhraseHit => ({ kind: "missing", count: 0, start: -1, end: -1 });

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

function readCount(record: Record<string, unknown>) {
  const value = record.termsCount ?? record.TermsCount;
  return typeof value === "number" ? value : null;
}

export function unwrapAnalysis(payload: unknown): unknown {
  const record = asRecord(payload);
  if (!record) return payload;
  if ("analysis" in record || "Analysis" in record) return record.analysis ?? record.Analysis;
  if ("analyses" in record || "Analyses" in record) {
    const list = record.analyses ?? record.Analyses;
    return Array.isArray(list) ? (list[0] ?? null) : list;
  }
  return payload;
}

export function parseAnalysis(value: unknown): ParsedAnalysis | null {
  const record = asRecord(value);
  if (!record) return null;

  const id = readString(record, "id", "ID");
  if (!id) return null;

  const rawTerms = record.terms ?? record.Terms;
  const termsPresent = Array.isArray(rawTerms);
  const terms = termsPresent
    ? rawTerms.flatMap((item) => {
        const term = asRecord(item);
        if (!term) return [];
        return [
          {
            id: readString(term, "id", "ID"),
            termSource: readString(term, "termSource", "TermSource"),
            termTranslated: readString(term, "termTranslated", "TermTranslated"),
          },
        ];
      })
    : [];

  return {
    id,
    sourceText: readString(record, "sourceText", "SourceText"),
    translatedText: readString(record, "translatedText", "TranslatedText"),
    topic: readString(record, "topic", "Topic"),
    termsCount: readCount(record),
    termsPresent,
    terms,
  };
}

function isWordChar(char: string) {
  return /[\p{L}\p{N}]/u.test(char);
}

function bounded(text: string, start: number, end: number) {
  const before = start > 0 ? text.charAt(start - 1) : "";
  const after = end < text.length ? text.charAt(end) : "";
  return (!before || !isWordChar(before)) && (!after || !isWordChar(after));
}

function occurrences(text: string, phrase: string, ignoreCase: boolean) {
  const needle = ignoreCase ? phrase.toLocaleLowerCase("ru") : phrase;
  const haystack = ignoreCase ? text.toLocaleLowerCase("ru") : text;
  if (!needle || needle.length !== phrase.length || haystack.length !== text.length) return [];

  const found: Array<{ start: number; end: number }> = [];
  let from = 0;

  while (from <= haystack.length - needle.length) {
    const index = haystack.indexOf(needle, from);
    if (index < 0) break;
    found.push({ start: index, end: index + phrase.length });
    from = index + needle.length;
  }

  return found;
}

export function locatePhrase(text: string, phrase: string): PhraseHit {
  const trimmed = phrase.trim();
  if (!trimmed) return emptyHit();

  const exact = occurrences(text, trimmed, false);
  const exactBounded = exact.filter((range) => bounded(text, range.start, range.end));
  if (exactBounded.length) {
    return { kind: "exact", count: exactBounded.length, ...exactBounded[0] };
  }

  const folded = occurrences(text, trimmed, true);
  const foldedBounded = folded.filter((range) => bounded(text, range.start, range.end));
  if (foldedBounded.length) {
    return { kind: "case", count: foldedBounded.length, ...foldedBounded[0] };
  }

  const partial = exact[0] ?? folded[0];
  if (partial) return { kind: "partial", count: exact.length || folded.length, ...partial };
  return emptyHit();
}

function termStatus(source: PhraseHit, translated: PhraseHit): TermCheck["status"] {
  const kinds = [source.kind, translated.kind];
  if (kinds.some((kind) => kind === "missing" || kind === "partial")) return "fail";
  if (kinds.some((kind) => kind === "case")) return "warn";
  return "pass";
}

export function checkAnalysis(analysis: ParsedAnalysis): TextCheck {
  const terms = analysis.terms.map((term) => {
    const source = locatePhrase(analysis.sourceText, term.termSource);
    const translated = locatePhrase(analysis.translatedText, term.termTranslated);
    return {
      id: term.id,
      termSource: term.termSource,
      termTranslated: term.termTranslated,
      source,
      translated,
      status: termStatus(source, translated),
    };
  });

  const translatedPresent = analysis.translatedText.trim().length > 0;
  const countMatches = analysis.termsCount == null || analysis.termsCount === terms.length;
  const termStatusRollup = terms.some((term) => term.status === "fail")
    ? "fail"
    : terms.some((term) => term.status === "warn")
      ? "warn"
      : "pass";

  let status: TextCheck["status"] = termStatusRollup;
  if (!analysis.termsPresent || !translatedPresent || !countMatches) status = "fail";

  return {
    terms,
    termsPresent: analysis.termsPresent,
    translatedPresent,
    countMatches,
    status,
  };
}
