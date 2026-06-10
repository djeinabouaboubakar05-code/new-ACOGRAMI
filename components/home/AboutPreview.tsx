
import Link from "next/link";
import Image from "next/image";
import { HOME_IMAGES } from "@/lib/images/home";

export function AboutPreview() {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

          {/* Image Gauche - Version corrigée avec Image de Next.js */}
          <div className="relative aspect-ratio[4/5] sm:aspect-video lg:aspect-ratio[4/5] rounded-lg overflow-hidden shadow-xl">
            <Image
              src={HOME_IMAGES.about}
              alt="Communauté ACOGRAMI - Culture et traditions du Grand Mifi"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Texte Droite */}
          <div className="max-w-xl">
            <span className="text-sm font-bold tracking-widest text-[#D97736] uppercase mb-2 block">
              NOTRE ASSOCIATION
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Qui sommes-nous ?
            </h2>

            <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
              <p>
                L'ACOGRAMI est une association culturelle apolitique qui regroupe les fils et filles de 16 villages du Grand Mifi.
              </p>
              <p>
                Nous œuvrons pour la promotion de notre culture, la solidarité, l'éducation et le développement harmonieux de notre communauté.
              </p>
              <p>
                Ensemble, nous préservons nos valeurs et construisons un avenir radieux pour tous.
              </p>
            </div>

            <Link
              href="/apropos"
              className="mt-8 inline-block rounded bg-[#D97736] px-8 py-3.5 font-bold text-white transition hover:bg-[#b86129]"
            >
              En savoir plus
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}