# Context Engineering Guide

> **Note**: This example is a **hand-curated reference** of what the pipeline should produce for this input. Your own run of `/to-skill` may differ in wording and emphasis. Use this as a quality benchmark, not as a verbatim output guarantee.

**Input type**: Twitter/X URL
**Skill type**: Knowledge
**Source**: [Andrej Karpathy's viral tweet on context engineering](https://x.com/karpathy/status/1937902205765607626) (June 2025)

## About the Source

Andrej Karpathy's tweet "+1 for 'context engineering' over 'prompt engineering'" went massively viral, sparking an industry-wide shift in terminology. The tweet and surrounding discussion describe context engineering as "the delicate art and science of filling the context window with just the right information for the next step."

## Pipeline Walkthrough

```
/to-skill https://x.com/karpathy/status/1937902205765607626
```

| Step | What Happens | Result |
|---|---|---|
| 0. Parse Intent | Detects URL input, user wants a skill from this tweet | — |
| 1. Ingest | Fetches tweet content + thread via URL extraction | Text extracted |
| 2. Classify | Expert insights, conceptual framework, no executable steps | **Knowledge-type** |
| 3. Language | English primary, bilingual description added | EN + ZH description |
| 4. Generate | Creates SKILL.md following Knowledge template | Analysis framework |
| 5. Quality Check | Validates against 12-point checklist | 12/12 |

## What Changed from Input to Output

| Aspect | Tweet + Thread | Generated Skill |
|---|---|---|
| Format | Short-form social media (280 chars + replies) | Structured Knowledge skill with framework |
| Depth | Concept introduction | Full framework with 4 operations, decision tree, anti-patterns |
| Actionability | "Here's a cool idea" | "Here's how to apply it in your LLM apps" |
| Examples | None in tweet | 2 worked examples (RAG pipeline, agent system) |
| Scope | Just context engineering | Compares prompt eng vs context eng, gives migration path |

## Files

- `SKILL.md` — Generated Knowledge-type skill: context engineering analysis framework

## Try It Yourself

```bash
npx skills add skillforgeai-dev/content-to-skill
/to-skill https://x.com/karpathy/status/1937902205765607626
```
