import type { InterviewSessionConfig } from "./types";

export const MOCK_TOKEN = "mock_token_123";

export const MOCK_SESSION: InterviewSessionConfig = {
  name: "Ashwin",
  role: "Frontend Developer",
  round: "technical",
  difficulty: "Medium",
};

export const AUDIO_SAMPLE_RATE = 24000;
export const PROCESSOR_BUFFER_SIZE = 4096;

// Browser voice lists are async and reorder between calls. Lock to this index
// once, then reuse the same voiceURI for the rest of the session.
export const INTERVIEW_VOICE_INDEX = 7;

export const LATEST_INTERVIEW_SUMMARY_KEY = "latestInterviewSummary";
