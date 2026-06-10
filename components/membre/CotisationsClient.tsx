"use client";

import { useState } from "react";
import { CheckCircle2, Clock, AlertCircle, Loader2, CreditCard, ArrowRight, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface Cotisation {
  id: string;
  montant: number;
  annee: string;
  statut: string;
  ref: string;
  date: string | Date;
}

const IS = { backgroundColor: "var(--input-bg)", color: "var(--input-text)", border: "1px solid var(--input-border)", borderRadius: "var(--radius)" };

function badgeStyle(statut: string) {
  if (statut === "PAYE" || statut === "VALIDE") return { className: "badge-success", Icon: CheckCircle2, label: "Payée" };
  if (statut === "EN_ATTENTE") return { className: "badge-warn", Icon: Clock, label: "En attente" };
  return { className: "badge-danger", Icon: AlertCircle, label: "En retard" };
}

export function CotisationsClient({ initialCotisations, userId }: { initialCotisations: Cotisation[]; userId: string }) {
  const [cotisations, setCotisations] = useState<Cotisation[]>(initialCotisations);
  const [selectedAmount, setSelectedAmount] = useState<number>(5000);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [operator, setOperator] = useState<"MTN" | "ORANGE">("MTN");
  const [phone, setPhone] = useState("");
  const [paying, setPaying] = useState(false);
  const router = useRouter();

  const isPaid2026 = cotisations.some(c => c.annee === "2026" && (c.statut === "PAYE" || c.statut === "VALIDE"));

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 9) { alert("Veuillez saisir un numéro de téléphone valide."); return; }
    const finalAmount = selectedAmount === 0 ? parseInt(customAmount) : selectedAmount;
    if (isNaN(finalAmount) || finalAmount <= 0) { alert("Veuillez choisir un montant valide."); return; }

    setPaying(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const reference = `COT-2026-${Math.floor(100000 + Math.random() * 900000)}`;
      const res = await fetch("/api/cotisations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ montant: finalAmount, annee: "2026", statut: "PAYE", ref: reference, userId }),
      });

      if (res.ok) {
        const newCotisation = await res.json();
        setCotisations(prev => [newCotisation, ...prev]);
        setShowModal(false);
        setPhone("");
        alert("Paiement effectué avec succès !");
        router.refresh();
      } else {
        alert("Erreur lors de l'enregistrement du paiement.");
      }
    } catch {
      alert("Une erreur de connexion est survenue.");
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Statut actuel */}
      <div className="bg-acogrami-green text-white p-6 rounded-2xl flex items-center justify-between gap-4 flex-wrap shadow-md">
        <div>
          <p className="text-sm text-white/70 font-medium">Statut de votre cotisation 2026</p>
          <p className="text-2xl font-bold mt-1 flex items-center gap-2">
            <CheckCircle2 className={`h-6 w-6 ${isPaid2026 ? "text-green-300 animate-pulse" : "text-amber-300"}`} />
            {isPaid2026 ? "À jour" : "Non payée"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-white/70 font-medium">Prochaine échéance</p>
          <p className="text-xl font-bold mt-1">{isPaid2026 ? "Janvier 2027" : "Immédiate"}</p>
        </div>
      </div>

      {/* Payer maintenant */}
      {!isPaid2026 && (
        <div className="p-6 rounded-2xl shadow-sm transition-all hover:shadow-md" style={{ backgroundColor: "var(--card)", border: "1px solid var(--card-border)" }}>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: "var(--card-foreground)" }}>
            <CreditCard className="h-5 w-5 text-acogrami-accent" />
            Payer ma cotisation 2026
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            {[5000, 10000].map(m => (
              <button key={m} type="button" onClick={() => { setSelectedAmount(m); setCustomAmount(""); }}
                className="border-2 rounded-xl py-3.5 font-bold transition-all text-sm cursor-pointer"
                style={{
                  borderColor: selectedAmount === m ? "var(--acogrami-green)" : "var(--card-border)",
                  backgroundColor: selectedAmount === m ? "color-mix(in srgb, var(--acogrami-green) 6%, transparent)" : "transparent",
                  color: selectedAmount === m ? "var(--acogrami-green)" : "var(--muted-foreground)",
                }}>
                {m.toLocaleString("fr-FR")} FCFA
              </button>
            ))}
            <button type="button" onClick={() => setSelectedAmount(0)}
              className="border-2 rounded-xl py-3.5 font-bold transition-all text-sm cursor-pointer"
              style={{
                borderColor: selectedAmount === 0 ? "var(--acogrami-green)" : "var(--card-border)",
                backgroundColor: selectedAmount === 0 ? "color-mix(in srgb, var(--acogrami-green) 6%, transparent)" : "transparent",
                color: selectedAmount === 0 ? "var(--acogrami-green)" : "var(--muted-foreground)",
              }}>
              Autre montant
            </button>
          </div>

          {selectedAmount === 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--muted-foreground)" }}>Saisir le montant (FCFA)</label>
              <input type="number" value={customAmount} onChange={e => setCustomAmount(e.target.value)}
                className="w-full rounded-xl px-4 py-2.5 focus:outline-none" style={IS}
                onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--ring)"}
                onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--input-border)"}
                placeholder="Ex: 15000" />
            </div>
          )}

          <button onClick={() => setShowModal(true)} className="w-full bg-acogrami-accent hover:bg-acogrami-earth text-white font-bold py-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm hover:shadow">
            Procéder au paiement (Mobile Money / Orange Money)
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Historique */}
      <div className="rounded-2xl shadow-sm overflow-hidden" style={{ backgroundColor: "var(--card)", border: "1px solid var(--card-border)" }}>
        <div className="p-6" style={{ borderBottom: "1px solid var(--card-border)" }}>
          <h2 className="text-lg font-bold" style={{ color: "var(--card-foreground)" }}>Historique des cotisations</h2>
        </div>
        <div className="divide-y" style={{ borderColor: "var(--card-border)" }}>
          {cotisations.map(item => {
            const { className, Icon, label } = badgeStyle(item.statut);
            return (
              <div key={item.id} className="flex items-center justify-between p-5 gap-4 flex-wrap">
                <div className="flex items-center gap-4">
                  <span className={`${className} inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold`}>
                    <Icon className="h-3.5 w-3.5" /> {label}
                  </span>
                  <div>
                    <p className="font-semibold" style={{ color: "var(--card-foreground)" }}>Cotisation {item.annee}</p>
                    <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                      {new Date(item.date).toLocaleDateString("fr-FR")} — Réf : {item.ref}
                    </p>
                  </div>
                </div>
                <p className="font-bold" style={{ color: "var(--card-foreground)" }}>{item.montant.toLocaleString("fr-FR")} FCFA</p>
              </div>
            );
          })}
          {cotisations.length === 0 && (
            <div className="p-8 text-center" style={{ color: "var(--muted-foreground)" }}>Aucune cotisation enregistrée.</div>
          )}
        </div>
      </div>

      {/* Modal paiement */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="rounded-2xl w-full max-w-md p-6 shadow-2xl relative" style={{ backgroundColor: "var(--card)", border: "1px solid var(--card-border)" }}>
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 cursor-pointer" style={{ color: "var(--muted-foreground)" }}>
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: "var(--card-foreground)" }}>
              <CreditCard className="h-5 w-5 text-acogrami-accent" />
              Paiement Sécurisé Mobile Money
            </h3>

            <form onSubmit={handlePay} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--muted-foreground)" }}>Choisir l'opérateur</label>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setOperator("MTN")}
                    className="border rounded-xl py-3 flex flex-col items-center justify-center font-semibold cursor-pointer transition-all"
                    style={{ borderColor: operator === "MTN" ? "#ffcc00" : "var(--card-border)", backgroundColor: operator === "MTN" ? "color-mix(in srgb, #ffcc00 8%, transparent)" : "transparent" }}>
                    <span className="text-lg font-black" style={{ color: "#cca300" }}>MTN</span>
                    <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>MoMo</span>
                  </button>
                  <button type="button" onClick={() => setOperator("ORANGE")}
                    className="border rounded-xl py-3 flex flex-col items-center justify-center font-semibold cursor-pointer transition-all"
                    style={{ borderColor: operator === "ORANGE" ? "#f16e00" : "var(--card-border)", backgroundColor: operator === "ORANGE" ? "color-mix(in srgb, #f16e00 8%, transparent)" : "transparent" }}>
                    <span className="text-lg font-black" style={{ color: "#f16e00" }}>Orange</span>
                    <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>Money</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--muted-foreground)" }}>Numéro de téléphone</label>
                <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} placeholder="Ex: 677889900"
                  className="w-full rounded-xl px-4 py-2.5 focus:outline-none" style={IS}
                  onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--ring)"}
                  onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--input-border)"} />
              </div>

              <div className="p-4 rounded-xl text-center" style={{ backgroundColor: "var(--muted)", border: "1px solid var(--card-border)" }}>
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Montant à payer</p>
                <p className="text-2xl font-extrabold mt-1" style={{ color: "var(--card-foreground)" }}>
                  {(selectedAmount === 0 ? parseInt(customAmount) || 0 : selectedAmount).toLocaleString("fr-FR")} FCFA
                </p>
              </div>

              <div className="flex gap-3 pt-3" style={{ borderTop: "1px solid var(--card-border)" }}>
                <button type="button" onClick={() => setShowModal(false)} className="w-1/2 py-3 rounded-xl text-sm font-semibold cursor-pointer transition-colors"
                  style={{ backgroundColor: "var(--muted)", color: "var(--foreground)" }}>
                  Annuler
                </button>
                <button type="submit" disabled={paying} className="w-1/2 py-3 bg-acogrami-green hover:bg-[#13382c] text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50">
                  {paying && <Loader2 className="h-4 w-4 animate-spin" />}
                  {paying ? "Validation..." : "Payer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
