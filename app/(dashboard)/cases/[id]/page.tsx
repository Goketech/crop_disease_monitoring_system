import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import CaseDetailClient from "./case-detail-client";

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const supabase = await createClient();

  // 1. Fetch Case with Farmer Info
  const { data: caseData, error: caseError } = await supabase
    .from('cases')
    .select('*, profiles(full_name, avatar_url)')
    .eq('id', id)
    .single();

  if (caseError || !caseData) {
    return notFound();
  }

  // 2. Fetch Expert Reviews
  const { data: reviews } = await supabase
    .from('expert_reviews')
    .select('*, profiles(full_name)')
    .eq('case_id', id)
    .order('created_at', { ascending: false });

  // 3. Get Current User Role for UI Permissions
  const { data: { user } } = await supabase.auth.getUser();
  let currentUserRole: string | null = null;
  
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    currentUserRole = profile?.role || null;
  }

  return (
    <CaseDetailClient 
      caseData={caseData} 
      reviews={reviews || []} 
      currentUserRole={currentUserRole}
    />
  );
}
