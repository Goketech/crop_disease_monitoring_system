"use client";

import React, { useState } from "react";
import { Search, Sparkles, UserCheck, Leaf, CheckCircle2, AlertCircle, Loader2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { updateCaseStatus } from "@/app/actions/cases";
import { useRouter } from "next/navigation";

interface CaseFormatted {
  id: string;
  crop: string;
  disease: string;
  conf: string;
  urgency: string;
  status: string;
  date: string;
  raw_status: string;
  raw_urgency: string;
}

export default function CasesClientModule({
  initialCases,
  initialSearch,
  initialFilter,
  userRole
}: {
  initialCases: CaseFormatted[];
  initialSearch: string;
  initialFilter: string;
  userRole: string;
}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [activeStatus, setActiveStatus] = useState<string | null>(
    initialFilter === 'reviewed' ? 'Reviewed' : null
  );
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const isFarmer = userRole === 'farmer';
  const isAgronomist = userRole === 'agronomist';

  // Filters based on role
  // Farmer: Analyzed, Pending Review, Reviewed, Resolved (Submitted removed)
  // Agronomist: Reviewed, Resolved (Analyzed, Pending Review, Submitted removed)
  const availableStatuses = isFarmer 
    ? ["Submitted", "Analyzed", "Pending Review", "Reviewed", "Resolved"]
    : ["Reviewed", "Resolved"];

  const handleStatusUpdate = async (caseId: string, newStatus: string) => {
    setIsUpdating(caseId);
    try {
      await updateCaseStatus(caseId, newStatus);
      router.refresh();
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status.");
    } finally {
      setIsUpdating(null);
    }
  };

  const handleExport = () => {
    const headers = ["Case ID", "Crop", "Diagnosis", "Confidence", "Urgency", "Status", "Date"];
    const rows = filteredCases.map(c => [
      c.id,
      c.crop,
      c.disease,
      c.conf,
      c.urgency,
      c.status,
      c.date
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `plantmd_cases_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredCases = initialCases.filter(c => {
    const matchesSearch = c.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.disease.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = activeStatus ? c.status === activeStatus : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-6 w-full pb-12 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black tracking-tighter text-[#1A5336] uppercase italic">Submission History</h1>
          <p className="text-sm text-muted-foreground font-medium italic">
            {isFarmer ? "Manage your crop diagnoses and expert interactions." : "Review cases you have personally validated."}
          </p>
        </div>
        <Button 
          onClick={handleExport}
          className="bg-[#1A5336] text-white hover:bg-[#113a25] rounded-xl px-6 h-12 font-black uppercase tracking-widest text-[11px] shadow-lg shadow-[#1A5336]/10 transition-all hover:-translate-y-1"
        >
          Export CSV
        </Button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
         {availableStatuses.map((status) => (
           <button
             key={status}
             onClick={() => setActiveStatus(activeStatus === status ? null : status)}
             className={cn(
               "px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border whitespace-nowrap shadow-sm",
               activeStatus === status 
                ? "bg-[#1A5336] text-white border-[#1A5336] shadow-md shadow-[#1A5336]/20" 
                : "bg-white text-muted-foreground border-border/60 hover:border-[#1A5336]/40 hover:text-[#1A5336]"
             )}
           >
             {status}
           </button>
         ))}
      </div>

      <Card className="bg-white p-0 rounded-[40px] border-none shadow-2xl shadow-black/5 overflow-hidden flex flex-col">
        {/* Table Filters */}
        <div className="p-8 border-b border-border/30 flex flex-col md:flex-row md:items-center justify-between bg-[#fcfdfc] gap-6">
          <div className="relative w-full md:w-[450px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#1A5336]/40" />
            <Input 
              placeholder="Search by ID, crop, or specific pathology..." 
              className="pl-11 h-14 bg-white border-border/40 rounded-2xl font-bold text-[#1A5336] shadow-inner focus-visible:ring-[#1A5336] transition-all" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#1A5336]/60 bg-[#1A5336]/5 px-5 py-2.5 rounded-full border border-[#1A5336]/10">
            <span className="h-2 w-2 rounded-full bg-[#1A5336] animate-pulse" />
            {filteredCases.length} result{filteredCases.length !== 1 ? 's' : ''} matched
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] uppercase bg-[#f8faf9] text-[#1A5336]/40 font-black tracking-[0.2em] border-b border-border/30">
              <tr>
                <th className="px-8 py-6">ID</th>
                <th className="px-8 py-6">Crop Focus</th>
                <th className="px-8 py-6">AI Diagnosis</th>
                <th className="px-8 py-6">Conf.</th>
                <th className="px-8 py-6">Priority</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6">Logged At</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {filteredCases.map((c) => (
                <tr key={c.id} className="hover:bg-[#fbfcfa] transition-colors group">
                  <td className="px-8 py-7">
                    <Link href={`/cases/${c.id}`} className="font-black text-[#1A5336] hover:text-[#6cdba1] transition-colors tracking-tighter">
                      #{c.id.length > 20 ? `${c.id.slice(0, 18)}…` : c.id}
                    </Link>
                  </td>
                  <td className="px-8 py-7">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#1A5336] text-white p-2 rounded-xl shadow-lg shadow-[#1A5336]/10 transition-transform group-hover:scale-110">
                        <Leaf className="h-4 w-4" />
                      </div>
                      <span className="font-black text-[13px] text-[#1A5336] uppercase tracking-tight">{c.crop}</span>
                    </div>
                  </td>
                  <td className="px-8 py-7 text-foreground font-black italic text-sm tracking-tight">{c.disease}</td>
                  <td className="px-8 py-7 font-mono text-[10px] font-black text-primary/60">{c.conf}</td>
                  <td className="px-8 py-7">
                    <span className={cn(
                      "px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm border",
                      c.urgency === 'Critical' ? 'bg-red-50 text-red-600 border-red-100' :
                        c.urgency === 'High' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                          c.urgency === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                            'bg-green-50 text-green-600 border-green-100'
                    )}>
                      {c.urgency}
                    </span>
                  </td>
                  <td className="px-8 py-7">
                    <div className="flex items-center gap-2">
                       {c.status === 'Submitted' ? (
                        <Clock className="h-4 w-4 text-amber-600" />
                      ) : c.status === 'Analyzed' ? (
                        <Sparkles className="h-4 w-4 text-[#6cdba1]" />
                      ) : c.status === 'Pending Review' ? (
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                      ) : c.status === 'Reviewed' ? (
                        <UserCheck className="h-4 w-4 text-blue-500" />
                      ) : c.status === 'Resolved' ? (
                        <CheckCircle2 className="h-4 w-4 text-[#1A5336]" />
                      ) : null}
                      <span className="text-muted-foreground font-black uppercase text-[10px] tracking-widest">{c.status}</span>
                    </div>
                  </td>
                  <td className="px-8 py-7 text-[#1A5336]/40 font-black text-[10px] uppercase tracking-wider">{c.date}</td>
                  <td className="px-8 py-7 text-right">
                    <div className="flex items-center justify-end gap-3">
                      {/* Contextual Action Buttons - FARMWORKS ONLY FOR RESOLUTION */}
                      {isFarmer && c.status === 'Submitted' && (
                        <Button
                          onClick={() => handleStatusUpdate(c.id, 'Pending Review')}
                          disabled={isUpdating === c.id}
                          className="h-10 px-4 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-amber-500/20"
                        >
                          {isUpdating === c.id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Escalate to expert"}
                        </Button>
                      )}

                      {isFarmer && c.status === 'Analyzed' && (
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => handleStatusUpdate(c.id, 'Pending Review')}
                            disabled={isUpdating === c.id}
                            className="h-10 px-4 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-amber-500/20"
                          >
                            {isUpdating === c.id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Request Review"}
                          </Button>
                          <Button 
                            onClick={() => handleStatusUpdate(c.id, 'Resolved')}
                            disabled={isUpdating === c.id}
                            variant="outline"
                            className="h-10 px-4 rounded-xl border-[#1A5336] text-[#1A5336] hover:bg-[#1A5336]/5 text-[10px] font-black uppercase tracking-widest"
                          >
                            {isUpdating === c.id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Resolve Now"}
                          </Button>
                        </div>
                      )}
                      
                      {isFarmer && c.status === 'Reviewed' && (
                        <Button 
                          onClick={() => handleStatusUpdate(c.id, 'Resolved')}
                          disabled={isUpdating === c.id}
                          className="h-10 px-6 rounded-xl bg-[#1A5336] hover:bg-[#113a25] text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#1A5336]/20 transition-all hover:-translate-y-1"
                        >
                          {isUpdating === c.id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Accept & Resolve"}
                        </Button>
                      )}

                      <Link href={`/cases/${c.id}`}>
                        <Button variant="ghost" className="h-10 px-4 rounded-xl border border-transparent hover:border-border/60 hover:bg-white text-[10px] font-black uppercase tracking-widest transition-all">
                          Details
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCases.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center gap-8">
                      <div className="h-24 w-24 bg-[#1A5336]/5 rounded-full flex items-center justify-center border-2 border-dashed border-[#1A5336]/10">
                        <Search className="h-8 w-8 text-[#1A5336] opacity-10" />
                      </div>
                      <div className="flex flex-col gap-2 max-w-sm">
                         <p className="font-black text-[#1A5336] text-2xl tracking-tighter uppercase italic">No Matches Detected</p>
                         <p className="text-sm text-muted-foreground font-medium italic leading-relaxed">Adjust your filters or query to find the specific pathology reports you're looking for.</p>
                      </div>
                      <Button variant="outline" onClick={() => { setSearchQuery(""); setActiveStatus(null); }} className="h-12 border-[#1A5336]/20 text-[#1A5336] font-black uppercase text-[10px] tracking-[0.3em] px-10 rounded-2xl hover:bg-[#1A5336]/5 transition-all">
                        Reset All Parameters
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
