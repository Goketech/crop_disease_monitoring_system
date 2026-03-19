'use client';

import { TrendingUp, Layers, MousePointer2, Download, TrendingDown, Map, ArrowUpRight, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type Trend = { percent: number; direction: 'up' | 'down' | 'flat' };

export type MonthlyPoint = { label: string; count: number };

export type Hotspot = { name: string; cases: number };

type ExportRow = {
  id: string;
  crop: string;
  disease: string | null;
  status: string;
  urgency: string;
  location: string | null;
  created_at: string;
};

interface AnalyticsProps {
  stats: {
    totalDiagnoses: number;
    activeFarmers: number;
    expertValidators: number;
    resolutionRate: number;
    topDiseases: Array<{ name: string; cases: number; share: number }>;
  };
  monthlySubmissions: MonthlyPoint[];
  trends: {
    diagnoses: Trend;
    farmers: Trend;
    experts: Trend;
    resolution: Trend;
  };
  hotspots: Hotspot[];
  exportRows: ExportRow[];
}

function formatTrend(t: Trend): string {
  if (t.direction === 'flat' || t.percent === 0) return '0%';
  const sign = t.percent > 0 ? '+' : '';
  return `${sign}${t.percent}%`;
}

export default function AnalyticsClient({ stats, monthlySubmissions, trends, hotspots, exportRows }: AnalyticsProps) {
  const maxMonth = Math.max(...monthlySubmissions.map((m) => m.count), 1);

  const handleExport = () => {
    const headers = ["Case ID", "Crop", "Disease", "Status", "Urgency", "Location", "Created At"];
    const rows = exportRows.map((r) => [
      r.id,
      r.crop,
      r.disease ?? "",
      r.status,
      r.urgency,
      r.location ?? "",
      r.created_at,
    ]);
    const csvContent = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `plantmd_platform_export_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const metricCards = [
    { label: "Total Diagnoses", value: stats.totalDiagnoses, trend: trends.diagnoses, icon: Layers },
    { label: "Active Farmers", value: stats.activeFarmers, trend: trends.farmers, icon: MousePointer2 },
    { label: "Expert Validators", value: stats.expertValidators, trend: trends.experts, icon: TrendingUp },
    { label: "Resolution Rate", value: `${stats.resolutionRate}%`, trend: trends.resolution, icon: TrendingUp },
  ];

  return (
    <div className="flex flex-col gap-10 w-full pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-black tracking-tighter text-[#1A5336]">Platform Analytics</h1>
          <p className="text-sm text-muted-foreground italic font-medium">Aggregated trends, species statistics, and expert performance across the platform.</p>
        </div>
        <Button
          onClick={handleExport}
          className="bg-[#1A5336] text-white rounded-2xl font-black h-12 px-8 shadow-xl shadow-[#1A5336]/20 uppercase text-[10px] tracking-widest transition-all active:scale-95"
        >
          <Download className="mr-2 h-4 w-4" /> Export Global Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 w-full">
        {metricCards.map((stat, i) => (
          <Card key={i} className="md:col-span-3 p-6 rounded-[28px] bg-white border-none shadow-sm flex flex-col justify-between h-40 group hover:shadow-md transition-all">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stat.label}</span>
              <div className="h-8 w-8 bg-[#1A5336]/5 rounded-lg flex items-center justify-center text-[#1A5336]">
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <h2 className="text-4xl font-black text-foreground tracking-tighter">{stat.value}</h2>
              <div
                className={cn(
                  "flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg",
                  stat.trend.direction === "up"
                    ? "bg-green-50 text-green-600"
                    : stat.trend.direction === "down"
                      ? "bg-red-50 text-red-600"
                      : "bg-muted text-muted-foreground border border-border/40"
                )}
              >
                {stat.trend.direction === "up" ? (
                  <TrendingUp className="h-3 w-3" />
                ) : stat.trend.direction === "down" ? (
                  <TrendingDown className="h-3 w-3" />
                ) : (
                  <Minus className="h-3 w-3" />
                )}
                {formatTrend(stat.trend)}
                <span className="sr-only">vs prior 30 days</span>
              </div>
            </div>
            <p className="text-[9px] text-muted-foreground font-medium mt-1">vs previous 30 days</p>
          </Card>
        ))}

        <Card className="md:col-span-8 p-10 rounded-[40px] bg-white border-none shadow-sm min-h-[450px] flex flex-col">
          <div className="flex items-center justify-between mb-10">
            <h3 className="font-black text-2xl text-[#1A5336] tracking-tighter">Submission volume</h3>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#1A5336]" />{" "}
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Cases created</span>
              </div>
            </div>
          </div>
          <div className="flex-1 w-full flex items-end justify-between px-2 gap-1 mb-4 min-h-[280px]">
            {monthlySubmissions.map((m, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-4 h-full justify-end group" title={`${m.label}: ${m.count}`}>
                <div
                  style={{ height: `${m.count > 0 ? Math.max(8, (m.count / maxMonth) * 100) : 4}%` }}
                  className="w-full bg-[#1A5336]/10 rounded-xl relative group-hover:bg-[#1A5336] transition-all duration-500 overflow-hidden min-h-[4px]"
                >
                  <div className="absolute inset-x-0 top-0 h-1/2 bg-white/10" />
                </div>
                <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-tighter text-center leading-none">{m.label}</span>
              </div>
            ))}
          </div>
        </Card>

        <div className="md:col-span-4 flex flex-col gap-5">
          <Card className="p-8 rounded-[40px] bg-[#1A5336] text-white border-none shadow-xl shadow-[#1A5336]/10">
            <h3 className="font-black text-xl mb-6 tracking-tight">Species breakdown</h3>
            <div className="flex flex-col gap-6">
              {stats.topDiseases.map((d, i) => (
                <div key={i} className="flex flex-col gap-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white/70 font-bold uppercase tracking-widest">{d.name}</span>
                    <span className="font-black">{d.cases} cases</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#6cdba1] rounded-full" style={{ width: `${d.share}%` }} />
                  </div>
                </div>
              ))}
              {stats.topDiseases.length === 0 && (
                <p className="text-xs text-white/50 italic py-4">No species data available.</p>
              )}
            </div>
          </Card>

          <Card className="p-8 rounded-[40px] bg-white border-none shadow-sm flex-1">
            <h3 className="font-black text-xl mb-6 tracking-tight text-[#1A5336]">Hotspots</h3>
            <div className="flex flex-col gap-2">
              {hotspots.length === 0 && (
                <p className="text-xs text-muted-foreground italic">Add location data on cases to see regional hotspots.</p>
              )}
              {hotspots.map((reg, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-3xl bg-[#f8faf9] border border-transparent hover:border-[#1A5336]/10 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-white rounded-2xl flex items-center justify-center border border-border/40 text-[#1A5336] shadow-sm">
                      <Map className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-sm text-foreground">{reg.name}</span>
                      <span className="text-[10px] text-muted-foreground font-bold">{reg.cases} cases</span>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-[#1A5336] transition-colors" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
