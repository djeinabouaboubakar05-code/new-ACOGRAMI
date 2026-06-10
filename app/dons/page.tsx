import { Metadata } from "next";
import { DonForm } from "@/components/dons/DonForm";

export const metadata: Metadata = {
  title: "Faire un don | ACOGRAMI",
  description: "Soutenez l'Association de la Communauté Grand Mifi en faisant un don.",
};

export default function DonsPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-64px)] py-16 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold" style={{ color: "var(--acogrami-green)" }}>
            Soutenir ACOGRAMI
          </h1>
          <p className="text-muted-foreground text-lg">
            Vos dons nous aident à financer les projets communautaires et culturels des 16 villages du Grand Mifi.
          </p>
        </div>

        <div className="bg-card border border-border shadow-md rounded-2xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 border-b border-border pb-4">
            Formulaire de déclaration de don
          </h2>
          <DonForm />
        </div>
      </div>
    </div>
  );
}
