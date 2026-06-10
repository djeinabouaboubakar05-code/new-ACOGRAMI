import type { Metadata } from "next";
import { AdhesionForm } from "@/components/adhesion/AdhesionForm";
import { prisma } from "@/lib/prisma";
import { Users, CheckCircle, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Adhésion | ACOGRAMI",
  description: "Devenez membre de l'ACOGRAMI et rejoignez la communauté du Grand Mifi.",
};

export default async function AdhesionPage() {
  const villages = await prisma.village.findMany({ orderBy: { nom: 'asc' } });

  return (
    <div className="bg-background">
      <div className="border-b border-acogrami-green/10 bg-acogrami-green py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-acogrami-accent">
            Devenir membre
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Rejoignez la communauté ACOGRAMI et participez au développement du Grand Mifi.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <AdhesionForm villages={villages.map(v => ({ nom: v.nom, slug: v.slug }))} />
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl bg-acogrami-green p-6 text-white">
              <h3 className="font-bold text-lg mb-4">Pourquoi adhérer ?</h3>
              <ul className="space-y-4">
                {[
                  { icon: Users, text: "Faire partie d'une communauté solidaire de 16 villages" },
                  { icon: CheckCircle, text: "Participer aux décisions et aux assemblées générales" },
                  { icon: Clock, text: "Bénéficier de l'entraide communautaire" },
                ].map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-3">
                    <Icon className="h-5 w-5 text-acogrami-accent shrink-0 mt-0.5" />
                    <span className="text-sm text-white/90">{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl p-6" style={{ border: "1px solid var(--card-border)", backgroundColor: "var(--card)" }}>
              <h3 className="font-bold mb-2" style={{ color: "var(--card-foreground)" }}>Déjà membre ?</h3>
              <p className="text-sm mb-4" style={{ color: "var(--muted-foreground)" }}>
                Connectez-vous pour accéder à votre espace membre.
              </p>
              <a href="/login" className="inline-block w-full text-center rounded-xl bg-acogrami-accent py-3 font-bold text-white hover:bg-acogrami-earth transition-colors">
                Se connecter
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
