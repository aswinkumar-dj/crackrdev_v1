import { NextRequest, NextResponse } from "next/server"
import Groq from "groq-sdk"
import { getRequestUser } from "@/lib/auth"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const user = await getRequestUser(req)
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { resumeUrl } = await req.json()

    if (!resumeUrl) return NextResponse.json({ error: "resumeUrl is required" }, { status: 400 })

    // 1. fetch the PDF as text
    const pdfResponse = await fetch(resumeUrl)
    const pdfBuffer = await pdfResponse.arrayBuffer()
    const pdfText = Buffer.from(pdfBuffer).toString("base64")

    // 2. send to Groq to extract resume data
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a resume parser. Return ONLY valid JSON. No markdown, no backticks, no explanation.",
        },
        {
          role: "user",
          content: `Parse this resume and extract key information.
Resume content (base64 encoded PDF): ${pdfText.slice(0, 3000)}

Return ONLY this JSON format:
{
  "skills": ["skill1", "skill2"],
  "yoe": "fresher or 1-2 years or 3-5 years or 5+",
  "projects": ["project1", "project2"]
}`,
        },
      ],
      temperature: 0.3,
    })

    const rawText = completion.choices[0].message.content || "{}"
    const parsed = JSON.parse(rawText)

    return NextResponse.json({
      skills: parsed.skills || [],
      yoe: parsed.yoe || "fresher",
      projects: parsed.projects || [],
      extractedAt: new Date().toISOString(),
    })

  } catch (error) {
    console.error("[/api/resume/parse]", error)
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
