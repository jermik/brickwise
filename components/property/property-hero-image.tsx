"use client";

const FALLBACK = "https://images.unsplash.com/photo-1560184897-ae5f036d1564?w=1200&q=80&auto=format&fit=crop";

export function PropertyHeroImage({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src || FALLBACK}
      alt={alt}
      referrerPolicy="no-referrer-when-downgrade"
      className="w-full h-full object-cover"
      onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
    />
  );
}
