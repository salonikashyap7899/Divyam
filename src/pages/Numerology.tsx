import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculateNumerology } from "@/lib/numerology";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Loader2, Calculator } from "lucide-react";

const Numerology = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !dob) return toast.error("Name and date of birth are required");
    setLoading(true);
    const result = calculateNumerology({ fullName, dob, mobile });
    if (user) {
      await supabase.from("reports").insert({
        user_id: user.id, type: "numerology",
        title: `Numerology · ${fullName}`,
        input: { fullName, dob, mobile } as any, result: result as any,
      });
    }
    setLoading(false);
    navigate("/numerology/report", { state: { result, input: { fullName, dob, mobile } } });
  };

  return (
    <section className="container py-12 md:py-16">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Tool</p>
        <h1 className="text-4xl md:text-5xl font-serif mt-2">Numerology Report</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl">
          Enter your name as on your birth certificate and your date of birth. We calculate your
          life path, expression, soul urge, personality, birthday, and personal year numbers.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-8 md:p-10 shadow-elegant space-y-5">
          <div>
            <Label htmlFor="name">Full name (as on birth certificate)</Label>
            <Input id="name" value={fullName} onChange={e => setFullName(e.target.value)} className="mt-1.5" placeholder="e.g. Aanya Iyer" required />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dob">Date of birth</Label>
              <Input id="dob" type="date" value={dob} onChange={e => setDob(e.target.value)} className="mt-1.5" required />
            </div>
            <div>
              <Label htmlFor="mobile">Mobile (optional)</Label>
              <Input id="mobile" value={mobile} onChange={e => setMobile(e.target.value)} className="mt-1.5" placeholder="+91 ..." />
            </div>
          </div>
          <Button variant="hero" size="lg" className="w-full" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />} Calculate my numbers
          </Button>
        </form>

        <aside className="rounded-2xl border border-border bg-secondary/40 p-6">
          <Calculator className="h-6 w-6 text-gold" />
          <h3 className="font-serif text-2xl mt-3">What you'll get</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>· Life Path number with meaning</li>
            <li>· Expression & Soul Urge</li>
            <li>· Personality & Birthday numbers</li>
            <li>· Your Personal Year forecast</li>
            <li>· Downloadable PDF report</li>
          </ul>
        </aside>
      </div>
    </section>
  );
};

export default Numerology;
