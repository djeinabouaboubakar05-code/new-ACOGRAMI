import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { NewsletterForm } from "./NewsletterForm";

const LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/apropos", label: "À propos" },
  { href: "/actualites", label: "Actualités" },
  { href: "/projets", label: "Projets" },
  { href: "/galerie", label: "Galerie" },
  { href: "/villages", label: "Villages" },
  { href: "/soutenir", label: "Soutenir" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer style={{ backgroundColor: "var(--acogrami-green)" }} className="text-white mt-20">
      {/* Corps du footer */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Colonne 1 : Identité */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full border-2 font-bold text-base text-white shrink-0"
                style={{ borderColor: "var(--acogrami-accent)", backgroundColor: "rgba(255,255,255,0.1)" }}
              >
                AC
              </div>
              <div>
                <p className="font-extrabold text-lg leading-none">ACOGRAMI</p>
                <p className="text-xs text-white/70 mt-0.5">Communauté Grand Mifi</p>
              </div>
            </div>
            <p className="text-sm text-white/80 leading-relaxed">
              Association culturelle apolitique regroupant 16 villages bamiléké à Ngaoundéré. Solidarité, culture et développement communautaire.
            </p>
            <div className="flex gap-3 pt-1">
              <a
                href="https://facebook.com/acogrami"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full transition-opacity hover:opacity-80"
                style={{ backgroundColor: "#1877F2" }}
                aria-label="Facebook ACOGRAMI"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24" className="text-white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a
                href="https://wa.me/237654966095"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full transition-opacity hover:opacity-80"
                style={{ backgroundColor: "#25D366" }}
                aria-label="WhatsApp ACOGRAMI"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24" className="text-white"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.347-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
              </a>
            </div>
          </div>

          {/* Colonne 2 : Liens rapides */}
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-widest mb-5 opacity-70">Navigation</h3>
            <ul className="space-y-2.5">
              {LINKS.map(l => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/80 hover:text-white transition-colors hover:underline underline-offset-2"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 3 : Contact */}
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-widest mb-5 opacity-70">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-white/80">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-white/60" />
                <span>Ngaoundéré, Région de l&apos;Adamaoua, Cameroun</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/80">
                <Phone className="h-4 w-4 shrink-0 text-white/60" />
                <a href="tel:+237654966095" className="hover:text-white transition-colors">+237 654 96 60 95</a>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/80">
                <Mail className="h-4 w-4 shrink-0 text-white/60" />
                <a href="mailto:fobiezogang@yahoo.fr" className="hover:text-white transition-colors">fobiezogang@yahoo.fr</a>
              </li>
            </ul>

            <div className="mt-6">
              <Link
                href="/adhesion"
                className="inline-block rounded-md px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: "var(--acogrami-accent)" }}
              >
                Rejoindre l&apos;association
              </Link>
            </div>
          </div>

          {/* Colonne 4 : Newsletter */}
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-widest mb-5 opacity-70">Newsletter</h3>
            <p className="text-sm text-white/80 mb-4 leading-relaxed">
              Restez informé des activités, événements et projets de l&apos;ACOGRAMI.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Bas de page */}
      <div className="border-t border-white/20">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/60">
            © {new Date().getFullYear()} ACOGRAMI — Tous droits réservés
          </p>
          <div className="flex items-center gap-4 text-xs text-white/60">
            <Link href="/contact" className="hover:text-white transition-colors">Nous contacter</Link>
            <span>·</span>
            <Link href="/adhesion" className="hover:text-white transition-colors">Devenir membre</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
