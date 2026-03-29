"use client";

import { Plus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardHeaderActions() {
  const handleExport = () => {
    alert("Preparing your data export... Your download will begin shortly.");
  };

  const handleAddField = () => {
    alert("Opening 'Add New Field' wizard... This will allow you to define field boundaries and crop types.");
  };

  return (
    <div className="flex items-center gap-3">
      <Button 
        onClick={handleAddField}
        className="bg-[#1A5336] text-white hover:bg-[#113a25] rounded-full px-5 font-bold shadow-lg shadow-[#1A5336]/20"
      >
        <Plus className="h-4 w-4 mr-1" /> Add Field
      </Button>
      <Button 
        variant="outline" 
        onClick={handleExport}
        className="rounded-full px-5 border-border/50 bg-white font-bold hover:bg-muted transition-colors"
      >
        <Download className="h-4 w-4 mr-2" /> Export Data
      </Button>
    </div>
  );
}
