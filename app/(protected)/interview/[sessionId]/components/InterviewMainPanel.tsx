import { HiMiniMicrophone, HiMiniStopCircle } from "react-icons/hi2";
import type { AiStatus } from "../types";

type InterviewMainPanelProps = {
  aiStatus: AiStatus;
  error: string | null;
  isConnected: boolean;
  isFinishing: boolean;
  isMicOn: boolean;
  currentQuestion: { id: string; content: string; category: string } | null;
  onFinishInterview: () => void;
  onToggleMic: () => void;
};

export function InterviewMainPanel({
  aiStatus,
  error,
  isConnected,
  isFinishing,
  isMicOn,
  currentQuestion,
  onFinishInterview,
  onToggleMic,
}: InterviewMainPanelProps) {
  return (
    <div className="relative flex min-h-0 overflow-hidden rounded-xl border border-[#dceaea] bg-white p-5 shadow-[0_12px_32px_rgba(21,49,77,0.08)] sm:p-6">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#1a2744] via-[#17a1a6] to-[#7cd5d8]" />

      <div className="flex h-full min-h-0 flex-col justify-between">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d6eeee] bg-[#f7fcfc] px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#8a9b99]">
            <span
              className={`h-2.5 w-2.5 rounded-full transition ${
                isMicOn
                  ? "bg-[#17a1a6] shadow-[0_0_14px_rgba(23,161,166,0.5)]"
                  : isConnected
                    ? "bg-emerald-500 shadow-[0_0_14px_rgba(16,185,129,0.4)]"
                    : "bg-amber-400 shadow-[0_0_14px_rgba(251,191,36,0.35)]"
              }`}
            />
            {isMicOn ? "Mic on" : isConnected ? "Connected" : "Connecting"}
          </div>

          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-[#17a1a6]">
            AI Status
          </p>
          <h2 className="mt-1.5 text-lg font-bold tracking-tight text-[#101616] sm:text-xl">
            {aiStatus}
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-6 text-[#4b5d5b]">
            Use the microphone toggle to unmute while answering. When your mic is enabled,
            AI playback stops immediately and your voice is streamed live. Muting again sends
            your response and resumes the interview.
          </p>

          {currentQuestion && (
            <div className="mt-4 rounded-xl border border-[#d6eeee] bg-[#f0fafa] px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#17a1a6] mb-1">
                Current Question
              </p>
              <p className="text-sm leading-6 text-[#101616] font-medium">
                {currentQuestion.content}
              </p>
              {currentQuestion.category && (
                <p className="mt-1 text-xs text-[#4b5d5b]">{currentQuestion.category}</p>
              )}
            </div>
          )}

          {error ? (
            <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {error}
            </div>
          ) : null}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onToggleMic}
            className={`inline-flex min-w-[220px] items-center justify-between gap-4 rounded-lg border px-4 py-3 text-sm font-bold transition ${
              isMicOn
                ? "border-[#1a2744] bg-[#1a2744] text-white shadow-[0_12px_28px_rgba(26,39,68,0.2)] hover:bg-[#243559]"
                : "border-[#17a1a6] bg-[#17a1a6] text-white shadow-[0_12px_28px_rgba(23,161,166,0.2)] hover:bg-[#138b90]"
            }`}
            aria-label={isMicOn ? "Mute microphone" : "Unmute microphone"}
          >
            <span className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white/20">
                {isMicOn ? (
                  <HiMiniStopCircle className="h-5 w-5" />
                ) : (
                  <HiMiniMicrophone className="h-5 w-5" />
                )}
              </span>
              <span>{isMicOn ? "Mute microphone" : "Unmute microphone"}</span>
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
              {isMicOn ? "Live" : "Muted"}
            </span>
          </button>

          <div className="rounded-lg border border-[#d9ecec] bg-[#f7fcfc] px-3.5 py-2.5 text-xs font-medium text-[#4b5d5b]">
            {isMicOn ? "You are live. Speak naturally." : "Mic muted. Click to answer."}
          </div>

          <button
            type="button"
            onClick={onFinishInterview}
            disabled={isFinishing}
            className="inline-flex items-center justify-center rounded-lg border border-[#d7e4e9] bg-white px-4 py-3 text-sm font-bold text-[#1a2744] transition hover:border-[#1a2744] hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isFinishing ? "Finishing..." : "Finish interview"}
          </button>
        </div>
      </div>
    </div>
  );
}