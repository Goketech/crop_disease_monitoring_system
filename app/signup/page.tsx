import { signup } from "../login/actions";
import { Leaf, Lock, Mail, User, AlertCircle, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import Link from "next/link";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function SignupPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const resolvedSearchParams = await searchParams;
  const error = resolvedSearchParams.error as string | undefined;

  return (
    <div className="min-h-screen bg-[#f8faf9] flex items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col items-center">
        {/* The App Logo */}
        <Link href="/" className="flex items-center gap-2 mb-8 group">
          <div className="bg-[#1A5336] p-3 rounded-2xl shadow-lg shadow-[#1A5336]/20 group-hover:scale-105 transition-transform">
            <Leaf className="h-8 w-8 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-black tracking-tighter text-[#1A5336] leading-none">
              PlantMD
            </span>
            <span className="text-[10px] uppercase font-black tracking-[0.3em] text-primary/60 mt-1">
              Join the Future
            </span>
          </div>
        </Link>

        {/* The Signup Card */}
        <Card className="w-full p-8 rounded-[32px] bg-white border-none shadow-xl shadow-black/5">
          <div className="flex flex-col gap-2 mb-8 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Create Account
            </h1>
            <p className="text-sm text-muted-foreground font-medium">
              Join our global network of farmers and experts.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-3 text-destructive animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <p className="text-sm font-semibold leading-snug">{error}</p>
            </div>
          )}

          <form className="flex flex-col gap-5">
            <div className="space-y-2">
              <Label
                htmlFor="full_name"
                className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1"
              >
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="full_name"
                  name="full_name"
                  type="text"
                  placeholder="John Doe"
                  required
                  className="pl-10 h-12 rounded-xl bg-[#fcfdfc] border-border/60 focus-visible:ring-[#1A5336] font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1"
              >
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  className="pl-10 h-12 rounded-xl bg-[#fcfdfc] border-border/60 focus-visible:ring-[#1A5336] font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="phone_number"
                className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1"
              >
                Phone Number (for SMS Alerts)
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground flex items-center justify-center">
                  <span className="text-[10px] font-bold">+</span>
                </div>
                <Input
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  placeholder="250 788 000 000"
                  required
                  className="pl-10 h-12 rounded-xl bg-[#fcfdfc] border-border/60 focus-visible:ring-[#1A5336] font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1"
              >
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="pl-10 h-12 rounded-xl bg-[#fcfdfc] border-border/60 focus-visible:ring-[#1A5336] font-medium"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2 border-t border-border/20 mt-2">
              <Label className="text-xs font-black uppercase tracking-widest text-[#1A5336] ml-1">
                Choose Your Role
              </Label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-muted/30 rounded-2xl border border-border/40">
                <div className="relative">
                  <input
                    type="radio"
                    name="role"
                    id="role-farmer"
                    value="farmer"
                    className="peer absolute opacity-0"
                    defaultChecked
                  />
                  <label
                    htmlFor="role-farmer"
                    className="flex items-center justify-center h-10 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer transition-all peer-checked:bg-[#1A5336] peer-checked:text-white border border-transparent peer-checked:shadow-sm text-muted-foreground hover:bg-white/50"
                  >
                    Farmer
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="radio"
                    name="role"
                    id="role-agronomist"
                    value="agronomist"
                    className="peer absolute opacity-0"
                  />
                  <label
                    htmlFor="role-agronomist"
                    className="flex items-center justify-center h-10 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer transition-all peer-checked:bg-[#1A5336] peer-checked:text-white border border-transparent peer-checked:shadow-sm text-muted-foreground hover:bg-white/50"
                  >
                    Agronomist
                  </label>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-4">
              <Button
                type="submit"
                formAction={signup}
                className="w-full h-12 rounded-xl bg-[#1A5336] hover:bg-[#113a25] text-white font-bold shadow-lg shadow-[#1A5336]/20 transition-all hover:-translate-y-0.5"
              >
                Register
              </Button>
              <Link href="/login" className="w-full">
                <Button
                  variant="ghost"
                  className="w-full h-12 rounded-xl border-none hover:bg-[#f8faf9] font-bold text-muted-foreground transition-all"
                >
                  Already have an account? Sign In
                </Button>
              </Link>
            </div>
          </form>
        </Card>

        <Link
          href="/"
          className="mt-8 flex items-center gap-2 text-xs text-muted-foreground font-bold uppercase tracking-widest hover:text-[#1A5336] transition-colors"
        >
          <ChevronLeft className="h-3 w-3" />
          Back to Homepage
        </Link>
      </div>
    </div>
  );
}
