import { Metadata } from "next";
import { NewsletterAdmin } from "@/components/admin/NewsletterAdmin";

export const metadata: Metadata = {
  title: "Gestion Newsletter | Administration ACOGRAMI",
};

export default function AdminNewsletterPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Gestion de la Newsletter</h1>
        <p className="mt-2 text-muted-foreground">
          Gérez vos abonnés et envoyez des e-mails d'information.
        </p>
      </div>

      <NewsletterAdmin />
    </div>
  );
}
