import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactInfo } from "@/components/contact/ContactInfo";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez l'ACOGRAMI : téléphone, adresse email et formulaire de contact pour toute demande d'information.",
};

export default function ContactPage() {
  return (
    <div className="bg-background">
      {/* En-tête de page */}
      <div className="border-b border-acogrami-green/10 bg-acogrami-green py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-acogrami-accent">
            Contactez-nous
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Une question ? Une suggestion ? N'hésitez pas à nous écrire ou à
            utiliser nos coordonnées. Nous vous répondrons dans les plus brefs
            délais.
          </p>
        </div>
      </div>

      {/* Contenu principal (Formulaire + Infos) */}
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Colonne de gauche (2/3) : Le formulaire */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>

          {/* Colonne de droite (1/3) : Les informations de contact statiques */}
          <div className="lg:col-span-1">
            <ContactInfo />
          </div>
        </div>
      </div>
    </div>
  );
}
