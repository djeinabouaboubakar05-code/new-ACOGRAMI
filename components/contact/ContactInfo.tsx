import { Mail, MapPin, Phone } from "lucide-react";

export function ContactInfo() {
  return (
    <div className="rounded-2xl bg-acogrami-green p-8 text-white shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Nos Coordonnées</h2>
      
      <div className="space-y-6">
        {/* Téléphone */}
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
            <Phone className="h-5 w-5 text-acogrami-accent" />
          </div>
          <div>
            <p className="text-sm font-medium text-white/70">Téléphone du Président</p>
            <p className="mt-1 text-lg font-semibold">654 96 60 95</p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
            <Mail className="h-5 w-5 text-acogrami-accent" />
          </div>
          <div>
            <p className="text-sm font-medium text-white/70">Email de contact</p>
            <a href="mailto:fobiezogang@yahoo.fr" className="mt-1 block text-lg font-semibold hover:text-acogrami-accent transition-colors">
              fobiezogang@yahoo.fr
            </a>
          </div>
        </div>

        {/* Adresse */}
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
            <MapPin className="h-5 w-5 text-acogrami-accent" />
          </div>
          <div>
            <p className="text-sm font-medium text-white/70">Siège social</p>
            <p className="mt-1 text-lg font-semibold">Ngaoundéré, Région de l&apos;Adamaoua<br/>Cameroun</p>
          </div>
        </div>
      </div>

      <div className="mt-10 rounded-xl bg-white/5 p-4 border border-white/10">
        <h3 className="font-semibold text-acogrami-accent mb-2">Heures de réception</h3>
        <p className="text-sm text-white/80 leading-relaxed">
          Le bureau de l&apos;ACOGRAMI est disponible pour vous recevoir ou répondre à vos requêtes .
        </p>
      </div>
    </div>
  );
}
