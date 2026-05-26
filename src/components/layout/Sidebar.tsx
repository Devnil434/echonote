"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard, Mic, Settings, LogOut, Menu, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
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
        <span className="text-lg font-bold text-foreground">🎙️ EchoNote</span>
        {/* Close button — mobile only */}
        <button
          className="md:hidden text-muted-foreground hover:text-foreground"
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
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              pathname === href
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/10"
                : "text-muted-foreground hover:bg-accent/60 hover:text-accent-foreground"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Sign out & Theme Toggle */}
      <div className="px-3 mt-auto pt-4 border-t border-border/40 flex items-center justify-between gap-2">
        <Button
          variant="ghost"
          className="justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-accent/60 flex-1 px-3"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </Button>
        <ThemeToggle />
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
      <aside className="hidden md:flex w-56 border-r border-border/40 bg-sidebar text-sidebar-foreground flex-col py-6 shrink-0">
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
          className="bg-background text-foreground border-border/40 shadow-sm"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* ── Mobile: overlay + drawer ──────────────────────── */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <aside className="md:hidden fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-border/40 text-sidebar-foreground z-50 flex flex-col py-6 shadow-xl">
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
