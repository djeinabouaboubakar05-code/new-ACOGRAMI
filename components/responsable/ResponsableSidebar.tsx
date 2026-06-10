"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { LayoutDashboard, Users, CreditCard, Newspaper, LogOut, MapPin } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const MENU = [
  { href: "/responsable",             label: "Tableau de bord",    icon: LayoutDashboard },
  { href: "/responsable/adhesions",   label: "Demandes d'adhésion", icon: Users },
  { href: "/responsable/membres",     label: "Membres du village", icon: MapPin },
  { href: "/responsable/cotisations", label: "Cotisations",        icon: CreditCard },
  { href: "/responsable/publications",label: "Publier actualité",  icon: Newspaper },
];

export function ResponsableSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const village = (session?.user as any)?.village || "Mon village";

  return (
    <aside
      className="w-full md:w-64 shrink-0 flex flex-col"
      style={{
        backgroundColor: "var(--sidebar)",
        borderRight: "1px solid var(--sidebar-border)",
        minHeight: "calc(100vh - 64px)",
      }}
    >
      {/* En-tête */}
      <div className="p-5" style={{ borderBottom: "1px solid var(--sidebar-border)" }}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--acogrami-accent)" }}>
          Espace
        </p>
        <p className="font-bold text-base" style={{ color: "var(--sidebar-foreground)" }}>
          Responsable Village
        </p>
        <div
          className="mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium"
          style={{
            backgroundColor: "color-mix(in srgb, var(--acogrami-green) 12%, transparent)",
            color: "var(--acogrami-green)",
          }}
        >
          <MapPin className="h-3.5 w-3.5" />
          {village}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5">
        {MENU.map(({ href, label, icon: Icon }) => {
          const exact = href === "/responsable";
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
