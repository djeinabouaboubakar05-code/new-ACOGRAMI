import { ShieldCheck, Lock } from "lucide-react";
import Link from "next/link";

export function CotisationSection() {
  return (
    <section className="rounded-2xl bg-acogrami-green p-8 text-white shadow-lg relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Payer ma cotisation</h2>
            <p className="text-white/70 flex items-center gap-2">
              <Lock className="h-3 w-3" />
              Réservé aux membres de l'ACOGRAMI
            </p>
          </div>
        </div>
        
        <p className="text-white/90 mb-8">
          La cotisation annuelle est obligatoire pour tous les membres statutaires de l'association. 
          Elle garantit votre statut de membre actif et vous donne le droit de voter aux assemblées générales, 
          ainsi que de bénéficier de l'assistance de la communauté.
        </p>

        <div className="rounded-xl border border-white/20 bg-black/10 p-5 mb-8">
          <h3 className="font-semibold mb-2">Pourquoi payer sa cotisation ?</h3>
          <ul className="list-disc list-inside text-sm text-white/80 space-y-1">
            <li>Droit de vote aux Assemblées Générales</li>
            <li>Assistance en cas d'événements heureux ou malheureux</li>
            <li>Participation active au développement de votre village</li>
          </ul>
        </div>

        <Link 
          href="/membre" 
          className="inline-flex w-full items-center justify-center rounded-xl bg-white py-4 font-bold text-acogrami-green hover:bg-zinc-100 transition-colors"
        >
          Se connecter à l'espace membre pour payer
        </Link>
      </div>
    </section>
  );
}
