'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { getSupabase } from '@/lib/supabase/client'

type ScoreData = {
  overall_score: number
  communication_score: number
  technical_score: number
  confidence_score: number
  feedback: string
  strengths: string[]
  areas_to_improve: string[]
}

type SessionData = {
  id: string
  role: string
  difficulty: string
  round_type: string
  started_at: string
  completed_at: string
  status: string
  scores: ScoreData | null
}

type SessionRow = Omit<SessionData, 'scores'> & {
  scores: ScoreData | ScoreData[] | null
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading, signOut } = useAuth()
  const [sessions, setSessions] = useState<SessionData[]>([])
  const [loadingSessions, setLoadingSessions] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (!user) return

    const loadSessions = async () => {
      try {
        const supabase = getSupabase()

        const { data, error } = await supabase
          .from('sessions')
          .select(`
            id,
            role,
            difficulty,
            round_type,
            started_at,
            completed_at,
            status,
            scores (
              overall_score,
              communication_score,
              technical_score,
              confidence_score,
              feedback,
              strengths,
              areas_to_improve
            )
          `)
          .eq('user_id', user.id)
          .order('started_at', { ascending: false })
          .limit(10)

        if (error) throw error

        const formatted = ((data || []) as SessionRow[]).map((s) => ({
          ...s,
          scores: Array.isArray(s.scores) ? s.scores[0] || null : s.scores,
        }))

        setSessions(formatted)
      } catch (err) {
        console.error('Failed to load sessions:', err)
      } finally {
        setLoadingSessions(false)
      }
    }

    void loadSessions()
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4fbfb]">
        <p className="text-[#17a1a6] font-semibold">Loading...</p>
      </div>
    )
  }

  if (!user) return null

  const latest = sessions[0] || null

  return (
    <div className="min-h-screen bg-[#f4fbfb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#101616]">Dashboard</h1>
            <p className="text-[#4b5d5b] mt-2">
              Welcome back, <span className="text-[#17a1a6] font-semibold">{user.email}</span>
            </p>
          </div>
          <button
            onClick={signOut}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
          >
            Sign out
          </button>
        </div>

        {/* latest session */}
        {loadingSessions ? (
          <div className="mb-8 rounded-2xl border border-[#dceaea] bg-white p-6">
            <p className="text-[#4b5d5b]">Loading your latest session...</p>
          </div>
        ) : latest ? (
          <div className="mb-8 rounded-2xl border border-[#27425f] bg-[#111c2e] p-6 shadow-[0_22px_60px_rgba(0,0,0,0.22)]">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#17a1a6]">
                  Latest Interview
                </p>
                <h2 className="mt-2 text-2xl font-bold text-white">
                  {latest.role} • {latest.round_type || 'Technical'}
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  {latest.difficulty} • {new Date(latest.started_at).toLocaleDateString()}
                </p>
                {latest.scores?.feedback && (
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                    {latest.scores.feedback}
                  </p>
                )}
              </div>
              <div className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                latest.status === 'completed'
                  ? 'bg-emerald-500/10 text-emerald-300'
                  : 'bg-amber-500/10 text-amber-300'
              }`}>
                {latest.status}
              </div>
            </div>

            {latest.scores ? (
              <>
                <div className="mt-5 grid gap-4 md:grid-cols-4">
                  <div className="rounded-xl border border-[#223953] bg-[#15253a] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Overall</p>
                    <p className="mt-2 text-2xl font-bold text-white">{latest.scores.overall_score}/100</p>
                  </div>
                  <div className="rounded-xl border border-[#223953] bg-[#15253a] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Communication</p>
                    <p className="mt-2 text-2xl font-bold text-white">{latest.scores.communication_score}/100</p>
                  </div>
                  <div className="rounded-xl border border-[#223953] bg-[#15253a] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Technical</p>
                    <p className="mt-2 text-2xl font-bold text-white">{latest.scores.technical_score}/100</p>
                  </div>
                  <div className="rounded-xl border border-[#223953] bg-[#15253a] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Confidence</p>
                    <p className="mt-2 text-2xl font-bold text-white">{latest.scores.confidence_score}/100</p>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-[#223953] bg-[#15253a] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#17a1a6]">Strengths</p>
                    <div className="mt-3 space-y-2 text-sm text-slate-300">
                      {latest.scores.strengths?.map((item) => (
                        <p key={item}>• {item}</p>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl border border-[#223953] bg-[#15253a] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#17a1a6]">Areas to Improve</p>
                    <div className="mt-3 space-y-2 text-sm text-slate-300">
                      {latest.scores.areas_to_improve?.map((item) => (
                        <p key={item}>• {item}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <p className="mt-4 text-sm text-slate-400">Scores not available for this session.</p>
            )}
          </div>
        ) : (
          <div className="mb-8 rounded-2xl border border-[#dceaea] bg-white p-6 text-center">
            <p className="text-[#4b5d5b]">No interviews yet. Start your first one!</p>
          </div>
        )}

        {/* recent sessions list */}
        <div className="mt-8 rounded-2xl border border-[#dceaea] bg-white p-6">
          <h2 className="text-xl font-bold text-[#101616] mb-4">Recent Sessions</h2>
          {sessions.length === 0 ? (
            <p className="text-[#4b5d5b] text-center py-6">No sessions yet.</p>
          ) : (
            <div className="space-y-3">
              {sessions.map((s) => (
                <div key={s.id} className="flex items-center justify-between rounded-xl border border-[#dceaea] bg-[#f8fbfb] px-4 py-3">
                  <div>
                    <p className="font-semibold text-[#101616]">{s.role}</p>
                    <p className="text-xs text-[#4b5d5b]">{s.difficulty} • {new Date(s.started_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {s.scores && (
                      <span className="text-sm font-bold text-[#17a1a6]">{s.scores.overall_score}/100</span>
                    )}
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      s.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {s.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* start new interview */}
        <div className="mt-6 text-center">
          <Link
            href="/interview"
            className="inline-block rounded-lg bg-[#17a1a6] px-6 py-3 text-white font-semibold hover:bg-[#138b90] transition-colors"
          >
            Start New Interview
          </Link>
        </div>

      </div>
    </div>
  )
}
