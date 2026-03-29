import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import TeamClientModule from "./team-client";

export default async function TeamManagementPage() {
  const supabase = await createClient();
  
  // Fetch profiles that are admins or agronomists
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .in('role', ['admin', 'agronomist'])
    .order('created_at', { ascending: false });

  const formattedMembers = (profiles || []).map(p => ({
    name: p.full_name || p.email.split('@')[0],
    email: p.email,
    role: p.role === 'admin' ? "Admin" : "Agronomist",
    status: "Active", // Hardcoded for now as we don't have a status column yet
    joined: format(new Date(p.created_at), "MMM yyyy")
  }));

  return <TeamClientModule initialMembers={formattedMembers} />;
}
