import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { createServerSupabase } from "./supabase/server";
import { adminSupabase } from "./supabase/admin";

export const getServerUser = cache(async () => {
  const supabase = await createServerSupabase();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  return user;
});

export async function requireUser() {
  const user = await getServerUser();

  if (!user) {
    redirect("/auth/login");
  }

  return user;
}

export async function redirectIfAuthenticated() {
  const user = await getServerUser();

  if (user) {
    redirect("/dashboard");
  }
}

export async function getRequestUser(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;

  if (token) {
    const {
      data: { user },
      error,
    } = await adminSupabase.auth.getUser(token);

    if (!error && user) {
      return user;
    }
  }

  const supabase = await createServerSupabase();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  return user;
}
