import { roleBreakdowns } from "../constants";

export default function RoleBreakdownGrid() {
  return (
    <div className="grid gap-px bg-[#dcebea] sm:grid-cols-[1fr_1fr_1fr_1fr]">
      <GridHeader label="Role" className="text-[#536461]" />
      <GridHeader label="Easy" className="text-green-700" />
      <GridHeader label="Medium" className="text-yellow-700" />
      <GridHeader label="Hard" className="text-red-700" />

      {roleBreakdowns.map(({ role, easy, medium, hard }) => (
        <div key={role} className="grid gap-px bg-[#dcebea] sm:contents">
          <div className="bg-white px-4 py-4">
            <h3 className="text-base font-bold text-[#101616]">{role}</h3>
          </div>
          <BreakdownCell label="Easy" tone="green" content={easy} />
          <BreakdownCell label="Medium" tone="yellow" content={medium} />
          <BreakdownCell label="Hard" tone="red" content={hard} />
        </div>
      ))}
    </div>
  );
}

function GridHeader({ label, className }: { label: string; className: string }) {
  return (
    <div
      className={`hidden bg-[#f8fbfb] px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] sm:block ${className}`}
    >
      {label}
    </div>
  );
}

function BreakdownCell({
  label,
  tone,
  content,
}: {
  label: string;
  tone: "green" | "yellow" | "red";
  content: string;
}) {
  const toneClass = {
    green: "bg-green-50 text-green-700",
    yellow: "bg-yellow-50 text-yellow-700",
    red: "bg-red-50 text-red-700",
  }[tone];

  return (
    <div className="bg-white px-4 py-4">
      <p
        className={`mb-2 inline-flex rounded-full px-3 py-1 text-xs font-bold sm:hidden ${toneClass}`}
      >
        {label}
      </p>
      <p className="text-sm leading-6 text-[#536461]">{content}</p>
    </div>
  );
}
