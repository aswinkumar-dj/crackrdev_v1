"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { getSupabase } from "@/lib/supabase/client"
import type { AiStatus, InterviewSessionConfig } from "../types"
import {
  cancelInterviewSpeech,
  speakInterviewLine,
  waitForInterviewVoice,
} from "../utils/speech"

type UseRealtimeInterviewOptions = {
  sessionId: string
  session: InterviewSessionConfig
  enabled: boolean
}

export function useRealtimeInterview({
  sessionId,
  session,
  enabled,
}: UseRealtimeInterviewOptions) {
  const [isMicOn, setIsMicOn] = useState(false)
  const [aiStatus, setAiStatus] = useState<AiStatus>("Processing...")
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [questions, setQuestions] = useState<{ id: string; content: string; category: string }[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [transcripts, setTranscripts] = useState<string[]>([])

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const isEndedRef = useRef(false)
  const sessionRef = useRef(session)
  const currentQuestion = questions[currentQuestionIndex] || null

  sessionRef.current = session

  const speak = useCallback(async (text: string) => {
    if (isEndedRef.current) return

    await speakInterviewLine(text, {
      isCancelled: () => isEndedRef.current,
      onStart: () => setAiStatus("Speaking..."),
      onEnd: () => {
        if (!isEndedRef.current) setAiStatus("Listening...")
      },
    })
  }, [])

  const askQuestion = useCallback(async (index: number, qs: typeof questions) => {
    if (isEndedRef.current) return

    if (index >= qs.length) {
      await speak("That concludes our interview. Thank you for your time. Please click finish interview.")
      if (!isEndedRef.current) setAiStatus("Processing...")
      return
    }

    setCurrentQuestionIndex(index)
    await speak(`Question ${index + 1}: ${qs[index].content}`)
  }, [speak])

  useEffect(() => {
    void waitForInterviewVoice()
  }, [])

  useEffect(() => {
    if (!enabled) return

    let cancelled = false

    const loadQuestions = async () => {
      try {
        const supabase = getSupabase()
        const { data: { session: authSession } } = await supabase.auth.getSession()
        if (!authSession || cancelled || isEndedRef.current) return

        const res = await fetch(`/api/questions?sessionId=${sessionId}`, {
          headers: { Authorization: `Bearer ${authSession.access_token}` },
        })
        const data = await res.json()
        if (!data.questions || cancelled || isEndedRef.current) return

        setQuestions(data.questions)
        setIsConnected(true)

        const { name, role } = sessionRef.current
        await speak(
          `Hi ${name}! Welcome to your ${role} mock interview. I'll ask you ${data.questions.length} questions. Take your time to answer each one. Let's begin.`,
        )
        if (cancelled || isEndedRef.current) return

        await askQuestion(0, data.questions)
      } catch {
        if (!cancelled) setError("Failed to load interview questions.")
      }
    }

    void loadQuestions()

    return () => {
      cancelled = true
      cancelInterviewSpeech()
    }
  }, [askQuestion, enabled, sessionId, speak])

  // setup camera
  useEffect(() => {
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
          audio: true,
        })
        streamRef.current = stream
        if (videoRef.current) videoRef.current.srcObject = stream
      } catch {
        setError("Camera or microphone access blocked. Please allow permissions and refresh.")
      }
    }
    void setupCamera()
    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop())
    }
  }, [])

  const toggleMic = useCallback(async () => {
    if (isMicOn) {
      // stop recording
      mediaRecorderRef.current?.stop()
      setIsMicOn(false)
      setAiStatus("Processing...")
    } else {
      // start recording
      if (!streamRef.current) return
      cancelInterviewSpeech()
      audioChunksRef.current = []

      const mediaRecorder = new MediaRecorder(streamRef.current)
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = async () => {
        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
          const formData = new FormData()
          formData.append("audio", audioBlob, "answer.webm")

          const res = await fetch("/api/transcribe", { method: "POST", body: formData })
          const data = await res.json()
          const transcript = data.transcript || ""

          // save transcript
          setTranscripts(prev => [...prev, transcript])

          // get AI feedback and next question
          const nextIndex = currentQuestionIndex + 1
          if (nextIndex < questions.length) {
            await speak(`Thank you for your answer. Moving to question ${nextIndex + 1}.`)
            if (isEndedRef.current) return
            await askQuestion(nextIndex, questions)
          } else {
            await speak("Great answer! That was the last question. Please click finish interview when you're ready.")
            if (!isEndedRef.current) setAiStatus("Processing...")
          }
        } catch {
          setError("Failed to process your answer. Please try again.")
          setAiStatus("Listening...")
        }
      }

      mediaRecorder.start()
      setIsMicOn(true)
      setAiStatus("Listening...")
    }
  }, [isMicOn, currentQuestionIndex, questions, speak, askQuestion])

  const endSession = useCallback(() => {
    if (isEndedRef.current) return
    isEndedRef.current = true
    cancelInterviewSpeech()
    mediaRecorderRef.current?.stop()
    streamRef.current?.getTracks().forEach(t => t.stop())
    setIsConnected(false)
    setIsMicOn(false)
    setAiStatus("Processing...")
  }, [])

  return {
  aiStatus,
  error,
  isConnected,
  isMicOn,
  setError,
  toggleMic,
  endSession,
  videoRef,
  transcripts,
  questions,
  currentQuestionIndex,
  currentQuestion,
}
}