import { NextRequest, NextResponse } from "next/server"
import { getRequestUser } from "@/lib/auth"
import { GROQ_MODELS, groq } from "@/lib/groq"

export async function POST(req: NextRequest) {
  try {
    const user = await getRequestUser(req)
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const formData = await req.formData()
    const audioFile = formData.get("audio") as File

    if (!audioFile) return NextResponse.json({ error: "No audio file" }, { status: 400 })

    const transcription = await groq.audio.transcriptions.create({
      file: audioFile,
      model: GROQ_MODELS.transcribe,
      language: "en",
    })

    return NextResponse.json({ transcript: transcription.text })

  } catch (error) {
    console.error("[/api/transcribe]", error)
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
