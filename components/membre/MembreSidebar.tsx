"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard, CreditCard, MessageSquare,
  User, Settings, LogOut, CheckCircle, Loader2, Calendar
} from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const MENU = [
  { href: "/membre",             label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/membre/cotisations", label: "Mes Cotisations",  icon: CreditCard },
  { href: "/membre/evenements",  label: "Mes Événements",   icon: Calendar },
  { href: "/membre/messagerie",  label: "Messagerie",       icon: MessageSquare },
  { href: "/membre/profil",      label: "Mon Profil",       icon: User },
  { href: "/membre/parametres",  label: "Paramètres",       icon: Settings },
];

export function MembreSidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  return (
    <aside
      className="w-full md:w-64 shrink-0 flex flex-col"
      style={{
        backgroundColor: "var(--sidebar)",
        borderRight: "1px solid var(--sidebar-border)",
        minHeight: "calc(100vh - 64px)",
      }}
    >
      {/* Profil */}
      <div className="p-5" style={{ borderBottom: "1px solid var(--sidebar-border)" }}>
        {status === "loading" ? (
          <div className="flex items-center gap-3">
            <div
              className="h-12 w-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "var(--muted)" }}
            >
              <Loader2 className="h-5 w-5 animate-spin" style={{ color: "var(--muted-foreground)" }} />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-24 rounded" style={{ backgroundColor: "var(--muted)" }} />
              <div className="h-3 w-16 rounded" style={{ backgroundColor: "var(--muted)" }} />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div
              className="h-12 w-12 rounded-full flex items-center justify-center font-bold text-lg"
              style={{
                backgroundColor: "color-mix(in srgb, var(--acogrami-green) 12%, transparent)",
                color: "var(--acogrami-green)",
              }}
            >
              {session?.user?.name?.[0]?.toUpperCase() || "M"}
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: "var(--sidebar-foreground)" }}>
                {session?.user?.name || "Membre"}
              </p>
              <p className="text-xs flex items-center gap-1" style={{ color: "var(--muted-foreground)" }}>
                <CheckCircle className="h-3 w-3 text-green-500" />
                Membre actif
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5">
        {MENU.map(({ href, label, icon: Icon }) => {
          const exact = href === "/membre";
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
              style={{
                backgroundColor: active ? "var(--sidebar-active-bg)" : "transparent",
                color: active ? "var(--sidebar-active-fg)" : "var(--sidebar-foreground)",
              }}
              onMouseEnter={e => {
                if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = "var(--sidebar-hover)";
              }}
              onMouseLeave={e => {
                if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
              }}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Thème + Déconnexion */}
      <div className="p-3 space-y-2" style={{ borderTop: "1px solid var(--sidebar-border)" }}>
        <div className="flex items-center gap-3 px-3 py-2">
          <ThemeToggle />
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-colors"
          style={{ color: "#ef4444" }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(239,68,68,0.08)"}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
