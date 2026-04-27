export type InterviewSummaryPayload = {
  sessionId: string;
  userId?: string;
  candidateName: string;
  role: string;
  round: string;
  difficulty: string;
  overallScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  technicalDepthScore: number;
  strengths: string[];
  improvements: string[];
  finalVerdict: string;
  transcript?: string[];
  completedAt: string;
};

export type FinishSessionResponse = {
  success: boolean;
  sessionId: string;
  savedAt: string;
};

export async function finishSession(
  payload: InterviewSummaryPayload,
): Promise<FinishSessionResponse> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  if (!backendUrl) {
    throw new Error("NEXT_PUBLIC_BACKEND_URL is not configured.");
  }

  const response = await fetch(`${backendUrl}/api/sessions/${payload.sessionId}/complete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to finish interview session.");
  }

  return response.json();
}
