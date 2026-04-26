import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface Row {
  id: string; enrolled_at: string;
  courses: { slug: string; title: string; subtitle: string | null; banner_url: string | null; instructor: string | null } | null;
}

const MyCourses = () => {
  const { user, loading } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase.from("enrollments").select("id, enrolled_at, courses(slug,title,subtitle,banner_url,instructor)")
      .order("enrolled_at", { ascending: false })
      .then(({ data }) => { setRows((data as any) || []); setBusy(false); });
  }, [user]);

  if (loading) return <div className="container py-24 text-center text-muted-foreground">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <section className="container py-12 md:py-16">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Your library</p>
        <h1 className="text-4xl md:text-5xl font-serif mt-2">My Courses</h1>
      </div>

      {busy ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_,i)=> <div key={i} className="h-64 rounded-xl bg-secondary/40 animate-pulse" />)}
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <h3 className="font-serif text-2xl">You haven't enrolled in any courses yet.</h3>
          <p className="mt-2 text-muted-foreground">Browse the catalog and find one that resonates.</p>
          <Button variant="hero" className="mt-6" asChild><Link to="/courses">Browse courses</Link></Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rows.map(r => r.courses && (
            <Link key={r.id} to={`/courses/${r.courses.slug}`}
              className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-elegant hover:-translate-y-0.5 transition-all">
              <div className="aspect-[16/10] bg-secondary overflow-hidden">
                {r.courses.banner_url && <img src={r.courses.banner_url} alt={r.courses.title} className="h-full w-full object-cover" />}
              </div>
              <div className="p-5">
                <h3 className="font-serif text-2xl">{r.courses.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{r.courses.instructor}</p>
                <p className="mt-3 text-xs text-muted-foreground">Enrolled {new Date(r.enrolled_at).toLocaleDateString()}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default MyCourses;
