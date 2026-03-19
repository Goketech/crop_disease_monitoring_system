import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AnalyticsClient, { type MonthlyPoint, type Trend, type Hotspot } from "./analytics-client";
import {
  eachMonthOfInterval,
  endOfMonth,
  format,
  startOfMonth,
  subMonths,
  subDays,
} from "date-fns";

type CaseRow = {
  id: string;
  crop: string;
  disease: string | null;
  status: string;
  urgency: string;
  location: string | null;
  created_at: string;
  farmer_id: string;
};

function buildTrend(current: number, previous: number): Trend {
  if (previous === 0 && current === 0) return { percent: 0, direction: "flat" };
  if (previous === 0) return { percent: 100, direction: "up" };
  const raw = Math.round(((current - previous) / previous) * 100);
  if (raw === 0) return { percent: 0, direction: "flat" };
  return { percent: Math.abs(raw), direction: raw > 0 ? "up" : "down" };
}

function resolutionRateForCases(cases: CaseRow[]): number {
  if (cases.length === 0) return 0;
  const resolved = cases.filter((c) => c.status === "Resolved").length;
  return Math.round((resolved / cases.length) * 100);
}

export default async function AnalyticsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();

  if (profile?.role !== "admin") {
    return redirect("/dashboard");
  }

  const { data: casesRaw } = await supabase.from("cases").select("*").order("created_at", { ascending: true });
  const { data: profiles } = await supabase.from("profiles").select("id, role, created_at");

  const cases = (casesRaw || []) as CaseRow[];

  const totalCases = cases.length;
  const farmerProfiles = profiles?.filter((p) => p.role === "farmer") || [];
  const expertCount = profiles?.filter((p) => p.role === "agronomist").length || 0;

  const cropStats = cases.reduce((acc: Record<string, number>, c) => {
    acc[c.crop] = (acc[c.crop] || 0) + 1;
    return acc;
  }, {});

  const topDiseases = Object.entries(cropStats)
    .map(([name, count]) => ({
      name,
      cases: count as number,
      share: totalCases > 0 ? Math.round(((count as number) / totalCases) * 100) : 0,
    }))
    .sort((a, b) => b.cases - a.cases)
    .slice(0, 4);

  const now = new Date();
  const last30Start = subDays(now, 30);
  const prev30Start = subDays(now, 60);
  const prev30End = last30Start;

  const casesLast30 = cases.filter((c) => new Date(c.created_at) >= last30Start);
  const casesPrev30 = cases.filter((c) => {
    const d = new Date(c.created_at);
    return d >= prev30Start && d < prev30End;
  });

  const farmersLast30 = new Set(casesLast30.map((c) => c.farmer_id)).size;
  const farmersPrev30 = new Set(casesPrev30.map((c) => c.farmer_id)).size;

  const expertsJoinedLast30 =
    profiles?.filter((p) => p.role === "agronomist" && p.created_at && new Date(p.created_at) >= last30Start).length ?? 0;
  const expertsJoinedPrev30 =
    profiles?.filter((p) => p.role === "agronomist" && p.created_at && new Date(p.created_at) >= prev30Start && new Date(p.created_at) < prev30End).length ?? 0;

  const resLast30 = resolutionRateForCases(casesLast30);
  const resPrev30 = resolutionRateForCases(casesPrev30);
  const resTrendPct =
    resPrev30 === 0 && resLast30 === 0 ? 0 : resPrev30 === 0 ? resLast30 : Math.round(resLast30 - resPrev30);
  const resTrend: Trend =
    resTrendPct === 0 ? { percent: 0, direction: "flat" } : resTrendPct > 0 ? { percent: Math.abs(resTrendPct), direction: "up" } : { percent: Math.abs(resTrendPct), direction: "down" };

  const monthEnd = endOfMonth(now);
  const monthStart = startOfMonth(subMonths(now, 11));
  const monthInterval = eachMonthOfInterval({ start: monthStart, end: monthEnd });

  const monthlySubmissions: MonthlyPoint[] = monthInterval.map((m) => {
    const key = format(m, "yyyy-MM");
    const count = cases.filter((c) => format(new Date(c.created_at), "yyyy-MM") === key).length;
    return { label: format(m, "MMM"), count };
  });

  const locCounts = cases.reduce((acc: Record<string, number>, c) => {
    const loc = c.location?.trim();
    if (!loc) return acc;
    acc[loc] = (acc[loc] || 0) + 1;
    return acc;
  }, {});

  const hotspots: Hotspot[] = Object.entries(locCounts)
    .map(([name, n]) => ({ name, cases: n }))
    .sort((a, b) => b.cases - a.cases)
    .slice(0, 6);

  const exportRows = [...cases]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .map((c) => ({
      id: c.id,
      crop: c.crop,
      disease: c.disease,
      status: c.status,
      urgency: c.urgency,
      location: c.location,
      created_at: c.created_at,
    }));

  return (
    <AnalyticsClient
      stats={{
        totalDiagnoses: totalCases,
        activeFarmers: farmerProfiles.length,
        expertValidators: expertCount,
        resolutionRate: totalCases > 0 ? Math.round((cases.filter((c) => c.status === "Resolved").length / totalCases) * 100) : 0,
        topDiseases,
      }}
      monthlySubmissions={monthlySubmissions}
      trends={{
        diagnoses: buildTrend(casesLast30.length, casesPrev30.length),
        farmers: buildTrend(farmersLast30, farmersPrev30),
        experts: buildTrend(expertsJoinedLast30, expertsJoinedPrev30),
        resolution: resTrend,
      }}
      hotspots={hotspots}
      exportRows={exportRows}
    />
  );
}
