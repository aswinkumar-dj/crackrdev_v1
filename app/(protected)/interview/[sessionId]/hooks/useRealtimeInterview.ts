"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { getSupabase } from "@/lib/supabase/client"
import type { AiStatus, InterviewSessionConfig } from "../types"

type UseRealtimeInterviewOptions = {
  sessionId: string
  session: InterviewSessionConfig
}

export function useRealtimeInterview({
  sessionId,
  session,
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
  const currentQuestion = questions[currentQuestionIndex] || null

  const speak = useCallback((text: string) => {
    if (isEndedRef.current) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 1.0
    utterance.pitch = 1.0
    utterance.volume = 1.0
    setAiStatus("Speaking...")
    utterance.onend = () => setAiStatus("Listening...")
    window.speechSynthesis.speak(utterance)
  }, [])

  const askQuestion = useCallback((index: number, qs: typeof questions) => {
    if (index >= qs.length) {
      speak("That concludes our interview. Thank you for your time. Please click finish interview.")
      setAiStatus("Processing...")
      return
    }
    const q = qs[index]
    speak(`Question ${index + 1}: ${q.content}`)
    setCurrentQuestionIndex(index)
  }, [speak])

  // load questions on mount
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const supabase = getSupabase()
        const { data: { session: authSession } } = await supabase.auth.getSession()
        if (!authSession) return

        const res = await fetch(`/api/questions?sessionId=${sessionId}`, {
          headers: { Authorization: `Bearer ${authSession.access_token}` },
        })
        const data = await res.json()
        if (data.questions) {
          setQuestions(data.questions)
          setIsConnected(true)
          // greet and ask first question
          setTimeout(() => {
            speak(`Hi ${session.name}! Welcome to your ${session.role} mock interview. I'll ask you ${data.questions.length} questions. Take your time to answer each one. Let's begin.`)
            setTimeout(() => askQuestion(0, data.questions), 4000)
          }, 500)
        }
      } catch (err) {
        setError("Failed to load interview questions.")
      }
    }

    void loadQuestions()
  }, [sessionId, session.name, session.role, speak, askQuestion])

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
      window.speechSynthesis.cancel()
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
            speak(`Thank you for your answer. Moving to question ${nextIndex + 1}.`)
            setTimeout(() => askQuestion(nextIndex, questions), 2000)
          } else {
            speak("Great answer! That was the last question. Please click finish interview when you're ready.")
            setAiStatus("Processing...")
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
  window.speechSynthesis.cancel()
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