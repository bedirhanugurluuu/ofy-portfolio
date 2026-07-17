-- Blog modelini sadeleştirir ve çoklu slider görsellerini ekler.
-- Uygulama kodu yayına alınmadan hemen önce Supabase SQL Editor'da çalıştırın.

BEGIN;

-- Mevcut sitede görünen başlık subtitle alanında tutuluyordu.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'news'
      AND column_name = 'subtitle'
  ) THEN
    EXECUTE $migration$
      UPDATE public.news
      SET title = subtitle
      WHERE NULLIF(BTRIM(subtitle), '') IS NOT NULL
    $migration$;
  END IF;
END;
$$;

CREATE TABLE IF NOT EXISTS public.news_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  news_id UUID NOT NULL REFERENCES public.news(id) ON DELETE CASCADE,
  image_path TEXT NOT NULL CHECK (BTRIM(image_path) <> ''),
  order_index INTEGER NOT NULL DEFAULT 0 CHECK (order_index >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (news_id, order_index)
);

CREATE INDEX IF NOT EXISTS news_images_news_order_idx
  ON public.news_images (news_id, order_index);

-- Eski tek kapak görselini slider'ın ilk görseli olarak taşır.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'news'
      AND column_name = 'image_path'
  ) THEN
    EXECUTE $migration$
      INSERT INTO public.news_images (news_id, image_path, order_index)
      SELECT id, image_path, 0
      FROM public.news
      WHERE NULLIF(BTRIM(image_path), '') IS NOT NULL
      ON CONFLICT (news_id, order_index) DO NOTHING
    $migration$;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_news_image_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_news_images_updated_at ON public.news_images;
CREATE TRIGGER set_news_images_updated_at
BEFORE UPDATE ON public.news_images
FOR EACH ROW
EXECUTE FUNCTION public.set_news_image_updated_at();

ALTER TABLE public.news_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "news images public read" ON public.news_images;
DROP POLICY IF EXISTS "news images authenticated insert" ON public.news_images;
DROP POLICY IF EXISTS "news images authenticated update" ON public.news_images;
DROP POLICY IF EXISTS "news images authenticated delete" ON public.news_images;

CREATE POLICY "news images public read"
ON public.news_images FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "news images authenticated insert"
ON public.news_images FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "news images authenticated update"
ON public.news_images FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "news images authenticated delete"
ON public.news_images FOR DELETE
TO authenticated
USING (true);

UPDATE public.news SET content = '' WHERE content IS NULL;
UPDATE public.news SET aspect_ratio = 'aspect-square'
WHERE aspect_ratio IS NULL OR BTRIM(aspect_ratio) = '';
UPDATE public.news SET featured = false WHERE featured IS NULL;

ALTER TABLE public.news
  ALTER COLUMN content SET DEFAULT '',
  ALTER COLUMN content SET NOT NULL,
  ALTER COLUMN aspect_ratio SET DEFAULT 'aspect-square',
  ALTER COLUMN aspect_ratio SET NOT NULL,
  ALTER COLUMN featured SET DEFAULT false,
  ALTER COLUMN featured SET NOT NULL;

ALTER TABLE public.news
  DROP COLUMN IF EXISTS category_text,
  DROP COLUMN IF EXISTS photographer,
  DROP COLUMN IF EXISTS subtitle,
  DROP COLUMN IF EXISTS published_at,
  DROP COLUMN IF EXISTS photos_label,
  DROP COLUMN IF EXISTS image_path,
  DROP COLUMN IF EXISTS featured_order,
  DROP COLUMN IF EXISTS is_featured;

COMMIT;

-- Kontrol:
-- SELECT n.id, n.title, n.slug, COUNT(ni.id) AS image_count
-- FROM public.news n
-- LEFT JOIN public.news_images ni ON ni.news_id = n.id
-- GROUP BY n.id
-- ORDER BY n.created_at DESC;
