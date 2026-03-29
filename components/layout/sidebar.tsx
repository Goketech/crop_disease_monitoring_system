"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, LayoutDashboard, FileText, UserCheck, BarChart3, Users, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRole } from "@/components/providers/role-context";
import { logout } from "@/app/login/actions";

const mainNav = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["farmer", "admin"] },
  { name: "Diagnose", href: "/diagnose", icon: Leaf, roles: ["farmer"] },
  { name: "Cases", href: "/cases", icon: FileText, roles: ["farmer", "agronomist"] },
  { name: "Review Queue", href: "/experts", icon: UserCheck, roles: ["agronomist"] },
  { name: "Users", href: "/admin/users", icon: Users, roles: ["admin"] },
  { name: "Analytics", href: "/analytics", icon: BarChart3, roles: ["admin"] },
];

const generalNav = [
  { name: "Settings", href: "/settings/profile", icon: Settings },
  { name: "Logout", href: "/", icon: LogOut },
];

export function Sidebar() {
  const pathname = usePathname();
  const { role } = useRole();

  const filteredNav = mainNav.filter(item => item.roles.includes(role));

  const logoHref = role === 'agronomist' ? '/experts' : '/dashboard';

  return (
    <div className="flex h-screen w-64 flex-col gap-6 bg-sidebar px-6 py-8 border-r border-sidebar-border overflow-y-auto">
      {/* Logo */}
      <Link href={logoHref} className="flex items-center gap-2 px-2 text-primary font-bold text-2xl tracking-tight hover:opacity-80 transition-opacity">
        <Leaf className="h-7 w-7" />
        PlantMD
      </Link>

      {/* Main Menu */}
      <div className="flex flex-1 flex-col gap-8 mt-4">
        <nav className="flex flex-col gap-1">
          <span className="px-2 text-xs font-semibold text-muted-foreground tracking-wider mb-2 uppercase">
            Menu
          </span>
          {filteredNav.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground",
                  isActive
                    ? "bg-muted text-primary"
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* General Menu */}
        <nav className="flex flex-col gap-1">
          <span className="px-2 text-xs font-semibold text-muted-foreground tracking-wider mb-2 uppercase">
            General
          </span>
          {generalNav.map((item) => {
             const isActive = pathname.startsWith(item.href);
             
             if (item.name === "Logout") {
               return (
                 <button
                   key={item.name}
                   onClick={() => logout()}
                   className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-sm font-medium transition-colors hover:bg-muted text-muted-foreground hover:text-foreground text-left"
                 >
                   <item.icon className="h-5 w-5" />
                   {item.name}
                 </button>
               );
             }

             return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground",
                  isActive ? "bg-muted text-foreground" : "text-muted-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
