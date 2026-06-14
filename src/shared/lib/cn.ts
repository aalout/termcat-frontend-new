type ClassDict = Record<string, boolean>;
type UnknownClass = string | number | boolean | null | undefined | ClassDict | unknown[];

/** Tiny class name helper compatible with nested arrays and `{ [key]: condition }`. */
export function cn(...inputs: UnknownClass[]): string {
  const out: string[] = [];

  const walk = (v: unknown): void => {
    if (v == null || v === false || v === true) return;

    if (typeof v === "string" || typeof v === "number") {
      if (String(v)) out.push(String(v));
      return;
    }

    if (Array.isArray(v)) {
      for (const x of v) walk(x);
      return;
    }

    if (typeof v === "object") {
      for (const [k, ok] of Object.entries(v as ClassDict))
        if (ok) out.push(k);
    }
  };

  for (const i of inputs) walk(i);

  return out.join(" ").trim();
}
