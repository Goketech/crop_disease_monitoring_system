import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { RoleProvider, UserRole } from "@/components/providers/role-context";
import { createClient } from "@/lib/supabase/server";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PlantMD - Agronomy Dashboard",
  description: "Platform for farmers and agronomists to diagnose and track plant health.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let role: UserRole = "farmer";
  let fullName: string = "User";
  let avatarUrl: string | null = null;
  let phoneNumber: string | null = null;
  let smsEnabled: boolean = true;
  
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('role, full_name, avatar_url, phone_number, sms_notifications_enabled')
      .eq('id', user.id)
      .single();
      
    if (data) {
       role = (data.role as UserRole) || "farmer";
       fullName = data.full_name || "User";
       avatarUrl = data.avatar_url;
       phoneNumber = data.phone_number;
       smsEnabled = data.sms_notifications_enabled ?? true;
    }
  }

  return (
    <html lang="en">
      <body
        className={`${outfit.variable} font-sans antialiased`}
      >
        <RoleProvider 
          initialRole={role} 
          userId={user?.id || null} 
          initialFullName={fullName}
          initialAvatarUrl={avatarUrl}
          initialPhoneNumber={phoneNumber}
          initialSmsEnabled={smsEnabled}
        >
          {children}
        </RoleProvider>
      </body>
    </html>
  );
}
