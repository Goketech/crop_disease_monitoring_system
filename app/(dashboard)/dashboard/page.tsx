import { ArrowUpRight, UploadCloud, ChevronRight, FileText, Leaf, Play, Square, Pause, Plus } from "lucide-react";
import { redirect } from "next/navigation";
import { DashboardHeaderActions } from "./header-actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { format, subDays, startOfToday } from "date-fns";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const role = profile?.role || 'farmer';

  // 1. Agronomists don't have a dashboard - direct to Review Queue
  if (role === 'agronomist') {
    return redirect('/experts');
  }

  // 2. Fetch All Relevant Data for the Current User
  const { data: cases } = await (role === 'farmer' 
    ? supabase.from('cases').select('*').eq('farmer_id', user.id)
    : supabase.from('cases').select('*')
  ).order('created_at', { ascending: false });

  const typedCases = cases || [];

  // 3. Calculate Stats
  const totalCases = typedCases.length;
  const activeCases = typedCases.filter(c => c.status !== 'Resolved').length;
  const reviewedCasesCount = typedCases.filter(c => c.status === 'Reviewed').length;
  const criticalCases = typedCases.filter(c => c.urgency === 'Critical').length;

  // 4. Farmer-specific data (Recent Cases)
  const recentCases = typedCases.slice(0, 4).map(c => ({
    id: c.id,
    target: `${c.crop} - ${c.disease || "Pending"}`,
    date: format(new Date(c.created_at), "MMM dd, yyyy"),
    color: c.urgency === 'Critical' ? "bg-red-500" :
           c.urgency === 'High' ? "bg-orange-500" :
           c.urgency === 'Medium' ? "bg-amber-400" : "bg-[#1A5336]",
    icon: Leaf
  }));

  // 5. Generate Chart Data (Last 7 Days) - Submissions vs Resolved
  // We use absolute YYYY-MM-DD strings to ensure matching works regardless of TZ
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const dayDate = subDays(new Date(), 6 - i);
    const dayStr = dayDate.toISOString().split('T')[0]; // Robust YYYY-MM-DD
    
    // Exact match on Normalized Date String
    const daySubmissions = typedCases.filter(c => {
      try {
        const caseDate = new Date(c.created_at).toISOString().split('T')[0];
        return caseDate === dayStr;
      } catch (e) {
        return false;
      }
    }).length;

    const dayResolved = typedCases.filter(c => {
      try {
        const caseDate = new Date(c.created_at).toISOString().split('T')[0];
        return caseDate === dayStr && c.status === 'Resolved';
      } catch (e) {
        return false;
      }
    }).length;

    return {
      day: format(dayDate, "EEE"),
      submissions: daySubmissions,
      resolved: dayResolved,
    };
  });

  // Scale for chart height (highest bar becomes ~90%)
  const maxVal = Math.max(...chartData.map(d => Math.max(d.submissions, d.resolved)), 1);

  return (
    <div className="flex flex-col gap-10 w-full pb-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-black tracking-tighter text-[#1A5336] uppercase italic">
             My Dashboard
          </h1>
          <p className="text-sm text-muted-foreground italic font-medium">
            Track your crop health and expert validation progress.
          </p>
        </div>
        <DashboardHeaderActions />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 w-full">
        <Link href="/cases" className="group h-full">
          <Card className="bg-[#1A5336] text-white p-7 rounded-[32px] border-none shadow-xl relative overflow-hidden flex flex-col justify-between h-full hover:shadow-2xl transition-all cursor-pointer">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Total Submissions</span>
              <div className="bg-white/10 p-2 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <ArrowUpRight className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <h2 className="text-6xl font-black tracking-tighter">{totalCases}</h2>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs font-bold text-white/80">
              <span className="bg-[#6cdba1]/20 text-[#6cdba1] px-2 py-0.5 rounded-lg text-[10px]">History</span>
              All records
            </div>
          </Card>
        </Link>

        {/* Active Cases */}
        <Link href="/cases?filter=active" className="group h-full">
          <Card className="bg-white p-7 rounded-[32px] border border-border/40 shadow-sm flex flex-col justify-between h-full hover:border-[#1A5336]/40 transition-all">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Active Cases</span>
              <div className="border border-border p-2 text-muted-foreground rounded-full flex items-center justify-center group-hover:bg-[#1A5336]/5 group-hover:text-[#1A5336] transition-colors">
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-4">
              <h2 className="text-6xl font-black text-[#1A5336] tracking-tighter">{activeCases}</h2>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs font-bold text-muted-foreground">
              <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-lg text-[10px] border border-amber-200">Pending</span>
              Need attention
            </div>
          </Card>
        </Link>

        {/* Expert Reviews */}
        <Link href="/cases?filter=reviewed" className="group h-full">
          <Card className="bg-white p-7 rounded-[32px] border border-border/40 shadow-sm flex flex-col justify-between h-full hover:border-[#1A5336]/40 transition-all">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Expert Reviews</span>
              <div className="border border-border p-2 text-muted-foreground rounded-full flex items-center justify-center group-hover:bg-[#1A5336]/5 group-hover:text-[#1A5336] transition-colors">
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-4">
              <h2 className="text-6xl font-black text-[#1A5336] tracking-tighter">{reviewedCasesCount}</h2>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs font-bold text-muted-foreground">
              <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-lg text-[10px] border border-green-200">Verified</span>
              Expert validation
            </div>
          </Card>
        </Link>

        {/* Critical Alerts */}
        <Link href="/cases?filter=critical" className="group h-full">
          <Card className="bg-white p-7 rounded-[32px] border border-border/40 shadow-sm flex flex-col justify-between h-full hover:border-red-400/40 transition-all">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600/60">Critical Alerts</span>
              <div className="border border-border p-2 text-muted-foreground rounded-full flex items-center justify-center group-hover:bg-red-50 group-hover:text-red-600 transition-colors">
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-4">
              <h2 className="text-6xl font-black text-red-600 tracking-tighter">{criticalCases}</h2>
            </div>
            <div className="mt-6 flex items-center gap-2 text-[11px] font-black uppercase text-red-600 tracking-wider">
               Urgent Resolution Required!
            </div>
          </Card>
        </Link>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 w-full">
        <Card className="md:col-span-8 bg-white p-10 rounded-[48px] border border-border/30 shadow-2xl shadow-black/5 flex flex-col min-h-[400px]">
          <div className="flex items-center justify-between mb-10">
            <div className="flex flex-col gap-1">
               <h3 className="font-black text-2xl text-[#1A5336] tracking-tight truncate">Diagnosis Analytics</h3>
               <p className="text-xs text-muted-foreground font-black uppercase tracking-widest opacity-60 italic">Submissions vs Resolved (Last 7 Days)</p>
            </div>
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-2">
                 <div className="h-3 w-3 rounded-full bg-[#1A5336] shadow-sm" />
                 <span className="text-[10px] font-black text-[#1A5336] uppercase tracking-widest">Submissions</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="h-3 w-3 rounded-full bg-[#6cdba1] shadow-sm" />
                 <span className="text-[10px] font-black text-[#6cdba1] uppercase tracking-widest">Resolved</span>
               </div>
            </div>
          </div>
          
          <div className="flex items-end justify-between flex-1 gap-6 mx-2 pb-4 h-72">
            {chartData.map((data, i) => (
              <div key={i} className="flex flex-col items-center gap-6 w-full relative group h-full justify-end">
                <div className="w-full flex gap-1.5 items-end pb-1 relative min-h-[10px] h-full">
                  {/* Case Submissions Bar */}
                  <div 
                    style={{ height: `${data.submissions > 0 ? (data.submissions / maxVal) * 90 : 2}%` }} 
                    className={cn(
                        "flex-1 rounded-t-2xl transition-all duration-700 group-hover:opacity-100",
                        data.submissions > 0 ? "bg-[#1A5336] shadow-lg shadow-[#1A5336]/10" : "bg-muted/10"
                    )} 
                  />
                  {/* Resolved Cases Bar */}
                  <div 
                    style={{ height: `${data.resolved > 0 ? (data.resolved / maxVal) * 90 : 2}%` }} 
                    className={cn(
                        "flex-1 rounded-t-2xl transition-all duration-700 delay-100 group-hover:opacity-100",
                        data.resolved > 0 ? "bg-[#6cdba1] shadow-lg shadow-[#6cdba1]/10" : "bg-muted/5"
                    )} 
                  />
                </div>
                <span className="text-[11px] font-black text-[#1A5336]/40 uppercase tracking-[0.2em]">{data.day}</span>
                
                {/* Tooltip */}
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-black text-white p-3 rounded-2xl text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50 shadow-2xl scale-50 group-hover:scale-100 whitespace-nowrap">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between gap-4">
                        <span className="text-white/60">Submissions:</span>
                        <span>{data.submissions}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-white/60">Resolved:</span>
                        <span>{data.resolved}</span>
                      </div>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Right: Recent Cases */}
        <Card className="md:col-span-4 bg-white p-8 rounded-[48px] border border-border/30 shadow-2xl shadow-black/5 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-black text-xl text-[#1A5336] tracking-tight">Recent Cases</h3>
              <Link href="/diagnose">
                <Button size="sm" className="h-10 rounded-2xl bg-[#1A5336] hover:bg-[#113a25] px-6 font-black uppercase text-[10px] tracking-widest text-white shadow-lg transition-all active:scale-95">
                  Report Case
                </Button>
              </Link>
            </div>
            <div className="flex flex-col gap-4">
              {recentCases.map((item, i) => (
                <Link key={i} href={`/cases/${item.id}`} className="flex items-center gap-4 group p-3 hover:bg-[#1A5336]/5 rounded-3xl transition-all border border-transparent hover:border-[#1A5336]/10">
                  <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-lg", item.color)}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="text-sm font-black text-[#1A5336] group-hover:text-[#113a25] transition-colors line-clamp-1">{item.target}</span>
                    <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-0.5">{item.date}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-[#1A5336]/40 group-hover:text-[#1A5336] transition-all" />
                </Link>
              ))}
              {recentCases.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-[#1A5336]/5 flex items-center justify-center border-2 border-dashed border-[#1A5336]/10">
                    <Leaf className="h-8 w-8 text-[#1A5336] opacity-10" />
                  </div>
                  <p className="text-xs font-black text-muted-foreground uppercase tracking-widest opacity-50 italic">No activity recorded</p>
                </div>
              )}
            </div>
        </Card>
      </div>

      {/* Health Score Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 w-full">
        <Card className="md:col-span-12 bg-[#0B2A1C] p-12 rounded-[56px] border-none shadow-2xl flex flex-col md:flex-row items-center justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#6cdba1]/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <div className="flex flex-col gap-6 relative z-10 max-w-xl">
             <div className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full bg-[#6cdba1] animate-pulse" />
                <span className="text-[11px] font-black uppercase text-white/50 tracking-[0.3em]">Farm Health Index</span>
             </div>
             <h3 className="text-5xl font-black text-white tracking-tighter leading-none">
               Your Farm is Operating at <span className="text-[#6cdba1] italic">85%</span> Efficiency
             </h3>
             <p className="text-sm text-white/40 font-bold leading-relaxed italic pr-8">
               Based on your recent pathology reports and expert validations.
             </p>
             <div className="flex gap-4 mt-4">
                <Link href="/cases">
                   <Button className="bg-[#6cdba1] text-[#0B2A1C] hover:bg-white rounded-2xl h-14 px-10 font-black uppercase tracking-widest text-[11px] transition-all hover:shadow-2xl hover:shadow-[#6cdba1]/20">
                     View All Submissions
                   </Button>
                </Link>
             </div>
          </div>

          <div className="relative flex flex-col items-center mt-12 md:mt-0">
             <div className="relative w-80 h-40 overflow-hidden">
                <div className="absolute top-0 left-0 w-80 h-80 border-[40px] border-white/5 rounded-full" />
                <div className="absolute top-0 left-0 w-80 h-80 border-[40px] border-[#6cdba1] rounded-full border-b-transparent border-r-transparent transform -rotate-45 z-10 shadow-inner" 
                     style={{ clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)" }} />
                <div className="absolute top-[35%] left-1/2 -translate-x-1/2 translate-y-4 flex flex-col items-center">
                   <span className="text-7xl font-black tracking-tighter text-white italic">85</span>
                   <span className="text-[11px] font-black text-[#6cdba1] uppercase tracking-[0.4em] mt-3">Optimal</span>
                </div>
             </div>
          </div>
        </Card>
      </div>

    </div>
  );
}
