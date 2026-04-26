import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Search, Clock, BarChart3 } from "lucide-react";

interface Course {
  id: string; slug: string; title: string; subtitle: string | null;
  instructor: string | null; banner_url: string | null; price: number;
  duration: string | null; level: string | null; category: string | null;
}

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("courses").select("*").eq("is_published", true).order("created_at", { ascending: false })
      .then(({ data }) => { setCourses((data as Course[]) || []); setLoading(false); });
  }, []);

  const filtered = courses.filter(c =>
    `${c.title} ${c.subtitle} ${c.instructor} ${c.category}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <section className="container py-12 md:py-16">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Learn</p>
          <h1 className="text-4xl md:text-5xl font-serif mt-2">All Courses</h1>
          <p className="mt-2 text-muted-foreground max-w-xl">From the foundations of Vastu to advanced numerology and meditation.</p>
        </div>
        <div className="relative md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search courses..." value={q} onChange={e => setQ(e.target.value)} className="pl-9" />
        </div>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_,i) => <div key={i} className="h-72 rounded-xl bg-secondary/40 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(c => (
            <Link key={c.id} to={`/courses/${c.slug}`}
              className="group rounded-xl border border-border bg-card overflow-hidden transition-all hover:shadow-elegant hover:-translate-y-0.5">
              <div className="aspect-[16/10] bg-secondary overflow-hidden">
                {c.banner_url && <img src={c.banner_url} alt={c.title} loading="lazy" className="h-full w-full object-cover transition-transform group-hover:scale-105" />}
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                  <span>{c.category}</span>
                </div>
                <h3 className="mt-2 font-serif text-2xl leading-tight">{c.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{c.subtitle}</p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {c.duration}</span>
                    <span className="flex items-center gap-1"><BarChart3 className="h-3.5 w-3.5" /> {c.level}</span>
                  </div>
                  <span className="font-serif text-xl text-gold">₹{Number(c.price).toLocaleString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default Courses;
