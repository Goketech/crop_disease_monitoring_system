import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !anonKey) {
  console.error('Missing Supabase URL or anon key.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey || anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function seed() {
  console.log('🌱 Starting database seed...');

  if (!serviceKey) {
    console.warn(
      '⚠️  SUPABASE_SERVICE_ROLE_KEY is not set. Using the anon key — this will fail if RLS blocks inserts.\n' +
        '   Add the service role key to .env.local for local seeding, or run seeds from the SQL editor as an admin.'
    );
  }

  try {
    const { data: users, error: userError } = await supabase.from('profiles').select('id, role').limit(1);

    if (userError || !users || users.length === 0) {
      console.error('❌ No profiles found. Create a user via the signup UI first.');
      process.exit(1);
    }

    const currentUserId = users[0].id;
    console.log(`Using Profile ID: ${currentUserId}`);

    console.log('Seeding Cases...');
    const casesToInsert = [
      { id: 'CAS-001', farmer_id: currentUserId, crop: 'Tomato', disease: 'Late Blight', confidence: 94, urgency: 'Critical', status: 'Analyzed' as const },
      { id: 'CAS-002', farmer_id: currentUserId, crop: 'Apple', disease: 'Apple Scab', confidence: 82, urgency: 'Medium', status: 'Pending Review' as const },
      { id: 'CAS-003', farmer_id: currentUserId, crop: 'Wheat', disease: 'Leaf Rust', confidence: 98, urgency: 'High', status: 'Reviewed' as const },
      { id: 'CAS-004', farmer_id: currentUserId, crop: 'Corn', disease: 'Healthy', confidence: 99, urgency: 'Low', status: 'Reviewed' as const },
      { id: 'CAS-005', farmer_id: currentUserId, crop: 'Potato', disease: 'Early Blight', confidence: 76, urgency: 'Medium', status: 'Analyzed' as const },
    ];

    const { error: casesError } = await supabase.from('cases').upsert(casesToInsert);
    if (casesError) throw casesError;

    console.log('Seeding Expert Reviews...');
    const reviewsToInsert = [
      {
        case_id: 'CAS-003',
        expert_id: currentUserId,
        clinical_observations: 'Severe rust pustules observed on upper leaf surfaces. Spreading rapidly.',
        treatment_plan: 'Apply tebuconazole immediately according to label rates. Re-evaluate in 7 days.',
        severity: 'High',
        is_submitted: true,
      },
      {
        case_id: 'CAS-004',
        expert_id: currentUserId,
        clinical_observations: 'Plant is remarkably healthy. Good node spacing and color.',
        treatment_plan: 'No treatment necessary. Continue standard irrigation practices.',
        severity: 'None',
        is_submitted: true,
      },
    ];

    const { error: reviewsError } = await supabase.from('expert_reviews').insert(reviewsToInsert);
    if (reviewsError) throw reviewsError;

    console.log('✅ Seeding completed successfully!');
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    if (err.code === '42501') {
      console.error('\n❌ RLS blocked this operation. Add SUPABASE_SERVICE_ROLE_KEY to .env.local and retry.\n');
    } else {
      console.error('❌ Seeding failed:', error);
    }
    process.exit(1);
  }
}

seed();
