import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const RZP_KEY_ID = Deno.env.get("RAZORPAY_KEY_ID");
    const RZP_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET");
    if (!RZP_KEY_ID || !RZP_KEY_SECRET) throw new Error("Razorpay keys not configured");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !userData.user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const user = userData.user;

    const { course_id, coupon_code } = await req.json();
    if (!course_id) return new Response(JSON.stringify({ error: "course_id required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { data: course } = await supabase.from("courses").select("id,title,price").eq("id", course_id).maybeSingle();
    if (!course) return new Response(JSON.stringify({ error: "Course not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    let discount = 0;
    let validCoupon: any = null;
    if (coupon_code) {
      const { data: coupon } = await supabase.from("coupons").select("*").eq("code", coupon_code.toUpperCase()).eq("active", true).maybeSingle();
      if (coupon && (!coupon.is_class_code || coupon.course_id === course.id)) {
        validCoupon = coupon;
        discount = coupon.discount_percent;
      }
    }

    const total = Math.max(0, Math.round(Number(course.price) * (100 - discount) / 100));

    // Free enrollment - skip Razorpay
    if (total === 0) {
      const { error: insErr } = await supabase.from("enrollments").insert({
        user_id: user.id, course_id: course.id,
        coupon_code: validCoupon?.code || null,
        amount_paid: 0, payment_status: "paid",
      });
      if (insErr && insErr.code !== "23505") throw insErr;
      return new Response(JSON.stringify({ free: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Create Razorpay order
    const auth = btoa(`${RZP_KEY_ID}:${RZP_KEY_SECRET}`);
    const orderRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: { "Authorization": `Basic ${auth}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: total * 100, // paise
        currency: "INR",
        notes: { course_id: course.id, user_id: user.id, coupon: validCoupon?.code || "" },
      }),
    });
    const order = await orderRes.json();
    if (!orderRes.ok) throw new Error(`Razorpay: ${JSON.stringify(order)}`);

    return new Response(JSON.stringify({
      order_id: order.id, amount: order.amount, currency: order.currency,
      key_id: RZP_KEY_ID, course_title: course.title, total,
      coupon_code: validCoupon?.code || null,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
