import { Leaf, Plus, X, Globe, Droplets, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CropsSettingsPage() {
  const currentCrops = ['Tomato', 'Apple', 'Wheat', 'Corn', 'Soybean', 'Potatoes'];

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Crop Preferences</h1>
        <p className="text-sm text-muted-foreground">Select the crops you grow to personalize your AI models and alerts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Main multi-select mock */}
         <Card className="p-8 rounded-[24px] bg-white border-none shadow-sm flex flex-col gap-6 md:col-span-1">
            <h3 className="font-bold text-lg">My Crops</h3>
            <div className="flex flex-wrap gap-2">
               {currentCrops.map((crop) => (
                  <div key={crop} className="flex items-center gap-2 bg-[#f4f7f4] text-primary px-3 py-1.5 rounded-full border border-primary/20 text-sm font-semibold">
                     {crop}
                     <X className="h-3 w-3 cursor-pointer hover:text-red-500" />
                  </div>
               ))}
               <Button variant="outline" size="sm" className="rounded-full border-dashed border-primary/30 text-primary hover:bg-primary/5">
                  <Plus className="h-3 w-3 mr-1" /> Add Crop
               </Button>
            </div>
         </Card>

         <Card className="p-8 rounded-[24px] bg-white border-none shadow-sm flex flex-col gap-6 md:col-span-1">
            <h3 className="font-bold text-lg">Field Conditions</h3>
            <div className="space-y-4">
               <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                     <Globe className="h-3 w-3" /> Region Type
                  </label>
                  <select className="flex h-10 w-full rounded-xl border border-border/40 bg-[#f8faf9] px-3 py-2 text-sm">
                     <option>Temperate</option>
                     <option>Tropical</option>
                     <option>Arid</option>
                  </select>
               </div>
               <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                     <Droplets className="h-3 w-3" /> Soil Category
                  </label>
                  <select className="flex h-10 w-full rounded-xl border border-border/40 bg-[#f8faf9] px-3 py-2 text-sm">
                     <option>Loam</option>
                     <option>Clay</option>
                     <option>Sandy</option>
                  </select>
               </div>
            </div>
         </Card>

         <Card className="md:col-span-2 p-6 rounded-[24px] bg-[#1A5336] text-white border-none shadow-md flex items-center gap-6">
            <div className="p-4 bg-white/10 rounded-2xl shrink-0">
               <Info className="h-8 w-8 text-[#6cdba1]" />
            </div>
            <div className="flex flex-col gap-1">
               <h4 className="font-bold text-lg">Why this matters?</h4>
               <p className="text-sm text-white/70 leading-relaxed">
                  Correct crop and region selection helps our AI improve its accuracy by filtering out diseases not native to your area or specific crop types.
               </p>
            </div>
         </Card>
      </div>

      <div className="flex justify-end">
         <Button className="bg-[#1A5336] text-white hover:bg-[#113a25] rounded-xl px-12 py-6 font-bold">
            Update Preferences
         </Button>
      </div>
    </div>
  );
}
