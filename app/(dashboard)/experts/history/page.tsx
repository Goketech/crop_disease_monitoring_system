import { 
  History, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  User, 
  Leaf, 
  ArrowUpRight,
  MoreVertical,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export default function ExpertHistoryPage() {
  const reviews = [
    { id: "CAS-882", farmer: "Mutoni Sandra", crop: "Apple", disease: "Apple Scab", date: "Feb 20, 2026", outcome: "Recovering", status: "Complete" },
    { id: "CAS-875", farmer: "Kayumba Kevin", crop: "Tomato", disease: "Late Blight", date: "Feb 15, 2026", outcome: "Stable", status: "Follow-up" },
    { id: "CAS-860", farmer: "Innocent B.", crop: "Wheat", disease: "Leaf Rust", date: "Feb 10, 2026", outcome: "Treatment Fail", status: "Escalated" },
    { id: "CAS-842", farmer: "Alice M.", crop: "Corn", disease: "Healthy", date: "Feb 02, 2026", outcome: "N/A", status: "Complete" },
    { id: "CAS-831", farmer: "John D.", crop: "Potato", disease: "Early Blight", date: "Jan 28, 2026", outcome: "Recovered", status: "Complete" },
  ];

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Review History</h1>
          <p className="text-sm text-muted-foreground">Manage and track all expert diagnoses you've provided.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-full px-5 border-border/50 bg-white shadow-sm">
            Export Report
          </Button>
          <Button className="bg-[#1A5336] text-white hover:bg-[#113a25] rounded-full px-5">
            Bulk Summary
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
         <Card className="p-5 rounded-[20px] bg-white border-none shadow-sm flex flex-col gap-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Reviews</span>
            <div className="flex items-end justify-between">
              <h2 className="text-3xl font-bold text-foreground tracking-tighter mt-1">142</h2>
              <Badge className="bg-green-100 text-green-700 border-none">+12%</Badge>
            </div>
         </Card>
         <Card className="p-5 rounded-[20px] bg-white border-none shadow-sm flex flex-col gap-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Avg. Score</span>
            <div className="flex items-end justify-between">
              <h2 className="text-3xl font-bold text-foreground tracking-tighter mt-1">4.8</h2>
              <span className="text-xs text-muted-foreground mb-1">/ 5.0 Rating</span>
            </div>
         </Card>
         <Card className="p-5 rounded-[20px] bg-white border-none shadow-sm flex flex-col gap-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Success Rate</span>
            <div className="flex items-end justify-between">
              <h2 className="text-3xl font-bold text-foreground tracking-tighter mt-1">92%</h2>
              <Badge className="bg-[#1A5336] text-white border-none">Top Tier</Badge>
            </div>
         </Card>
         <Card className="p-5 rounded-[20px] bg-white border-none shadow-sm flex flex-col gap-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Follow-ups</span>
            <div className="flex items-end justify-between">
              <h2 className="text-3xl font-bold text-foreground tracking-tighter mt-1">8</h2>
              <span className="text-xs font-bold text-amber-600 mb-1">Due soon</span>
            </div>
         </Card>
      </div>

      <Card className="bg-white p-0 rounded-[24px] border border-border/40 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-border/40 flex items-center justify-between bg-[#fcfdfc]">
          <div className="flex items-center gap-3">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search past reviews..." className="pl-9 h-11 bg-white border-border/60 rounded-xl" />
            </div>
            <Button variant="outline" className="bg-white border-border/60 h-11 rounded-xl px-5">
              <Filter className="h-4 w-4 mr-2" /> Filter
            </Button>
          </div>
          <div className="flex items-center gap-2">
             <span className="text-sm font-semibold text-muted-foreground">Sorting by Date</span>
             <Calendar className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-[#f8faf9] text-muted-foreground font-bold tracking-wider">
              <tr>
                <th className="px-6 py-5">Case & Farmer</th>
                <th className="px-6 py-5">Diagnosis</th>
                <th className="px-6 py-5">Reviewed On</th>
                <th className="px-6 py-5">Outcome</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5"></th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r, i) => (
                <tr key={i} className="border-b border-border/40 last:border-0 hover:bg-[#fbfcfa] transition-colors group cursor-pointer">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                       <Avatar className="h-9 w-9 border border-border/40">
                          <AvatarImage src={`https://i.pravatar.cc/150?u=${r.farmer}`} />
                          <AvatarFallback>{r.farmer[0]}</AvatarFallback>
                       </Avatar>
                       <div className="flex flex-col">
                          <span className="font-bold text-foreground">{r.id}</span>
                          <span className="text-xs text-muted-foreground">{r.farmer}</span>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                       <div className="bg-[#e5ede5] text-[#155e3a] p-1.5 rounded-lg"><Leaf className="h-3.5 w-3.5" /></div>
                       <div className="flex flex-col">
                          <span className="font-semibold text-foreground">{r.disease}</span>
                          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-tight">{r.crop}</span>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-muted-foreground font-medium">{r.date}</td>
                  <td className="px-6 py-5">
                     <span className={cn(
                       "text-xs font-bold px-2.5 py-1 rounded-full",
                       r.outcome === 'Recovered' ? 'bg-green-100 text-green-700' : 
                       r.outcome === 'Stable' ? 'bg-blue-100 text-blue-700' : 
                       r.outcome === 'Treatment Fail' ? 'bg-red-100 text-red-700' : 'bg-muted text-muted-foreground'
                     )}>
                        {r.outcome}
                     </span>
                  </td>
                  <td className="px-6 py-5">
                     <div className="flex items-center gap-2">
                        <span className={cn(
                          "h-2 w-2 rounded-full",
                          r.status === 'Complete' ? 'bg-[#3eb579]' : r.status === 'Follow-up' ? 'bg-orange-400' : 'bg-red-500'
                        )} />
                        <span className="font-semibold text-muted-foreground">{r.status}</span>
                     </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-foreground hover:bg-white rounded-full">
                       <MoreVertical className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
