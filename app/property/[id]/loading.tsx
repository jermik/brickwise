import { AppShell } from "@/components/layout/app-shell";

export default function PropertyLoading() {
  return (
    <AppShell>
      <div className="px-10 py-8 max-w-[960px]">
        <div
          className="h-3 w-32 rounded mb-6 animate-pulse"
          style={{ background: "#f0f0f0" }}
        />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
          <div className="space-y-4">
            <div
              className="rounded-[12px] animate-pulse"
              style={{ background: "#f0f0f0", height: 300 }}
            />
            {[120, 100, 180, 90].map((h, i) => (
              <div
                key={i}
                className="rounded-[10px] animate-pulse"
                style={{ background: "#f5f5f5", height: h }}
              />
            ))}
          </div>
          <div className="space-y-4">
            {[200, 160, 130, 120].map((h, i) => (
              <div
                key={i}
                className="rounded-[10px] animate-pulse"
                style={{ background: "#f5f5f5", height: h }}
              />
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
