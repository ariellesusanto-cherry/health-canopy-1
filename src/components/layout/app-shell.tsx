"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { AIAssistant } from "@/components/chat/ai-assistant";
import { useRole } from "@/lib/role-context";

// Decides whether to show the app chrome (sidebar + AI Agent).
// The login page is chromeless; the read-only Executive persona gets
// no interactive AI Agent.
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { role } = useRole();

  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <>
      <Sidebar />
      <main className="ml-64 min-h-screen bg-background">{children}</main>
      {role && !role.readOnly && <AIAssistant />}
    </>
  );
}
