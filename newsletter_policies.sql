-- Newsletter RLS Policies Setup
-- Run this in your Supabase SQL Editor

-- Enable Row Level Security (RLS) if not already enabled
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow newsletter subscription" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Allow admin to read subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Allow admin to update subscribers" ON public.newsletter_subscribers;

-- Create policy to allow inserts from authenticated and anonymous users
CREATE POLICY "Allow newsletter subscription" ON public.newsletter_subscribers
    FOR INSERT WITH CHECK (true);

-- Create policy to allow reads only for authenticated users (admin)
CREATE POLICY "Allow admin to read subscribers" ON public.newsletter_subscribers
    FOR SELECT USING (auth.role() = 'authenticated');

-- Create policy to allow updates only for authenticated users (admin)
CREATE POLICY "Allow admin to update subscribers" ON public.newsletter_subscribers
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Verify the policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'newsletter_subscribers';

-- Test insert (should work)
INSERT INTO public.newsletter_subscribers (email, status) 
VALUES ('test@example.com', 'active')
ON CONFLICT (email) DO NOTHING;

-- Check if insert worked
SELECT COUNT(*) as subscriber_count FROM public.newsletter_subscribers;
