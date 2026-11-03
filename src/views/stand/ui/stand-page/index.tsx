"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { analysisApi } from "@/shared/api/analysis/client";
import { ApiError, readToken } from "@/shared/api/http";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import {
  checkAnalysis,
  parseAnalysis,
  unwrapAnalysis,
  type ParsedAnalysis,
  type PhraseHit,
} from "@/shared/lib/term-alignment";
import styles from "./index.module.css";

const PRESETS = [
  {
    id: "short",
    title: "Короткий",
    text: "Machine learning helps computers learn from data.",
  },
  {
    id: "cases",
    title: "Склонения",
    text: "Large language models rely on machine learning and deep learning pipelines. Teams fine-tune them on in-domain corpora and monitor quality with BLEU score and perplexity. Transformer-based neural networks remain central to natural language processing, encoding tokens as dense embeddings.",
  },
  {
    id: "repeat",
    title: "Повторы",
    text: "A neural network trains another neural network. The same neural network shares weights across layers.",
  },
];

interface ProbeView {
  created: ParsedAnalysis | null;
  parseError: string;
}

export function StandPage() {
  const router = useRouter();
  const [text, setText] = useState(PRESETS[1].text);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");
  const [probe, setProbe] = useState<ProbeView | null>(null);

  const run = async (source: string) => {
    if (!readToken()) {
      router.replace("/login");
      return;
    }

    setRunning(true);
    setError("");
    try {
      const result = await analysisApi.probe(source);
      const created = parseAnalysis(unwrapAnalysis(result));
      setProbe({
        created,
        parseError: created ? "" : "В ответе нет разбора анализа",
      });
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        router.replace("/login");
        return;
      }
      setProbe(null);
      setError(err instanceof ApiError ? err.message : "Не удалось выполнить проверку");
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>Проверка бэкенда</p>
          <h1 className={styles.title}>Терминологический стенд</h1>
        </div>
        <Link href="/" className={styles.back}>
          К анализу
        </Link>
      </header>

      <p className={styles.lead}>
        После проверки два ответа: совпало ли склонение и пришёл ли термин с бэка ровно той строкой,
        которая стоит в тексте.
      </p>

      <section className={styles.composer}>
        <div className={styles.presets}>
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className={text === preset.text ? styles.presetActive : styles.preset}
              onClick={() => setText(preset.text)}
            >
              {preset.title}
            </button>
          ))}
        </div>
        <Textarea
          fullWidth
          rows={7}
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        <div className={styles.actions}>
          <Button variant="gradient" size="small" onClick={() => run(text)} disabled={running || !text.trim()}>
            {running ? "Проверка…" : "Проверить"}
          </Button>
        </div>
        {error ? <p className={styles.error}>{error}</p> : null}
      </section>

      {probe ? (
        <div className={styles.results}>
          {probe.parseError ? <p className={styles.error}>{probe.parseError}</p> : null}
          {probe.created ? <Report analysis={probe.created} /> : null}
        </div>
      ) : null}
    </div>
  );
}

function Report({ analysis }: { analysis: ParsedAnalysis }) {
  const check = checkAnalysis(analysis);
  const hasTerms = check.termsPresent && check.terms.length > 0;
  const sameForm = (kind: PhraseHit["kind"]) => kind === "exact" || kind === "case";
  const declension = yesNo(
    hasTerms && check.translatedPresent && check.terms.every((term) => sameForm(term.translated.kind))
  );
  const identical = yesNo(
    hasTerms &&
      check.translatedPresent &&
      check.terms.every((term) => term.source.kind === "exact" && term.translated.kind === "exact")
  );

  return (
    <section className={styles.report}>
      <p className={declension === "Да" ? styles.yes : styles.no}>Склонения отрабатывают? {declension}</p>
      <p className={identical === "Да" ? styles.yes : styles.no}>
        Термин с бэка один в один с текстом? {identical}
      </p>
      {!check.translatedPresent ? <p className={styles.note}>Перевод в ответе пустой, сверить форму нельзя.</p> : null}
      {!check.termsPresent ? <p className={styles.note}>Список терминов в ответе пустой.</p> : null}

      <ul className={styles.list}>
        {check.terms.length === 0 ? (
          <li>Терминов нет</li>
        ) : (
          check.terms.map((term) => (
            <li key={term.id || `${term.termSource}-${term.termTranslated}`}>
              <p className={styles.pair}>
                {term.termSource || "—"} → {term.termTranslated || "—"}
              </p>
              <p>Исходник: {sideLine(term.source, analysis.sourceText)}</p>
              <p>Перевод: {sideLine(term.translated, analysis.translatedText)}</p>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}

function yesNo(ok: boolean) {
  return ok ? "Да" : "Нет";
}

function sideLine(hit: PhraseHit, text: string) {
  if (hit.kind === "exact") return "да";
  if (hit.kind === "case") return `форма та же, в тексте «${text.slice(hit.start, hit.end)}»`;
  if (hit.kind === "partial") return `нет, в тексте это часть «${wordAround(text, hit.start, hit.end)}»`;
  return "нет, в тексте такой строки нет";
}

function wordAround(text: string, start: number, end: number) {
  let from = start;
  let to = end;
  while (from > 0 && isWordChar(text.charAt(from - 1))) from -= 1;
  while (to < text.length && isWordChar(text.charAt(to))) to += 1;
  return text.slice(from, to);
}

function isWordChar(char: string) {
  return /[\p{L}\p{N}]/u.test(char);
}
