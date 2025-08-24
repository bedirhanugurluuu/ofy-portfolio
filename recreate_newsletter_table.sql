-- Drop and Recreate Newsletter Subscribers Table
-- Run this in your Supabase SQL Editor

-- Drop existing table and all related objects
DROP TABLE IF EXISTS public.newsletter_subscribers CASCADE;

-- Create fresh newsletter_subscribers table
CREATE TABLE public.newsletter_subscribers (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    subscribed_at TIMESTAMPTZ DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_newsletter_subscribers_email ON public.newsletter_subscribers(email);
CREATE INDEX idx_newsletter_subscribers_status ON public.newsletter_subscribers(status);

-- Enable Row Level Security (RLS)
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow newsletter subscription" ON public.newsletter_subscribers
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin to read subscribers" ON public.newsletter_subscribers
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin to update subscribers" ON public.newsletter_subscribers
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
CREATE TRIGGER update_newsletter_subscribers_updated_at 
    BEFORE UPDATE ON public.newsletter_subscribers 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Test insert
INSERT INTO public.newsletter_subscribers (email, status) 
VALUES ('test@example.com', 'active');

-- Verify the setup
SELECT 
    'Table created successfully' as status,
    COUNT(*) as subscriber_count
FROM public.newsletter_subscribers;

-- Show test data
SELECT 
    id,
    email,
    status,
    subscribed_at
FROM public.newsletter_subscribers
LIMIT 5;

-- Show table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'newsletter_subscribers' 
AND table_schema = 'public'
ORDER BY ordinal_position;
