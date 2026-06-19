"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Chatbot } from "@/components/layout/Chatbot";

const LOGGED_PREFIXES = ["/dashboard", "/admin", "/membre", "/responsable"];

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoggedArea = LOGGED_PREFIXES.some((p) => pathname.startsWith(p));

  return (
    <>
      {!isLoggedArea && <Navbar />}
      <main className="flex-1">{children}</main>
      {!isLoggedArea && <Footer />}
      {!isLoggedArea && <Chatbot />}
    </>
  );
}
