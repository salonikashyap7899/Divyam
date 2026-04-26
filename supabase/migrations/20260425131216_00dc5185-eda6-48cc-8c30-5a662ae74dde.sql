ALTER TABLE public.enrollments ADD COLUMN IF NOT EXISTS razorpay_order_id text;
ALTER TABLE public.enrollments ADD COLUMN IF NOT EXISTS razorpay_payment_id text;
ALTER TABLE public.enrollments ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'pending';