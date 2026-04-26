import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { VastuResult, PlacedRoom } from "@/lib/vastu";
import { Download, ArrowLeft, CheckCircle2, AlertTriangle, Circle } from "lucide-react";

const VastuReport = () => {
  const location = useLocation();
  const state = location.state as { result?: VastuResult; rooms?: PlacedRoom[] } | null;

  if (!state?.result) {
    return (
      <section className="container py-24 text-center">
        <h1 className="text-3xl font-serif">No report to show</h1>
        <p className="mt-2 text-muted-foreground">Run an analysis first.</p>
        <Button variant="hero" className="mt-6" asChild><Link to="/vastu">Go to analyser</Link></Button>
      </section>
    );
  }

  const { result } = state;

  const downloadPdf = () => window.print();

  return (
    <section className="container py-12 md:py-16">
      <div className="flex items-center justify-between mb-8 print:hidden">
        <Button variant="ghost" asChild><Link to="/vastu"><ArrowLeft className="h-4 w-4" /> Back</Link></Button>
        <Button variant="gold" onClick={downloadPdf}><Download className="h-4 w-4" /> Download PDF</Button>
      </div>

      <div className="rounded-2xl border border-border bg-card p-8 md:p-12 shadow-elegant">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Vastu Report</p>
        <h1 className="text-4xl md:text-5xl font-serif mt-2">Your Vastu Reading</h1>

        <div className="mt-8 grid md:grid-cols-[200px_1fr] gap-8 items-center">
          <div className="relative aspect-square">
            <div className="absolute inset-0 rounded-full gradient-hero" />
            <div className="absolute inset-0 grid place-items-center text-gold">
              <div className="text-center">
                <div className="font-serif text-5xl">{result.score}</div>
                <div className="text-[10px] uppercase tracking-widest mt-1">/ 100</div>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-serif">Summary</h2>
            <p className="mt-2 text-muted-foreground leading-relaxed">{result.summary}</p>
          </div>
        </div>

        <div className="mt-12">
          <h3 className="font-serif text-2xl mb-4">Room-by-room findings</h3>
          <ul className="divide-y divide-border border border-border rounded-lg overflow-hidden">
            {result.findings.map(f => (
              <li key={f.room.id} className="p-4 flex gap-4 bg-card">
                <span className="mt-0.5">
                  {f.status === "ideal" ? <CheckCircle2 className="h-5 w-5 text-gold" /> :
                    f.status === "avoid" ? <AlertTriangle className="h-5 w-5 text-destructive" /> :
                    <Circle className="h-5 w-5 text-muted-foreground" />}
                </span>
                <div>
                  <div className="font-medium">{f.room.type} · {f.room.direction}</div>
                  <p className="text-sm text-muted-foreground mt-0.5">{f.message}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default VastuReport;
