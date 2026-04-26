import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Compass, Calculator, GraduationCap, Sparkles, ArrowRight } from "lucide-react";

const tools = [
  { to: "/vastu", icon: Compass, title: "Room Vastu Analyser", desc: "Place rooms on a compass and get instant guidance." },
  { to: "/numerology", icon: Calculator, title: "Numerology Report", desc: "Life path, expression, and personal year — calculated." },
  { to: "/courses", icon: GraduationCap, title: "All Courses", desc: "Foundations to mastery, taught by traditional teachers." },
];

const Index = () => (
  <>
    {/* Hero */}
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 gradient-hero" />
      <div className="absolute inset-0 -z-10 opacity-[0.07]"
        style={{ backgroundImage: "radial-gradient(circle at 25% 30%, hsl(var(--gold)) 1px, transparent 1px), radial-gradient(circle at 75% 70%, hsl(var(--gold)) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      <div className="container py-24 md:py-36 text-primary-foreground">
        <div className="max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 px-3 py-1 text-xs uppercase tracking-[0.2em] text-gold">
            <Sparkles className="h-3 w-3" /> Vastu · Numerology · Sacred Learning
          </div>
          <h1 className="mt-6 text-5xl md:text-7xl font-serif leading-[1.05]">
            Ancient sciences,<br />
            <span className="italic text-gold">beautifully practical.</span>
          </h1>
          <p className="mt-6 text-lg text-primary-foreground/80 max-w-xl">
            Analyze your home in minutes, decode your numbers, and learn from teachers
            who carry these traditions forward.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button variant="gold" size="lg" asChild>
              <Link to="/vastu">Start a Vastu reading <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
              <Link to="/courses">Browse courses</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>

    {/* Quick tools */}
    <section className="container py-20">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Quick Access</p>
          <h2 className="text-4xl font-serif mt-2">Begin where you feel called.</h2>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-5">
        {tools.map(t => (
          <Link key={t.to} to={t.to}
            className="group rounded-xl border border-border bg-card p-7 transition-all hover:shadow-elegant hover:-translate-y-0.5">
            <div className="grid h-12 w-12 place-items-center rounded-lg bg-secondary text-foreground group-hover:bg-gold group-hover:text-gold-foreground transition-colors">
              <t.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-2xl font-serif">{t.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
            <span className="mt-5 inline-flex items-center gap-1 text-sm text-foreground/80 group-hover:text-gold">
              Open <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        ))}
      </div>
    </section>

    {/* About */}
    <section className="bg-secondary/40 border-y border-border">
      <div className="container py-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">About Divyam</p>
          <h2 className="text-4xl md:text-5xl font-serif mt-3 leading-tight">
            A modern home for <span className="italic">timeless</span> sciences.
          </h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            Divyam brings together a tools-first approach with deep teaching. Our analysers
            are designed by traditional acharyas and built so you understand the <em>why</em>,
            not just the <em>what</em>. Every report is private to you.
          </p>
          <ul className="mt-6 space-y-2 text-sm">
            <li>· Personalized analysis with downloadable PDFs</li>
            <li>· Courses from beginner to practitioner</li>
            <li>· Saved reports across all your sessions</li>
          </ul>
        </div>
        <div className="relative aspect-square max-w-md mx-auto">
          <div className="absolute inset-0 rounded-full gradient-hero shadow-elegant" />
          <div className="absolute inset-6 rounded-full border-2 border-gold/40 animate-spin-slow" />
          <div className="absolute inset-16 rounded-full border border-primary-foreground/20" />
          <div className="absolute inset-0 grid place-items-center text-gold">
            <Compass className="h-24 w-24" strokeWidth={1} />
          </div>
        </div>
      </div>
    </section>
  </>
);

export default Index;
