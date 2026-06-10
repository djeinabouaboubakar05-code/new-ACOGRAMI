import Link from "next/link";
import Image from "next/image";
import { HOME_IMAGES } from "@/lib/images/home";

export function JoinCta() {
  return (
    <section className="mt-20 w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Conteneur avec image de fond */}
        <div className="relative overflow-hidden rounded-2xl min-height-[360px] flex items-center">

          {/* Image de fond */}
          <div className="absolute inset-0 z-0">
            <Image
              src={HOME_IMAGES.joinCta}
              alt="Rejoindre la communauté ACOGRAMI"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
          </div>

          {/* Dégradé vert de gauche vers droite */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1B4D3E] via-[#1B4D3E]/85 to-[#1B4D3E]/10 z-10" />

          {/* Contenu */}
          <div className="relative z-20 px-8 py-16 md:px-16 max-w-2xl text-white">
            <span className="text-sm font-bold tracking-widest text-[#D97736] uppercase mb-4 block">
              ENSEMBLE, NOUS SOMMES PLUS FORTS
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Prêt à nous rejoindre ?
            </h2>
            <p className="text-lg text-white/90 mb-10 leading-relaxed">
              Votre soutien nous donne davantage d&apos;ailes.<br />
              Ensemble, nous sommes plus forts.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/adhesion"
                className="rounded bg-[#D97736] px-8 py-3.5 font-bold text-white transition hover:bg-[#b86129]"
              >
                Devenir membre
              </Link>
              <Link
                href="/soutenir"
                className="rounded bg-white px-8 py-3.5 font-bold text-acogrami-green transition hover:bg-zinc-100"
              >
                Je soutiens l&apos;association
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}