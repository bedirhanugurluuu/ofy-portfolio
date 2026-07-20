-- Production RLS policies for portfolio-ofy
-- Run this in Supabase Dashboard → SQL Editor
--
-- IMPORTANT: Admin panel uses Supabase Auth (authenticated role) for CRUD.
-- Public site reads via anon key; contact form inserts via anon key.
-- This will NOT break admin panel if you are logged in with Supabase Auth.

-- Helper: apply standard CMS policies to a table
-- Public read, authenticated write

-- ============================================================
-- CMS CONTENT TABLES
-- ============================================================

DO $$
DECLARE
  tbl text;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'projects',
    'news',
    'news_images',
    'intro_banners',
    'about_content',
    'about_gallery',
    'about_slider',
    'slider',
    'contact',
    'what_we_do',
    'project_gallery',
    'header_settings',
    'about_banner',
    'footer',
    'services'
  ]
  LOOP
    IF EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = tbl
    ) THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', tbl);

      EXECUTE format('DROP POLICY IF EXISTS "%s public read" ON public.%I', tbl, tbl);
      EXECUTE format(
        'CREATE POLICY "%s public read" ON public.%I FOR SELECT TO anon, authenticated USING (true)',
        tbl, tbl
      );

      EXECUTE format('DROP POLICY IF EXISTS "%s authenticated insert" ON public.%I', tbl, tbl);
      EXECUTE format(
        'CREATE POLICY "%s authenticated insert" ON public.%I FOR INSERT TO authenticated WITH CHECK (true)',
        tbl, tbl
      );

      EXECUTE format('DROP POLICY IF EXISTS "%s authenticated update" ON public.%I', tbl, tbl);
      EXECUTE format(
        'CREATE POLICY "%s authenticated update" ON public.%I FOR UPDATE TO authenticated USING (true) WITH CHECK (true)',
        tbl, tbl
      );

      EXECUTE format('DROP POLICY IF EXISTS "%s authenticated delete" ON public.%I', tbl, tbl);
      EXECUTE format(
        'CREATE POLICY "%s authenticated delete" ON public.%I FOR DELETE TO authenticated USING (true)',
        tbl, tbl
      );
    END IF;
  END LOOP;
END $$;

-- ============================================================
-- CONTACT FORM SUBMISSIONS
-- ============================================================

ALTER TABLE IF EXISTS public.contact_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "contact_submissions public insert" ON public.contact_submissions;
CREATE POLICY "contact_submissions public insert"
  ON public.contact_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "contact_submissions authenticated read" ON public.contact_submissions;
CREATE POLICY "contact_submissions authenticated read"
  ON public.contact_submissions FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "contact_submissions authenticated delete" ON public.contact_submissions;
CREATE POLICY "contact_submissions authenticated delete"
  ON public.contact_submissions FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- NEWSLETTER SUBSCRIBERS
-- ============================================================

ALTER TABLE IF EXISTS public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "newsletter public insert" ON public.newsletter_subscribers;
CREATE POLICY "newsletter public insert"
  ON public.newsletter_subscribers FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "newsletter authenticated read" ON public.newsletter_subscribers;
CREATE POLICY "newsletter authenticated read"
  ON public.newsletter_subscribers FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- IP WHITELIST (maintenance mode only)
-- ============================================================

ALTER TABLE IF EXISTS public.allowed_ips ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allowed_ips public read" ON public.allowed_ips;
CREATE POLICY "allowed_ips public read"
  ON public.allowed_ips FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "allowed_ips authenticated write" ON public.allowed_ips;
CREATE POLICY "allowed_ips authenticated write"
  ON public.allowed_ips FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- STORAGE (uploads bucket)
-- ============================================================

DROP POLICY IF EXISTS "uploads public read" ON storage.objects;
CREATE POLICY "uploads public read"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'uploads');

DROP POLICY IF EXISTS "uploads authenticated insert" ON storage.objects;
CREATE POLICY "uploads authenticated insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'uploads');

DROP POLICY IF EXISTS "uploads authenticated update" ON storage.objects;
CREATE POLICY "uploads authenticated update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'uploads')
  WITH CHECK (bucket_id = 'uploads');

DROP POLICY IF EXISTS "uploads authenticated delete" ON storage.objects;
CREATE POLICY "uploads authenticated delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'uploads');

-- ============================================================
-- VERIFY: After running, test admin panel login + content edit
-- and public site contact form submission.
-- ============================================================
