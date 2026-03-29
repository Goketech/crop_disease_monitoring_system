"use client";

import React, { useState } from "react";
import { Users, UserPlus, Shield, Mail, MoreVertical, Search, Filter, ShieldCheck, UserCog, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface MemberFormatted {
  name: string;
  email: string;
  role: string;
  status: string;
  joined: string;
}

export default function TeamClientModule({
  initialMembers
}: {
  initialMembers: MemberFormatted[]
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeRole, setActiveRole] = useState<string | null>(null);

  const handleInvite = () => {
    alert("Opening invitation portal... You'll be able to invite agronomists via email and assign them field permissions.");
  };

  const filteredMembers = initialMembers.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = activeRole ? m.role === activeRole : true;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="flex flex-col gap-8 w-full pb-12">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Team Management</h1>
          <p className="text-sm text-muted-foreground">Manage your organization's agronomists and administrators.</p>
        </div>
        <Button 
          onClick={handleInvite}
          className="bg-[#1A5336] text-white hover:bg-[#113a25] rounded-full px-7 h-11 font-bold shadow-lg shadow-[#1A5336]/20 transition-all hover:scale-105"
        >
          <UserPlus className="h-4 w-4 mr-2" /> Invite Member
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 rounded-[24px] bg-white border-none shadow-sm flex items-center gap-4 border border-border/20">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary">
            <Users className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tighter">{initialMembers.length}</span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Members</span>
          </div>
        </Card>
        <Card className="p-6 rounded-[24px] bg-white border-none shadow-sm flex items-center gap-4 border border-border/20">
          <div className="p-3 bg-[#1A5336]/10 rounded-2xl text-[#1A5336]">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tighter">{initialMembers.filter(m => m.role === 'Agronomist').length}</span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Agronomists</span>
          </div>
        </Card>
        <Card className="p-6 rounded-[24px] bg-[#0B2A1C] text-white border-none shadow-md flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-2xl text-[#6cdba1]">
            <UserCog className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tighter">{initialMembers.filter(m => m.role === 'Admin').length}</span>
            <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Admins</span>
          </div>
        </Card>
      </div>

      <Card className="bg-white p-0 rounded-[32px] border border-border/40 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-border/40 flex items-center justify-between bg-[#fcfdfc]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search team members..." 
                  className="pl-9 h-11 bg-white border-border/60 rounded-xl font-medium" 
                />
              </div>
              <Button 
                onClick={() => alert("Searching database for: " + searchQuery)}
                className="bg-[#1A5336] text-white h-11 rounded-xl px-6 font-bold text-xs uppercase tracking-widest shadow-sm hover:scale-[1.02] transition-all"
              >
                Search
              </Button>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="outline" className="bg-white border-border/60 h-11 rounded-xl px-5 font-bold text-xs uppercase tracking-widest cursor-pointer">
                  <Filter className="h-3.5 w-3.5 mr-2" /> 
                  {activeRole || "All Roles"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48 rounded-xl p-2 border-border/40 shadow-xl">
                {["Admin", "Agronomist"].map((role) => (
                  <DropdownMenuItem 
                    key={role}
                    onClick={() => setActiveRole(activeRole === role ? null : role)}
                    className="rounded-lg font-bold text-xs p-3 cursor-pointer"
                  >
                    {role}
                    {activeRole === role && <Check className="ml-auto h-3 w-3 text-primary" />}
                  </DropdownMenuItem>
                ))}
                {activeRole && (
                  <DropdownMenuItem 
                    onClick={() => setActiveRole(null)}
                    className="rounded-lg font-bold text-[10px] p-3 text-destructive uppercase tracking-widest mt-1 border-t"
                  >
                    Clear Filter
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">
             {filteredMembers.length} Accounts Found
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] uppercase bg-[#f8faf9] text-muted-foreground font-black tracking-widest border-b border-border/40">
              <tr>
                <th className="px-8 py-6">Member</th>
                <th className="px-8 py-6">Role</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6">Joined</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((m, i) => (
                <tr key={i} className="border-b border-border/40 last:border-0 hover:bg-[#fbfcfa] transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-11 w-11 border-2 border-white shadow-sm ring-1 ring-border/20">
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${m.email}`} />
                        <AvatarFallback>{m.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground text-base tracking-tight">{m.name}</span>
                        <span className="text-xs text-muted-foreground font-medium">{m.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       <div className={cn(
                         "p-1.5 rounded-lg",
                         m.role === 'Admin' ? 'bg-[#1A5336]/10 text-[#1A5336]' : 'bg-primary/10 text-primary'
                       )}>
                         <Shield className="h-3.5 w-3.5" />
                       </div>
                       <span className="font-bold text-foreground text-xs uppercase tracking-widest">{m.role}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <Badge className={cn(
                      "bg-transparent border-none shadow-none px-3 py-1 text-[10px] font-black uppercase tracking-widest",
                      m.status === 'Active' ? 'text-green-600 bg-green-50' : 'text-amber-600 bg-amber-50'
                    )}>
                      <span className={cn("mr-1.5 h-1.5 w-1.5 rounded-full inline-block", m.status === 'Active' ? "bg-green-500" : "bg-amber-500")} />
                      {m.status}
                    </Badge>
                  </td>
                  <td className="px-8 py-6 text-muted-foreground font-bold text-xs uppercase tracking-widest">{m.joined}</td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <Button variant="ghost" size="icon" className="h-10 w-10 border border-border/20 rounded-xl bg-white hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-all opacity-0 group-hover:opacity-100">
                         <Mail className="h-4 w-4" />
                       </Button>
                       <Button variant="ghost" size="icon" className="h-10 w-10 border border-border/20 rounded-xl bg-white hover:bg-muted transition-all opacity-0 group-hover:opacity-100">
                         <MoreVertical className="h-4 w-4" />
                       </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredMembers.length === 0 && (
                <tr>
                   <td colSpan={5} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4 text-muted-foreground opacity-40">
                         <Search className="h-12 w-12" />
                         <span className="font-black uppercase tracking-widest text-xs">No team members match your search</span>
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
