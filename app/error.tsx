"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="h-20 w-20 rounded-2xl flex items-center justify-center shadow-xl mb-8" style={{ backgroundColor: "color-mix(in srgb, #ef4444 12%, transparent)" }}>
        <AlertTriangle className="h-10 w-10 text-red-500" />
      </div>

      <h1 className="text-3xl font-extrabold mb-3" style={{ color: "var(--foreground)" }}>
        Une erreur est survenue
      </h1>
      <p className="text-lg max-w-md mb-8" style={{ color: "var(--muted-foreground)" }}>
        Quelque chose s&apos;est mal passé. Veuillez réessayer ou revenir à l&apos;accueil.
      </p>

      <div className="flex flex-wrap gap-3 justify-center">
        <button onClick={reset} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white cursor-pointer hover:opacity-90 transition-opacity" style={{ backgroundColor: "var(--acogrami-green)" }}>
          <RefreshCw className="h-4 w-4" />
          Réessayer
        </button>
        <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-colors" style={{ backgroundColor: "var(--muted)", color: "var(--foreground)" }}>
          <Home className="h-4 w-4" />
          Accueil
        </Link>
      </div>
    </div>
  );
}
