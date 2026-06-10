"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Globe } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { useSession, signOut } from "next-auth/react";

const LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/apropos", label: "À propos" },
  { href: "/actualites", label: "Actualités" },
  { href: "/evenements", label: "Événements" },
  { href: "/projets", label: "Projets" },
  { href: "/villages", label: "Villages" },
  { href: "/galerie", label: "Galerie" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { data: session, status } = useSession();
  const user = session?.user as any;

  const dashHref =
    user?.role === "ADMIN" ? "/admin"
    : user?.role === "RESPONSABLE" ? "/responsable"
    : "/membre";

  const dashLabel =
    user?.role === "ADMIN" ? "Administration"
    : user?.role === "RESPONSABLE" ? "Espace Responsable"
    : "Espace Membre";

  return (
    <>
      {/* Bandeau supérieur */}
      <div
        style={{ backgroundColor: "var(--acogrami-green)" }}
        className="py-1.5 text-center text-xs font-medium text-white/90"
      >
        Rejoignez ACOGRAMI — 16 villages, 1 seule famille.{" "}
        <Link href="/adhesion" className="ml-1 font-bold text-white underline underline-offset-2 hover:text-amber-300 transition-colors">
          Devenir membre
        </Link>
      </div>

      {/* Navbar principale */}
      <header
        className="sticky top-0 z-50 backdrop-blur-md"
        style={{
          backgroundColor: "color-mix(in srgb, var(--background-alt) 95%, transparent)",
          borderBottom: "1px solid var(--border)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-full border-2 font-bold text-base text-white"
              style={{ backgroundColor: "var(--acogrami-green)", borderColor: "var(--acogrami-accent)" }}
            >
              AC
            </div>
            <div className="leading-tight">
              <span className="block text-base font-extrabold tracking-wide" style={{ color: "var(--acogrami-green)" }}>
                ACOGRAMI
              </span>
              <span className="hidden text-[11px] sm:block" style={{ color: "var(--muted-foreground)" }}>
                Communauté Grand Mifi
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {LINKS.map((link) => {
              const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-3 py-2 text-sm font-medium rounded-md transition-colors"
                  style={{
                    color: active ? "var(--acogrami-green)" : "var(--foreground-subtle)",
                    backgroundColor: active ? "color-mix(in srgb, var(--acogrami-green) 8%, transparent)" : "transparent",
                  }}
                  onMouseEnter={e => {
                    if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = "var(--muted)";
                  }}
                  onMouseLeave={e => {
                    if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                  }}
                >
                  {link.label}
                  {active && (
                    <span
                      className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full"
                      style={{ backgroundColor: "var(--acogrami-green)" }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions Droite */}
          <div className="hidden xl:flex items-center gap-3">
            <ThemeToggle />

            {status !== "loading" && session ? (
              <>
                <Link
                  href={dashHref}
                  className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "var(--acogrami-green)" }}
                >
                  {dashLabel}
                </Link>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="rounded-md border px-3 py-2 text-sm font-semibold transition-colors cursor-pointer"
                  style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = "var(--muted)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"}
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/adhesion"
                  className="rounded-md px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "var(--acogrami-accent)" }}
                >
                  Devenir membre
                </Link>
                <Link
                  href="/login"
                  className="rounded-md border px-4 py-2 text-sm font-semibold transition-colors"
                  style={{
                    borderColor: "var(--acogrami-green)",
                    color: "var(--acogrami-green)",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = "color-mix(in srgb, var(--acogrami-green) 8%, transparent)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                  }}
                >
                  Connexion
                </Link>
              </>
            )}
          </div>

          {/* Bouton menu mobile */}
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md xl:hidden transition-colors cursor-pointer"
            style={{ color: "var(--foreground)" }}
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = "var(--muted)"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Menu Mobile */}
        {open && (
          <nav
            className="border-t xl:hidden animate-fadeSlideIn"
            style={{ backgroundColor: "var(--background-alt)", borderColor: "var(--border)" }}
          >
            <div className="px-4 py-3 space-y-1">
              {LINKS.map((link) => {
                const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                    style={{
                      color: active ? "var(--acogrami-green)" : "var(--foreground)",
                      backgroundColor: active ? "color-mix(in srgb, var(--acogrami-green) 8%, transparent)" : "transparent",
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div
              className="px-4 py-3 border-t space-y-3"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>Changer le thème</span>
              </div>

              {status !== "loading" && session ? (
                <div className="flex flex-col gap-2">
                  <Link
                    href={dashHref}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-bold text-white"
                    style={{ backgroundColor: "var(--acogrami-green)" }}
                  >
                    {dashLabel}
                  </Link>
                  <button
                    onClick={() => { setOpen(false); signOut({ callbackUrl: "/" }); }}
                    className="flex items-center justify-center rounded-lg border px-4 py-2.5 text-sm font-bold cursor-pointer"
                    style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
                  >
                    Déconnexion
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/adhesion"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-bold text-white"
                    style={{ backgroundColor: "var(--acogrami-accent)" }}
                  >
                    Devenir membre
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center rounded-lg border px-4 py-2.5 text-sm font-bold"
                    style={{ borderColor: "var(--acogrami-green)", color: "var(--acogrami-green)" }}
                  >
                    Connexion
                  </Link>
                </div>
              )}
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
