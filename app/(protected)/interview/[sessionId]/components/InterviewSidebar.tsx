import type { RefObject } from "react";
import type { InterviewSessionConfig } from "../types";

type InterviewSidebarProps = {
  session: InterviewSessionConfig;
  showRedirectNotice: boolean;
  videoRef: RefObject<HTMLVideoElement | null>;
};

export function InterviewSidebar({
  session,
  showRedirectNotice,
  videoRef,
}: InterviewSidebarProps) {
  return (
    <aside className="flex min-h-0 flex-col gap-4">
      {/* Camera Preview Card */}
      <div className="overflow-hidden rounded-xl border border-[#dceaea] bg-white shadow-[0_8px_24px_rgba(21,49,77,0.08)]">
        <div className="aspect-[4/4.2] bg-gray-400">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="h-full w-full object-cover"
          />
        </div>
        <div className="space-y-2.5 border-t border-[#e4efef] px-4 py-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-[#101616]">{session.name}</p>
              <p className="text-xs font-medium uppercase tracking-wider text-[#8a9b99]">
                Camera Preview
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-[#17a1a6] shadow-[0_0_12px_rgba(23,161,166,0.6)]" />
              <span className="text-xs font-medium text-[#17a1a6]">Live</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interview Flow Card */}
      <div className="flex flex-1 flex-col rounded-xl border border-[#dceaea] bg-white p-4 shadow-[0_8px_24px_rgba(21,49,77,0.08)]">
        <div className="mb-3">
          <p className="text-xs font-bold uppercase tracking-wider text-[#8a9b99]">
            Interview Flow
          </p>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex gap-3">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#17a1a6]/10 text-xs font-bold text-[#17a1a6]">
              1
            </div>
            <p className="leading-5 text-[#4b5d5b]">AI asks the next question.</p>
          </div>
          <div className="flex gap-3">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#17a1a6]/10 text-xs font-bold text-[#17a1a6]">
              2
            </div>
            <p className="leading-5 text-[#4b5d5b]">Unmute when ready to answer.</p>
          </div>
          <div className="flex gap-3">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#17a1a6]/10 text-xs font-bold text-[#17a1a6]">
              3
            </div>
            <p className="leading-5 text-[#4b5d5b]">Mute to let interviewer continue.</p>
          </div>
          <div className="flex gap-3">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#17a1a6]/10 text-xs font-bold text-[#17a1a6]">
              4
            </div>
            <p className="leading-5 text-[#4b5d5b]">Finish to generate summary.</p>
          </div>
        </div>

        {showRedirectNotice ? (
          <div className="mt-4 rounded-lg bg-[#e8f5f4] p-3 text-xs font-medium text-[#127d82]">
            ✓ Summary ready. Redirecting...
          </div>
        ) : null}
      </div>
    </aside>
  );
}
