'use client'

import { useState } from "react"
import NewsFilters from "./NewsFilters"
import NewsGrid from "./NewsGrid"

interface Actualite {
  id: string;
  titre: string;
  extrait: string | null;
  categorie: string;
  image: string | null;
  createdAt: Date;
}

interface ActualitesContentProps {
  actualites: Actualite[];
}

export default function ActualitesContent({ actualites }: ActualitesContentProps) {
  const [activeCategory, setActiveCategory] = useState("tous")

  return (
    <div className="bg-card p-6 rounded-2xl shadow-sm border border-border h-full">
      <div className="mb-6 border-b border-border pb-4">
        <h2 className="text-2xl font-bold text-card-foreground">À la une</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Explorez les événements et projets par catégorie
        </p>
      </div>

      <NewsFilters active={activeCategory} onChange={setActiveCategory} />

      <NewsGrid activeCategory={activeCategory} actualites={actualites} />
    </div>
  )
}
