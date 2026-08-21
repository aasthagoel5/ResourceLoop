const STAGES = [
  { key: "pending", label: "Offer Sent" },
  { key: "accepted", label: "Accepted" },
  { key: "completed", label: "Completed" },
];

function DonationStepper({ status, timeline = [] }) {
  // "cancelled" is a special case — show it as a stopped/broken flow
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-2 py-2">
        <div className="h-6 w-6 rounded-full bg-slate-300 flex items-center justify-center text-white text-xs">
          ✕
        </div>
        <span className="text-sm text-slate-500">Cancelled</span>
      </div>
    );
  }

  const currentIndex = STAGES.findIndex((s) => s.key === status);

  const getTimestamp = (stageKey) => {
    const entry = timeline.find((t) => t.status === stageKey);
    if (!entry) return null;
    return new Date(entry.timestamp).toLocaleString([], {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex items-start py-2">
      {STAGES.map((stage, i) => {
        const isDone = i <= currentIndex;
        const isCurrent = i === currentIndex;

        return (
          <div
            key={stage.key}
            className="flex items-center flex-1 last:flex-none"
          >
            <div className="flex flex-col items-center">
              <div
                className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  isDone
                    ? "bg-brand-600 text-white"
                    : "bg-slate-200 text-slate-400"
                } ${isCurrent ? "ring-4 ring-brand-100" : ""}`}
              >
                {isDone ? "✓" : i + 1}
              </div>
              <span
                className={`text-xs mt-1 whitespace-nowrap ${isDone ? "text-slate-700 font-medium" : "text-slate-400"}`}
              >
                {stage.label}
              </span>
              {getTimestamp(stage.key) && (
                <span className="text-[10px] text-slate-400 mt-0.5">
                  {getTimestamp(stage.key)}
                </span>
              )}
            </div>
            {i < STAGES.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-1 mb-5 transition-colors ${i < currentIndex ? "bg-brand-600" : "bg-slate-200"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default DonationStepper;
