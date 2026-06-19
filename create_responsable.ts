import { prisma } from './lib/prisma';
import bcrypt from 'bcryptjs';
import { RoleSysteme, StatutMembre } from '@prisma/client';

async function main() {
  const hash = await bcrypt.hash("responsable123", 10);
  const resp = await prisma.user.upsert({
    where: { email: "responsable@acogrami.org" },
    update: { 
      password: hash, 
      roleSysteme: RoleSysteme.RESPONSABLE, 
      statut: StatutMembre.EN_REGLE, 
      village: { connect: { slug: "bamougoum" } } 
    },
    create: { 
      email: "responsable@acogrami.org", 
      password: hash, 
      nom: "Responsable", 
      prenom: "Bamougoum", 
      roleSysteme: RoleSysteme.RESPONSABLE, 
      statut: StatutMembre.EN_REGLE,
      village: { connect: { slug: "bamougoum" } }
    },
    include: {
      village: true
    }
  });
  console.log("✅ Compte Responsable créé ou mis à jour :");
  console.log("Email :", resp.email);
  console.log("Mot de passe : responsable123");
  console.log("Village :", resp.village?.nom);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
