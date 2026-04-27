import { NextRequest, NextResponse } from "next/server"
import Groq from "groq-sdk"
import { adminSupabase } from "@/lib/supabase/admin"
import { getRequestUser } from "@/lib/auth"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params

    const user = await getRequestUser(req)
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const { role, difficulty, transcript, questions } = body

    const { data: session, error: sessionError } = await adminSupabase
      .from("sessions")
      .select("id, user_id")
      .eq("id", sessionId)
      .single()

    if (sessionError) throw sessionError
    if (session.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a technical interview evaluator. Return ONLY valid JSON. No markdown, no backticks.",
        },
        {
          role: "user",
          content: `Evaluate this technical interview and return scores based on the actual answers given.
Role: ${role}
Difficulty: ${difficulty}
Questions asked: ${questions?.join(", ")}
Candidate transcript: ${transcript || "No answer provided"}

Score the candidate honestly from 0-100 based on their actual responses.
Return ONLY this JSON with no other text:
{
  "overallScore": <number 0-100>,
  "communicationScore": <number 0-100>,
  "technicalScore": <number 0-100>,
  "confidenceScore": <number 0-100>,
  "feedback": "<2-3 sentence overall feedback>",
  "strengths": ["<specific strength 1>", "<specific strength 2>"],
  "areasToImprove": ["<specific area 1>", "<specific area 2>"]
}`,
        },
      ],
      temperature: 0.3,
    })

    const rawText = completion.choices[0].message.content || "{}"
    const scores = JSON.parse(rawText)

    const { error: updateError } = await adminSupabase
      .from("sessions")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("id", session.id)
      .select()

    if (updateError) console.error("session update error:", updateError)

    const { error: scoresError } = await adminSupabase
      .from("scores")
      .insert({
        session_id: session.id,
        overall_score: scores.overallScore,
        communication_score: scores.communicationScore,
        technical_score: scores.technicalScore,
        confidence_score: scores.confidenceScore,
        feedback: scores.feedback,
        strengths: scores.strengths,
        areas_to_improve: scores.areasToImprove,
      })

    if (scoresError) console.error("scores insert error:", scoresError)

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      scores,
      savedAt: new Date().toISOString(),
    })

  } catch (error) {
    console.error("[/api/sessions/complete]", error)
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
