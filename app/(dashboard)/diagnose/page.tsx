"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, Image as ImageIcon, Sparkles, UserCheck, X, Loader2, Users, BookOpen, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImageModal } from "@/components/ui/image-modal";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function DiagnosePage() {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisMode, setAnalysisMode] = useState<"ai" | "expert">("ai");
  const [crop, setCrop] = useState("Tomato (Lycopersicon esculentum)");
  const [customCrop, setCustomCrop] = useState("");
  const [notes, setNotes] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedImages((prev) => [...prev, ...filesArray]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (selectedImages.length === 0) return;
    
    setIsAnalyzing(true);
    const supabase = createClient();
    
    try {
      // 1. Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("You must be logged in to submit a case.");
        return;
      }

      // 2. Upload images to Supabase Storage
      const imageUrls: string[] = [];
      for (const file of selectedImages) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { data, error: uploadError } = await supabase.storage
          .from('plant-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('plant-images')
          .getPublicUrl(filePath);
        
        imageUrls.push(publicUrl);
      }

      // 3. Generate Case ID
      const caseId = `CAS-${Math.floor(1000 + Math.random() * 9000)}`;

      // 4. Insert into cases table
      const { error: insertError } = await supabase
        .from('cases')
        .insert({
          id: caseId,
          farmer_id: user.id,
          crop: crop === 'Other' ? (customCrop || 'Other') : crop,
          farmer_notes: notes,
          image_urls: imageUrls,
          urgency: 'Medium', // Default
          status: analysisMode === 'ai' ? 'Analyzed' : 'Pending Review'
        });

      if (insertError) throw insertError;

      // 5. Trigger AI Analysis if in AI mode
      if (analysisMode === 'ai') {
        const { analyzePlantImage } = await import("@/app/actions/ai-actions");
        await analyzePlantImage(caseId, imageUrls, crop);
        router.push(`/cases/${caseId}`);
      } else {
        alert("Expert Review Requested! Your submission has been sent to our priority queue.");
        router.push("/cases");
      }
    } catch (error: any) {
      console.error("Submission Error:", error);
      alert(`Error submitting case: ${error.message || "Unknown error"}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto pb-20">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tight text-foreground">New Diagnosis</h1>
        <p className="text-sm text-muted-foreground font-medium">Upload high-resolution images of your affected plants for AI or <span className="text-primary italic">Expert</span> analysis.</p>
      </div>

      <Card className="bg-white p-10 rounded-[40px] border border-border/40 shadow-xl flex flex-col gap-10 relative overflow-hidden">
        {isAnalyzing && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-md z-50 flex flex-col items-center justify-center gap-6 transition-all animate-in fade-in">
             <div className="relative">
                <div className="h-20 w-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <Sparkles className="h-8 w-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
             </div>
             <div className="text-center">
                <h3 className="text-2xl font-black text-[#1A5336] leading-tight">
                  {analysisMode === "ai" ? "Running AI Deep Scan..." : "Preparing Expert Submission..."}
                </h3>
                <p className="text-sm text-muted-foreground mt-2 font-medium">Scanning for morphological anomalies and pathogen signatures.</p>
             </div>
          </div>
        )}

        {/* Upload Area */}
        <input 
          type="file" 
          hidden 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          multiple 
          accept="image/*"
        />
        
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "border-3 border-dashed border-primary/10 hover:border-primary/40 transition-all rounded-[32px] p-16 flex flex-col items-center justify-center gap-5 bg-[#fcfdfc] cursor-pointer group hover:bg-[#f3faf6]",
            selectedImages.length > 0 ? "p-10" : "p-16"
          )}
        >
          <div className="h-20 w-20 bg-white rounded-3xl flex items-center justify-center shadow-md border border-border/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
            <UploadCloud className="h-10 w-10 text-[#1A5336]" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-black text-foreground">Click to upload or drag & drop</h3>
            <p className="text-sm text-muted-foreground mt-2 font-medium">High-res macros preferred (Up to 10MB each)</p>
          </div>
        </div>

        {/* Image Previews */}
        {selectedImages.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {selectedImages.map((file, i) => (
                <div key={i} className="aspect-square rounded-[24px] border border-border/40 overflow-hidden relative group shadow-sm bg-muted/10">
                  <img 
                    src={URL.createObjectURL(file)} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                    alt="preview" 
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px]">
                    <ImageModal src={URL.createObjectURL(file)} alt={`User upload ${i+1}`} />
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                    className="absolute top-3 right-3 h-8 w-8 bg-black/60 hover:bg-red-500 text-white rounded-xl flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md z-10"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
            ))}
          </div>
        )}

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
           <div className="flex flex-col gap-3">
             <label className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] pl-1">Primary Crop Species</label>
             <div className="relative">
                <Leaf className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary opacity-40" />
                <select 
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  className="flex h-12 w-full rounded-2xl border-2 border-border/40 bg-white pl-11 px-4 py-2 text-sm font-bold focus:border-primary/50 focus:outline-none transition-all appearance-none"
                >
                  <option>Select a crop species...</option>
                  <option>Tomato (Lycopersicon esculentum)</option>
                  <option>Apple (Malus domestica)</option>
                  <option>Wheat (Triticum aestivum)</option>
                  <option>Corn (Zea mays)</option>
                  <option>Coffee (Coffea arabica)</option>
                  <option value="Other">Other (Specify Below)</option>
                </select>
             </div>
             {crop === 'Other' && (
                <div className="flex flex-col gap-3 mt-4 animate-in fade-in slide-in-from-top-2">
                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] pl-1">Custom Crop Name</label>
                  <input 
                    type="text"
                    value={customCrop}
                    onChange={(e) => setCustomCrop(e.target.value)}
                    placeholder="Enter the species name..."
                    className="flex h-12 w-full rounded-2xl border-2 border-border/40 bg-white px-6 py-2 text-sm font-bold focus:border-primary/50 focus:outline-none transition-all shadow-sm"
                  />
                </div>
             )}
          </div>
          
          <div className="flex flex-col gap-3">
             <label className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] pl-1">Select Analysis Mode</label>
             <div className="flex items-center gap-3 p-1 bg-[#f8faf9] rounded-2xl border border-border/40">
                <button 
                  onClick={() => setAnalysisMode("ai")}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 h-11 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                    analysisMode === "ai" ? "bg-white text-primary shadow-sm border border-border/40" : "text-muted-foreground hover:bg-white/50"
                  )}
                >
                   <Sparkles className="h-3.5 w-3.5" /> AI Scan
                </button>
                <button 
                  onClick={() => setAnalysisMode("expert")}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 h-11 rounded-xl text-xs font-black uppercase tracking-widest transition-all italic",
                    analysisMode === "expert" ? "bg-white text-primary shadow-sm border border-border/40" : "text-muted-foreground hover:bg-white/50"
                  )}
                >
                   <UserCheck className="h-3.5 w-3.5" /> Expert Review
                </button>
             </div>
           </div>

           <div className="flex flex-col gap-3 md:col-span-2">
             <div className="flex items-center justify-between">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] pl-1">Symptoms & Field Observations</label>
                <span className="text-[10px] font-bold text-primary italic">Optional but recommended</span>
             </div>
             <textarea 
               rows={5} 
               value={notes}
               onChange={(e) => setNotes(e.target.value)}
               placeholder="Describe the lesions, distribution, and environmental conditions (recent rain, humidity, etc.)..."
               className="flex w-full rounded-3xl border-2 border-border/40 bg-white px-6 py-5 text-sm font-medium focus:border-primary/50 focus:outline-none transition-all placeholder:text-muted-foreground/30 leading-relaxed"
             />
           </div>
        </div>

        <div className="flex items-center justify-between pt-8 border-t border-border/40">
           <div className="flex flex-col">
              <span className="text-xs font-black text-foreground uppercase tracking-widest">Pricing Policy</span>
              <p className="text-[10px] text-muted-foreground font-medium italic">
                {analysisMode === "ai" ? "AI analysis is free for all users." : "Expert review counts as 1 credit ($1.99)."}
              </p>
           </div>
           <Button 
            onClick={handleSubmit}
            disabled={selectedImages.length === 0}
            className="bg-[#1A5336] text-white hover:bg-[#113a25] rounded-[24px] px-12 h-16 text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-[#1A5336]/30 disabled:opacity-30 disabled:grayscale transition-all hover:scale-[1.02] active:scale-95"
           >
             {analysisMode === "ai" ? "Start AI Processing" : "Submit for Expert Review"}
           </Button>
        </div>
      </Card>

      {/* Helper Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-primary/5 p-8 rounded-[40px] border border-primary/10">
         <div className="flex items-start gap-4">
            <div className="p-3 bg-white rounded-2xl shadow-sm">
               <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div className="flex flex-col gap-1">
               <h4 className="font-bold text-sm">Best Practices</h4>
               <p className="text-xs text-muted-foreground leading-relaxed">Capture leaves in natural light. Ensure macro focus on the infection boundary.</p>
            </div>
         </div>
         <div className="flex items-start gap-4">
            <div className="p-3 bg-white rounded-2xl shadow-sm">
               <Users className="h-6 w-6 text-primary" />
            </div>
            <div className="flex flex-col gap-1">
               <h4 className="font-bold text-sm">Expert Network</h4>
               <p className="text-xs text-muted-foreground leading-relaxed">Our network includes 50+ regional agronomists specializing in East African crops.</p>
            </div>
         </div>
      </div>
    </div>
  );
}
