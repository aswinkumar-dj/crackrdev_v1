import { NextRequest, NextResponse } from "next/server"
import { adminSupabase } from "@/lib/supabase/admin"
import { getRequestUser } from "@/lib/auth"
import { GROQ_MODELS, groq, parseModelJson } from "@/lib/groq"

type InterviewScores = {
  overallScore: number
  communicationScore: number
  technicalScore: number
  confidenceScore: number
  feedback: string
  strengths: string[]
  areasToImprove: string[]
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> },
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
      model: GROQ_MODELS.quality,
      reasoning_effort: "low",
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content:
            "You are a technical interview evaluator. Score the candidate from the actual answers given. Return valid JSON.",
        },
        {
          role: "user",
          content: `Evaluate this technical interview and return scores based on the actual answers given.
Role: ${role}
Difficulty: ${difficulty}
Questions asked: ${questions?.join(", ")}
Candidate transcript: ${transcript || "No answer provided"}

Score the candidate honestly from 0-100 based on their actual responses.`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "interview_scores",
          strict: true,
          schema: {
            type: "object",
            properties: {
              overallScore: { type: "number" },
              communicationScore: { type: "number" },
              technicalScore: { type: "number" },
              confidenceScore: { type: "number" },
              feedback: { type: "string" },
              strengths: {
                type: "array",
                items: { type: "string" },
              },
              areasToImprove: {
                type: "array",
                items: { type: "string" },
              },
            },
            required: [
              "overallScore",
              "communicationScore",
              "technicalScore",
              "confidenceScore",
              "feedback",
              "strengths",
              "areasToImprove",
            ],
            additionalProperties: false,
          },
        },
      },
    })

    const scores = parseModelJson<InterviewScores>(
      completion.choices[0]?.message?.content,
    )

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
