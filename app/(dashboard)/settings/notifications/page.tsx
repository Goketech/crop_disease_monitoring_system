import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import NotificationsForm from "./notifications-form";

export default async function NotificationsSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("phone_number, sms_notifications_enabled")
    .eq("id", user.id)
    .single();

  return (
    <NotificationsForm
      initialSmsEnabled={profile?.sms_notifications_enabled ?? true}
      phoneNumber={profile?.phone_number ?? ""}
    />
  );
}
