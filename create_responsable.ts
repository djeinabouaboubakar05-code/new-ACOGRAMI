import { prisma } from './lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const hash = await bcrypt.hash("responsable123", 10);
  const resp = await prisma.user.upsert({
    where: { email: "responsable@acogrami.org" },
    update: { password: hash, role: "RESPONSABLE", estValide: true, village: "Bamougoum" },
    create: { 
      email: "responsable@acogrami.org", 
      password: hash, 
      nom: "Responsable", 
      prenom: "Bamougoum", 
      role: "RESPONSABLE", 
      estValide: true,
      village: "Bamougoum"
    },
  });
  console.log("✅ Compte Responsable créé ou mis à jour :");
  console.log("Email :", resp.email);
  console.log("Mot de passe : responsable123");
  console.log("Village :", resp.village);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
