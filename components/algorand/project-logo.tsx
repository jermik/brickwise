"use client";

// Safe logo renderer for ecosystem projects.
// - If logoUrl is provided AND it loads: shows the image
// - Otherwise: falls back to a deterministic gradient LetterAvatar
//
// "use client" because we listen to <img onError> to swap to fallback.

import { useState } from "react";
import { LetterAvatar } from "./letter-avatar";

interface ProjectLogoProps {
  name: string;
  logoUrl?: string;
  size?: number;
  rounded?: number;
}

export function ProjectLogo({ name, logoUrl, size = 56, rounded = 12 }: ProjectLogoProps) {
  const [errored, setErrored] = useState(false);

  if (!logoUrl || errored) {
    return <LetterAvatar name={name} size={size} rounded={rounded} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logoUrl}
      alt={`${name} logo`}
      width={size}
      height={size}
      onError={() => setErrored(true)}
      style={{
        width: size,
        height: size,
        borderRadius: rounded,
        objectFit: "cover",
        flexShrink: 0,
        background: "rgba(255,255,255,0.05)",
      }}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}
