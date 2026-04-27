export default function DifficultySummary() {
  return (
    <div className="border-t border-[#dcebea] bg-[#f8fbfb] px-5 py-4 sm:px-6">
      <div className="grid gap-3 text-sm text-[#536461] sm:grid-cols-3">
        <SummaryCard
          tone="green"
          label="Easy"
          text="fundamentals and role basics."
        />
        <SummaryCard
          tone="yellow"
          label="Medium"
          text="practical depth and design tradeoffs."
        />
        <SummaryCard
          tone="red"
          label="Hard"
          text="advanced architecture and problem solving."
        />
      </div>
    </div>
  );
}

function SummaryCard({
  tone,
  label,
  text,
}: {
  tone: "green" | "yellow" | "red";
  label: string;
  text: string;
}) {
  const toneClass = {
    green: "text-green-700",
    yellow: "text-yellow-700",
    red: "text-red-700",
  }[tone];

  return (
    <div className="rounded-lg border border-[#dcebea] bg-white p-3">
      <span className={`font-bold ${toneClass}`}>{label}:</span> {text}
    </div>
  );
}
