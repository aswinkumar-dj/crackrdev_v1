import { NextRequest, NextResponse } from "next/server"
import { PDFParse } from "pdf-parse"
import { getRequestUser } from "@/lib/auth"
import { GROQ_MODELS, groq, parseModelJson } from "@/lib/groq"

export const runtime = "nodejs"

const YOE_VALUES = ["fresher", "1-2 years", "3-5 years", "5+"] as const

type ParsedResumePayload = {
  skills: string[]
  yoe: (typeof YOE_VALUES)[number]
  projects: string[]
}

export async function POST(req: NextRequest) {
  try {
    const user = await getRequestUser(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { resumeUrl } = await req.json()

    if (!resumeUrl) {
      return NextResponse.json(
        { error: "resumeUrl is required" },
        { status: 400 },
      )
    }

    const pdfResponse = await fetch(resumeUrl)

    if (!pdfResponse.ok) {
      throw new Error(`Failed to download resume: ${pdfResponse.status}`)
    }

    const pdfBuffer = Buffer.from(await pdfResponse.arrayBuffer())

    console.log("[/api/resume/parse] PDF downloaded:", pdfBuffer.length, "bytes")

    const parser = new PDFParse({ data: pdfBuffer })

    try {
      const result = await parser.getText()
      const resumeText = result.text?.trim() ?? ""

      console.log("[/api/resume/parse] Resume text length:", resumeText.length)

      if (!resumeText) {
        return NextResponse.json(
          {
            error:
              "Could not extract text from the resume. The PDF may be image-based.",
          },
          { status: 400 },
        )
      }

      const completion = await groq.chat.completions.create({
        model: GROQ_MODELS.fast,
        reasoning_effort: "low",
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content:
              "You are a resume parser. Extract only information that appears in the resume. Return valid JSON.",
          },
          {
            role: "user",
            content: `Parse this resume and extract skills, years of experience, and project names.

Rules:
- skills: technical and professional skills mentioned in the resume
- yoe: one of "fresher", "1-2 years", "3-5 years", "5+"
- projects: project names/titles only
- Do not invent information that is not in the resume

Resume:
${resumeText}`,
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "parsed_resume",
            strict: true,
            schema: {
              type: "object",
              properties: {
                skills: {
                  type: "array",
                  items: { type: "string" },
                },
                yoe: {
                  type: "string",
                  enum: [...YOE_VALUES],
                },
                projects: {
                  type: "array",
                  items: { type: "string" },
                },
              },
              required: ["skills", "yoe", "projects"],
              additionalProperties: false,
            },
          },
        },
      })

      const parsed = parseModelJson<ParsedResumePayload>(
        completion.choices[0]?.message?.content,
      )

      return NextResponse.json({
        skills: Array.isArray(parsed.skills) ? parsed.skills : [],
        yoe: YOE_VALUES.includes(parsed.yoe) ? parsed.yoe : "fresher",
        projects: Array.isArray(parsed.projects) ? parsed.projects : [],
        extractedAt: new Date().toISOString(),
      })
    } finally {
      await parser.destroy()
    }
  } catch (error) {
    console.error("[/api/resume/parse] Error:", error)

    const message =
      error instanceof Error ? error.message : "Internal server error"

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
