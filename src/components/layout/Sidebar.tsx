"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Mic, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/meetings/new", label: "New Meeting", icon: Mic },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <aside className="w-56 border-r bg-white flex flex-col py-6 px-3">
      {/* Logo */}
      <div className="px-3 mb-8">
        <span className="text-lg font-bold text-slate-900">🎙️ EchoNote</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              pathname === href
                ? "bg-slate-100 text-slate-900"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Sign out */}
      <Button
        variant="ghost"
        className="justify-start gap-3 text-slate-600"
        onClick={handleSignOut}
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </Button>
    </aside>
  );
}
