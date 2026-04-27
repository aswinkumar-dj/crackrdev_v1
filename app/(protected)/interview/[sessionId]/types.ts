import type { InterviewSummaryPayload } from "@/lib/finishSession";

export type AiStatus = "Speaking..." | "Listening..." | "Processing...";

export type RealtimeEvent = {
  type: string;
  delta?: string;
};

export type InterviewSessionConfig = {
  name: string;
  role: string;
  round: string;
  difficulty: string;
};

export type StoredInterviewSummary = InterviewSummaryPayload & {
  savedToBackend?: boolean;
};
