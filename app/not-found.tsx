import Link from "next/link";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="relative mb-8">
        <p className="text-[10rem] font-black leading-none select-none" style={{ color: "color-mix(in srgb, var(--acogrami-green) 12%, transparent)" }}>
          404
        </p>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-20 w-20 rounded-2xl flex items-center justify-center shadow-xl" style={{ backgroundColor: "var(--acogrami-green)" }}>
            <Search className="h-10 w-10 text-white" />
          </div>
        </div>
      </div>

      <h1 className="text-3xl font-extrabold mb-3" style={{ color: "var(--foreground)" }}>
        Page introuvable
      </h1>
      <p className="text-lg max-w-md mb-8" style={{ color: "var(--muted-foreground)" }}>
        La page que vous cherchez n&apos;existe pas ou a été déplacée. Retournez à l&apos;accueil ou utilisez la navigation.
      </p>

      <div className="flex flex-wrap gap-3 justify-center">
        <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white hover:opacity-90 transition-opacity" style={{ backgroundColor: "var(--acogrami-green)" }}>
          <Home className="h-4 w-4" />
          Accueil
        </Link>
        <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-colors" style={{ backgroundColor: "var(--muted)", color: "var(--foreground)" }}>
          <ArrowLeft className="h-4 w-4" />
          Nous contacter
        </Link>
      </div>
    </div>
  );
}
