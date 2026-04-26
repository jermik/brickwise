import { AppShell } from "@/components/layout/app-shell";

export default function AnalyzerLoading() {
  return (
    <AppShell>
      <div className="flex flex-col h-full">
        <div className="px-6 pt-7 pb-5" style={{ borderBottom: "1px solid #ebebeb" }}>
          <div
            className="h-2.5 w-16 rounded mb-2 animate-pulse"
            style={{ background: "#f0f0f0" }}
          />
          <div
            className="h-6 w-44 rounded animate-pulse"
            style={{ background: "#f0f0f0" }}
          />
        </div>
        <div className="flex-1 px-6 py-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-[10px] overflow-hidden animate-pulse"
                style={{ background: "#f5f5f5", height: 240 }}
              />
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
