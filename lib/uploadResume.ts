import { getSupabase } from "./supabase/client";

export async function uploadResume(file: File) {
  if (file.type !== "application/pdf") {
    throw new Error("Only PDF resumes can be uploaded.");
  }

  const supabase = getSupabase();
  const filePath = `resumes/${Date.now()}.pdf`;

  const { error } = await supabase.storage
    .from("resumes")
    .upload(filePath, file, {
      contentType: "application/pdf",
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from("resumes").getPublicUrl(filePath);

  return data.publicUrl;
}
