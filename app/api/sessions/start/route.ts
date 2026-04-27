import { NextRequest, NextResponse } from "next/server"
import Groq from "groq-sdk"
import { adminSupabase } from "@/lib/supabase/admin"
import { getRequestUser } from "@/lib/auth"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const user = await getRequestUser(req)
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // 2. parse body
    const { role, difficulty, roundtype, resumeUrl, resumeData } = await req.json()

    // 3. insert session
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

    // 4. generate questions via Groq
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a technical interviewer. Return ONLY valid JSON array. No markdown, no explanation, no backticks.",
        },
        {
          role: "user",
          content: `Generate 5 technical interview questions for a ${role} developer.
Difficulty: ${difficulty}
Experience: ${resumeData.yoe}
Skills: ${resumeData.skills.join(", ")}
Projects: ${resumeData.projects.join(", ")}

Return ONLY this JSON format:
[{ "content": "question text here", "category": "category name here" }]`,
        },
      ],
      temperature: 0.7,
    })

    const rawText = completion.choices[0].message.content || "[]"
    const questions = JSON.parse(rawText) as Array<{
      content: string
      category: string
    }>

    // 5. insert questions
    const { data: insertedQuestions, error: qError } = await adminSupabase
      .from("questions")
      .insert(
        questions.map((q) => ({
          role,
          difficulty,
          content: q.content,
          category: q.category,
        }))
      )
      .select("id")

    if (qError) throw qError

    // store questionIds in session row
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
