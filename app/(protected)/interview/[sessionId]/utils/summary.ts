import type { InterviewSummaryPayload } from "@/lib/finishSession";
import { LATEST_INTERVIEW_SUMMARY_KEY } from "../constants";
import type { InterviewSessionConfig, StoredInterviewSummary } from "../types";

export function buildMockSummary(
  sessionId: string,
  session: InterviewSessionConfig,
  userId?: string,
): InterviewSummaryPayload {
  return {
    sessionId,
    userId,
    candidateName: session.name,
    role: session.role,
    round: session.round,
    difficulty: session.difficulty,
    overallScore: 84,
    communicationScore: 82,
    problemSolvingScore: 86,
    technicalDepthScore: 83,
    strengths: [
      "Explained frontend tradeoffs clearly and stayed structured under pressure.",
      "Demonstrated good React and component design reasoning.",
      "Answered follow-up prompts with concise, relevant examples.",
    ],
    improvements: [
      "Go deeper on performance optimization decisions with concrete metrics.",
      "Tighten explanations around accessibility and edge-case handling.",
      "Add more system-level reasoning when discussing architecture choices.",
    ],
    finalVerdict:
      "Strong technical round overall. Candidate is interview-ready with a few areas to sharpen.",
    transcript: [
      "AI: Tell me about your experience building scalable frontend applications.",
      "Candidate: Shared React, Next.js, and UI architecture examples.",
      "AI: How would you optimize a slow dashboard page?",
      "Candidate: Discussed profiling, code splitting, caching, and render control.",
    ],
    completedAt: new Date().toISOString(),
  };
}

export function persistLatestSummary(summary: StoredInterviewSummary) {
  sessionStorage.setItem(LATEST_INTERVIEW_SUMMARY_KEY, JSON.stringify(summary));
}

export function persistSummaryFallback(summary: InterviewSummaryPayload) {
  sessionStorage.setItem(
    `interview-summary-${summary.sessionId}`,
    JSON.stringify(summary),
  );
}
