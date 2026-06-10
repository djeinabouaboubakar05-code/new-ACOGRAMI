import "dotenv/config";
import { prisma } from '../lib/prisma';
import bcrypt from "bcryptjs";

async function main() {
  // 1. Villages
  const villages = [
    { nom: "Bafoussam", slug: "bafoussam" },
    { nom: "Bamougoum", slug: "bamougoum" },
    { nom: "Bansoa", slug: "bansoa" },
    { nom: "Bandjoun", slug: "bandjoun" },
    { nom: "Baham", slug: "baham" },
    { nom: "Batié", slug: "baite" },
    { nom: "Batcham", slug: "batcham" },
    { nom: "Baleng", slug: "baleng" },
    { nom: "Dschang", slug: "dschang" },
    { nom: "Fokoué", slug: "fokoue" },
    { nom: "Foumban", slug: "foumban" },
    { nom: "Foumbot", slug: "foumbot" },
    { nom: "Koutaba", slug: "koutaba" },
    { nom: "Mbouda", slug: "mbouda" },
    { nom: "Penka-Michel", slug: "penka-michel" },
    { nom: "Tonga", slug: "tonga" },
  ];
  for (const v of villages) {
    await prisma.village.upsert({ where: { slug: v.slug }, update: {}, create: v });
  }
  console.log(`✓ ${villages.length} villages`);

  // 2. Valeurs
  const valeurs = [
    { titre: "Solidarité", resume: "Force de l'entraide mutuelle", description: "La solidarité est le pilier fondamental de notre association. Elle se manifeste à travers l'entraide communautaire, le soutien aux familles dans le besoin et la mobilisation collective face aux défis.", icone: "handshake", ordre: 1 },
    { titre: "Culture", resume: "Préservation du patrimoine bamiléké", description: "La culture bamilékée est un trésor de traditions, d'arts et de sagesse. Nous œuvrons pour sa transmission aux jeunes générations à travers des festivals, des ateliers d'artisanat et la promotion de la langue et des danses traditionnelles.", icone: "palette", ordre: 2 },
    { titre: "Respect", resume: "Respect des aînés et des traditions", description: "Dans la culture bamilékée, le respect est une valeur sacrée. Il s'exprime par la considération envers les aînés et les chefs traditionnels, l'écoute des sages, et la courtoisie dans les relations quotidiennes.", icone: "heart", ordre: 3 },
    { titre: "Engagement", resume: "Développement durable de la communauté", description: "L'engagement est notre moteur. Chaque membre s'investit activement dans les projets de l'association : bourses d'études, développement local, soutien aux initiatives économiques.", icone: "target", ordre: 4 },
  ];
  for (const v of valeurs) {
    const existing = await prisma.valeur.findFirst({ where: { titre: v.titre } });
    if (!existing) await prisma.valeur.create({ data: v });
  }
  console.log(`✓ ${valeurs.length} valeurs`);

  // 3. Bureau
  const bureau = [
    { nom: "Fobiezogang", prenom: "Martin", fonction: "Président", telephone: "699 12 34 56", email: "fobiezogang@yahoo.fr", ordre: 1 },
    { nom: "Tchinda", prenom: "Marie", fonction: "Vice-Présidente", telephone: "677 78 90 12", email: "marie.tchinda@email.com", ordre: 2 },
    { nom: "Kengne", prenom: "Paul", fonction: "Secrétaire Général", telephone: "694 56 78 90", email: "paul.kengne@email.com", ordre: 3 },
    { nom: "Fotso", prenom: "Claire", fonction: "Trésorière", telephone: "698 23 45 67", email: "claire.fotso@email.com", ordre: 4 },
    { nom: "Nkongue", prenom: "Jean", fonction: "Commissaire aux Comptes", telephone: "690 34 56 78", email: "jean.nkongue@email.com", ordre: 5 },
  ];
  for (const m of bureau) {
    const existing = await prisma.membreBureau.findFirst({ where: { nom: m.nom, prenom: m.prenom } });
    if (!existing) await prisma.membreBureau.create({ data: m });
  }
  console.log(`✓ ${bureau.length} membres du bureau`);

  // 4. Utilisateur admin pour les actualités
  const hash = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@acogrami.org" },
    update: {},
    create: { email: "admin@acogrami.org", password: hash, nom: "Admin", prenom: "ACOGRAMI", role: "ADMIN", estValide: true },
  });
  console.log(`✓ utilisateur admin: ${admin.email}`);

  // 5. Actualités
  const actualites = [
    { titre: "Journée culturelle bamiléké à Ngaoundéré", contenu: "L'ACOGRAMI a organisé une journée culturelle riche en couleurs au siège de l'association. Danses traditionnelles, contes et dégustations ont rythmé cette célébration.", extrait: "Une journée dédiée aux danses, aux traditions et au partage entre les villages de la Mifi.", categorie: "culture" },
    { titre: "Projet solidarité jeunesse 2026", contenu: "Lancement du nouveau programme de soutien à la jeunesse. Des bourses d'études et des formations seront proposées aux jeunes des 16 villages.", extrait: "Un nouveau programme de bourses et formations pour les jeunes du Grand Mifi.", categorie: "projets" },
    { titre: "Assemblée Générale Annuelle", contenu: "L'Assemblée Générale de l'ACOGRAMI se tiendra le 15 juin 2026. Tous les membres sont conviés à y participer pour faire le bilan de l'année.", extrait: "Bilan annuel et perspectives pour la communauté du Grand Mifi.", categorie: "evenements" },
    { titre: "Action solidarité : visite aux aînés", contenu: "Les membres de l'ACOGRAMI ont rendu visite aux aînés de la communauté pour leur apporter soutien et réconfort. Des dons ont été remis aux familles.", extrait: "Une journée de partage et de soutien envers les aînés de notre communauté.", categorie: "communaute" },
    { titre: "Atelier de formation artisanale", contenu: "Un atelier de formation aux métiers artisanaux a été organisé pour les jeunes. Tissage, sculpture et poterie étaient au programme.", extrait: "Transmission des savoir-faire traditionnels aux jeunes générations.", categorie: "culture" },
  ];
  for (const a of actualites) {
    const existing = await prisma.actualite.findFirst({ where: { titre: a.titre } });
    if (!existing) {
      await prisma.actualite.create({ data: { ...a, auteurId: admin.id, image: null } });
    }
  }
  console.log(`✓ ${actualites.length} actualités`);

  // 6. Événements
  const evenements = [
    { titre: "Assemblée Générale Annuelle", description: "Réunion annuelle des membres de l'ACOGRAMI pour faire le bilan de l'année écoulée et planifier les actions futures.", date: new Date("2026-06-15"), lieu: "Ngaoundéré, Salle polyvalente du Grand Mifi", statut: "VALIDE" },
    { titre: "Fête de la Culture du Grand Mifi", description: "Célébration des traditions bamilékées avec danses, musiques, expositions d'artisanat et dégustations culinaires.", date: new Date("2026-08-20"), lieu: "Place publique de la mairie, Bafoussam", statut: "VALIDE" },
    { titre: "Séminaire de formation des responsables", description: "Formation des responsables de villages sur la gestion associative et le développement communautaire.", date: new Date("2026-09-10"), lieu: "Siège ACOGRAMI, Ngaoundéré", statut: "VALIDE" },
    { titre: "Journée de collecte de fonds", description: "Journée dédiée à la collecte de fonds pour financer les projets de l'association.", date: new Date("2026-10-05"), lieu: "Marché central, Ngaoundéré", statut: "EN_ATTENTE" },
  ];
  for (const e of evenements) {
    const existing = await prisma.evenement.findFirst({ where: { titre: e.titre } });
    if (!existing) await prisma.evenement.create({ data: { ...e, image: null } });
  }
  console.log(`✓ ${evenements.length} événements`);

  // 7. Projets
  const projets = [
    { titre: "Construction d'un puits à Bamougoum", description: "Projet d'accès à l'eau potable pour le village de Bamougoum. Installation d'un forage équipé de panneaux solaires.", statut: "VALIDE", soumisPar: "Chef de village Bamougoum" },
    { titre: "Rénovation de l'école primaire de Bayangam", description: "Réfection des toitures, achat de nouveaux équipements scolaires et construction de deux salles de classe supplémentaires.", statut: "VALIDE", soumisPar: "Responsable éducatif" },
    { titre: "Bourse d'études 2026-2027", description: "Programme de bourses pour 10 étudiants méritants issus des villages du Grand Mifi.", statut: "EN_ATTENTE", soumisPar: "Commission éducation" },
    { titre: "Centre culturel inter-villages", description: "Construction d'un centre culturel pour accueillir les événements et les formations inter-villages.", statut: "EN_ATTENTE", soumisPar: "Bureau exécutif" },
  ];
  for (const p of projets) {
    const existing = await prisma.projet.findFirst({ where: { titre: p.titre } });
    if (!existing) await prisma.projet.create({ data: { ...p, image: null } });
  }
  console.log(`✓ ${projets.length} projets`);

  // 8. Partenaires
  const partenaires = [
    { nom: "Mairie de Bafoussam", url: "#" },
    { nom: "Fondation pour le Développement", url: "#" },
    { nom: "Association des Ressortissants", url: "#" },
  ];
  for (const p of partenaires) {
    const existing = await prisma.partenaire.findFirst({ where: { nom: p.nom } });
    if (!existing) await prisma.partenaire.create({ data: p });
  }
  console.log(`✓ ${partenaires.length} partenaires`);

  console.log("\n✅ Seed terminé !");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
