'use client';

import React, { useState } from "react";
import { Search, MapPin, Clock, MoreVertical, Filter, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PendingCase {
  id: string;
  crop: string;
  disease: string;
  farmer_name: string;
  location: string;
  time_ago: string;
  urgency: string;
  image: string;
  created_at: string;
}

export default function ExpertsClient({ initialCases }: { initialCases: PendingCase[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest" | "urgency">("latest");

  const filteredRequests = initialCases
    .filter(req => 
      req.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.farmer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.disease.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "urgency") {
        const priority = { 'Critical': 3, 'High': 2, 'Medium': 1, 'Low': 0 };
        return (priority[b.urgency as keyof typeof priority] || 0) - (priority[a.urgency as keyof typeof priority] || 0);
      }
      if (sortOrder === "latest") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (sortOrder === "oldest") {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      return 0;
    });

  return (
    <div className="flex flex-col gap-8 w-full pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-black tracking-tighter text-[#1A5336]">Review Queue</h1>
          <p className="text-sm text-muted-foreground italic font-medium">Validate and analyze disease cases submitted by farmers.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search queue..." 
              className="pl-9 h-12 bg-white border-border/60 rounded-2xl shadow-sm focus-visible:ring-[#1A5336]" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => setSortOrder(sortOrder === "latest" ? "urgency" : sortOrder === "urgency" ? "oldest" : "latest")}
              variant="outline" 
              className="h-12 rounded-2xl border-border/60 px-5 font-black text-[10px] uppercase tracking-widest shadow-sm bg-white hover:bg-[#f8faf9]"
            >
              <Filter className="h-4 w-4 mr-2" /> Sort: {sortOrder}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 max-w-5xl">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xs font-black uppercase text-muted-foreground tracking-[0.2em]">
            Pending Validation ({filteredRequests.length})
          </h2>
        </div>
        
        {filteredRequests.map((req) => (
          <Card key={req.id} className="group bg-white p-6 rounded-[32px] border-none shadow-sm hover:shadow-xl hover:shadow-[#1A5336]/5 transition-all flex flex-col md:flex-row items-center gap-8 cursor-default border border-transparent hover:border-[#1A5336]/10">
            <div className="relative shrink-0">
              <img src={req.image} alt="Crop" className="w-40 h-40 object-cover rounded-3xl bg-muted shadow-md group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#1A5336] border border-[#1A5336]/10 shadow-sm">
                {req.crop}
              </div>
            </div>
            
            <div className="flex flex-col flex-1 gap-4">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-[#1A5336]/60 uppercase tracking-widest">{req.id}</span>
                    <span className="h-1 w-1 rounded-full bg-border" />
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest uppercase">{req.time_ago}</span>
                  </div>
                  <h3 className="text-2xl font-black text-[#1A5336] tracking-tight leading-none group-hover:text-[#113a25] transition-colors">{req.disease !== "Pending" ? req.disease : "Unknown Pathology"}</h3>
                </div>
                <span className={cn(
                  "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm",
                  req.urgency === 'Critical' ? 'bg-red-50 text-red-600 border-red-100' : 
                  req.urgency === 'High' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                  req.urgency === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-green-50 text-green-600 border-green-100'
                )}>
                  {req.urgency}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 bg-[#1A5336]/5 rounded-full flex items-center justify-center text-[10px] font-black text-[#1A5336] uppercase border border-[#1A5336]/10">
                    {req.farmer_name[0]}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Farmer</span>
                    <span className="text-sm font-bold text-foreground">{req.farmer_name}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Location</span>
                    <span className="text-sm font-bold text-foreground">{req.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Submitted</span>
                    <span className="text-sm font-bold text-foreground">{req.time_ago}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border/20 pt-5">
                <div className="flex gap-3">
                  <Link href={`/cases/${req.id}`}>
                    <Button className="bg-[#1A5336] text-white hover:bg-[#113a25] h-12 text-[10px] font-black uppercase tracking-widest rounded-2xl px-8 shadow-lg shadow-[#1A5336]/10 transition-all hover:-translate-y-0.5 active:scale-95">
                      Review Case
                    </Button>
                  </Link>
                </div>
                <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground group-hover:text-primary transition-colors">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
        
        {filteredRequests.length === 0 && (
          <div className="py-24 flex flex-col items-center gap-6 text-center bg-white rounded-[40px] border-2 border-dashed border-border/40">
            <div className="h-24 w-24 bg-[#1A5336]/5 rounded-full flex items-center justify-center">
              <Leaf className="h-10 w-10 text-[#1A5336] opacity-40 animate-pulse" />
            </div>
            <div className="flex flex-col gap-2 max-w-xs">
              <h3 className="text-2xl font-black text-[#1A5336] tracking-tight">Queue is Empty</h3>
              <p className="text-sm text-muted-foreground font-medium leading-relaxed italic">You've cleared all pending validations! Take a break or check history.</p>
            </div>
            <Button variant="outline" onClick={() => setSearchQuery("")} className="font-black h-12 px-8 rounded-2xl uppercase text-[10px] tracking-widest">Reset Filters</Button>
          </div>
        )}
      </div>
    </div>
  );
}
