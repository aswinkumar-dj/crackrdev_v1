import { redirectIfAuthenticated } from "@/lib/auth";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await redirectIfAuthenticated()

  return children
}
