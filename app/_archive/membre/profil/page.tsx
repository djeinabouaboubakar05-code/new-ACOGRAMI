import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/membre/ProfileForm";

export const metadata: Metadata = {
  title: "Mon Profil | Espace Membre",
};

export default async function ProfilPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Mon profil</h1>
        <p className="mt-2 text-muted-foreground">
          Gérez vos informations personnelles et votre mot de passe de sécurité.
        </p>
      </div>

      <ProfileForm user={session.user} />
    </div>
  );
}
