import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Compass, Loader2 } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: { full_name: fullName },
        },
      });
      setLoading(false);
      if (error) {
        console.log("Sign-up error:", error.message);
        return;
      }
      toast.success("Account created — you can sign in now");
      setMode("signin");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) {
        console.error("Sign-in error details:", error);
        toast.error(error.message || "Failed to sign in");
        return;
      }
      toast.success("Welcome back");
      navigate("/");
    }
  };

  return (
    <section className="container py-16 md:py-24">
      <div className="max-w-md mx-auto rounded-2xl border border-border bg-card p-8 md:p-10 shadow-elegant">
        <div className="flex justify-center">
          <div className="grid h-14 w-14 place-items-center rounded-full gradient-hero text-gold">
            <Compass className="h-7 w-7" />
          </div>
        </div>
        <h1 className="mt-6 text-3xl font-serif text-center">
          {mode === "signin" ? "Sign in" : "Create account"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground text-center">
          {mode === "signin" ? "Welcome back to Divyam" : "Begin your journey"}
        </p>

        <form onSubmit={submit} className="mt-8 space-y-4">
          {mode === "signup" && (
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your name" className="mt-1.5" />
            </div>
          )}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="mt-1.5" />
          </div>
          <Button variant="hero" size="lg" className="w-full" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "signin" ? "Sign in" : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-xs text-center text-muted-foreground">
          {mode === "signin" ? "New to Divyam? " : "Already have an account? "}
          <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="text-foreground underline">
            {mode === "signin" ? "Create one" : "Sign in"}
          </button>
        </p>
        <p className="mt-3 text-xs text-center">
          <Link to="/" className="text-muted-foreground hover:text-foreground">← Back to home</Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
