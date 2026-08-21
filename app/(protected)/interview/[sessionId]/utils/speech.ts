"use client"

import { INTERVIEW_VOICE_INDEX } from "../constants"

const VOICE_WAIT_MS = 2500
const VOICE_SETTLE_MS = 150
const CANCEL_SETTLE_MS = 60

let pinnedVoiceURI: string | null = null
let voicesReady: Promise<SpeechSynthesisVoice | null> | null = null
let speakGeneration = 0

function getVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !window.speechSynthesis) return []
  return window.speechSynthesis.getVoices()
}

function pickInterviewVoice(): SpeechSynthesisVoice | null {
  const voices = getVoices()

  if (pinnedVoiceURI) {
    const pinned = voices.find((voice) => voice.voiceURI === pinnedVoiceURI)
    if (pinned) return pinned
  }

  if (voices.length <= INTERVIEW_VOICE_INDEX) return null

  const preferred = voices[INTERVIEW_VOICE_INDEX]
  pinnedVoiceURI = preferred.voiceURI
  return preferred
}

export function waitForInterviewVoice(): Promise<SpeechSynthesisVoice | null> {
  const existing = pickInterviewVoice()
  if (existing) return Promise.resolve(existing)
  if (voicesReady) return voicesReady

  voicesReady = new Promise((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      resolve(null)
      return
    }

    let settled = false
    let debounceTimer: number | null = null
    let timeoutTimer: number | null = null
    let pollTimer: number | null = null

    const cleanup = () => {
      window.speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged)
      if (debounceTimer !== null) window.clearTimeout(debounceTimer)
      if (timeoutTimer !== null) window.clearTimeout(timeoutTimer)
      if (pollTimer !== null) window.clearInterval(pollTimer)
    }

    const finish = (voice: SpeechSynthesisVoice | null) => {
      if (settled) return
      settled = true
      cleanup()
      if (!voice) voicesReady = null
      resolve(voice)
    }

    const tryFinish = () => {
      const voice = pickInterviewVoice()
      if (voice) finish(voice)
    }

    const onVoicesChanged = () => {
      if (debounceTimer !== null) window.clearTimeout(debounceTimer)
      debounceTimer = window.setTimeout(tryFinish, VOICE_SETTLE_MS)
    }

    window.speechSynthesis.addEventListener("voiceschanged", onVoicesChanged)
    window.speechSynthesis.getVoices()
    pollTimer = window.setInterval(tryFinish, 100)

    if (getVoices().length > INTERVIEW_VOICE_INDEX) {
      debounceTimer = window.setTimeout(tryFinish, VOICE_SETTLE_MS)
    }

    timeoutTimer = window.setTimeout(() => {
      finish(pickInterviewVoice())
    }, VOICE_WAIT_MS)
  })

  return voicesReady
}

export function cancelInterviewSpeech() {
  speakGeneration += 1

  if (typeof window === "undefined" || !window.speechSynthesis) return

  window.speechSynthesis.cancel()
}

function delay(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

type SpeakOptions = {
  isCancelled?: () => boolean
  onStart?: () => void
  onEnd?: () => void
}

export async function speakInterviewLine(
  text: string,
  options: SpeakOptions = {},
): Promise<void> {
  if (typeof window === "undefined" || !window.speechSynthesis) return
  if (options.isCancelled?.()) return

  const generation = ++speakGeneration
  const isStale = () =>
    generation !== speakGeneration || Boolean(options.isCancelled?.())

  const voice = await waitForInterviewVoice()
  if (isStale() || !voice) return

  window.speechSynthesis.cancel()
  await delay(CANCEL_SETTLE_MS)
  if (isStale()) return

  await new Promise<void>((resolve) => {
    if (isStale()) {
      resolve()
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.voice = voice
    utterance.lang = voice.lang
    utterance.rate = 1
    utterance.pitch = 1
    utterance.volume = 1

    const done = () => {
      utterance.onstart = null
      utterance.onend = null
      utterance.onerror = null
      if (!isStale()) options.onEnd?.()
      resolve()
    }

    utterance.onstart = () => {
      if (!isStale()) options.onStart?.()
    }
    utterance.onend = done
    utterance.onerror = done

    window.speechSynthesis.speak(utterance)

    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume()
    }
  })
}
