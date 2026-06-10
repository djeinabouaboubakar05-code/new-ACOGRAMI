// components/home/Hero.tsx
"use client";

import Image from "next/image";
import { HOME_IMAGES } from "@/lib/images/home";

export function Hero() {
  return (
    <section className="relative h-screen min-h-[600px] w-full">
      {/* Image de fond */}
      <div className="absolute inset-0 z-0">
        <Image
          src={HOME_IMAGES.hero}
          alt="Communauté ACOGRAMI - Unis pour la culture"
          fill
          className="object-cover brightness-50"
          priority
          sizes="100vw"
        />
      </div>

      {/* Contenu au-dessus de l'image */}
      <div className="relative z-10 flex h-full items-center justify-center text-center text-white">
        <div className="mx-auto max-w-4xl px-4 drop-shadow-xl">
          <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl mb-4 drop-shadow-md">
            Association de la Communauté
            <br />
            <span className="text-[#CC7722]">Grand Mifi</span>
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl mb-8 text-gray-200 drop-shadow-md font-medium">
            ️16 villages unis pour la promotion de notre culture, la solidarité et le développement de notre communauté.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/apropos"
              className="inline-block rounded-lg bg-[#CC7722] px-8 py-3 font-bold text-white transition hover:bg-[#b86129]"
            >
              Découvrir
            </a>
            <a
              href="/soutenir"
              className="inline-block rounded-lg border-2 border-white px-8 py-3 font-bold text-white transition hover:bg-white hover:text-[#1B4D3E]"
            >
              Nous soutenir
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}