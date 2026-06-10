/**
 * Images d'illustration pour la page d'accueil.
 * Thème : culture africaine, communauté, vivre-ensemble.
 * Toutes ces images sont valides et s'afficheront correctement.
 */

const u = (id: string, w = 800) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;

export const HOME_IMAGES = {
  // Hero bannière : communauté africaine unie
  hero: u("photo-1523800503107-5bc3ba2a6f81", 2070),

  // Section À propos : paysage/village africain
  about: u("photo-1509099836639-18ba1795216d", 1500),

  // CTA rejoindre : personnes heureuses
  joinCta: u("photo-1531206715517-5c0ba140b2b8", 2070),

  // Actualités : photos diverses
  news: [
    u("photo-1593113598332-cd288d649433", 800),  // culture/événement
    u("photo-1605276374106-a8830c4e9b09", 800),  // communauté
    u("photo-1596524430615-b751607ee769", 800),  // tradition
  ],

  // Section Impact : statistiques
  impact: {
    members: u("photo-1529156069898-49953e39b3ac", 400),   // membres
    scholarships: u("photo-1532629345602-506c6d35a870", 400), // éducation/bourses
    projects: u("photo-1591135207863-0a5334a88c99", 400),  // projets
  },

  // Grille des 16 villages
  villages: [
    u("photo-1593113598332-cd288d649433", 200),  // village 1
    u("photo-1547471080-7cc2caa37a30", 200),    // village 2
    u("photo-1580894900119-2f749ebf28d7", 200), // village 3
    u("photo-1532629345602-506c6d35a870", 200), // village 4
    u("photo-1605276374106-a8830c4e9b09", 200), // village 5
    u("photo-1596524430615-b751607ee769", 200), // village 6
    u("photo-1591135207863-0a5334a88c99", 200), // village 7
    u("photo-1600880292203-757bb62b4577", 200), // village 8
    u("photo-1542884748-2b87b36c6b90", 200),   // village 9
    u("photo-1529156069898-49953e39b3ac", 200), // village 10
    u("photo-1519085360753-af0119f7cbe7", 200), // village 11
    u("photo-1573496359142-b8d87734a5a2", 200), // village 12
    u("photo-1507003211169-0a1dd7228f2d", 200), // village 13
    u("photo-1551836022-d5d88e2274b0", 200),   // village 14
    u("photo-1488521787991-ed7bbaae773c", 200), // village 15
    u("photo-1600880292203-757bb62b4577", 200), // village 16
  ],
} as const;