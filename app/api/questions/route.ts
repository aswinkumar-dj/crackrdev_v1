import { NextRequest, NextResponse } from "next/server"
import { adminSupabase } from "@/lib/supabase/admin"
import { getRequestUser } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const user = await getRequestUser(req)
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get("sessionId")
    if (!sessionId) return NextResponse.json({ error: "sessionId required" }, { status: 400 })

    // get question ids from session
    const { data: session, error: sessionError } = await adminSupabase
      .from("sessions")
      .select("question_ids, user_id")
      .eq("id", sessionId)
      .single()

    if (sessionError) throw sessionError
    if (session.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    if (!session?.question_ids?.length) {
      return NextResponse.json({ error: "No questions found for this session" }, { status: 404 })
    }

    // fetch those specific questions
    const { data: questions, error } = await adminSupabase
      .from("questions")
      .select("id, content, category")
      .in("id", session.question_ids)
      .order("created_at", { ascending: true })

    if (error) throw error

    return NextResponse.json({ questions })

  } catch (error) {
    console.error("[/api/questions]", error)
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
