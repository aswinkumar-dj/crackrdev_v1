import type { InterviewSessionConfig } from "../types";

type SessionHeaderProps = {
  sessionId: string;
  session: InterviewSessionConfig;
};

const META_ITEMS = [
  { label: "Candidate", key: "name" },
  { label: "Round", key: "round" },
  { label: "Difficulty", key: "difficulty" },
  { label: "Role", key: "role" },
] as const;

export function SessionHeader({ sessionId, session }: SessionHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-[#17a1a6]">
          CrackrDev AI Interview
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#101616] sm:text-4xl">
          Live Interview Room
        </h1>
        <p className="mt-1.5 text-xs font-medium text-[#8a9b99]">Session ID: <span className="font-mono text-[#17a1a6]">{sessionId}</span></p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-end sm:gap-2.5">
        {META_ITEMS.map(({ label, key }) => (
          <div
            key={label}
            className="rounded-lg border border-[#dceaea] bg-white px-3 py-2.5 shadow-[0_6px_16px_rgba(21,49,77,0.05)] hover:shadow-[0_8px_20px_rgba(21,49,77,0.08)] transition"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-[#8a9b99]">
              {label}
            </p>
            <p className="mt-1 text-sm font-bold capitalize text-[#101616]">
              {session[key]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
