"use client";

import { useState } from "react";
import FormIntro from "./components/FormIntro";
import InstructionsModal from "./components/InstructionsModal";
import PageHeader from "./components/PageHeader";
import PillToggleGroup from "./components/PillToggleGroup";
import ResumeUploadField from "./components/ResumeUploadField";
import RoleSelect from "./components/RoleSelect";
import SubmitButton from "./components/SubmitButton";
import { difficultyOptions, yoeOptions } from "./constants";
import { useInterviewSetupForm } from "./hooks/useInterviewSetupForm";
import type { Difficulty } from "./types";
import { getSupabase } from "@/lib/supabase/client";

export default function InterviewPage() {
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const interviewForm = useInterviewSetupForm();



  const getDifficultyInactiveClass = (option: Difficulty) => {
    const difficultyOption = difficultyOptions.find(
      ({ label }) => label === option,
    );

    return `border-[#e4eceb] ${difficultyOption?.tintClass ?? ""} hover:border-[#17a1a6]`;
  };

 const getQuestions = async () => {
  try {
    const supabase = getSupabase();

    // 🔑 Get current logged-in session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // ❗ Check if user is logged in
    if (!session) {
      console.log("User not logged in");
      return;
    }

    const token = session.access_token;

    // 🌐 Call your backend with token
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questions`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // ❗ Handle error safely
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error:", response.status, errorText);
      return;
    }

    const questions = await response.json();
    console.log(questions);
  } catch (err) {
    console.error("Fetch failed:", err);
  }
};

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8fbfb] px-4 py-16 text-[#101616] sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 border-b border-[#dcebea] bg-white" />

      <PageHeader onOpenInstructions={() => setIsInstructionsOpen(true)} />

      <form
        onSubmit={interviewForm.handleSubmit}
        className="relative z-10 mx-auto w-full max-w-2xl rounded-lg border border-[#dcebea] bg-white px-6 py-8 shadow-xl shadow-[#dcebea]/60 sm:px-8 sm:py-10"
      >
        <FormIntro />

        <div className="mt-6 text-left">
          <ResumeUploadField
            file={interviewForm.resumeFile}
            fileError={interviewForm.resumeError}
            requiredError={interviewForm.formErrors.resume}
            onFileSelect={interviewForm.handleResumeSelect}
            onRemove={interviewForm.removeResume}
          />

          <RoleSelect
            value={interviewForm.role}
            error={interviewForm.formErrors.role}
            onChange={interviewForm.handleRoleChange}
          />

          <PillToggleGroup
            label="YOE"
            options={yoeOptions}
            value={interviewForm.yoe}
            error={interviewForm.formErrors.yoe}
            columnsClass="grid-cols-2 sm:grid-cols-4"
            onChange={interviewForm.handleYoeChange}
          />

          <PillToggleGroup
            label="Difficulty"
            options={difficultyOptions.map(({ label }) => label)}
            value={interviewForm.difficulty}
            error={interviewForm.formErrors.difficulty}
            columnsClass="grid-cols-3"
            getInactiveClass={getDifficultyInactiveClass}
            onChange={interviewForm.handleDifficultyChange}
          />

          <SubmitButton
            disabled={!interviewForm.isFormComplete || interviewForm.isSubmitting}
            error={interviewForm.submitError}
            isSubmitting={interviewForm.isSubmitting}
          />
        </div>
      </form>

      <InstructionsModal
        isOpen={isInstructionsOpen}
        onClose={() => setIsInstructionsOpen(false)}
      />

      <button className="bg-blue-500" onClick={()=>getQuestions()}>Testing</button>
    </div>
  );
}
