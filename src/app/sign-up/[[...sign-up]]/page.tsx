import { SignUp } from "@clerk/nextjs";
import { Leaf } from "lucide-react";

export default function Page() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background px-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-24 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="relative flex flex-col items-center">
        {/* Brand */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-3">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground font-display">Health Canopy</h1>
          <p className="text-sm text-muted mt-1">Create your workspace account</p>
        </div>

        <SignUp
          appearance={{
            variables: { colorPrimary: "#b5654a", borderRadius: "0.5rem" },
            elements: {
              card: "shadow-xl border border-border",
              headerTitle: "font-display",
              formButtonPrimary: "bg-primary hover:bg-primary-dark text-sm normal-case",
            },
          }}
        />

        <p className="text-center text-[11px] text-muted mt-6">
          Contra Costa Health · demo environment · synthetic data only
        </p>
      </div>
    </div>
  );
}
