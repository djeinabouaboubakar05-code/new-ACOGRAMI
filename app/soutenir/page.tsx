import type { Metadata } from "next";
import { DonationSection } from "@/components/soutenir/DonationSection";
import { CotisationSection } from "@/components/soutenir/CotisationSection";

export const metadata: Metadata = {
  title: "Soutenir",
  description: "Soutenez les projets de l'ACOGRAMI par un don ou payez votre cotisation de membre.",
};

export default function SoutenirPage() {
  return (
    <div className="bg-background">
      <div className="border-b border-acogrami-green/10 bg-acogrami-green py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-acogrami-accent">
            Soutenir l&apos;ACOGRAMI
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Votre soutien est essentiel pour pérenniser nos actions culturelles et de solidarité.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <DonationSection />
          <CotisationSection />
        </div>
      </div>
    </div>
  );
}
