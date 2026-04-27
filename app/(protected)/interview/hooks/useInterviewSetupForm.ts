import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { parseResume } from "@/lib/parseResume";
import { startSession } from "@/lib/startSession";
import { getSupabase } from "@/lib/supabase/client";
import { uploadResume } from "@/lib/uploadResume";
import type { Difficulty, FormErrors, FormField, Role, Yoe } from "../types";
import { validateInterviewForm } from "../validation";

export function useInterviewSetupForm() {
  const router = useRouter();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeError, setResumeError] = useState("");
  const [role, setRole] = useState<Role | "">("");
  const [yoe, setYoe] = useState<Yoe | "">("");
  const [difficulty, setDifficulty] = useState<Difficulty | "">("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const isFormComplete = Boolean(resumeFile && role && yoe && difficulty);

  const clearFormError = (field: FormField) => {
    setFormErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }));
  };

  const resetSubmittingState = () => {
    setIsSubmitting(false);
  };

  const clearSubmitError = () => {
    setSubmitError("");
  };

  const handleResumeSelect = (file?: File) => {
    if (!file) {
      return;
    }

    resetSubmittingState();
    clearSubmitError();

    if (file.type !== "application/pdf") {
      setResumeFile(null);
      setResumeError("Please upload a PDF file only.");
      return;
    }

    setResumeFile(file);
    setResumeError("");
    clearFormError("resume");
  };

  const removeResume = () => {
    setResumeFile(null);
    setResumeError("");
    resetSubmittingState();
    clearSubmitError();
  };

  const handleRoleChange = (nextRole: Role | "") => {
    setRole(nextRole);
    resetSubmittingState();
    clearSubmitError();
    clearFormError("role");
  };

  const handleYoeChange = (nextYoe: Yoe) => {
    setYoe(nextYoe);
    resetSubmittingState();
    clearSubmitError();
    clearFormError("yoe");
  };

  const handleDifficultyChange = (nextDifficulty: Difficulty) => {
    setDifficulty(nextDifficulty);
    resetSubmittingState();
    clearSubmitError();
    clearFormError("difficulty");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearSubmitError();

    const nextErrors = validateInterviewForm({
      resumeFile,
      role,
      yoe,
      difficulty,
    });

    setFormErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      resetSubmittingState();
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = getSupabase();
      const resumeUrl = await uploadResume(resumeFile!);
      const parsedResume = await parseResume(resumeUrl);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Please sign in before starting an interview.");
      }

      const resumeData = {
        skills: parsedResume.skills,
        yoe: parsedResume.yoe,
        projects: parsedResume.projects,
      };

      const { sessionId, questionIds } = await startSession({
        userId: user.id,
        role,
        difficulty,
        roundtype: "technical",
        resumeUrl,
        resumeData,
      });

      sessionStorage.setItem(
        "interviewConfig",
        JSON.stringify({
          sessionId,
          role,
          difficulty,
          resumeUrl,
          resumeData,
          questionIds,
        }),
      );

      router.push(`/interview/${sessionId}`);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to start interview. Please try again.",
      );
      setIsSubmitting(false);
    }
  };

  return {
    difficulty,
    formErrors,
    handleDifficultyChange,
    handleResumeSelect,
    handleRoleChange,
    handleSubmit,
    handleYoeChange,
    isFormComplete,
    isSubmitting,
    removeResume,
    resumeError,
    resumeFile,
    role,
    submitError,
    yoe,
  };
}
