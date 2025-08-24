-- Newsletter Subscribers Table Setup (Safe Version)
-- Run this in your Supabase SQL Editor

-- Create newsletter_subscribers table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    subscribed_at TIMESTAMPTZ DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON public.newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_status ON public.newsletter_subscribers(status);

-- Enable Row Level Security (RLS) if not already enabled
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow newsletter subscription" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Allow admin to read subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Allow admin to update subscribers" ON public.newsletter_subscribers;

-- Create new policies
CREATE POLICY "Allow newsletter subscription" ON public.newsletter_subscribers
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin to read subscribers" ON public.newsletter_subscribers
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin to update subscribers" ON public.newsletter_subscribers
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_newsletter_subscribers_updated_at ON public.newsletter_subscribers;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_newsletter_subscribers_updated_at 
    BEFORE UPDATE ON public.newsletter_subscribers 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Verify the setup
SELECT 
    'Table created successfully' as status,
    COUNT(*) as subscriber_count
FROM public.newsletter_subscribers;
