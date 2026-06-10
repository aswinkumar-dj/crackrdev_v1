# STAR Method Interview Narrative — CrackrDev

> Ready-to-use narrative for explaining this project during technical interviews. Structured in the classic STAR format (Situation, Task, Action, Result).

---

## Situation

Technical interviews test two distinct skills: **solving** problems and **explaining** solutions under pressure while someone listens and probes.

Most developers can code in isolation, but many freeze, ramble, or lose clarity when forced to verbalize their thinking in real time. Common practice options fall short:
- LeetCode-style platforms are text-only and too polite.
- Peer mock interviews are inconsistent and often too gentle.
- Expensive coaching or bootcamp mocks are not scalable or always available.

There was a clear gap for an **on-demand, voice-first, resume-aware mock interview platform** that:
- Generates realistic, personalized technical questions.
- Forces candidates to speak their answers out loud.
- Provides structured, honest feedback on both communication and technical depth.
- Tracks progress over time.

## Task

Build **CrackrDev**, a production-ready web application that lets developers practice full technical interviews with the following requirements:

- Support for **8 roles** (Frontend, Backend, Full Stack, Android, Data Engineering, Machine Learning, Data Science, DevOps).
- **4 experience levels** and **3 difficulty tiers** (Easy / Medium / Hard).
- Resume upload for context-aware, personalized question generation.
- A realistic **live spoken interview experience** (AI asks questions verbally; user answers by speaking).
- High-quality transcription of spoken answers.
- Honest, multi-dimensional AI evaluation (Overall, Communication, Technical, Confidence) with specific strengths and areas to improve.
- Persistent session history and dashboard for progress tracking.
- Secure authentication and protected flows.

Non-functional constraints: Fast development velocity, minimal infrastructure, reliable voice handling, and good UX without over-engineering.

## Action

### 1. Overall Architecture & Design Decisions

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript.
- **Route Groups** for strong separation of concerns:
  - `(public)` — Marketing/landing site
  - `(auth)` & `app/auth/` — Authentication flows
  - `(protected)` — Dashboard and interview experience (guarded)
- **Styling & Polish**: Tailwind CSS 4 with a focused design system (brand teal `#17a1a6`). GSAP + ScrollTrigger for smooth landing page reveals.
- **Backend Services**: Supabase (Auth + Postgres + Storage) for speed and zero infra overhead.
- **AI Layer**: Groq SDK exclusively (Llama-3.3-70B for reasoning, Whisper-large-v3 for transcription). Chose Groq for speed, cost, and reliable structured JSON output.
- **Voice Interaction Model**: Deliberately **turn-based** (not continuous WebSocket streaming):
  - AI uses browser `SpeechSynthesis` (instant, free, controllable).
  - User uses `MediaRecorder` + server-side Whisper per answer.
  - This trains the exact "think → speak → release" rhythm the product markets.

**Key data model** (inferred from usage):
- `sessions`: role, difficulty, round_type, resume_url, `question_ids[]`, status, timestamps, user_id.
- `questions`: content, category, role, difficulty.
- `scores`: per-session scores + feedback + strengths + areas_to_improve.

### 2. How Major Features Were Built (Step by Step)

#### A. Authentication & Access Control
- Supabase Auth (email/password + GitHub OAuth).
- `lib/auth-context.tsx`: Client-side provider with session listener.
- `lib/auth.ts`: Server utilities (`getServerUser`, `requireUser`, `getRequestUser` supporting both cookies and Bearer tokens).
- Protection via protected layout (`await requireUser()`) + client-side redirects.
- Dedicated auth pages with clean UX and test credential helpers.

#### B. Public Marketing Site
- Problem-solution narrative in `app/(public)`:
  - Emphasizes the real gap ("You know the code, then your voice disappears").
  - How it Works section highlights the push-to-talk rhythm.
- Uses `data-reveal` + GSAP for progressive disclosure.

#### C. Interview Setup (Personalization)
- Rich form in `/interview`:
  - Drag-and-drop + click-to-upload PDF resume (`ResumeUploadField`).
  - Role select, YOE pills, difficulty pills with visual tints.
- On submit (`useInterviewSetupForm.ts`):
  1. Upload resume to Supabase Storage → get public URL.
  2. Call resume parse API → Groq extracts structured `{skills, yoe, projects}`.
  3. Call session start → router to live room.

#### D. Session Start & Question Generation
- `POST /api/sessions/start` (protected):
  1. Authenticate user.
  2. Insert session record.
  3. Prompt Groq with role + difficulty + parsed resume data. Strict system prompt: "Return ONLY valid JSON array".
  4. Parse response, bulk-insert 5 questions into `questions` table.
  5. Store `question_ids` array back on the session.
- Later retrieval (`/api/questions`) enforces ownership.

#### E. The Live Interview Room (Most Complex Feature)
Location: `app/(protected)/interview/[sessionId]/`

Core logic lives in `useRealtimeInterview.ts` hook:

- On load:
  - Fetch questions for the session.
  - Acquire camera + audio stream (`getUserMedia`).
  - Greet user via TTS, then ask first question.
- Turn-based flow:
  - AI speaks question via `SpeechSynthesisUtterance`.
  - User clicks "Unmute" → starts `MediaRecorder` on the live stream.
  - User clicks "Mute" → stops recorder → sends webm blob to `/api/transcribe`.
  - Whisper returns text → append to `transcripts[]`.
  - AI speaks transition ("Thank you... next question") and advances.
- When out of questions → prompt to finish.
- Camera preview shown live in sidebar (for presence/psychological realism), but **not recorded**.
- Cleanup and guards using refs (`isEndedRef`, stream refs, etc.).

Components:
- `InterviewMainPanel` — Status, current question, primary mic toggle, Finish button.
- `InterviewSidebar` — Live camera + simple 4-step flow explanation.
- `SessionHeader` — Context (role, difficulty, session ID).

#### F. Evaluation & Dashboard
- On "Finish Interview":
  - Stop all media/speech.
  - POST full joined transcript + original questions to `/api/sessions/[id]/complete`.
- Complete route:
  - Ownership check.
  - Groq evaluation prompt (lower temperature for consistency) asking for specific 0-100 scores + feedback.
  - Update session status.
  - Insert row into `scores` table.
- Dashboard (`/dashboard`):
  - Loads user's sessions + joined scores.
  - Prominent "Latest Interview" card with scores, feedback, strengths, and improvements.
  - List of recent sessions.
  - CTA to start new interview.

### 3. Key Technical Choices & Patterns

| Area                    | Choice                                      | Why (Tradeoff) |
|-------------------------|---------------------------------------------|----------------|
| AI                      | Groq (Llama-3.3-70B + Whisper)             | Fast + cheap + excellent at strict JSON output |
| Database & Auth         | Supabase (SSR clients + Storage)           | Zero infra, great DX, unified auth |
| Voice Loop              | Browser TTS + MediaRecorder + server STT   | Simple & reliable. Avoided complex streaming backend |
| Question Generation     | 5 questions generated once at start        | Predictable cost, consistent evaluation baseline |
| State in Interview      | React local state + refs (no WebSockets)   | Low latency for turn-based experience |
| Personalization         | Resume → Storage → Groq extraction         | Makes interviews feel tailored without RAG complexity |
| API Protection          | Admin client in routes + user checks       | Trusted server routes can write freely |
| Form Handling           | Custom hook + validation + progressive state | Clean separation, good UX feedback |
| Animations              | GSAP (landing only)                        | Smooth marketing experience without runtime cost in app |

**Architectural notes / evolution artifacts**:
- Some helper files in `lib/` (`startSession.ts`, `finishSession.ts`, `parseResume.ts`) were written to call an external `NEXT_PUBLIC_BACKEND_URL`. The current implementation calls the local Next.js API routes directly from the UI and hooks.
- A `proxy.ts` file exists with auth redirect logic but is not wired as Next.js middleware. Protection is handled via layouts + client context.
- No actual code editor shipped in the live room (some marketing copy references one).

### 4. Problems This Project Solves & How

| Problem                              | How CrackrDev Addresses It |
|--------------------------------------|----------------------------|
| "I can solve it but can't explain it" | Forces spoken answers with an AI that doesn't interrupt or be overly polite |
| Lack of realistic, on-demand practice | Always-available voice interview with real microphone interaction |
| Generic questions that don't feel relevant | Resume parsing + role + difficulty + YOE injected into generation prompt |
| No structured feedback on soft skills | Multi-axis scoring (communication + technical + confidence) + specific strengths/improvements |
| Hard to track improvement            | Full session history + scores dashboard with latest deep-dive card |
| Expensive or inconsistent human mocks | Affordable, consistent, repeatable AI interviews |

## Result

CrackrDev is a complete, end-to-end vertical slice of an AI-powered interview practice platform that directly targets the hardest part of interviewing: **speaking technical answers under pressure**.

**What was delivered**:
- Personalized, resume-aware question generation using Groq.
- Realistic turn-based spoken interview loop using browser media APIs + Whisper.
- Honest, structured evaluation with actionable feedback.
- Clean, protected user flows with history tracking.
- Polished marketing site that clearly communicates the value proposition.

**What the project demonstrates** (strong talking points):
- Deep product thinking: Identified a specific human skill gap (verbal reasoning under observation) and built directly for it.
- Pragmatic architecture: Chose reliable, boring primitives (Supabase, per-turn audio, local state) that actually serve the learning goal instead of chasing flashy real-time tech.
- Full ownership across the stack: Auth, file storage, AI orchestration, browser media APIs, database modeling, and dashboard visualization.
- Ability to ship a focused, high-quality experience with clear scope boundaries.

The platform is ready for real usage and can be extended (dynamic follow-ups, code editor integration, video analysis, more roles, etc.).

---

**Files of interest for deeper discussion**:
- `app/(protected)/interview/[sessionId]/hooks/useRealtimeInterview.ts`
- `app/api/sessions/start/route.ts` & `complete/route.ts`
- `app/api/resume/parse/route.ts` & `app/api/transcribe/route.ts`
- `lib/auth.ts` + `lib/auth-context.tsx`
- `app/(protected)/dashboard/page.tsx`

Use the sections above selectively depending on the interview focus (architecture, AI integration, frontend state management, product thinking, etc.).
