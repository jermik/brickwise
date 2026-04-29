"use client";

import "@fontsource/geist-sans";
import { useRef, useEffect } from "react";
import Link from "next/link";

const BG = "#04020F";
const FG = "#F3F2EF";
const SUB = "#D3D0CC";
const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_065045_c44942da-53c6-4804-b734-f9e07fc22e08.mp4";

const LOGOS = ["Vortex", "Nimbus", "Prysma", "Cirrus", "Kynder", "Halcyn"];
const LOGOS_DOUBLED = [...LOGOS, ...LOGOS];

function ChevronDown() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M2 4l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LandingHero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let raf: number;

    function tick() {
      const v = videoRef.current;
      if (!v || !v.duration) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const t = v.currentTime;
      const d = v.duration;
      const fade = 0.5;

      if (t < fade) {
        v.style.opacity = String(t / fade);
      } else if (t > d - fade) {
        v.style.opacity = String((d - t) / fade);
      } else {
        v.style.opacity = "1";
      }
      raf = requestAnimationFrame(tick);
    }

    function onEnded() {
      cancelAnimationFrame(raf);
      const v = videoRef.current;
      if (!v) return;
      v.style.opacity = "0";
      setTimeout(() => {
        if (!videoRef.current) return;
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
        raf = requestAnimationFrame(tick);
      }, 100);
    }

    video.play().catch(() => {});
    raf = requestAnimationFrame(tick);
    video.addEventListener("ended", onEnded);

    return () => {
      cancelAnimationFrame(raf);
      video.removeEventListener("ended", onEnded);
    };
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        background: BG,
        color: FG,
        fontFamily: "'Geist Sans', 'Inter', system-ui, sans-serif",
      }}
    >
      {/* Background video */}
      <video
        ref={videoRef}
        src={VIDEO_URL}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ opacity: 0 }}
      />

      {/* Blurred blob behind content */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          width: 984,
          height: 527,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "#030712",
          opacity: 0.9,
          filter: "blur(82px)",
          borderRadius: 9999,
        }}
      />

      {/* All content sits above the video */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* ── Navbar ── */}
        <nav className="flex items-center justify-between py-5 px-8">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-[7px] flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
            >
              <svg width="14" height="12" viewBox="0 0 13 11" fill="none">
                <rect x="0" y="8" width="13" height="3" rx="0.75" fill="rgba(255,255,255,0.85)" />
                <rect x="0" y="4" width="9" height="3" rx="0.75" fill="rgba(255,255,255,0.85)" />
                <rect x="0" y="0" width="5" height="3" rx="0.75" fill="rgba(255,255,255,0.85)" />
              </svg>
            </div>
            <span
              className="text-[15px] font-semibold tracking-[-0.3px]"
              style={{ color: FG }}
            >
              Brickwise
            </span>
          </div>

          {/* Nav items — hidden on mobile */}
          <div className="hidden md:flex items-center gap-7">
            {(
              [
                { label: "Features", chevron: true },
                { label: "Solutions", chevron: false },
                { label: "Plans", chevron: false },
                { label: "Learning", chevron: true },
              ] as const
            ).map(({ label, chevron }) => (
              <button
                key={label}
                className="flex items-center gap-1.5 text-[14px] transition-opacity duration-150 hover:opacity-100"
                style={{ color: FG, opacity: 0.65 }}
              >
                {label}
                {chevron && <ChevronDown />}
              </button>
            ))}
          </div>

          {/* Sign Up */}
          <Link
            href="/sign-up"
            className="flex items-center px-4 py-2 rounded-full text-[13px] font-medium no-underline transition-opacity duration-150 hover:opacity-90"
            style={{
              background: "rgba(255,255,255,0.07)",
              color: FG,
              border: "1px solid rgba(255,255,255,0.14)",
            }}
          >
            Sign Up
          </Link>
        </nav>

        {/* Divider */}
        <div
          aria-hidden
          style={{
            height: 1,
            marginTop: 3,
            background:
              "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",
          }}
        />

        {/* ── Hero copy ── */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="text-center">
            <h1
              style={{
                fontFamily: "'General Sans', system-ui, sans-serif",
                fontSize: "clamp(64px, 14vw, 220px)",
                fontWeight: 400,
                lineHeight: 1.02,
                letterSpacing: "-0.024em",
                margin: 0,
              }}
            >
              <span style={{ color: FG }}>Power </span>
              <span
                style={{
                  backgroundImage:
                    "linear-gradient(to left, #6366f1, #a855f7, #fcd34d)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                AI
              </span>
            </h1>

            <p
              className="mx-auto"
              style={{
                color: SUB,
                fontSize: 18,
                lineHeight: 2,
                maxWidth: 448,
                marginTop: 9,
                opacity: 0.8,
              }}
            >
              The most powerful AI ever deployed / in talent acquisition
            </p>

            <Link
              href="/sign-up"
              className="inline-flex items-center no-underline transition-opacity duration-150 hover:opacity-80"
              style={{
                background: "rgba(255,255,255,0.07)",
                color: FG,
                border: "1px solid rgba(255,255,255,0.18)",
                borderRadius: 8,
                paddingLeft: 29,
                paddingRight: 29,
                paddingTop: 24,
                paddingBottom: 24,
                marginTop: 25,
                fontSize: 15,
                fontWeight: 500,
              }}
            >
              Schedule a Consult
            </Link>
          </div>
        </div>

        {/* ── Logo marquee ── */}
        <div className="pb-10 overflow-hidden">
          <div className="max-w-5xl mx-auto px-8 flex items-center gap-12">
            {/* Static label */}
            <p
              className="text-sm flex-shrink-0 leading-snug"
              style={{ color: `${FG}80`, whiteSpace: "pre-line" }}
            >
              {"Relied on by brands\nacross the globe"}
            </p>

            {/* Scrolling strip */}
            <div className="overflow-hidden flex-1 min-w-0">
              <div
                className="flex items-center"
                style={{
                  gap: 64,
                  width: "max-content",
                  animation: "marquee 20s linear infinite",
                }}
              >
                {LOGOS_DOUBLED.map((name, i) => (
                  <div
                    key={i}
                    className="flex items-center flex-shrink-0"
                    style={{ gap: 10 }}
                  >
                    <div
                      className="liquid-glass rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        width: 24,
                        height: 24,
                        fontSize: 11,
                        fontWeight: 700,
                        color: FG,
                      }}
                    >
                      {name[0]}
                    </div>
                    <span
                      className="text-base font-semibold"
                      style={{ color: FG }}
                    >
                      {name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
