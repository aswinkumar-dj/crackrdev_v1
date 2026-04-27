import { getSupabase } from "@/lib/supabase/client"
export type StartSessionPayload = {
  userId: string
  role: string
  difficulty: string
  roundtype: string
  resumeUrl: string
  resumeData: {
    skills: string[]
    yoe: string
    projects: string[]
  }
}

export type StartSessionResponse = {
  sessionId: string
  startedAt: string
  questionIds: string[]
}

export async function startSession(
  payload: StartSessionPayload,
): Promise<StartSessionResponse> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
  if (!backendUrl) throw new Error("NEXT_PUBLIC_BACKEND_URL not configured")

  const supabase = getSupabase()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error("Not authenticated")

  const response = await fetch(`${backendUrl}/api/sessions/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) throw new Error("Failed to start interview session")
  return response.json()
}