import { NextRequest, NextResponse } from "next/server"
import { adminSupabase } from "@/lib/supabase/admin"
import { getRequestUser } from "@/lib/auth"
import { GROQ_MODELS, groq, parseModelJson } from "@/lib/groq"

type GeneratedQuestion = {
  content: string
  category: string
}

type GeneratedQuestionsPayload = {
  questions: GeneratedQuestion[]
}

export async function POST(req: NextRequest) {
  try {
    const user = await getRequestUser(req)
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { role, difficulty, roundtype, resumeUrl, resumeData } = await req.json()

    const { data: session, error: sessionError } = await adminSupabase
      .from("sessions")
      .insert({
        user_id: user.id,
        role,
        difficulty,
        round_type: roundtype,
        resume_url: resumeUrl,
        status: "in-progress",
      })
      .select()
      .single()

    if (sessionError) throw sessionError

    const completion = await groq.chat.completions.create({
      model: GROQ_MODELS.quality,
      reasoning_effort: "low",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content:
            "You are a technical interviewer. Generate interview questions tailored to the candidate. Return valid JSON.",
        },
        {
          role: "user",
          content: `Generate 5 technical interview questions for a ${role} developer.
Difficulty: ${difficulty}
Experience: ${resumeData.yoe}
Skills: ${resumeData.skills.join(", ")}
Projects: ${resumeData.projects.join(", ")}`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "interview_questions",
          strict: true,
          schema: {
            type: "object",
            properties: {
              questions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    content: { type: "string" },
                    category: { type: "string" },
                  },
                  required: ["content", "category"],
                  additionalProperties: false,
                },
              },
            },
            required: ["questions"],
            additionalProperties: false,
          },
        },
      },
    })

    const { questions } = parseModelJson<GeneratedQuestionsPayload>(
      completion.choices[0]?.message?.content,
    )

    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("Model did not return any interview questions.")
    }

    const { data: insertedQuestions, error: qError } = await adminSupabase
      .from("questions")
      .insert(
        questions.map((q) => ({
          role,
          difficulty,
          content: q.content,
          category: q.category,
        })),
      )
      .select("id")

    if (qError) throw qError

    await adminSupabase
      .from("sessions")
      .update({ question_ids: insertedQuestions.map((q) => q.id) })
      .eq("id", session.id)

    return NextResponse.json({
      sessionId: session.id,
      startedAt: session.started_at,
      questionIds: insertedQuestions.map((q) => q.id),
    })
  } catch (error) {
    console.error("[/api/sessions/start]", error)
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
