"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, MapPin, Calendar, FolderOpen,
  LogOut, ShieldCheck, Mail, Settings, MessageSquare,
  Images, Star, Handshake, Award
} from "lucide-react";
import { signOut } from "next-auth/react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const MENU = [
  { href: "/admin",             label: "Tableau de bord",  icon: LayoutDashboard },
  { href: "/admin/utilisateurs",label: "Utilisateurs",     icon: Users },
  { href: "/admin/villages",    label: "Villages",         icon: MapPin },
  { href: "/admin/evenements",  label: "Événements",       icon: Calendar },
  { href: "/admin/projets",     label: "Projets soumis",   icon: FolderOpen },
  { href: "/admin/messages",    label: "Messages contact", icon: MessageSquare },
  { href: "/admin/galerie",     label: "Galerie",          icon: Images },
  { href: "/admin/bureau",      label: "Bureau exécutif",  icon: Award },
  { href: "/admin/partenaires", label: "Partenaires",      icon: Handshake },
  { href: "/admin/valeurs",     label: "Valeurs",          icon: Star },
  { href: "/admin/newsletter",  label: "Newsletter",       icon: Mail },
  { href: "/admin/parametres",  label: "Paramètres",       icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

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
      <div
        className="p-5 flex items-center gap-3"
        style={{ borderBottom: "1px solid var(--sidebar-border)" }}
      >
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: "color-mix(in srgb, var(--acogrami-green) 12%, transparent)" }}
        >
          <ShieldCheck className="h-5 w-5" style={{ color: "var(--acogrami-green)" }} />
        </div>
        <div>
          <p className="font-bold text-sm" style={{ color: "var(--sidebar-foreground)" }}>Administration</p>
          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Accès total ACOGRAMI</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {MENU.map(({ href, label, icon: Icon }) => {
          const exact = href === "/admin";
          const active = exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");
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
              <span>{label}</span>
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
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
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
