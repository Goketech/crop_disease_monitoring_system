import { Bell, Mail, Smartphone, Monitor, Info, Save } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotificationsSettingsPage() {
  const settings = [
    {
      group: "Submission Lifecycle",
      items: [
        { name: "New Diagnosis Ready", desc: "When AI completes an analysis", push: true, email: true },
        { name: "Expert Review Started", desc: "When an agronomist picks up your case", push: true, email: false },
        { name: "Expert Review Completed", desc: "When the final treatment plan is ready", push: true, email: true },
      ]
    },
    {
      group: "Field Alerts",
      items: [
        { name: "Urgent Outbreak Alerts", desc: "Nearby reports of highly contagious diseases", push: true, email: true },
        { name: "Weather Advisory", desc: "Conditions favorable for blight or rust spread", push: false, email: true },
        { name: "Treatment Reminders", desc: "Based on your scheduled treatment plans", push: true, email: false },
      ]
    }
  ];

  return (
    <div className="flex flex-col gap-8 w-full max-w-3xl mx-auto pb-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Notification Preferences</h1>
        <p className="text-sm text-muted-foreground">Choose what you want to be notified about and where.</p>
      </div>

      <div className="flex flex-col gap-6">
        {settings.map((group, idx) => (
          <Card key={idx} className="p-0 rounded-[28px] bg-white border-none shadow-sm overflow-hidden flex flex-col">
            <div className="px-8 py-5 bg-[#fbfcfa] border-b border-border/40">
              <h3 className="font-bold text-foreground">{group.group}</h3>
            </div>
            <div className="flex flex-col">
              {group.items.map((item, i) => (
                <div key={i} className="px-8 py-6 flex items-center justify-between border-b border-border/40 last:border-0 hover:bg-[#f8faf9]/50 transition-colors">
                  <div className="flex flex-col gap-1 max-w-[60%]">
                    <span className="font-semibold text-foreground">{item.name}</span>
                    <span className="text-xs text-muted-foreground">{item.desc}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-center gap-2">
                       <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Push</span>
                       <Switch active={item.push} />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                       <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Email</span>
                       <Switch active={item.email} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 rounded-[24px] bg-[#f8faf9] border border-border/40 flex items-start gap-4">
         <div className="mt-0.5 p-2 bg-white rounded-xl shadow-sm border border-border/40 shrink-0">
           <Monitor className="h-5 w-5 text-primary" />
         </div>
         <div className="flex flex-col gap-1">
           <h4 className="font-bold text-sm">Browser Notifications</h4>
           <p className="text-xs text-muted-foreground leading-relaxed">
             Enable desktop alerts to get real-time diagnostic results even when the app is minimized.
           </p>
            <button 
              onClick={() => alert("Requesting browser notification permissions...")}
              className="text-xs font-bold text-primary mt-1 hover:underline text-left"
            >
              Enable In Browser
            </button>
         </div>
      </Card>

      <div className="flex justify-end gap-3 mt-4">
        <Button variant="ghost" className="rounded-xl px-6" onClick={() => alert("Notification settings restored to defaults.")}>Restore Defaults</Button>
        <Button 
          className="bg-[#1A5336] text-white hover:bg-[#113a25] rounded-xl px-10 font-bold"
          onClick={() => alert("Notification preferences saved!")}
        >
          <Save className="h-4 w-4 mr-2" /> Save Preferences
        </Button>
      </div>
    </div>
  );
}

function Switch({ active }: { active: boolean }) {
  return (
    <div className={cn(
      "w-10 h-5 rounded-full relative transition-colors cursor-pointer",
      active ? "bg-primary" : "bg-muted"
    )}>
      <div className={cn(
        "absolute top-1 w-3 h-3 bg-white rounded-full transition-all",
        active ? "left-6" : "left-1"
      )} />
    </div>
  );
}
