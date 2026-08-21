import Groq from "groq-sdk"

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

// Groq retired llama-3.1-8b-instant and llama-3.3-70b-versatile on 2026-08-16.
export const GROQ_MODELS = {
  fast: "openai/gpt-oss-20b",
  quality: "openai/gpt-oss-120b",
  transcribe: "whisper-large-v3",
} as const

export function parseModelJson<T>(raw: string | null | undefined): T {
  const text = (raw ?? "").trim()

  if (!text) {
    throw new Error("Model returned an empty response.")
  }

  try {
    return JSON.parse(text) as T
  } catch {
    const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)

    if (fenced?.[1]) {
      return JSON.parse(fenced[1].trim()) as T
    }

    const objectStart = text.indexOf("{")
    const arrayStart = text.indexOf("[")
    const start = [objectStart, arrayStart]
      .filter((index) => index >= 0)
      .sort((a, b) => a - b)[0]

    if (start === undefined) {
      throw new Error("Model did not return valid JSON.")
    }

    const closer = text[start] === "[" ? "]" : "}"
    const end = text.lastIndexOf(closer)

    if (end <= start) {
      throw new Error("Model did not return valid JSON.")
    }

    return JSON.parse(text.slice(start, end + 1)) as T
  }
}
