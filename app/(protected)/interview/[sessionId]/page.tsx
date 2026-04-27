"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getSupabase } from "@/lib/supabase/client";
import { InterviewMainPanel } from "./components/InterviewMainPanel";
import { InterviewSidebar } from "./components/InterviewSidebar";
import { SessionHeader } from "./components/SessionHeader";
import { useRealtimeInterview } from "./hooks/useRealtimeInterview";
import type { InterviewSessionConfig } from "./types";

export default function InterviewRoomPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [isFinishing, setIsFinishing] = useState(false);
  const [showRedirectNotice, setShowRedirectNotice] = useState(false);
  const [sessionConfig, setSessionConfig] = useState<InterviewSessionConfig>({
    name: user?.email?.split("@")[0] || "Candidate",
    role: "Developer",
    round: "technical",
    difficulty: "Medium",
  });

  useEffect(() => {
    const loadSession = async () => {
      if (!user) {
        return;
      }

      try {
        const supabase = getSupabase();
        const { data } = await supabase
          .from("sessions")
          .select("role, difficulty, round_type")
          .eq("id", sessionId)
          .eq("user_id", user.id)
          .single();

        if (data) {
          setSessionConfig({
            name: user?.email?.split("@")[0] || "Candidate",
            role: data.role,
            round: data.round_type || "technical",
            difficulty: data.difficulty,
          });
        } else {
          router.replace("/dashboard");
        }
      } catch (err) {
        console.error("Failed to load session config", err);
        router.replace("/dashboard");
      }
    };

    void loadSession();
  }, [router, sessionId, user]);

  const {
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
    currentQuestion,
  } = useRealtimeInterview({
    sessionId,
    session: sessionConfig,
  });

  const handleFinishInterview = async () => {
    if (isFinishing) return;
    console.log("finishing interview...", sessionId);
    setIsFinishing(true);
    setError(null);
    setShowRedirectNotice(true);
    endSession();

    try {
      const supabase = getSupabase();
      const { data: { session: authSession } } = await supabase.auth.getSession();
      console.log("auth session:", authSession?.access_token ? "found" : "missing");
      console.log("calling complete route for:", sessionId);

      const res = await fetch(`/api/sessions/${sessionId}/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authSession?.access_token}`,
        },
        body: JSON.stringify({
          role: sessionConfig.role,
          difficulty: sessionConfig.difficulty,
          transcript: transcripts.join(" "),
          questions: questions.map((q) => q.content),
        }),
      });
      console.log("complete route response:", res.status);
      const data = await res.json();
      console.log("complete route data:", data);
    } catch (saveError) {
      console.error("save error:", saveError);
      setError("Interview finished but results could not be saved.");
    } finally {
      setIsFinishing(false);
      router.push("/dashboard");
    }
  };

  return (
    <section className="relative h-[calc(100dvh-4rem)] overflow-hidden bg-[#f4fbfb] text-[#15314d]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(23,161,166,0.18),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(26,39,68,0.08),_transparent_30%)]" />

      <div className="relative mx-auto flex h-full max-w-7xl flex-col overflow-hidden px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
        <SessionHeader sessionId={sessionId} session={sessionConfig} />

        <div className="mx-auto grid min-h-0 w-full max-w-6xl flex-1 gap-4 py-4 lg:grid-cols-[minmax(0,1fr)_260px]">
          <InterviewMainPanel
            aiStatus={aiStatus}
            error={error}
            isConnected={isConnected}
            currentQuestion={currentQuestion}
            isFinishing={isFinishing}
            isMicOn={isMicOn}
            onFinishInterview={() => void handleFinishInterview()}
            onToggleMic={() => void toggleMic()}
          />

          <InterviewSidebar
            session={sessionConfig}
            showRedirectNotice={showRedirectNotice}
            videoRef={videoRef}
          />
        </div>
      </div>
    </section>
  );
}
