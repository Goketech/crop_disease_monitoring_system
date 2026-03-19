-- PlantMD: align schema + tighten RLS (run in Supabase SQL Editor for existing DBs)
-- Safe to re-run: uses IF NOT EXISTS / DROP IF EXISTS where applicable.

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone_number text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS sms_notifications_enabled boolean DEFAULT true;

ALTER TABLE public.cases ADD COLUMN IF NOT EXISTS treatment_plan text;

CREATE OR REPLACE FUNCTION public.is_agronomist_or_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.role IN ('agronomist'::user_role, 'admin'::user_role)
  );
$$;

-- Profiles policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Profiles readable by authenticated users" ON public.profiles;
CREATE POLICY "Profiles readable by authenticated users"
  ON public.profiles FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Cases policies
DROP POLICY IF EXISTS "Cases are viewable by everyone." ON public.cases;
DROP POLICY IF EXISTS "cases_select_scope" ON public.cases;
CREATE POLICY "cases_select_scope"
  ON public.cases FOR SELECT TO authenticated
  USING (farmer_id = auth.uid() OR public.is_agronomist_or_admin());

DROP POLICY IF EXISTS "Authenticated users can insert cases." ON public.cases;
DROP POLICY IF EXISTS "cases_insert_own" ON public.cases;
CREATE POLICY "cases_insert_own"
  ON public.cases FOR INSERT TO authenticated
  WITH CHECK (farmer_id = auth.uid());

DROP POLICY IF EXISTS "Authenticated users can update cases." ON public.cases;
DROP POLICY IF EXISTS "cases_update_scope" ON public.cases;
CREATE POLICY "cases_update_scope"
  ON public.cases FOR UPDATE TO authenticated
  USING (farmer_id = auth.uid() OR public.is_agronomist_or_admin())
  WITH CHECK (farmer_id = auth.uid() OR public.is_agronomist_or_admin());

-- Expert reviews policies
DROP POLICY IF EXISTS "Expert reviews viewable by everyone." ON public.expert_reviews;
DROP POLICY IF EXISTS "expert_reviews_select_scope" ON public.expert_reviews;
CREATE POLICY "expert_reviews_select_scope"
  ON public.expert_reviews FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.cases c
      WHERE c.id = expert_reviews.case_id
      AND (c.farmer_id = auth.uid() OR public.is_agronomist_or_admin())
    )
  );

DROP POLICY IF EXISTS "Authenticated users can insert reviews." ON public.expert_reviews;
DROP POLICY IF EXISTS "expert_reviews_insert_staff" ON public.expert_reviews;
CREATE POLICY "expert_reviews_insert_staff"
  ON public.expert_reviews FOR INSERT TO authenticated
  WITH CHECK (public.is_agronomist_or_admin() AND expert_id = auth.uid());

DROP POLICY IF EXISTS "Authenticated users can update reviews." ON public.expert_reviews;
DROP POLICY IF EXISTS "expert_reviews_update_own" ON public.expert_reviews;
CREATE POLICY "expert_reviews_update_own"
  ON public.expert_reviews FOR UPDATE TO authenticated
  USING (public.is_agronomist_or_admin() AND expert_id = auth.uid())
  WITH CHECK (public.is_agronomist_or_admin() AND expert_id = auth.uid());

-- Storage: scope uploads and deletes to the user's folder (first path segment = user id)
DROP POLICY IF EXISTS "Authenticated users can upload plant images." ON storage.objects;
DROP POLICY IF EXISTS "Users upload plant images to own folder" ON storage.objects;
CREATE POLICY "Users upload plant images to own folder"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'plant-images'
    AND split_part(name, '/', 1) = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users can delete their own plant images." ON storage.objects;
DROP POLICY IF EXISTS "Users delete own plant images in plant-images" ON storage.objects;
CREATE POLICY "Users delete own plant images in plant-images"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'plant-images'
    AND split_part(name, '/', 1) = auth.uid()::text
  );
