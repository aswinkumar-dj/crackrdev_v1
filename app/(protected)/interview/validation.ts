import type { Difficulty, FormErrors, Role, Yoe } from "./types";

export function validateInterviewForm({
  resumeFile,
  role,
  yoe,
  difficulty,
}: {
  resumeFile: File | null;
  role: Role | "";
  yoe: Yoe | "";
  difficulty: Difficulty | "";
}) {
  const errors: FormErrors = {};

  if (!resumeFile) {
    errors.resume = "Please upload your resume.";
  }

  if (!role) {
    errors.role = "Please select a role.";
  }

  if (!yoe) {
    errors.yoe = "Please select your years of experience.";
  }

  if (!difficulty) {
    errors.difficulty = "Please select a difficulty.";
  }

  return errors;
}
