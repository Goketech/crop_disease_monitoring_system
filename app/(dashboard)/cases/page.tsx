import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import { redirect } from "next/navigation";
import CasesClientModule from "./cases-client";

export default async function CasesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient();
  const resolvedSearchParams = await searchParams;
  const initialSearch = (resolvedSearchParams.search as string) || "";
  const filter = (resolvedSearchParams.filter as string) || "";

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/login');

  // Get user role
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  const isAgronomist = profile?.role === 'agronomist';

  let query: any;
  
  if (isAgronomist) {
    // Agronomists see cases they've reviewed or resolved
    // We join with expert_reviews and filter by their id
    query = supabase
      .from('cases')
      .select('*, expert_reviews!inner(expert_id)')
      .eq('expert_reviews.expert_id', user.id);
  } else {
    // Farmers see their own cases
    query = supabase
      .from('cases')
      .select('*')
      .eq('farmer_id', user.id);
  }

  // Apply Stat Card Filters
  if (filter === 'active') {
    query = query.neq('status', 'Resolved');
  } else if (filter === 'reviewed') {
    query = query.eq('status', 'Reviewed');
  } else if (filter === 'critical') {
    query = query.eq('urgency', 'Critical');
  }

  const { data: cases, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching cases:", error);
  }

  // Format the data
  const formattedCases = (cases || []).map((c: any) => ({
    id: c.id,
    crop: c.crop,
    disease: c.disease || "Pending",
    conf: c.confidence ? `${c.confidence}%` : "N/A",
    urgency: c.urgency,
    status: c.status,
    date: format(new Date(c.created_at), "MMM dd, yyyy"),
    raw_status: c.status,
    raw_urgency: c.urgency
  }));

  return (
    <CasesClientModule 
      initialCases={formattedCases} 
      initialSearch={initialSearch} 
      initialFilter={filter}
      userRole={profile?.role || 'farmer'}
    />
  );
}
