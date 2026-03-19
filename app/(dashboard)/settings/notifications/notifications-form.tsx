'use client';

import { useState } from "react";
import Link from "next/link";
import { Bell, Smartphone, Save } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { setSmsNotifications } from "@/app/actions/profile";

function Switch({
  active,
  onToggle,
  disabled,
}: {
  active: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onToggle}
      className={cn(
        "w-10 h-5 rounded-full relative transition-colors",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
        active ? "bg-primary" : "bg-muted"
      )}
    >
      <span
        className={cn(
          "absolute top-1 w-3 h-3 bg-white rounded-full transition-all shadow-sm",
          active ? "left-6" : "left-1"
        )}
      />
    </button>
  );
}

export default function NotificationsForm({
  initialSmsEnabled,
  phoneNumber,
}: {
  initialSmsEnabled: boolean;
  phoneNumber: string;
}) {
  const [smsEnabled, setSmsEnabled] = useState(initialSmsEnabled);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const save = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await setSmsNotifications(smsEnabled);
      setMessage("SMS preferences saved.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Could not save preferences.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-3xl mx-auto pb-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Notification preferences</h1>
        <p className="text-sm text-muted-foreground">
          SMS is the only channel wired today (AI results and expert reviews). Email and push are not configured for this deployment.
        </p>
      </div>

      <Card className="p-0 rounded-[28px] bg-white border-none shadow-sm overflow-hidden flex flex-col">
        <div className="px-8 py-5 bg-[#fbfcfa] border-b border-border/40 flex items-center gap-3">
          <Smartphone className="h-4 w-4 text-[#1A5336]" />
          <h3 className="font-bold text-foreground">SMS alerts</h3>
        </div>
        <div className="px-8 py-6 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-6">
            <div className="flex flex-col gap-1 max-w-[75%]">
              <span className="font-semibold text-foreground">Diagnosis & expert updates</span>
              <span className="text-xs text-muted-foreground">
                Receive a text when AI finishes a scan or an agronomist submits a review. Requires a phone number on your{" "}
                <Link href="/settings/profile" className="text-primary font-medium underline-offset-2 hover:underline">
                  profile
                </Link>
                .
              </span>
              {phoneNumber ? (
                <span className="text-[11px] text-muted-foreground font-mono">Current: {phoneNumber}</span>
              ) : (
                <span className="text-[11px] text-amber-700 font-medium">Add a phone number in profile to receive SMS.</span>
              )}
            </div>
            <div className="flex flex-col items-center gap-2 shrink-0">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">SMS</span>
              <Switch active={smsEnabled} onToggle={() => setSmsEnabled((v) => !v)} disabled={saving} />
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 rounded-[24px] bg-[#f8faf9] border border-border/40 flex items-start gap-4">
        <div className="mt-0.5 p-2 bg-white rounded-xl shadow-sm border border-border/40 shrink-0">
          <Bell className="h-5 w-5 text-primary" />
        </div>
        <div className="flex flex-col gap-1">
          <h4 className="font-bold text-sm">In-app history</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            All diagnoses remain available under <strong>Cases</strong> whether or not SMS is enabled.
          </p>
        </div>
      </Card>

      {message && <p className="text-sm text-muted-foreground px-1">{message}</p>}

      <div className="flex justify-end gap-3">
        <Button className="bg-[#1A5336] text-white hover:bg-[#113a25] rounded-xl px-10 font-bold" disabled={saving} onClick={save}>
          <Save className="h-4 w-4 mr-2" /> Save
        </Button>
      </div>
    </div>
  );
}
