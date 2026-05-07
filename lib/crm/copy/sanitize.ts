// Lightweight, deterministic copy sanitiser. Applied to every piece of
// generated outreach / proposal / audit text before it leaves the
// generator. The goal is to strip the AI-tells (em dashes, double dashes)
// and tighten whitespace without changing meaning.
//
// Rules:
//   1. " — ", "—", " -- ", "--"  →  ", "
//   2. Markdown horizontal rules ("---" alone on a line) are preserved.
//   3. Cleans up duplicate punctuation produced by step 1 (",,", ",.")
//   4. Collapses runs of whitespace and trims trailing whitespace.
//   5. Collapses 3+ blank lines to a single blank line.
//
// The function is idempotent: sanitize(sanitize(x)) === sanitize(x).

export function sanitizeCopyOutput(input: string | undefined | null): string {
  if (!input) return "";

  const lines = input.split("\n").map((raw) => {
    // Preserve a markdown horizontal-rule line ("---" or "----" etc.).
    if (/^\s*-{3,}\s*$/.test(raw)) return raw.trim();

    // Track dashes that sit at the start or end of the raw line so we can
    // clean up artefact commas the replacement is about to produce.
    // (We only strip leading/trailing commas we just *created* — anything
    // the author already had, such as a "Best," sign-off, is preserved.)
    const hadLeadingDash = /^[ \t]*(?:—|--(?!-))/.test(raw);
    const hadTrailingDash = /(?:—|(?<!-)--(?!-))[ \t]*$/.test(raw);

    let line = raw;

    // 1. Em-dash and double-dash (when not part of "---") collapse to ", ".
    line = line.replace(/\s*—\s*/g, ", ");
    line = line.replace(/\s+--\s+/g, ", ");
    line = line.replace(/(?<!-)--(?!-)/g, ", ");

    // 2. Drop the leading/trailing comma artefacts we just produced.
    if (hadLeadingDash) line = line.replace(/^([ \t]*),\s*/, "$1");
    if (hadTrailingDash) line = line.replace(/[ \t]*,[ \t]*$/, "");

    // 3. Collapse repeated commas and clean punctuation around them.
    line = line.replace(/(,\s*){2,}/g, ", ");
    line = line.replace(/\(\s*,\s*/g, "(");
    line = line.replace(/\s*,\s*\)/g, ")");
    line = line.replace(/,\s*([.;:!?])/g, "$1");

    // 4. Whitespace inside the line.
    line = line.replace(/[ \t]{2,}/g, " ");
    line = line.replace(/[ \t]+$/g, "");

    return line;
  });

  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

/**
 * Apply sanitiseCopyOutput to every string field in an object (shallow),
 * leaving non-string values untouched. Useful for proposal-package
 * sub-objects.
 */
export function sanitizeStringFields<T extends Record<string, unknown>>(obj: T): T {
  const out: Record<string, unknown> = { ...obj };
  for (const k of Object.keys(out)) {
    const v = out[k];
    if (typeof v === "string") out[k] = sanitizeCopyOutput(v);
  }
  return out as T;
}
