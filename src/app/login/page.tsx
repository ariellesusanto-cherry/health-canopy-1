"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Leaf, Lock, Mail, ChevronDown, ArrowRight } from "lucide-react";
import { useRole } from "@/lib/role-context";
import { ROLE_LIST, type RoleId } from "@/lib/roles";

export default function LoginPage() {
  const router = useRouter();
  const { setRole } = useRole();
  const [email, setEmail] = useState("demo@cchealth.org");
  const [password, setPassword] = useState("demo-access");
  const [roleId, setRoleId] = useState<RoleId>(ROLE_LIST[0].id);
  const [submitting, setSubmitting] = useState(false);

  const selected = ROLE_LIST.find((r) => r.id === roleId)!;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    // Mock auth — any input is accepted; the chosen role is the identity.
    setRole(roleId);
    router.replace(selected.landingRoute);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      {/* soft brand backdrop */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-24 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-card rounded-2xl border border-border shadow-xl p-8 card-enter">
          {/* Brand */}
          <div className="flex flex-col items-center text-center mb-7">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-3">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground font-display">
              Health Canopy
            </h1>
            <p className="text-sm text-muted mt-1">Sign in to your workspace</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-border bg-white text-sm text-foreground placeholder:text-muted/60 focus:border-primary focus:outline-none"
                  placeholder="you@cchealth.org"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-border bg-white text-sm text-foreground focus:border-primary focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Role selector */}
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Sign in as</label>
              <div className="relative">
                <select
                  value={roleId}
                  onChange={(e) => setRoleId(e.target.value as RoleId)}
                  className="w-full appearance-none pl-3 pr-9 py-2.5 rounded-lg border border-border bg-white text-sm text-foreground focus:border-primary focus:outline-none cursor-pointer"
                >
                  {ROLE_LIST.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              </div>
              <p className="text-[11px] text-muted mt-1.5 leading-snug">{selected.description}</p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-70"
            >
              Sign in
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-[11px] text-muted mt-6">
            Contra Costa Health · demo environment · synthetic data only
          </p>
        </div>
      </div>
    </div>
  );
}
