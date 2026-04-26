import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, ShieldCheck, Tag } from "lucide-react";

interface Course { id: string; slug: string; title: string; price: number; banner_url: string | null; }
interface Coupon { code: string; discount_percent: number; is_class_code: boolean; course_id: string | null; }

declare global { interface Window { Razorpay: any; } }

const loadRazorpay = () => new Promise<boolean>((resolve) => {
  if (window.Razorpay) return resolve(true);
  const s = document.createElement("script");
  s.src = "https://checkout.razorpay.com/v1/checkout.js";
  s.onload = () => resolve(true);
  s.onerror = () => resolve(false);
  document.body.appendChild(s);
});

const Checkout = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [code, setCode] = useState("");
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!slug) return;
    supabase.from("courses").select("id,slug,title,price,banner_url").eq("slug", slug).maybeSingle()
      .then(({ data }) => setCourse(data as any));
  }, [slug]);

  if (loading) return <div className="container py-24 text-center text-muted-foreground">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!course) return <div className="container py-24 text-center text-muted-foreground">Loading course...</div>;

  const discount = coupon ? Math.min(100, coupon.discount_percent) : 0;
  const total = Math.max(0, Math.round(Number(course.price) * (100 - discount) / 100));

  const applyCode = async () => {
    if (!code) return;
    const { data, error } = await supabase.from("coupons").select("*").eq("code", code.toUpperCase()).eq("active", true).maybeSingle();
    if (error || !data) return toast.error("Invalid code");
    if (data.is_class_code && data.course_id !== course.id) return toast.error("This class code is for a different course");
    setCoupon(data as Coupon);
    toast.success(data.is_class_code ? "Class code applied — free enrollment" : `${data.discount_percent}% discount applied`);
  };

  const pay = async () => {
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("razorpay-create-order", {
        body: { course_id: course.id, coupon_code: coupon?.code || null },
      });
      if (error) throw error;

      // Free enrollment path
      if (data.free) {
        toast.success("Enrolled!");
        navigate("/my-courses");
        return;
      }

      const ok = await loadRazorpay();
      if (!ok) throw new Error("Couldn't load Razorpay");

      const rzp = new window.Razorpay({
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        order_id: data.order_id,
        name: "Divyam",
        description: data.course_title,
        prefill: { email: user.email },
        theme: { color: "#1a1a4a" },
        handler: async (resp: any) => {
          const { data: vData, error: vErr } = await supabase.functions.invoke("razorpay-verify-payment", {
            body: {
              razorpay_order_id: resp.razorpay_order_id,
              razorpay_payment_id: resp.razorpay_payment_id,
              razorpay_signature: resp.razorpay_signature,
              course_id: course.id,
              coupon_code: coupon?.code || null,
              amount: data.total,
            },
          });
          if (vErr || vData?.error) return toast.error("Payment verification failed");
          toast.success("Payment successful — enrolled!");
          navigate("/my-courses");
        },
        modal: { ondismiss: () => setBusy(false) },
      });
      rzp.on("payment.failed", (r: any) => {
        toast.error(r.error?.description || "Payment failed");
        setBusy(false);
      });
      rzp.open();
    } catch (e: any) {
      toast.error(e.message || "Something went wrong");
      setBusy(false);
    }
  };

  return (
    <section className="container py-12 md:py-16">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Checkout</p>
        <h1 className="text-4xl md:text-5xl font-serif mt-2">Complete your enrollment</h1>
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-8">
        <div className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-6">
          <div className="flex gap-4">
            {course.banner_url && (
              <div className="w-28 aspect-[4/3] rounded-md overflow-hidden bg-secondary shrink-0">
                <img src={course.banner_url} alt={course.title} className="h-full w-full object-cover" />
              </div>
            )}
            <div>
              <h3 className="font-serif text-2xl">{course.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">Lifetime access · self-paced</p>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <Label htmlFor="code" className="flex items-center gap-2"><Tag className="h-4 w-4" /> Coupon or class code</Label>
            <div className="mt-2 flex gap-2">
              <Input id="code" value={code} onChange={e => setCode(e.target.value)} placeholder="e.g. WELCOME20" />
              <Button variant="outline" onClick={applyCode}>Apply</Button>
            </div>
            {coupon && <p className="mt-2 text-xs text-gold">Code <strong>{coupon.code}</strong> applied · {coupon.discount_percent}% off</p>}
            <p className="mt-3 text-xs text-muted-foreground">Try <code>WELCOME20</code>, <code>FESTIVE50</code>, or class code <code>CLASS-VASTU-101</code>.</p>
          </div>
        </div>

        <aside className="rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-24 self-start shadow-elegant">
          <h3 className="font-serif text-2xl">Order summary</h3>
          <div className="mt-5 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Course</span><span>₹{Number(course.price).toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Discount</span><span>-{discount}%</span></div>
          </div>
          <div className="mt-5 pt-5 border-t border-border flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="font-serif text-3xl text-gold">₹{total.toLocaleString()}</span>
          </div>
          <Button variant="hero" size="lg" className="w-full mt-5" onClick={pay} disabled={busy}>
            {busy && <Loader2 className="h-4 w-4 animate-spin" />} {total === 0 ? "Enroll for free" : "Pay with Razorpay"}
          </Button>
          <p className="mt-3 text-[11px] text-muted-foreground flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> Secure payments via Razorpay</p>
          <Button variant="ghost" size="sm" asChild className="w-full mt-2"><Link to={`/courses/${course.slug}`}>Back to course</Link></Button>
        </aside>
      </div>
    </section>
  );
};

export default Checkout;
