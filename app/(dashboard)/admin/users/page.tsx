import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import AdminUsersClient from "./admin-users-client";
import { redirect } from "next/navigation";

export default async function AdminUsersPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return redirect('/dashboard');
  }

  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching users:", error);
  }

  const formattedUsers = (profiles || []).map(p => ({
    id: p.id,
    full_name: p.full_name || "New User",
    email: p.email,
    role: p.role,
    joined: format(new Date(p.created_at), "MMM dd, yyyy")
  }));

  return <AdminUsersClient initialUsers={formattedUsers} />;
}
