-- ==========================================
-- PlantMD Supabase Initial Schema
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
  created_at timestamptz DEFAULT now()
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create Cases Table
CREATE TABLE public.cases (
  id text PRIMARY KEY, -- e.g. CAS-001
  farmer_id uuid REFERENCES public.profiles(id) NOT NULL,
  crop text NOT NULL,
  disease text,
  confidence numeric,
  urgency urgency_level DEFAULT 'Medium',
  status case_status DEFAULT 'Analyzed',
  location text,
  image_urls text[] DEFAULT '{}',
  farmer_notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS for cases
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

-- Enable RLS for expert_reviews
ALTER TABLE public.expert_reviews ENABLE ROW LEVEL SECURITY;

-- 5. Basic RLS Policies (For Development)
-- Note: These policies are permissive for testing. You should restrict them for production.

-- Profiles: Anyone can view profiles, users can update their own.
CREATE POLICY "Public profiles are viewable by everyone." 
  ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." 
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Cases: Anyone can view cases, authenticated users can insert/update.
CREATE POLICY "Cases are viewable by everyone." 
  ON public.cases FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert cases." 
  ON public.cases FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update cases." 
  ON public.cases FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Expert Reviews: Anyone can view, authenticates users can insert/update.
CREATE POLICY "Expert reviews viewable by everyone." 
  ON public.expert_reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert reviews." 
  ON public.expert_reviews FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update reviews." 
  ON public.expert_reviews FOR UPDATE USING (auth.uid() IS NOT NULL);

-- 6. Storage Buckets (For Plant Images)
-- Instructions: Create the 'plant-images' bucket in Supabase Dashboard -> Storage
-- Then run the following policies:

-- Ensure public access to the bucket if not already set
-- INSERT INTO storage.buckets (id, name, public) VALUES ('plant-images', 'plant-images', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Plant images are publicly viewable."
  ON storage.objects FOR SELECT USING (bucket_id = 'plant-images');

CREATE POLICY "Authenticated users can upload plant images."
  ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'plant-images' AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can delete their own plant images."
  ON storage.objects FOR DELETE USING (
    bucket_id = 'plant-images' AND auth.uid() = owner
  );

-- 7. Trigger for new user signup to automatically create a profile
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
