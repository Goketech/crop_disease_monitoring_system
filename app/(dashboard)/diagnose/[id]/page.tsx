"use client";

import { CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Download, MessageSquare, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImageModal } from "@/components/ui/image-modal";
import Link from "next/link";

export default function DiagnosisResultPage() {
  const handleDownload = () => {
    alert("Generating your diagnostic report... Your PDF will download shortly.");
  };

  const plantImg = "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=600&h=600";

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black tracking-tight text-foreground">Diagnosis: <span className="text-primary italic">Late Blight</span></h1>
          <p className="text-sm text-muted-foreground font-medium">AI analysis completed for <strong className="text-foreground">Tomato field #4</strong>.</p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleDownload}
          className="rounded-full px-6 h-11 border-border/50 bg-white shadow-sm font-bold hover:bg-muted transition-colors"
        >
          <Download className="h-4 w-4 mr-2" /> Download Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Result Details */}
        <div className="md:col-span-8 flex flex-col gap-8">
          <Card className="p-10 rounded-[40px] border-none bg-white shadow-md relative overflow-hidden">
            <div className="flex flex-col md:flex-row gap-10 items-start">
              <div className="w-full md:w-1/3 aspect-square bg-muted/20 rounded-[32px] overflow-hidden relative group shadow-sm border border-border/20">
                <img 
                  src={plantImg} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  alt="Affected Plant"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px]">
                   <ImageModal src={plantImg} alt="Close up of tomato leaf blight" />
                </div>
                <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                  Detected
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-[#1A5336] bg-[#1A5336]/5 px-4 py-2 rounded-xl border border-[#1A5336]/10 uppercase tracking-widest italic">
                    Phytophthora Infestans
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em] ml-1 opacity-50">Pathogen</span>
                </div>
                
                <div className="flex flex-col gap-3 py-2 bg-[#f8faf9] p-6 rounded-3xl border border-border/40">
                   <div className="flex items-center justify-between text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">
                      <span>AI Confidence Score</span>
                      <span className="text-2xl font-black text-primary tracking-tighter">94.8%</span>
                   </div>
                   <div className="w-full h-3 bg-white rounded-full overflow-hidden shadow-inner border border-border/20">
                      <div className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(26,83,54,0.3)] transition-all duration-1000" style={{ width: '94.8%' }}></div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-5 mt-2">
                   <div className="p-4 bg-white rounded-2xl flex flex-col border border-border/40 shadow-sm group hover:border-red-200 transition-colors">
                      <span className="text-[10px] uppercase font-black text-muted-foreground mb-1 tracking-widest opacity-60">Visual Severity</span>
                      <span className="text-base font-black text-red-600 flex items-center gap-1.5 italic">
                        <AlertTriangle className="h-4 w-4" /> HIGH
                      </span>
                   </div>
                   <div className="p-4 bg-white rounded-2xl flex flex-col border border-border/40 shadow-sm group hover:border-orange-200 transition-colors">
                      <span className="text-[10px] uppercase font-black text-muted-foreground mb-1 tracking-widest opacity-60">Spread Risk</span>
                      <span className="text-base font-black text-orange-600 italic">MODERATE</span>
                   </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <Card className="p-8 rounded-[40px] border-none bg-white shadow-sm overflow-hidden flex flex-col border border-border/20">
                <h3 className="text-xs font-black uppercase text-muted-foreground mb-6 flex items-center gap-3 tracking-[0.2em]">
                   <CheckCircle2 className="h-5 w-5 text-primary" /> Symptoms Found
                </h3>
                <ul className="flex flex-col gap-5">
                   {['Wavy dark spots on leaf edges', 'White fuzzy growth in high humidity', 'Dark necrotic lesions on stems', 'Fruit discoloration & rot'].map((s, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-4 leading-relaxed font-medium">
                         <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0 shadow-[0_0_5px_rgba(26,83,54,0.5)]" /> 
                         {s}
                      </li>
                   ))}
                </ul>
             </Card>
             <Card className="p-8 rounded-[40px] border-none bg-[#1A5336]/5 overflow-hidden flex flex-col border border-[#1A5336]/10">
                <h3 className="text-xs font-black uppercase text-[#1A5336] mb-6 flex items-center gap-3 tracking-[0.2em]">
                   <ShieldCheck className="h-5 w-5" /> Recovery Plan
                </h3>
                <ul className="flex flex-col gap-4">
                   {['Remove infected plants immediately', 'Apply curative copper-based fungicide', 'Improve field air circulation / density', 'Switch to drip-based irrigation'].map((a, i) => (
                      <li key={i} className="text-sm text-foreground flex items-start gap-4 leading-relaxed font-bold italic">
                         <div className="mt-2 h-1 w-1 bg-[#1A5336] shrink-0 rotate-45" /> {a}
                      </li>
                   ))}
                </ul>
             </Card>
          </div>
        </div>

        {/* Right Column: Next Steps */}
        <div className="md:col-span-4 flex flex-col gap-8">
           <Card className="bg-[#0B2A1C] text-white p-8 rounded-[40px] border-none shadow-xl shadow-primary/10 relative overflow-hidden flex flex-col min-h-[320px] justify-between group">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay opacity-10" />
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 flex flex-col gap-4">
                <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-[#6cdba1]" />
                </div>
                <h3 className="font-black text-2xl tracking-tight leading-tight">Unsure about the AI Results?</h3>
                <p className="text-sm text-white/60 leading-relaxed italic font-medium">
                  Professional agronomists can verify this analysis and provide a certified treatment plan within 12 hours.
                </p>
              </div>

              <Link href="/experts" className="relative z-10 w-full">
                <Button className="w-full bg-[#3eb579] text-white hover:bg-[#329a65] rounded-2xl font-black text-xs uppercase tracking-widest py-7 shadow-lg shadow-black/20 transition-all hover:scale-[1.02]">
                  Talk to an Expert
                  <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
           </Card>

           <Card className="p-8 rounded-[40px] border-none bg-white shadow-sm flex flex-col border border-border/20">
              <h3 className="text-xs font-black uppercase text-muted-foreground mb-8 tracking-widest pl-1">Historical Context</h3>
              <div className="flex flex-col gap-8">
                 {[
                   { date: "Feb 20", action: "Field Mapping Initialized", icon: CheckCircle2, color: "bg-primary" },
                   { date: "Feb 22", action: "Healthy Baseline Captured", icon: CheckCircle2, color: "bg-[#113a25]" },
                   { date: "Feb 26", action: "Current Diagnosis Session", icon: Sparkles, color: "bg-amber-500" },
                 ].map((h, i) => (
                    <div key={i} className="flex gap-4 relative">
                       {i < 2 && <div className="absolute top-8 left-[19px] w-0.5 h-12 bg-border/20" />}
                       <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${h.color} text-white`}>
                          <h.icon className="h-4 w-4" />
                       </div>
                       <div className="flex flex-col justify-center">
                          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none opacity-40">{h.date}</span>
                          <span className="text-sm font-bold text-foreground mt-1.5">{h.action}</span>
                       </div>
                    </div>
                 ))}
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}
