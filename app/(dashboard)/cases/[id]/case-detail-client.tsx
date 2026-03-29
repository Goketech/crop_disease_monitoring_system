"use client";

import { 
  ArrowLeft, Leaf, Calendar, ShieldCheck, Sparkles, UserCheck, MessageSquare, Download, Share2, CheckCircle2, Loader2, Save
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageModal } from "@/components/ui/image-modal";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitExpertReview } from "@/app/actions/cases";

interface CaseDetailProps {
  caseData: any;
  reviews: any[];
  currentUserRole: string | null;
}

export default function CaseDetailClient({ caseData: initialCase, reviews: initialReviews, currentUserRole }: CaseDetailProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  // Local state to show updates instantly
  const [caseData, setCaseData] = useState(initialCase);
  const [reviews, setReviews] = useState(initialReviews);

  const [reviewForm, setReviewForm] = useState({
    clinical_observations: "",
    treatment_plan: "",
    severity: "Medium"
  });

  const handleExport = () => {
    alert(`Generating PDF report for ${caseData.id}... Download will start in a moment.`);
  };

  const handleReviewSubmit = async () => {
    if (!reviewForm.clinical_observations || !reviewForm.treatment_plan) {
      alert("Please provide both observations and a treatment plan.");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitExpertReview(caseData.id, reviewForm);
      
      // Update local state temporarily for instant feedback
      setReviews([{
        ...reviewForm,
        created_at: new Date().toISOString(),
        profiles: { full_name: "You" }
      }, ...reviews]);
      setCaseData({ ...caseData, status: 'Reviewed' });
      setShowReviewForm(false);
      
      router.refresh(); // Sync with server for real data
      alert("Expert review successfully submitted!");
    } catch (error: any) {
      console.error("Review Error:", error);
      alert(`Error submitting review: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isExpert = currentUserRole === 'admin' || currentUserRole === 'agronomist';
  const hasReview = reviews && reviews.length > 0;
  const latestReview = hasReview ? reviews[0] : null;

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto pb-12">
      {/* Header / Breadcrumbs */}
      <div className="flex flex-col gap-4">
        <Link 
          href="/cases" 
          className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Submission History
        </Link>
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black tracking-tight text-foreground line-clamp-1">
                {caseData.crop} Analysis: {caseData.id}
              </h1>
              <Badge className={cn(
                "font-bold uppercase text-[10px]",
                caseData.urgency === 'Critical' ? "bg-red-100 text-red-700 border-red-200" :
                caseData.urgency === 'High' ? "bg-orange-100 text-orange-700 border-orange-200" :
                "bg-blue-100 text-blue-700 border-blue-200"
              )}>
                {caseData.urgency}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-muted-foreground font-black uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-primary" /> {format(new Date(caseData.created_at), "MMM dd, yyyy")}</span>
              <span className="flex items-center gap-1.5"><Leaf className="h-4 w-4 text-primary" /> {caseData.crop}</span>
              <span className="flex items-center gap-1.5">
                <span className={cn("h-2 w-2 rounded-full", caseData.status === 'Complete' ? "bg-green-500" : "bg-amber-500")}></span>
                {caseData.status}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" className="rounded-full bg-white border-border/50 h-11 w-11 shadow-sm">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              onClick={handleExport}
              className="rounded-full bg-white border-border/50 px-6 h-11 font-bold shadow-sm hover:bg-muted transition-colors"
            >
              <Download className="h-4 w-4 mr-2" /> Export PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Photos Section */}
          <section className="flex flex-col gap-4">
            <h3 className="text-xs font-black uppercase text-muted-foreground tracking-widest pl-1">Attached Photos</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {caseData.image_urls?.map((img: string, i: number) => (
                <div key={i} className="aspect-square rounded-[32px] overflow-hidden border border-border/40 relative group shadow-sm bg-muted/20">
                  <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={`Crop view ${i+1}`} />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px]">
                    <ImageModal src={img} alt={`Crop view ${i+1}`} />
                  </div>
                </div>
              ))}
              {(!caseData.image_urls || caseData.image_urls.length === 0) && (
                <div className="col-span-full border-2 border-dashed border-border/20 rounded-[32px] p-12 flex flex-col items-center justify-center text-muted-foreground">
                  <Leaf className="h-10 w-10 opacity-20 mb-2" />
                  <p className="text-sm font-bold">No photos attached</p>
                </div>
              )}
            </div>
          </section>

          {/* AI Diagnosis Result */}
          {caseData.status === 'Analyzed' || caseData.status === 'Complete' || caseData.status === 'Reviewed' ? (
             <section className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
               <h3 className="text-xs font-black uppercase text-muted-foreground tracking-widest pl-1 flex items-center gap-2">
                 <Sparkles className="h-4 w-4 text-primary" /> AI Diagnosis Result
               </h3>
               <Card className="p-10 rounded-[48px] border-none bg-white shadow-md flex flex-col gap-8">
                 <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-border/40 pb-8">
                   <div className="flex flex-col gap-1">
                     <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Detection</span>
                     <h4 className="text-3xl font-black text-[#1A5336] italic leading-tight">{caseData.disease || "Running Scan..."}</h4>
                     <p className="text-sm text-muted-foreground font-bold italic opacity-60">Pathology Analysis Engine v1.5</p>
                   </div>
                   <div className="flex flex-col items-end gap-3 bg-primary/5 p-4 rounded-3xl border border-primary/10">
                      <div className="flex items-center gap-3">
                         <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Confidence Score</span>
                         <span className="text-3xl font-black text-primary tracking-tighter">{caseData.confidence ? `${caseData.confidence}%` : "—"}</span>
                      </div>
                   </div>
                 </div>

                 {caseData.treatment_plan && (
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                           <ShieldCheck className="h-4 w-4 text-primary" />
                           <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">AI-Recommended Remediations</span>
                        </div>
                        <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 text-sm font-bold text-[#1A5336] leading-relaxed">
                           {caseData.treatment_plan}
                        </div>
                    </div>
                 )}
               </Card>
             </section>
          ) : null}

          {/* Expert Review Section */}
          <section className="flex flex-col gap-4">
            <h3 className="text-xs font-black uppercase text-muted-foreground tracking-widest pl-1 flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-[#1A5336]" /> Expert Review
            </h3>
            {hasReview ? (
               <Card className="p-10 rounded-[48px] border-none bg-white shadow-md flex flex-col gap-8">
                 <div className="flex items-center gap-4 border-b border-border/40 pb-6">
                    <Avatar className="h-12 w-12 border-2 border-primary/20">
                      <AvatarImage src={`https://i.pravatar.cc/150?u=${latestReview.expert_id}`} />
                      <AvatarFallback>E</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                       <span className="text-sm font-black text-foreground">Verified Expert Review</span>
                       <span className="text-xs text-muted-foreground font-medium">{format(new Date(latestReview.created_at), "PPP")}</span>
                    </div>
                    <Badge className="ml-auto bg-green-100 text-green-700 border-none font-black uppercase text-[10px]">Verified</Badge>
                 </div>
                 <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                       <h5 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Clinical Observations</h5>
                       <p className="text-[15px] text-foreground font-medium leading-relaxed italic">{latestReview.clinical_observations}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                       <h5 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Recommended Treatment Plan</h5>
                       <div className="bg-[#1A5336]/5 p-6 rounded-3xl border border-[#1A5336]/10 text-[#1A5336] text-sm font-bold leading-relaxed">
                          {latestReview.treatment_plan}
                       </div>
                    </div>
                 </div>
               </Card>
            ) : showReviewForm ? (
                <Card className="p-10 rounded-[48px] border-none bg-white shadow-xl flex flex-col gap-8 animate-in slide-in-from-bottom-5">
                    <div className="flex flex-col gap-2">
                        <h4 className="text-xl font-black text-[#1A5336] tracking-tight">Expert Resolution Form</h4>
                        <p className="text-xs text-muted-foreground font-medium">Please provide a technical diagnosis and specific remedial actions.</p>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-3">
                            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Clinical Observations</label>
                            <textarea 
                                rows={4}
                                value={reviewForm.clinical_observations}
                                onChange={(e) => setReviewForm({ ...reviewForm, clinical_observations: e.target.value })}
                                placeholder="Describe the specific pathogen indicators, nutrient deficiencies, or pest presence..."
                                className="w-full rounded-3xl border-2 border-border/40 bg-[#fbfcfa] px-6 py-5 text-sm font-medium focus:border-primary/50 outline-none transition-all placeholder:text-muted-foreground/30 italic"
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Treatment & Remediations</label>
                            <textarea 
                                rows={4}
                                value={reviewForm.treatment_plan}
                                onChange={(e) => setReviewForm({ ...reviewForm, treatment_plan: e.target.value })}
                                placeholder="Step-by-step instructions for the farmer (e.g., fungicides, fertilization, pruning)..."
                                className="w-full rounded-3xl border-2 border-border/40 bg-[#fbfcfa] px-6 py-5 text-sm font-medium focus:border-primary/50 outline-none transition-all placeholder:text-muted-foreground/30 font-bold text-[#1A5336]"
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Confirmed Severity</label>
                            <div className="flex items-center gap-2 p-1 bg-[#f8faf9] rounded-2xl border border-border/40">
                                {["Low", "Medium", "High", "Critical"].map((sev) => (
                                    <button 
                                        key={sev}
                                        onClick={() => setReviewForm({ ...reviewForm, severity: sev })}
                                        className={cn(
                                            "flex-1 h-10 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all",
                                            reviewForm.severity === sev ? "bg-[#1A5336] text-white shadow-md" : "text-muted-foreground hover:bg-white/50"
                                        )}
                                    >
                                        {sev}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-4">
                            <Button 
                                onClick={handleReviewSubmit}
                                disabled={isSubmitting}
                                className="flex-1 bg-[#1A5336] text-white hover:bg-[#113a25] rounded-2xl h-14 font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                            >
                                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Save className="h-4 w-4 mr-2" /> Submit Validation</>}
                            </Button>
                            <Button 
                                variant="outline" 
                                onClick={() => setShowReviewForm(false)}
                                className="rounded-2xl h-14 px-8 font-black uppercase tracking-widest border-border/50 hover:bg-muted"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </Card>
            ) : (
               <Card className="p-10 rounded-[48px] border-dashed border-2 border-border/40 bg-[#fbfcfa] flex flex-col items-center justify-center text-center py-16 gap-6">
                  <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-xl border border-border/20 group hover:scale-110 transition-transform cursor-pointer relative">
                     <UserCheck className="h-10 w-10 text-[#1A5336]" />
                     <div className="absolute inset-0 rounded-full animate-ping bg-primary/10 -z-10" />
                  </div>
                  <div className="max-w-md">
                    <h4 className="text-xl font-black text-foreground tracking-tight">Awaiting Expert Review</h4>
                    <p className="text-sm text-muted-foreground mt-3 font-medium leading-relaxed italic">
                      {isExpert 
                        ? "As an expert, you can review this case and provide clinical observations." 
                        : "Your case is in the queue. Our agronomists will provide a detailed review within 24 hours."}
                    </p>
                  </div>
                  {isExpert && (
                    <Button 
                      className="bg-[#1A5336] text-white hover:bg-[#113a25] rounded-full px-10 h-12 font-bold shadow-lg"
                      onClick={() => setShowReviewForm(true)}
                    >
                      Process Review
                    </Button>
                  )}
               </Card>
            )}
          </section>
        </div>

        {/* Sidebar: Right Column */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <Card className="p-8 rounded-[40px] border-none bg-white shadow-sm flex flex-col gap-8">
            <h3 className="text-xs font-black uppercase text-muted-foreground tracking-widest pl-1">Case Metadata</h3>
            <div className="flex flex-col gap-6">
              {[
                { label: "Submitted By", value: case_user_name(caseData) },
                { label: "Detected Disease", value: caseData.disease || "Pending" },
                { label: "Location", value: caseData.location || "Default Patch" },
                { label: "Urgency Level", value: caseData.urgency }
              ].map((item, i) => (
                <div key={i} className="flex flex-col gap-1.5 border-b border-border/40 last:border-0 pb-4 last:pb-0">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{item.label}</span>
                  <span className="text-sm font-bold text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </Card>

          {caseData.farmer_notes && (
            <Card className="p-8 rounded-[40px] border-none bg-[#0B2A1C] text-white shadow-xl flex flex-col gap-4">
              <h3 className="text-[10px] font-black uppercase text-white/50 tracking-widest flex items-center gap-2">
                <MessageSquare className="h-3.5 w-3.5" /> Farmer Notes
              </h3>
              <p className="text-sm text-white/90 leading-relaxed italic font-medium">
                "{caseData.farmer_notes}"
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function case_user_name(data: any) {
    if (data.profiles && data.profiles.full_name) return data.profiles.full_name;
    return "Farmer User";
}
