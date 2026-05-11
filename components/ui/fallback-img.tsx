"use client";

const FALLBACK = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=700&q=80&auto=format&fit=crop";

interface FallbackImgProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
}

export function FallbackImg({ fallback = FALLBACK, src, ...props }: FallbackImgProps) {
  return (
    <img
      src={(src as string) || fallback}
      {...props}
      onError={(e) => { (e.target as HTMLImageElement).src = fallback; }}
    />
  );
}
