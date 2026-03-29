import { ArrowRight, Leaf, ShieldCheck, Zap, Globe, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2 text-[#1A5336] font-bold text-2xl tracking-tighter">
          <Leaf className="h-8 w-8" />
          PlantMD
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-muted-foreground uppercase tracking-widest">
          <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
          <Link href="#how-it-works" className="hover:text-primary transition-colors">How it works</Link>
          <Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="font-bold text-sm">Log in</Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-[#1A5336] text-white hover:bg-[#113a25] rounded-full px-6 font-bold">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="px-8 py-24 md:py-32 max-w-7xl mx-auto flex flex-col items-center text-center gap-8">
          <div className="inline-flex items-center gap-2 bg-[#1A5336]/5 text-[#1A5336] px-4 py-2 rounded-full border border-[#1A5336]/10 text-xs font-bold uppercase tracking-widest">
            <Zap className="h-3 w-3" /> AI-Powered Agriculture is here
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-[#1A5336] max-w-4xl leading-[0.9]">
            STOP CROP <span className="text-primary italic">DISEASE</span> BEFORE IT SPREADS.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Professional-grade plant health diagnostics in the palm of your hand. Upload images, get instant AI analysis, and connect with global agronomists.
          </p>
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <Link href="/signup">
              <Button className="bg-[#1A5336] text-white hover:bg-[#113a25] rounded-full px-10 py-8 text-lg font-bold shadow-xl shadow-[#1A5336]/20">
                Start Diagnosing Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" className="rounded-full px-10 py-8 text-lg font-bold border-border/60">
              View Sample Report
            </Button>
          </div>
          
          {/* Mock Dashboard Preview */}
          <div className="mt-16 w-full max-w-5xl aspect-video bg-muted rounded-[32px] border-4 border-white shadow-2xl overflow-hidden relative shadow-primary/10">
             <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-white/50 shadow-xl flex flex-col gap-4 max-w-xs scale-110">
                   <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                         <ShieldCheck className="h-6 w-6" />
                      </div>
                      <div className="flex flex-col">
                         <span className="font-bold text-sm">98% Accuracy</span>
                         <span className="text-[10px] text-muted-foreground uppercase font-black">AI Analysis</span>
                      </div>
                   </div>
                   <p className="text-xs text-muted-foreground">Late Blight detected in 35 seconds across 4 field sectors.</p>
                </div>
             </div>
          </div>
        </section>

        {/* Features grid */}
        <section id="features" className="bg-[#fbfcfa] py-32 px-8">
           <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              {[
                { icon: Zap, title: "Instant AI Results", desc: "Our vision models are trained on over 1M+ clinical crop samples for pixel-perfect accuracy." },
                { icon: Users, title: "Expert Network", desc: "Collaborate with certified agronomists for validated treatment plans and field visits." },
                { icon: Globe, title: "Global Reach", desc: "Monitor multi-region farms from a single dashboard with localized disease heatmaps." }
              ].map((f, i) => (
                <div key={i} className="flex flex-col items-center gap-4">
                   <div className="h-16 w-16 bg-white rounded-3xl shadow-sm border border-border/40 flex items-center justify-center text-primary mb-2">
                      <f.icon className="h-8 w-8" />
                   </div>
                   <h3 className="text-xl font-bold text-[#1A5336]">{f.title}</h3>
                   <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              ))}
           </div>
        </section>
      </main>

      <footer className="px-8 py-12 border-t border-border/40 max-w-7xl mx-auto w-full text-center text-sm text-muted-foreground">
        © 2026 PlantMD Agriculture AI. Built for precision farming.
      </footer>
    </div>
  );
}
