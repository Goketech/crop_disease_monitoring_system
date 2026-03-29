import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('🌱 Starting database seed...');

  try {
    // Note: To seed data correctly respecting foreign keys, we first need to get the UUID 
    // of the user you just created. We'll fetch the first available user.
    const { data: users, error: userError } = await supabase.from('profiles').select('id, role').limit(1);
    
    if (userError || !users || users.length === 0) {
       console.error('❌ Error: No profiles found. Please create at least one user via the signup UI first.');
       process.exit(1);
    }

    const currentUserId = users[0].id;
    console.log(`Using Profile ID: ${currentUserId}`);

    // --- Seed Cases ---
    console.log('Seeding Cases...');
    const casesToInsert = [
      { id: "CAS-001", farmer_id: currentUserId, crop: "Tomato", disease: "Late Blight", confidence: 94, urgency: "Critical", status: "Analyzed" },
      { id: "CAS-002", farmer_id: currentUserId, crop: "Apple", disease: "Apple Scab", confidence: 82, urgency: "Medium", status: "Pending Review" },
      { id: "CAS-003", farmer_id: currentUserId, crop: "Wheat", disease: "Leaf Rust", confidence: 98, urgency: "High", status: "Complete" },
      { id: "CAS-004", farmer_id: currentUserId, crop: "Corn", disease: "Healthy", confidence: 99, urgency: "Low", status: "Complete" },
      { id: "CAS-005", farmer_id: currentUserId, crop: "Potato", disease: "Early Blight", confidence: 76, urgency: "Medium", status: "Analyzed" },
    ];

    const { error: casesError } = await supabase.from('cases').upsert(casesToInsert);
    if (casesError) throw casesError;
    // --- Seed Expert Reviews (Only for CAS-003 and CAS-004 which are "Complete") ---
    console.log('Seeding Expert Reviews...');
    const reviewsToInsert = [
      { 
        case_id: "CAS-003", 
        expert_id: currentUserId, // Using the same user as expert for simplicity in this seed
        clinical_observations: "Severe rust pustules observed on upper leaf surfaces. Spreading rapidly.",
        treatment_plan: "Apply tebuconazole immediately according to label rates. Re-evaluate in 7 days.",
        severity: "High",
        is_submitted: true
      },
      { 
        case_id: "CAS-004", 
        expert_id: currentUserId,
        clinical_observations: "Plant is remarkably healthy. Good node spacing and color.",
        treatment_plan: "No treatment necessary. Continue standard irrigation practices.",
        severity: "None",
        is_submitted: true
      }
    ];

    const { error: reviewsError } = await supabase.from('expert_reviews').insert(reviewsToInsert);
    if (reviewsError) throw reviewsError;

    console.log('✅ Seeding completed successfully!');
  } catch (error: any) {
    if (error.code === '42501') {
      console.error('\n❌ Seeding failed due to Row Level Security (RLS).');
      console.error('Because we are using the public ANONYMOUS key, Supabase blocks inserts.');
      console.error('👉 ACTION REQUIRED:');
      console.error('1. Go to your Supabase Dashboard -> SQL Editor');
      console.error('2. Run this command temporarily:');
      console.error('   ALTER TABLE cases DISABLE ROW LEVEL SECURITY;');
      console.error('   ALTER TABLE expert_reviews DISABLE ROW LEVEL SECURITY;');
      console.error('3. Run this seed script again: npx tsx supabase/seed.ts');
      console.error('4. Re-enable RLS afterwards:');
      console.error('   ALTER TABLE cases ENABLE ROW LEVEL SECURITY;');
      console.error('   ALTER TABLE expert_reviews ENABLE ROW LEVEL SECURITY;\n');
    } else {
      console.error('❌ Seeding failed:', error);
    }
  }
}

seed();
