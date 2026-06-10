import { Metadata } from "next";
import { ConfigurationAdmin } from "@/components/admin/ConfigurationAdmin";

export const metadata: Metadata = {
  title: "Paramètres | Administration ACOGRAMI",
};

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Paramètres</h1>
        <p className="mt-2 text-muted-foreground">
          Gérez les configurations globales de l'association.
        </p>
      </div>

      <ConfigurationAdmin />
    </div>
  );
}
