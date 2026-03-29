import { createClient } from "@/lib/supabase/server";
import { formatDistanceToNow } from "date-fns";
import ExpertsClient from "./experts-client";
import { redirect } from "next/navigation";

export default async function ExpertsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/login');

  // Verify role (only agronomists and admins can see this)
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role === 'farmer') {
    return redirect('/dashboard');
  }

  // Fetch all cases pending review (cross-farmer)
  const { data: cases, error } = await supabase
    .from('cases')
    .select('*, farmer:profiles!farmer_id(full_name)')
    .eq('status', 'Pending Review')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching cases:", error);
  }

  const formattedCases = (cases || []).map(c => ({
    id: c.id,
    crop: c.crop,
    disease: c.disease || "Pending",
    farmer_name: (c.farmer as any)?.full_name || "Unknown Farmer",
    location: "Remote Submission", // In a real app, this would be from farmer profile or case metadata
    time_ago: formatDistanceToNow(new Date(c.created_at), { addSuffix: true }),
    urgency: c.urgency,
    image: c.image_urls?.[0] || "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=200&h=200",
    created_at: c.created_at
  }));

  return <ExpertsClient initialCases={formattedCases} />;
}
