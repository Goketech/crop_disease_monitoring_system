import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AnalyticsClient from "./analytics-client";

export default async function AnalyticsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/login');

  // Role check
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return redirect('/dashboard');
  }

  // Fetch real stats
  const { data: cases } = await supabase.from('cases').select('*');
  const { data: profiles } = await supabase.from('profiles').select('role');
  const { data: reviews } = await supabase.from('expert_reviews').select('*');

  // Calculate metrics
  const totalCases = cases?.length || 0;
  const farmerCount = profiles?.filter(p => p.role === 'farmer').length || 0;
  const expertCount = profiles?.filter(p => p.role === 'agronomist').length || 0;
  const resolvedCount = cases?.filter(c => c.status === 'Resolved').length || 0;
  
  // Distinguish by crop
  const cropStats = (cases || []).reduce((acc: any, c) => {
    acc[c.crop] = (acc[c.crop] || 0) + 1;
    return acc;
  }, {});

  const topDiseases = Object.entries(cropStats)
    .map(([name, count]) => ({ name, cases: count as number, share: Math.round(((count as number) / totalCases) * 100) || 0 }))
    .sort((a, b) => b.cases - a.cases)
    .slice(0, 4);

  return (
    <AnalyticsClient 
      stats={{
        totalDiagnoses: totalCases,
        activeFarmers: farmerCount,
        expertValidators: expertCount,
        resolutionRate: totalCases > 0 ? Math.round((resolvedCount / totalCases) * 100) : 0,
        topDiseases
      }}
    />
  );
}

