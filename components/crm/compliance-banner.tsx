export function ComplianceBanner() {
  return (
    <div
      className="flex items-start gap-3 rounded-lg px-4 py-3 text-sm"
      style={{
        background: "rgba(245,158,11,0.08)",
        border: "1px solid rgba(245,158,11,0.25)",
        color: "rgba(242,237,230,0.7)",
      }}
    >
      <span className="mt-0.5 text-base" aria-hidden>⚠</span>
      <div className="space-y-0.5">
        <p className="font-medium" style={{ color: "#f59e0b" }}>
          Compliance reminder
        </p>
        <p>
          This tool is for personalised, low-volume outreach only. Every message must be manually reviewed and personalised before sending. Never use this to send bulk or automated messages. Respect all do-not-contact flags. Include your identity and an opt-out option in every cold message.
        </p>
      </div>
    </div>
  );
}
