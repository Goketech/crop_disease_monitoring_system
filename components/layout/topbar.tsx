"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, Loader2, User, Settings, Home, LogOut, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRole } from "@/components/providers/role-context";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "@/app/login/actions";
import { cn } from "@/lib/utils";

export function Topbar() {
  const { role, fullName, avatarUrl } = useRole();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      router.push(`/cases?search=${encodeURIComponent(searchQuery)}`);
    }, 800);
  };

  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <header className="flex items-center justify-between bg-[#F8F9F8] px-8 py-5 shrink-0 sticky top-0 z-40 backdrop-blur-sm bg-opacity-90">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex w-full max-w-md items-center gap-2 rounded-xl bg-white px-4 py-2.5 shadow-sm border border-border/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
        {isSearching ? <Loader2 className="h-5 w-5 text-primary animate-spin" /> : <Search className="h-5 w-5 text-muted-foreground" />}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search database..."
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground font-medium"
        />
        <kbd className="hidden rounded bg-muted px-2 py-0.5 text-[10px] sm:inline-block border border-border font-bold text-muted-foreground/60">
          ENTER
        </kbd>
      </form>

      {/* Right side Profile */}
      <div className="flex items-center gap-5 relative" ref={menuRef}>
        <div 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center gap-3 pl-2 group cursor-pointer select-none"
        >
          <div className="flex flex-col text-sm text-right">
            <span className="font-bold text-foreground group-hover:text-primary transition-colors whitespace-nowrap">{fullName}</span>
            <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{role} Account</span>
          </div>
          <div className="relative">
            <Avatar className="h-10 w-10 border-2 border-white shadow-md group-hover:border-primary/20 transition-all">
              <AvatarImage src={avatarUrl || undefined} alt={fullName} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold">{initials}</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-border">
              <ChevronDown className={cn("h-3 w-3 text-muted-foreground transition-transform duration-200", isMenuOpen && "rotate-180")} />
            </div>
          </div>
        </div>

        {/* Profile Dropdown Popup */}
        {isMenuOpen && (
          <div className="absolute top-full right-0 mt-3 w-56 rounded-2xl bg-white p-2 shadow-2xl border border-border/50 animate-in fade-in zoom-in-95 duration-200 origin-top-right overflow-hidden">
            <div className="px-3 py-2 border-b border-border/40 mb-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">My Account</p>
            </div>
            
            <Link 
              href="/settings/profile" 
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>

            <Link 
              href="/" 
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Home className="h-4 w-4" />
              Go to Landing Page
            </Link>

            <div className="my-1 border-t border-border/40" />

            <button 
              onClick={() => {
                setIsMenuOpen(false);
                logout();
              }}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
