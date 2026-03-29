"use client";

import React, { useState, useRef, useEffect } from "react";
import { User, Mail, Camera, Save, Loader2, CheckCircle2, ChevronLeft, Phone, Bell, BellOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRole } from "@/components/providers/role-context";
import { updateProfile } from "@/app/actions/profile";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function ProfileSettingsPage() {
  const { fullName, avatarUrl, role, userId, phoneNumber: initialPhone, smsNotificationsEnabled: initialSms } = useRole();
  const [name, setName] = useState(fullName);
  const [phone, setPhone] = useState(initialPhone || "");
  const [smsEnabled, setSmsEnabled] = useState(initialSms);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  useEffect(() => {
    setName(fullName);
    setPhone(initialPhone || "");
    setSmsEnabled(initialSms);
  }, [fullName, initialPhone, initialSms]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("fullName", name);
      formData.append("phoneNumber", phone);
      formData.append("smsEnabled", smsEnabled.toString());
      await updateProfile(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    try {
      // Upload to 'plant-images' bucket (already exists from previous steps)
      const { data, error } = await supabase.storage
        .from('plant-images')
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('plant-images')
        .getPublicUrl(filePath);

      const formData = new FormData();
      formData.append("avatarUrl", publicUrl);
      await updateProfile(formData);
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading avatar. Make sure 'plant-images' bucket exists.");
    } finally {
      setUploading(false);
    }
  };

  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex flex-col gap-8 w-full max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black tracking-tighter text-[#1A5336]">Profile Settings</h1>
          <p className="text-sm text-muted-foreground font-medium italic">Manage your identity on the PlantMD platform.</p>
        </div>
      </div>

      <Card className="p-8 rounded-[32px] bg-white border-none shadow-xl shadow-black/5 flex flex-col gap-10 overflow-hidden relative">
        {saveSuccess && (
          <div className="absolute top-0 left-0 right-0 bg-[#6cdba1] text-[#1A5336] py-2 px-4 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest animate-in slide-in-from-top duration-300">
            <CheckCircle2 className="h-4 w-4" />
            Profile updated successfully
          </div>
        )}

        {/* Avatar Section */}
        <div className="flex items-center gap-8 pb-8 border-b border-border/40">
          <div className="relative group">
            <Avatar className="h-28 w-28 border-4 border-white shadow-2xl transition-transform group-hover:scale-105 duration-300">
              <AvatarImage src={avatarUrl || undefined} alt={name} />
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-black">{initials}</AvatarFallback>
            </Avatar>
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer border-2 border-white/20 backdrop-blur-[2px]"
            >
              {uploading ? <Loader2 className="h-8 w-8 text-white animate-spin" /> : <Camera className="h-8 w-8 text-white" />}
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange}
            />
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="font-black text-xl text-[#1A5336] leading-tight">Your Avatar</h3>
            <p className="text-xs text-muted-foreground font-medium max-w-[200px]">
              Upload a professional portrait to help experts recognize you.
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-9 text-xs rounded-xl font-bold border-border/60"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Change Photo"}
              </Button>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12">
          <div className="flex flex-col gap-3">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-primary" /> Full Name
            </label>
            <Input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name" 
              className="h-12 rounded-xl bg-[#F8FAF8] border-border/40 focus:ring-[#1A5336] font-bold text-[#1A5336]" 
            />
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-primary opacity-50" /> Email (Read-only)
            </label>
            <Input 
              disabled 
              placeholder="Your Email" 
              className="h-12 rounded-xl bg-muted/50 border-border/40 font-bold opacity-60 cursor-not-allowed" 
            />
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-primary" /> Phone Number
            </label>
            <Input 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+250 788 000 000" 
              className="h-12 rounded-xl bg-[#F8FAF8] border-border/40 focus:ring-[#1A5336] font-bold text-[#1A5336]" 
            />
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
              SMS Notifications
            </label>
            <button 
              onClick={() => setSmsEnabled(!smsEnabled)}
              className={cn(
                "h-12 rounded-xl border transition-all flex items-center justify-between px-4 font-bold text-sm group",
                smsEnabled 
                  ? "bg-primary/5 border-primary/20 text-primary" 
                  : "bg-muted/50 border-border/40 text-muted-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                {smsEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                <span>{smsEnabled ? "Enabled" : "Disabled"}</span>
              </div>
              <div className={cn(
                "w-10 h-5 rounded-full relative transition-all duration-300",
                smsEnabled ? "bg-primary" : "bg-muted-foreground/30"
              )}>
                <div className={cn(
                  "absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300",
                  smsEnabled ? "left-6" : "left-1"
                )} />
              </div>
            </button>
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
              Account Type
            </label>
            <div className="h-12 rounded-xl bg-primary/5 border border-primary/10 flex items-center px-4">
              <span className="text-sm font-black text-primary uppercase tracking-[0.2em]">{role} Account</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-border/40">
          <Button 
            disabled={isSaving || name === fullName}
            onClick={handleSave}
            className="bg-[#1A5336] text-white hover:bg-[#113a25] rounded-xl px-10 h-12 font-black uppercase tracking-widest text-[11px] shadow-lg shadow-[#1A5336]/20 transition-all hover:-translate-y-1 disabled:opacity-50 disabled:translate-y-0"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Update Profile
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
