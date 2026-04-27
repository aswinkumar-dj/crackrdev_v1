import AppHeader from "../components/AppHeader";
import { requireUser } from "@/lib/auth";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireUser();

  return (
    <>
      <AppHeader />
      {children}
    </>
  );
}
