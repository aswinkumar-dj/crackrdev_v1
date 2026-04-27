export type ParsedResume = {
  skills: string[];
  yoe: string;
  projects: string[];
  rawText: string;
};

export async function parseResume(resumeUrl: string): Promise<ParsedResume> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  if (!backendUrl) {
    throw new Error("NEXT_PUBLIC_BACKEND_URL is not configured.");
  }

  const response = await fetch(`${backendUrl}/api/resume/parse`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ resumeUrl }),
  });
  const data = await response.json();
  console.log(data);
  if (!response.ok) {
    throw new Error("Failed to parse resume.");
  }
  return data;
}
