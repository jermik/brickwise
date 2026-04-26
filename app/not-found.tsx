import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";

export default function NotFound() {
  return (
    <AppShell>
      <div className="flex flex-col items-center justify-center h-full min-h-[420px] px-6">
        <div
          className="text-[64px] font-bold tracking-[-3px] leading-none mb-4"
          style={{ fontFamily: "var(--font-dm-mono)", color: "#ebebeb" }}
        >
          404
        </div>
        <div
          className="text-[16px] font-semibold mb-2 tracking-[-0.3px]"
          style={{ color: "#111" }}
        >
          Page not found
        </div>
        <p
          className="text-[13px] text-center mb-6 max-w-[260px]"
          style={{ color: "#a3a3a3" }}
        >
          The page you&#39;re looking for doesn&#39;t exist or has been moved.
        </p>
        <div className="flex gap-2">
          <Link
            href="/"
            className="px-4 py-2 rounded-[7px] text-[13px] font-medium no-underline transition-opacity hover:opacity-80"
            style={{ background: "#111", color: "#fff" }}
          >
            Dashboard
          </Link>
          <Link
            href="/analyzer"
            className="px-4 py-2 rounded-[7px] text-[13px] font-medium no-underline"
            style={{
              background: "transparent",
              color: "#737373",
              border: "1px solid #ebebeb",
            }}
          >
            Analyzer
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
