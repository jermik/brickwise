"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#f5f5f3" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "24px",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.6px",
              textTransform: "uppercase",
              color: "#a3a3a3",
              marginBottom: 8,
            }}
          >
            Something went wrong
          </div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#111",
              marginBottom: 8,
              letterSpacing: "-0.4px",
            }}
          >
            Unexpected error
          </div>
          <p style={{ fontSize: 13, color: "#737373", marginBottom: 20, textAlign: "center", maxWidth: 280 }}>
            An unexpected error occurred. Please try again or refresh the page.
          </p>
          <button
            onClick={reset}
            style={{
              padding: "8px 18px",
              background: "#111",
              color: "#fff",
              border: "none",
              borderRadius: 7,
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
