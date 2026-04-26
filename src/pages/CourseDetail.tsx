import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Clock, BarChart3, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface Course {
  id: string; slug: string; title: string; subtitle: string | null; description: string | null;
  instructor: string | null; banner_url: string | null; price: number;
  duration: string | null; level: string | null; category: string | null;
  curriculum: { title: string; lessons: string[] }[];
}

const CourseDetail = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    if (!slug) return;
    supabase.from("courses").select("*").eq("slug", slug).maybeSingle()
      .then(({ data }) => setCourse(data as any));
  }, [slug]);

  useEffect(() => {
    if (!user || !course) return;
    supabase.from("enrollments").select("id").eq("user_id", user.id).eq("course_id", course.id).maybeSingle()
      .then(({ data }) => setEnrolled(!!data));
  }, [user, course]);

  if (!course) return <div className="container py-24 text-center text-muted-foreground">Loading...</div>;

  return (
    <>
      <section className="border-b border-border gradient-hero text-primary-foreground">
        <div className="container py-16 md:py-24 grid md:grid-cols-[1fr_400px] gap-10 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-gold">{course.category}</p>
            <h1 className="mt-3 text-4xl md:text-6xl font-serif leading-[1.05]">{course.title}</h1>
            <p className="mt-4 text-lg text-primary-foreground/80 max-w-xl">{course.subtitle}</p>
            <div className="mt-6 flex flex-wrap gap-5 text-sm text-primary-foreground/80">
              <span className="flex items-center gap-2"><User className="h-4 w-4" /> {course.instructor}</span>
              <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> {course.duration}</span>
              <span className="flex items-center gap-2"><BarChart3 className="h-4 w-4" /> {course.level}</span>
            </div>
          </div>
          {course.banner_url && (
            <div className="rounded-xl overflow-hidden shadow-elegant aspect-[4/3]">
              <img src={course.banner_url} alt={course.title} className="h-full w-full object-cover" />
            </div>
          )}
        </div>
      </section>

      <section className="container py-16 grid lg:grid-cols-[1fr_360px] gap-10">
        <div>
          <h2 className="font-serif text-3xl">About this course</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">{course.description}</p>

          <h2 className="font-serif text-3xl mt-12">Curriculum</h2>
          <Accordion type="single" collapsible className="mt-4">
            {(course.curriculum || []).map((m, i) => (
              <AccordionItem key={i} value={`m-${i}`}>
                <AccordionTrigger className="font-serif text-lg">{m.title}</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-1.5 text-muted-foreground">
                    {m.lessons.map((l, j) => <li key={j}>· {l}</li>)}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <aside className="lg:sticky lg:top-24 self-start rounded-2xl border border-border bg-card p-6 shadow-elegant">
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-4xl text-gold">₹{Number(course.price).toLocaleString()}</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">One-time payment · lifetime access</p>
          {enrolled ? (
            <Button variant="outline" size="lg" className="mt-5 w-full" disabled>You're enrolled</Button>
          ) : (
            <Button variant="hero" size="lg" className="mt-5 w-full" asChild>
              <Link to={`/checkout/${course.slug}`}>Enroll now</Link>
            </Button>
          )}
          <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
            <li>· Self-paced video lessons</li>
            <li>· Downloadable workbooks</li>
            <li>· Certificate of completion</li>
            <li>· Lifetime updates</li>
          </ul>
        </aside>
      </section>
    </>
  );
};

export default CourseDetail;
