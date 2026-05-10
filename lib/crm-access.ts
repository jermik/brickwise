// CRM access-code gate helpers. All checks are server-side. Edge-runtime
// compatible (uses Web Crypto API, no Node `crypto` module).
//
// Required env vars:
//   CRM_ACCESS_CODE     — the password users must type
//   CRM_COOKIE_SECRET   — HMAC signing key (any random 32+ char string)
//
// Cookie design:
//   crm_access_granted=<ts>.<hmac(ts)>
//   - ts is ms-since-epoch when the code was verified
//   - hmac signs ts using CRM_COOKIE_SECRET so the cookie cannot be forged
//   - max age 7 days; enforced both by cookie attribute AND by re-checking ts on each verify
//
// Fail-closed: if env vars are missing or invalid, access is denied.

export const CRM_COOKIE_NAME = "crm_access_granted";
export const CRM_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

const ENC = new TextEncoder();

function timingSafeEqualStrings(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export function isCrmAccessCodeValid(submitted: string): boolean {
  const expected = process.env.CRM_ACCESS_CODE;
  if (!expected || expected.length < 4) return false;
  if (typeof submitted !== "string") return false;
  return timingSafeEqualStrings(submitted, expected);
}

function getCookieSecret(): string | null {
  const s = process.env.CRM_COOKIE_SECRET;
  if (!s || s.length < 16) return null;
  return s;
}

function base64UrlEncode(bytes: Uint8Array): string {
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
}

async function hmacSign(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    ENC.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const buf = await crypto.subtle.sign("HMAC", key, ENC.encode(payload));
  return base64UrlEncode(new Uint8Array(buf));
}

export async function createCrmAccessToken(): Promise<string | null> {
  const secret = getCookieSecret();
  if (!secret) return null;
  const ts = Date.now().toString();
  const sig = await hmacSign(ts, secret);
  return `${ts}.${sig}`;
}

export async function verifyCrmAccessToken(token: string | undefined): Promise<boolean> {
  if (!token || typeof token !== "string") return false;
  const secret = getCookieSecret();
  if (!secret) return false;

  const dot = token.indexOf(".");
  if (dot < 0) return false;
  const ts = token.slice(0, dot);
  const sig = token.slice(dot + 1);

  const tsNum = parseInt(ts, 10);
  if (!Number.isFinite(tsNum) || tsNum <= 0) return false;
  // Hard age limit even if cookie attribute somehow stale
  if (Date.now() - tsNum > CRM_COOKIE_MAX_AGE_SECONDS * 1000) return false;

  const expected = await hmacSign(ts, secret);
  return timingSafeEqualStrings(sig, expected);
}

// Production-grade cookie attributes. Domain set so cookie works on both
// brickwise.pro and crm.brickwise.pro. In local dev, no domain attribute.
export function buildCrmAccessCookieAttributes(): string {
  const isProd = process.env.NODE_ENV === "production";
  const parts = [
    "Path=/",
    `Max-Age=${CRM_COOKIE_MAX_AGE_SECONDS}`,
    "HttpOnly",
    "SameSite=Lax",
  ];
  if (isProd) {
    parts.push("Secure");
    parts.push("Domain=.brickwise.pro");
  }
  return parts.join("; ");
}

export function buildCrmAccessClearCookie(): string {
  const isProd = process.env.NODE_ENV === "production";
  const parts = [`${CRM_COOKIE_NAME}=`, "Path=/", "Max-Age=0", "HttpOnly", "SameSite=Lax"];
  if (isProd) {
    parts.push("Secure");
    parts.push("Domain=.brickwise.pro");
  }
  return parts.join("; ");
}
