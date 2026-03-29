import { login } from "./actions";
import { Leaf, Lock, Mail, AlertCircle, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import Link from "next/link";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function LoginPage({
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
              Smart Agriculture
            </span>
          </div>
        </Link>

        {/* The Login Card */}
        <Card className="w-full p-8 rounded-[32px] bg-white border-none shadow-xl shadow-black/5">
          <div className="flex flex-col gap-2 mb-8 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Welcome Back
            </h1>
            <p className="text-sm text-muted-foreground font-medium">
              Sign in to your account.
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

            <div className="flex flex-col gap-3 mt-4">
              <Button
                type="submit"
                formAction={login}
                className="w-full h-12 rounded-xl bg-[#1A5336] hover:bg-[#113a25] text-white font-bold shadow-lg shadow-[#1A5336]/20 transition-all hover:-translate-y-0.5"
              >
                Sign In
              </Button>
              <Link href="/signup" className="w-full">
                <Button
                  variant="outline"
                  className="w-full h-12 rounded-xl border-border/60 hover:bg-[#f8faf9] font-bold text-muted-foreground transition-all"
                >
                  Don't have an account? Sign Up
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
