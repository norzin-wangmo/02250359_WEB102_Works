-- Run once in Supabase → SQL Editor after buckets `videos` and `thumbnails` exist.
-- This app uses your own API (JWT) for users, not Supabase Auth, so uploads from the
-- browser use the anon key. Policies below allow anon + authenticated to INSERT and
-- everyone to SELECT (public buckets). Tighten for production (e.g. signed URLs only).

-- Videos bucket
DROP POLICY IF EXISTS "Public read videos" ON storage.objects;
CREATE POLICY "Public read videos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'videos');

DROP POLICY IF EXISTS "Allow upload videos" ON storage.objects;
CREATE POLICY "Allow upload videos"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'videos');

DROP POLICY IF EXISTS "Allow update own videos" ON storage.objects;
CREATE POLICY "Allow update own videos"
ON storage.objects FOR UPDATE
TO anon, authenticated
USING (bucket_id = 'videos')
WITH CHECK (bucket_id = 'videos');

DROP POLICY IF EXISTS "Allow delete own videos" ON storage.objects;
CREATE POLICY "Allow delete own videos"
ON storage.objects FOR DELETE
TO anon, authenticated
USING (bucket_id = 'videos');

-- Thumbnails bucket
DROP POLICY IF EXISTS "Public read thumbnails" ON storage.objects;
CREATE POLICY "Public read thumbnails"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'thumbnails');

DROP POLICY IF EXISTS "Allow upload thumbnails" ON storage.objects;
CREATE POLICY "Allow upload thumbnails"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'thumbnails');

DROP POLICY IF EXISTS "Allow update thumbnails" ON storage.objects;
CREATE POLICY "Allow update thumbnails"
ON storage.objects FOR UPDATE
TO anon, authenticated
USING (bucket_id = 'thumbnails')
WITH CHECK (bucket_id = 'thumbnails');

DROP POLICY IF EXISTS "Allow delete thumbnails" ON storage.objects;
CREATE POLICY "Allow delete thumbnails"
ON storage.objects FOR DELETE
TO anon, authenticated
USING (bucket_id = 'thumbnails');
