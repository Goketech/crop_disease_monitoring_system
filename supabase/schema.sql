-- ==========================================
-- PlantMD Supabase Schema (fresh install)
-- ==========================================

-- 1. Create Custom Types
CREATE TYPE user_role AS ENUM ('farmer', 'agronomist', 'admin');
CREATE TYPE urgency_level AS ENUM ('Low', 'Medium', 'High', 'Critical');
CREATE TYPE case_status AS ENUM ('Submitted', 'Analyzed', 'Pending Review', 'Reviewed', 'Resolved');

-- 2. Create Profiles Table (extends auth.users)
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  role user_role DEFAULT 'farmer',
  avatar_url text,
  farm_name text,
  location text,
  phone_number text,
  sms_notifications_enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create Cases Table
CREATE TABLE public.cases (
  id text PRIMARY KEY,
  farmer_id uuid REFERENCES public.profiles(id) NOT NULL,
  crop text NOT NULL,
  disease text,
  confidence numeric,
  urgency urgency_level DEFAULT 'Medium',
  status case_status DEFAULT 'Submitted',
  location text,
  image_urls text[] DEFAULT '{}',
  farmer_notes text,
  treatment_plan text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;

-- 4. Create Expert Reviews Table
CREATE TABLE public.expert_reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id text REFERENCES public.cases(id) ON DELETE CASCADE,
  expert_id uuid REFERENCES public.profiles(id),
  clinical_observations text,
  treatment_plan text,
  severity text,
  is_submitted boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.expert_reviews ENABLE ROW LEVEL SECURITY;

-- Role helper (SECURITY DEFINER so role checks stay reliable)
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

-- 5. Row Level Security

CREATE POLICY "Profiles readable by authenticated users"
  ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "cases_select_scope"
  ON public.cases FOR SELECT TO authenticated
  USING (farmer_id = auth.uid() OR public.is_agronomist_or_admin());
CREATE POLICY "cases_insert_own"
  ON public.cases FOR INSERT TO authenticated
  WITH CHECK (farmer_id = auth.uid());
CREATE POLICY "cases_update_scope"
  ON public.cases FOR UPDATE TO authenticated
  USING (farmer_id = auth.uid() OR public.is_agronomist_or_admin())
  WITH CHECK (farmer_id = auth.uid() OR public.is_agronomist_or_admin());

CREATE POLICY "expert_reviews_select_scope"
  ON public.expert_reviews FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.cases c
      WHERE c.id = expert_reviews.case_id
      AND (c.farmer_id = auth.uid() OR public.is_agronomist_or_admin())
    )
  );
CREATE POLICY "expert_reviews_insert_staff"
  ON public.expert_reviews FOR INSERT TO authenticated
  WITH CHECK (public.is_agronomist_or_admin() AND expert_id = auth.uid());
CREATE POLICY "expert_reviews_update_own"
  ON public.expert_reviews FOR UPDATE TO authenticated
  USING (public.is_agronomist_or_admin() AND expert_id = auth.uid())
  WITH CHECK (public.is_agronomist_or_admin() AND expert_id = auth.uid());

-- 6. Storage (create bucket in Dashboard if needed)
CREATE POLICY "Plant images are publicly viewable."
  ON storage.objects FOR SELECT USING (bucket_id = 'plant-images');

CREATE POLICY "Users upload plant images to own folder"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'plant-images'
    AND split_part(name, '/', 1) = auth.uid()::text
  );

CREATE POLICY "Users delete own plant images in plant-images"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'plant-images'
    AND split_part(name, '/', 1) = auth.uid()::text
  );

-- 7. New user → profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email,
    COALESCE((new.raw_user_meta_data->>'role')::user_role, 'farmer'::user_role)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
