import { VillagesSection } from "@/components/apropos/VillagesSection";
import { ValuesSection } from "@/components/apropos/ValuesSection";
import { BureauSection } from "@/components/apropos/BureauSection";
import { PartnersSection } from "@/components/home/PartnersSection";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Découvrez l'ACOGRAMI, ses 16 villages, ses valeurs et les membres du bureau.",
};

export default async function AproposPage() {
  const valeurs = await prisma.valeur.findMany({ orderBy: { ordre: 'asc' } });

  return (
    <div>
      <section
        className="relative w-full min-h-[400px] flex items-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1542884748-2b87b36c6b90?q=80&w=2070&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#1B4D3E] via-[#1B4D3E]/85 to-[#1B4D3E]/10" />
        <div className="relative z-10 mx-auto max-w-7xl w-full px-6 py-20 lg:px-16">
          <div className="max-w-2xl text-white">
            <span className="text-sm font-bold tracking-widest text-[#D97736] uppercase mb-4 block">
              NOTRE ASSOCIATION
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
              Notre <span className="text-[#D97736]">Histoire</span>
            </h1>
            <p className="text-lg text-zinc-300 leading-relaxed max-w-xl">
              L&apos;ACOGRAMI est une association culturelle apolitique à but
              non lucratif, fondée à Ngaoundéré pour fédérer la diaspora
              bamiléké du Grand Mifi autour de la culture, de la solidarité et
              du vivre-ensemble.
            </p>
          </div>
        </div>
      </section>

      <div className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <VillagesSection />
          <ValuesSection valeurs={valeurs} />
          <BureauSection />
          <PartnersSection />
        </div>
      </div>
    </div>
  );
}
