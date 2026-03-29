'use client';

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Leaf, Shield, Zap, BarChart3, Users2, Smartphone, Search, Camera, Activity, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  const teamMembers = [
    { name: "Michaella Kamikazi", role: "Report & Dashboard Developer", image: "https://drive.google.com/uc?export=download&id=1KSYpLDXgOhl1Z498SjzVBBw4QHqsoNKD" },
    { name: "Bodgar Kwizera", role: "AI Model Engineer", image: "https://drive.google.com/uc?export=download&id=1AgCAMbrV7uFePum2EdGhlbf2fWqGB6QP" },
    { name: "Natinael Borana", role: "Front-end Developer", image: "https://drive.google.com/uc?export=download&id=10RanzsGLkdnHLAFVaCdrKdZySw-sEhyA" },
    { name: "Modupe Akanni", role: "Backend Developer", image: "https://drive.google.com/uc?export=download&id=1494RDWpN0YjEKnE3rBDbnk0Yhp8y8iRK" },
    { name: "Lea Abatoni", role: "UI/UX Designer", image: "https://drive.google.com/uc?export=download&id=1aa1FRh72xzqBIDVmfGuop69PosdX2GcS" }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF8] font-outfit text-[#1A2E1A] overflow-x-hidden">
      {/* HEADER / NAVIGATION */}
      <header className="fixed top-0 left-0 right-0 z-[100] bg-white/70 backdrop-blur-xl border-b border-[#1A5336]/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#1A5336] flex items-center justify-center text-white text-xl">
              <Leaf className="h-6 w-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-[#1A5336]">PlantMD</span>
          </div>

          <nav className="hidden md:flex items-center gap-10">
            <Link href="/" className="text-sm font-bold uppercase tracking-widest text-[#1A5336] transition-colors">Home</Link>
            <Link href="#features" className="text-sm font-bold uppercase tracking-widest text-[#1A5336]/60 hover:text-[#1A5336] transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-sm font-bold uppercase tracking-widest text-[#1A5336]/60 hover:text-[#1A5336] transition-colors">How it Works</Link>
            <Link href="#team" className="text-sm font-bold uppercase tracking-widest text-[#1A5336]/60 hover:text-[#1A5336] transition-colors">About Team</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-black uppercase tracking-widest text-[#1A5336] px-4">
              Log In
            </Link>
            <Link href="/signup">
              <button className="h-11 px-8 rounded-full bg-[#1A5336] text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-[#1A5336]/20 transition-all hover:scale-105 active:scale-95">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-32">
        {/* HERO SECTION */}
        <section className="px-6 mb-20 text-center">
          <div className="max-w-7xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#6cdba1]/10 border border-[#6cdba1]/20 text-[#1A5336] text-[10px] font-black uppercase tracking-[0.2em] mb-8">
              <div className="h-1.5 w-1.5 rounded-full bg-[#6cdba1] animate-pulse" />
              Integrated AI Plant Care
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-[#1A5336] leading-[0.9] mb-8">
              Your Harvest, <br />
              <span className="text-[#6cdba1]">Secured</span> by AI
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-[#1A5336]/60 font-medium italic mb-12 leading-relaxed">
              Don't guess with your crops. Use our AI-powered vision system and world-class agronomists to diagnose and treat plant diseases instantly.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-24">
              <Link href="/signup">
                <button className="h-16 px-12 rounded-full bg-[#1A5336] text-white font-black uppercase text-[12px] tracking-[0.3em] shadow-2xl shadow-[#1A5336]/30 transition-all hover:-translate-y-1">
                  Start Analysis
                </button>
              </Link>
              <Link href="/login">
                <button className="h-16 px-12 rounded-full bg-white border-2 border-[#1A5336]/10 text-[#1A5336] font-black uppercase text-[12px] tracking-[0.3em] transition-all hover:bg-[#1A5336]/5">
                  Access Dashboard
                </button>
              </Link>
            </div>

            {/* BENTO GRID (Dashboard Style) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:min-h-[600px]">
              <div className="md:col-span-4 relative rounded-[40px] overflow-hidden shadow-xl group">
                <Image src="/hero-plant.png" alt="Healthy Plant" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A5336] to-transparent opacity-60" />
                <div className="absolute bottom-8 left-8 right-8 text-left">
                  <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-4">
                    <Camera className="h-5 w-5" />
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-tight">One-Touch <br />Diagnosis</h3>
                </div>
              </div>

              <div className="md:col-span-3 bg-[#1A5336] rounded-[40px] p-10 flex flex-col justify-between text-left text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8">
                  <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6cdba1]">Active Users</span>
                  <div className="text-7xl font-semibold tracking-tighter mt-2">10k+</div>
                </div>
                <div className="text-xs font-medium text-white/50 flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#6cdba1]" />
                  Protecting farms globally
                </div>
              </div>

              <div className="md:col-span-5 grid grid-cols-2 gap-6">
                <div className="bg-white rounded-[40px] p-10 border border-[#1A5336]/5 shadow-sm text-left flex flex-col justify-between">
                  <div className="h-12 w-12 rounded-2xl bg-[#f0f9f4] flex items-center justify-center text-[#1A5336]">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-4xl font-black text-[#1A5336] tracking-tighter">100%</div>
                    <p className="text-[10px] font-black uppercase text-[#1A5336]/40 tracking-widest mt-2">Data Security</p>
                  </div>
                </div>

                <div className="bg-[#6cdba1]/10 rounded-[40px] p-10 border border-[#6cdba1]/20 text-left flex flex-col justify-between">
                  <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-[#1A5336]">
                    <Activity className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-3xl font-black text-[#1A5336] tracking-tighter">98.5%</div>
                    <p className="text-[10px] font-black uppercase text-[#1A5336]/40 tracking-widest mt-2">AI Precision</p>
                  </div>
                </div>

                <div className="col-span-2 bg-[#0B2A1C] rounded-[40px] p-10 flex items-center justify-between text-left">
                  <div className="flex flex-col gap-2">
                    <h4 className="text-2xl font-black text-white tracking-tight">Real-time Health Reports</h4>
                    <p className="text-xs text-white/40 font-medium italic">Instant visual pathology tracking for every field.</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-4xl font-black text-[#6cdba1]">95%</div>
                    <div className="h-12 w-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full w-full bg-[#6cdba1]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION (Actual App Features) */}
        <section className="bg-[#022c22] py-32 rounded-[60px] mx-6 relative z-10 shadow-3xl" id="features">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-24">
              <h2 className="text-5xl font-black text-white tracking-tighter leading-tight mb-6">
                Integrated Tools for <br />
                Modern Agriculture
              </h2>
              <p className="text-white/40 font-medium italic max-w-2xl mx-auto">Our platform combines artificial intelligence with human expertise to provide the ultimate plant pathology toolkit.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: "AI Photo Scan", icon: Camera, desc: "Upload a photo and get instant identification of diseases and nutrient deficiencies." },
                { title: "Expert Review", icon: Shield, desc: "Request a deep-dive validation from certified agronomists for critical field decisions." },
                { title: "Personal Dashboard", icon: BarChart3, desc: "Monitor your entire farm's health trends and case history in one unified view." },
                { title: "Disease Tracking", icon: Activity, desc: "Log every scan and track the history of every plant case from submission to resolution." },
                { title: "Regional Alerts", icon: Smartphone, desc: "Get real-time notifications about disease outbreaks and pest swarms in your local area." },
                { title: "Team Collaboration", icon: Users2, desc: "Add managers and experts to your farm workspace to coordinate large-scale treatments." },
              ].map((service, i) => (
                <div key={i} className="group bg-white/5 border border-white/10 p-10 rounded-[32px] hover:bg-white/10 transition-all cursor-pointer relative min-h-[300px] flex flex-col justify-between">
                  <div>
                    <div className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center text-[#6cdba1] mb-8 group-hover:scale-110 transition-transform">
                      <service.icon className="h-6 w-6" />
                    </div>
                    <h4 className="text-2xl font-black text-white tracking-tight mb-4">{service.title}</h4>
                    <p className="text-sm text-white/40 leading-relaxed">
                      {service.desc}
                    </p>
                  </div>
                  <div className="absolute top-10 right-10 text-white/20 group-hover:text-white transition-colors">
                    <ArrowUpRight className="h-6 w-6" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION (Divided for Farmers) */}
        <section className="bg-white py-40 rounded-b-[60px]" id="how-it-works">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center gap-20">
              <div className="flex-1">
                <div className="relative p-10 bg-[#f8faf8] rounded-[50px] shadow-sm border border-[#1A5336]/5 h-[500px]">
                  <Image src="/dashboard-mock.png" alt="Dashboard" fill className="object-cover rounded-[40px] shadow-2xl" />
                </div>
              </div>
              <div className="flex-1 text-left">
                <h2 className="text-5xl font-black text-[#1A5336] tracking-tighter leading-none mb-8">
                  How PlantMD works <br />for your farm
                </h2>
                <p className="text-[#1A5336]/60 font-medium italic mb-12">Three simple steps to move from a sick plant to a booming harvest.</p>

                <div className="space-y-12">
                  {[
                    { t: "1. Capture & Upload", d: "Snap a high-quality photo of your affected plant and upload it through our mobile-responsive dashboard." },
                    { t: "2. Automatic Scan", d: "Our specialized Gemini-powered AI identifies the disease and assigns an urgency level in seconds." },
                    { t: "3. Resolve with Expert Help", d: "Follow the instant treatment plan or request a second opinion from our network of agronomists." }
                  ].map((step, i) => (
                    <div key={i} className="flex gap-6 relative">
                      {i < 2 && <div className="absolute left-[11px] top-[30px] w-0.5 h-[calc(100%+24px)] bg-[#1A5336]/10" />}
                      <div className="h-6 w-6 rounded-full bg-[#1A5336] flex items-center justify-center text-[#6cdba1] flex-shrink-0 z-10">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <h5 className="text-xl font-black text-[#1A5336] tracking-tight">{step.t}</h5>
                        <p className="text-[#1A5336]/60 text-sm font-medium leading-relaxed">{step.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT OUR TEAM SECTION (New!) */}
        <section className="py-40 bg-[#f8faf8]" id="team">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="mb-24">
              <h2 className="text-5xl font-black text-[#1A5336] tracking-tighter mb-6">The Minds Behind PlantMD</h2>
              <p className="text-[#1A5336]/60 font-medium italic max-w-2xl mx-auto">Meet the experts in agronomy, AI, and software engineering who are redefining agricultural intelligence.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
              {teamMembers.map((member, i) => (
                <div key={i} className="group flex flex-col items-center">
                  <div className="w-full aspect-square relative rounded-[40px] overflow-hidden mb-6 shadow-lg shadow-[#1A5336]/5 border-4 border-white transition-all group-hover:border-[#6cdba1]/30 h-[220px]">
                    <Image src={member.image} alt={member.name} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  </div>
                  <h4 className="text-xl font-black text-[#1A5336] tracking-tight mb-1">{member.name}</h4>
                  <p className="text-[10px] font-black uppercase text-[#1A5336]/40 tracking-widest">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="px-6 mb-12">
          <div className="max-w-7xl mx-auto bg-[#1A5336] rounded-[60px] py-40 relative overflow-hidden text-center text-white">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            <h2 className="text-5xl font-black tracking-tighter mb-8 relative z-10">From Seedling to Success</h2>
            <p className="text-white/50 italic mb-12 relative z-10 max-w-xl mx-auto">Join thousands of farmers already using AI to protect their livelihood. Get started with a free scan today.</p>
            <Link href="/signup">
              <button className="h-16 px-16 rounded-full bg-[#6cdba1] text-[#1A5336] font-black uppercase text-[12px] tracking-[0.3em] relative z-10 hover:bg-white transition-all transform hover:scale-105 active:scale-95">
                Join the Platform
              </button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-[#111827] pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-20 mb-32 items-start">
            <div className="md:col-span-5">
              <div className="flex items-center gap-3 mb-8">
                <Leaf className="h-8 w-8 text-[#6cdba1]" />
                <span className="text-2xl font-black tracking-tighter text-white">PlantMD</span>
              </div>
              <p className="text-white/40 text-sm leading-relaxed mb-10 max-w-sm">
                Empowering farmers with intelligent diagnostic tools. Protect your crops, maximize your yield, and secure your financial future with artificial intelligence.
              </p>
            </div>

            <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-12">
              <div className="flex flex-col gap-6">
                <h6 className="text-sm font-black text-white uppercase tracking-widest">Platform</h6>
                <ul className="space-y-4">
                  <li><Link href="#features" className="text-sm text-white/40 hover:text-[#6cdba1] transition-colors">Features</Link></li>
                  <li><Link href="#how-it-works" className="text-sm text-white/40 hover:text-[#6cdba1] transition-colors">How it Works</Link></li>
                  <li><Link href="#team" className="text-sm text-white/40 hover:text-[#6cdba1] transition-colors">Our Team</Link></li>
                </ul>
              </div>

              <div className="flex flex-col gap-6">
                <h6 className="text-sm font-black text-white uppercase tracking-widest">Access</h6>
                <ul className="space-y-4">
                  <li><Link href="/login" className="text-sm text-white/40 hover:text-[#6cdba1] transition-colors">Log In</Link></li>
                  <li><Link href="/signup" className="text-sm text-white/40 hover:text-[#6cdba1] transition-colors">Sign Up</Link></li>
                </ul>
              </div>

              <div className="flex flex-col gap-6">
                <h6 className="text-sm font-black text-white uppercase tracking-widest">Connect</h6>
                <div className="social-row flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 cursor-pointer hover:bg-white/10 hover:text-white transition-all text-sm font-black">in</div>
                  <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 cursor-pointer hover:bg-white/10 hover:text-white transition-all text-sm font-black">f</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center border-t border-white/5 pt-12 text-[10px] font-bold uppercase tracking-widest text-white/20">
            <p>© 2026 PlantMD Platform. Designed for modern agriculture.</p>
            <div className="flex gap-10 mt-6 md:mt-0">
              <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
