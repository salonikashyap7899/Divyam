import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NumerologyResult, NumerologyInput } from "@/lib/numerology";
import { Download, ArrowLeft } from "lucide-react";

const numbers: { key: keyof NumerologyResult; label: string }[] = [
  { key: "lifePath", label: "Life Path" },
  { key: "expression", label: "Expression" },
  { key: "soulUrge", label: "Soul Urge" },
  { key: "personality", label: "Personality" },
  { key: "birthday", label: "Birthday" },
  { key: "personalYear", label: "Personal Year" },
];

const NumerologyReport = () => {
  const state = useLocation().state as { result?: NumerologyResult; input?: NumerologyInput } | null;

  if (!state?.result) {
    return (
      <section className="container py-24 text-center">
        <h1 className="text-3xl font-serif">No report to show</h1>
        <Button variant="hero" className="mt-6" asChild><Link to="/numerology">Go to numerology</Link></Button>
      </section>
    );
  }

  const { result, input } = state;

  return (
    <section className="container py-12 md:py-16">
      <div className="flex items-center justify-between mb-8 print:hidden">
        <Button variant="ghost" asChild><Link to="/numerology"><ArrowLeft className="h-4 w-4" /> Back</Link></Button>
        <Button variant="gold" onClick={() => window.print()}><Download className="h-4 w-4" /> Download PDF</Button>
      </div>

      <div className="rounded-2xl border border-border bg-card p-8 md:p-12 shadow-elegant">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Numerology Report</p>
        <h1 className="text-4xl md:text-5xl font-serif mt-2">{input?.fullName}</h1>
        {input?.dob && <p className="mt-1 text-muted-foreground">Born {new Date(input.dob).toLocaleDateString(undefined, { year:"numeric", month:"long", day:"numeric" })}</p>}

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {numbers.map(n => (
            <div key={n.key} className="rounded-xl border border-border bg-background p-6">
              <div className="flex items-baseline justify-between">
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{n.label}</span>
                <span className="font-serif text-5xl text-gold">{result[n.key] as number}</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{result.meanings[n.key as string]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NumerologyReport;
