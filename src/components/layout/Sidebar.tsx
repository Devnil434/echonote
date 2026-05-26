"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard, Mic, Settings, LogOut, Menu, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard",    label: "Dashboard",   icon: LayoutDashboard },
  { href: "/meetings/new", label: "New Meeting",  icon: Mic },
  { href: "/settings",     label: "Settings",    icon: Settings },
];

interface NavContentProps {
  pathname: string;
  setMobileOpen: (open: boolean) => void;
  handleSignOut: () => void;
}

function NavContent({ pathname, setMobileOpen, handleSignOut }: NavContentProps) {
  return (
    <>
      {/* Logo */}
      <div className="px-3 mb-8 flex items-center justify-between">
        <span className="text-lg font-bold text-slate-900">🎙️ EchoNote</span>
        {/* Close button — mobile only */}
        <button
          className="md:hidden text-slate-500 hover:text-slate-800"
          onClick={() => setMobileOpen(false)}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              pathname === href
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Sign out */}
      <div className="px-3 mt-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-slate-500 hover:text-slate-800"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const supabase = createClient();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <>
      {/* ── Desktop sidebar ──────────────────────────────── */}
      <aside className="hidden md:flex w-56 border-r bg-white flex-col py-6 shrink-0">
        <NavContent
          pathname={pathname}
          setMobileOpen={setMobileOpen}
          handleSignOut={handleSignOut}
        />
      </aside>

      {/* ── Mobile: hamburger button ─────────────────────── */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMobileOpen(true)}
          className="bg-white shadow-sm"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* ── Mobile: overlay + drawer ──────────────────────── */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 bg-black/40 z-40"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <aside className="md:hidden fixed left-0 top-0 h-full w-64 bg-white z-50 flex flex-col py-6 shadow-xl">
            <NavContent
              pathname={pathname}
              setMobileOpen={setMobileOpen}
              handleSignOut={handleSignOut}
            />
          </aside>
        </>
      )}
    </>
  );
}
