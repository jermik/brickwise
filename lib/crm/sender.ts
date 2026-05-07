// Centralised sender / sign-off config for outreach copy.
//
// The whole point of this module is that the outreach generators don't
// hardcode "Mikey Gelderblom" in fifteen places. When this product later
// becomes white-label / multi-user, only this file needs to change (or
// be replaced with a per-user lookup) and every email, audit report,
// proposal, and follow-up will pick up the new identity.
//
// Keep it deliberately small and synchronous — no DB lookup, no async,
// no tenant resolution. Just constants + locale-aware sign-off builder.

export type SenderLocale = "en" | "nl";

export interface SenderConfig {
  /** Display name in the sign-off line. */
  name: string;
  /** Role / function ("Growth", "Founder", "Head of Sales", ...). */
  role: string;
  /** Company shown after the role (without "https://"). */
  company: string;
}

export const DEFAULT_SENDER_NAME = "Mikey Gelderblom";
export const DEFAULT_SENDER_ROLE = "Growth";
export const DEFAULT_SENDER_COMPANY = "Brickwise.pro";

export const DEFAULT_SENDER: SenderConfig = {
  name: DEFAULT_SENDER_NAME,
  role: DEFAULT_SENDER_ROLE,
  company: DEFAULT_SENDER_COMPANY,
};

/**
 * Locale-aware sign-off lines. Returns an array of plain text lines,
 * with empty strings denoting blank lines between blocks. Suitable for
 * `.join("\n")` or spreading into an existing line array.
 *
 * Format (EN):
 *   Best,
 *   <blank>
 *   <name>
 *   <blank>
 *   <role> at <company>
 *
 * Format (NL):
 *   Met vriendelijke groet,
 *   <blank>
 *   <name>
 *   <blank>
 *   <role> van <company>
 */
export function signoffLines(
  locale: SenderLocale,
  sender: SenderConfig = DEFAULT_SENDER,
): string[] {
  if (locale === "nl") {
    return [
      "Met vriendelijke groet,",
      "",
      sender.name,
      "",
      `${sender.role} van ${sender.company}`,
    ];
  }
  return [
    "Best,",
    "",
    sender.name,
    "",
    `${sender.role} at ${sender.company}`,
  ];
}

/** Same content as `signoffLines`, joined with "\n" for inline insertion. */
export function buildSignoff(
  locale: SenderLocale,
  sender: SenderConfig = DEFAULT_SENDER,
): string {
  return signoffLines(locale, sender).join("\n");
}
