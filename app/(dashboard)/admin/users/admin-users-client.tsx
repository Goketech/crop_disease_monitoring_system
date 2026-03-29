'use client';

import React, { useState } from "react";
import { Search, User, Mail, Shield, Calendar, Trash2, MoreVertical, Filter, UserCheck, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  joined: string;
}

export default function AdminUsersClient({ initialUsers }: { initialUsers: UserProfile[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = !roleFilter || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    
    // In a real app, you might use a service role or a specific function to delete users from auth.users
    // For now, we'll just delete from the profiles table as a demonstration (though we should handle auth.users too)
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) {
      alert("Error deleting user: " + error.message);
    } else {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-black tracking-tighter text-[#1A5336]">User Management</h1>
          <p className="text-sm text-muted-foreground italic font-medium">Oversee all registered farmers, agronomists, and administrators.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search users..." 
              className="pl-9 h-12 bg-white border-border/60 rounded-2xl shadow-sm focus-visible:ring-[#1A5336]" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {["admin", "agronomist", "farmer"].map(role => (
              <Button 
                key={role}
                variant={roleFilter === role ? "default" : "outline"}
                onClick={() => setRoleFilter(roleFilter === role ? null : role)}
                className={cn(
                  "h-12 rounded-2xl px-4 font-black text-[10px] uppercase tracking-widest shadow-sm transition-all",
                  roleFilter === role ? "bg-[#1A5336] text-white" : "bg-white text-muted-foreground border-border/60"
                )}
              >
                {role}s
              </Button>
            ))}
          </div>
        </div>
      </div>

      <Card className="rounded-[32px] border-none shadow-xl shadow-black/5 overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/40 bg-[#f8faf9]">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">User</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Role</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Joined</th>
                <th className="px-6 py-5 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="group hover:bg-[#fcfdfc] transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-[#1A5336]/5 rounded-full flex items-center justify-center text-[11px] font-black text-[#1A5336] uppercase border border-[#1A5336]/10 shadow-sm">
                        {u.full_name?.[0] || u.email[0]}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-foreground">{u.full_name || "Anonymous"}</span>
                        <span className="text-xs font-medium text-muted-foreground italic">{u.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm",
                      u.role === 'admin' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                      u.role === 'agronomist' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-green-50 text-green-600 border-green-100'
                    )}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {u.joined}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-10 w-10 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        onClick={() => handleDelete(u.id)}
                       >
                          <Trash2 className="h-4 w-4" />
                       </Button>
                       <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground rounded-xl">
                          <MoreVertical className="h-4 w-4" />
                       </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                       <div className="h-16 w-16 bg-muted/20 rounded-full flex items-center justify-center">
                          <UserX className="h-8 w-8 text-muted-foreground opacity-20" />
                       </div>
                       <p className="text-sm font-bold text-muted-foreground italic">No users found matching your search.</p>
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
