import { getPlatformUrl, platformLinkRel } from "@/lib/affiliate";

// Reusable platform CTA. Self-aware about whether an affiliate URL is
// active — falls back to platform homepage when none is configured.
//
// Usage:
//   <AffiliateCta platform="Lofty" />
//   <AffiliateCta platform="RealT" label="Browse RealT properties" />
//   <AffiliateCta platform="Lofty" sourceUrl={p.sourceUrl} />  // per-property
//
// Drop a referral URL into lib/affiliate.ts and every instance flips
// automatically with proper rel="sponsored" disclosure.
export function AffiliateCta({
  platform,
  label,
  sourceUrl,
  variant = "primary",
  className,
}: {
  platform: string;
  label?: string;
  sourceUrl?: string;
  variant?: "primary" | "secondary" | "inline";
  className?: string;
}) {
  const href = getPlatformUrl(platform, sourceUrl);
  const rel = platformLinkRel(platform, sourceUrl);
  const text = label ?? `Visit ${platform} →`;

  const baseStyles: React.CSSProperties = {
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    fontSize: 13,
    fontWeight: 600,
    borderRadius: 9,
    transition: "opacity 0.15s",
  };

  const variantStyles: React.CSSProperties =
    variant === "primary"
      ? { padding: "10px 20px", background: "#111", color: "#fff" }
      : variant === "secondary"
      ? { padding: "10px 20px", background: "#fff", color: "#111", border: "1px solid #ebebeb" }
      : { padding: 0, color: "#16a34a", textDecoration: "underline" };

  return (
    <a
      href={href}
      target="_blank"
      rel={rel}
      className={className}
      style={{ ...baseStyles, ...variantStyles }}
    >
      {text}
    </a>
  );
}
