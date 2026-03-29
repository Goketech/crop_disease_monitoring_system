"use client";

import { Bell, Mail, Info, CheckCircle2, AlertTriangle, Clock, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function NotificationsPage() {
  const notifications = [
    { id: 'CAS-001', type: 'result', title: 'New Diagnosis Ready', body: 'AI analysis for your Tomato field #4 is complete with 94% confidence.', time: '2 mins ago', unread: true, icon: CheckCircle2, color: 'text-green-600 bg-green-50' },
    { id: 'CAS-001', type: 'expert', title: 'Expert Assigned', body: 'Agronomist Alexandra Deff has started reviewing your Apple Scab case.', time: '1 hour ago', unread: true, icon: Clock, color: 'text-blue-600 bg-blue-50' },
    { id: 'CAS-003', type: 'alert', title: 'Critical Urgency Alert', body: 'Detected high risk of spread in Kansas region. Please check field protocols.', time: '5 hours ago', unread: false, icon: AlertTriangle, color: 'text-red-600 bg-red-50' },
    { id: 'CAS-001', type: 'system', title: 'System Update', body: 'V5.2 AI model deployed with improved accuracy for wheat diseases.', time: '1 day ago', unread: false, icon: Info, color: 'text-muted-foreground bg-muted' },
  ];

  const handleMarkAllRead = () => {
    alert("All notifications marked as read.");
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Notifications</h1>
          <p className="text-sm text-muted-foreground">Stay updated on analysis results, expert reviews, and field alerts.</p>
        </div>
        <Button 
          variant="ghost" 
          onClick={handleMarkAllRead}
          className="text-xs text-primary font-black uppercase tracking-widest hover:bg-primary/5 rounded-full px-6"
        >
          Mark all as read
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {notifications.map((notif, i) => (
          <Link key={i} href={`/cases/${notif.id}`}>
            <Card className={cn("p-6 rounded-[28px] border border-border/40 shadow-sm transition-all hover:translate-x-1 group cursor-pointer", 
               notif.unread ? "bg-white border-l-4 border-l-primary" : "bg-[#fcfdfc] opacity-80")}>
               <div className="flex items-start gap-4">
                  <div className={cn("p-3.5 rounded-2xl flex items-center justify-center shrink-0 shadow-sm", notif.color)}>
                     <notif.icon className="h-6 w-6" />
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                     <div className="flex items-center justify-between">
                        <h3 className="font-bold text-foreground leading-tight group-hover:text-primary transition-colors">{notif.title}</h3>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{notif.time}</span>
                     </div>
                     <p className="text-sm text-muted-foreground leading-relaxed pr-8">{notif.body}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground self-center opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
               </div>
            </Card>
          </Link>
        ))}
      </div>
      
      <div className="flex justify-center mt-6">
         <Button variant="outline" className="rounded-full border-border/60 bg-white text-muted-foreground px-10 h-11 font-bold shadow-sm">Load More Notifications</Button>
      </div>
    </div>
  );
}
