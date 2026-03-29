"use client";

import React, { useState } from "react";
import { 
  ArrowLeft, 
  Leaf, 
  Sparkles, 
  UserCheck, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Stethoscope, 
  ClipboardCheck, 
  History,
  Send,
  Save,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

import { ImageModal } from "@/components/ui/image-modal";

export default function ExpertReviewFormPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [severity, setSeverity] = useState("High");
  const [diagnosis, setDiagnosis] = useState("Late Blight (Confirm AI)");

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate API delay
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/experts/history");
    }, 2000);
  };

  const submissionImg = "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=600&h=600";

  return (
    <div className="flex flex-col gap-8 w-full pb-12 relative">
      {isSubmitting && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-md z-[100] flex flex-col items-center justify-center gap-4">
          <div className="relative">
             <Loader2 className="h-16 w-16 text-[#1A5336] animate-spin" />
             <ShieldCheck className="h-8 w-8 text-[#1A5336] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <div className="text-center">
             <h2 className="text-2xl font-black text-[#1A5336]">Publishing Diagnosis...</h2>
             <p className="text-sm text-muted-foreground font-medium italic mt-1">Notifying farmer and updating regional records.</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link 
          href="/experts" 
          className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Review Queue
        </Link>
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black tracking-tight text-foreground leading-[1.1]">
                Expert Review: <span className="text-primary italic">CAS-001</span>
              </h1>
              <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary rounded-full px-3 py-1 font-bold text-[10px] uppercase">Priority Case</Badge>
            </div>
            <p className="text-sm text-muted-foreground font-medium">Submit findings for <strong>David Obanijesu's</strong> Tomato Field.</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="rounded-2xl bg-white border-border/60 px-6 h-12 font-bold text-xs shadow-sm">
              <Save className="h-4 w-4 mr-2" /> Save Draft
            </Button>
            <Button 
               onClick={handleSubmit}
               className="bg-[#1A5336] text-white hover:bg-[#113a25] rounded-2xl px-8 h-12 font-bold text-xs shadow-lg shadow-[#1A5336]/20"
            >
              <Send className="h-4 w-4 mr-2" /> Publish Review
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Case Reference */}
        <div className="xl:col-span-5 flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase text-muted-foreground tracking-widest pl-1">Farmer Submission</h3>
            <Badge className="bg-muted text-muted-foreground border-none text-[10px] font-bold px-3">Ref: 2026-03-16</Badge>
          </div>

          <Card className="p-0 rounded-[40px] border-none bg-white shadow-md overflow-hidden flex flex-col group">
            <div className="aspect-[4/3] relative bg-muted/20">
               <img 
                 src={submissionImg} 
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                 alt="Submission" 
               />
               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px]">
                  <ImageModal src={submissionImg} alt="Farmer submission plant image" />
               </div>
            </div>
            <div className="p-8 flex flex-col gap-6">
               <div className="flex flex-col gap-3">
                 <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Patient Zero Observations</span>
                 <p className="text-sm text-foreground bg-[#f8faf9] p-5 rounded-2xl border border-border/40 italic leading-relaxed font-medium">
                   "Leaves are turning black and falling off. The stems look rotten near the base. Spreading fast after rain."
                 </p>
               </div>
               <div className="flex gap-2">
                 <Badge variant="outline" className="text-[10px] font-black border-primary/20 bg-primary/5 text-primary rounded-lg px-3 py-1 uppercase">Tomato / Roma</Badge>
                 <Badge variant="outline" className="text-[10px] font-black border-border bg-[#fbfcfa] rounded-lg px-3 py-1 uppercase">Kimironko Sector</Badge>
               </div>
            </div>
          </Card>

          {/* AI Comparison */}
          <Card className="p-8 rounded-[40px] border-none bg-[#1A5336] text-white shadow-xl shadow-primary/10 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
            <div className="relative z-10 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-sm flex items-center gap-2 uppercase tracking-widest text-[#6cdba1]">
                  <Sparkles className="h-4 w-4" /> AI Confidence Scan
                </h4>
                <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black">94.8% Match</div>
              </div>
              <div className="flex flex-col gap-1">
                 <span className="text-3xl font-black italic">Late Blight</span>
                 <span className="text-xs text-white/60 font-medium">Pathogen: Phytophthora infestans</span>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                 <div className="flex flex-col">
                   <span className="text-[10px] font-bold text-white/40 uppercase">Symptom Accuracy</span>
                   <span className="text-lg font-black text-[#6cdba1]">High (4/5)</span>
                 </div>
                 <div className="flex flex-col">
                   <span className="text-[10px] font-bold text-white/40 uppercase">Action Urgent</span>
                   <span className="text-lg font-black text-red-400">IMMEDIATE</span>
                 </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Expert Input Form */}
        <div className="xl:col-span-7 flex flex-col gap-8">
          <h3 className="text-xs font-black uppercase text-muted-foreground tracking-widest">Diagnostic Verdict</h3>

          <Card className="p-10 rounded-[48px] border-none bg-white shadow-md flex flex-col gap-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-3">
                <label className="text-xs font-black uppercase text-muted-foreground tracking-[0.1em] pl-1">Clinical Diagnosis</label>
                <select 
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="flex h-14 w-full rounded-2xl border border-border/60 bg-white px-4 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                >
                  <option>Late Blight (Confirm AI)</option>
                  <option>Early Blight</option>
                  <option>Bacterial Canker</option>
                  <option>Septoria Leaf Spot</option>
                  <option>Other / Referral Needed</option>
                </select>
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-xs font-black uppercase text-muted-foreground tracking-[0.1em] pl-1">Visual Severity</label>
                <div className="flex items-center gap-2 h-14 bg-[#f8faf9] p-1.5 rounded-2xl border border-border/40">
                  {['Low', 'Med', 'High', 'Crit'].map((lv) => (
                    <button 
                      key={lv} 
                      onClick={() => setSeverity(lv)}
                      className={cn(
                        "flex-1 h-full rounded-xl text-[10px] font-black uppercase transition-all tracking-wider",
                        (severity.startsWith(lv)) 
                          ? "bg-white text-[#1A5336] shadow-sm border border-border/40" 
                          : "text-muted-foreground hover:bg-white/50"
                      )}
                    >
                      {lv}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-xs font-black uppercase text-muted-foreground tracking-[0.1em] pl-1">Expert Observations</label>
              <textarea 
                rows={5} 
                className="flex w-full rounded-[24px] border border-border/60 bg-white px-5 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground/50 leading-relaxed shadow-sm"
                placeholder="The concentric rings suggest a secondary fungal infection. Immediate localized pruning is required before fungicide application..."
              />
            </div>

            <div className="flex flex-col gap-6 border-t border-border/40 pt-10">
               <h4 className="text-sm font-black text-[#1A5336] flex items-center gap-2 uppercase tracking-widest">
                 <ShieldCheck className="h-5 w-5" /> Mandatory Recovery Plan
               </h4>
               <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Direct Intervention</label>
                    <Input placeholder="e.g., Copper-based fungicide, Nitro-boost" className="rounded-xl h-12 bg-[#fbfcfa] border-border/60 font-bold text-sm" />
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Environmental Control</label>
                    <textarea 
                      rows={3} 
                      className="flex w-full rounded-xl border border-border/60 bg-[#fbfcfa] px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                      placeholder="e.g., Reduce overnight overhead irrigation. Space rows by +1.5m."
                    />
                  </div>
               </div>
            </div>

            <div className="flex items-center gap-4 p-6 bg-[#1A5336]/5 rounded-3xl border border-[#1A5336]/10">
               <input type="checkbox" className="h-5 w-5 rounded-lg border-primary/40 text-primary focus:ring-primary cursor-pointer" id="followup" defaultChecked />
               <div className="flex flex-col">
                  <label htmlFor="followup" className="text-sm font-bold text-foreground cursor-pointer">Schedule verification visit</label>
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Required within 7 days by protocol</span>
               </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
