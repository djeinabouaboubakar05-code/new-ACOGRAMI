"use client";

import { useState } from "react";
import { Heart, FileText, Loader2, Sparkles } from "lucide-react";
import jsPDF from "jspdf";

const IS = { backgroundColor: "var(--input-bg)", color: "var(--input-text)", border: "1px solid var(--input-border)", borderRadius: "var(--radius)" };

export function DonationSection() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(5000);
  const [customAmount, setCustomAmount] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [operator, setOperator] = useState<"orange" | "mtn">("orange");
  const [phone, setPhone] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [receiptInfo, setReceiptInfo] = useState<{ amount: number; name: string; ref: string; date: string } | null>(null);

  const getAmount = () => {
    if (selectedAmount !== null) return selectedAmount;
    return parseFloat(customAmount) || 0;
  };

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = getAmount();
    if (amount <= 0) { alert("Veuillez sélectionner ou saisir un montant valide."); return; }
    setShowModal(true);
  };

  const handleSimulatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !nom || !prenom) { alert("Veuillez remplir tous les champs."); return; }
    setPaying(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const amount = getAmount();
      const ref = "DON-" + Math.floor(100000 + Math.random() * 900000);
      const date = new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });
      setReceiptInfo({ amount, name: `${prenom} ${nom}`, ref, date });
      setSuccess(true);
      setShowModal(false);
    } catch {
      alert("Une erreur est survenue lors de la simulation de paiement.");
    } finally {
      setPaying(false);
    }
  };

  const generatePDF = () => {
    if (!receiptInfo) return;
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a5" });
    doc.setDrawColor(27, 77, 62); doc.setLineWidth(1); doc.rect(5, 5, 138, 200);
    doc.setFont("Helvetica", "bold"); doc.setFontSize(16); doc.setTextColor(27, 77, 62);
    doc.text("REÇU DE DONATION", 74, 25, { align: "center" });
    doc.setFont("Helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(160, 82, 45);
    doc.text("ACOGRAMI — Communauté Grand Mifi", 74, 32, { align: "center" });
    doc.setDrawColor(200, 200, 200); doc.line(15, 38, 133, 38);
    doc.setFont("Helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(80, 80, 80);
    doc.text(`Référence : ${receiptInfo.ref}`, 15, 48);
    doc.text(`Date : ${receiptInfo.date}`, 15, 54);
    doc.setFont("Helvetica", "normal"); doc.setFontSize(11); doc.setTextColor(40, 40, 40);
    const bodyText = `L'association ACOGRAMI certifie avoir reçu de M./Mme/Mlle ${receiptInfo.name} un don d'un montant de :`;
    doc.text(doc.splitTextToSize(bodyText, 118), 15, 68);
    doc.setFont("Helvetica", "bold"); doc.setFontSize(16); doc.setTextColor(27, 77, 62);
    doc.text(`${receiptInfo.amount.toLocaleString("fr-FR")} FCFA`, 74, 95, { align: "center" });
    doc.setFont("Helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(80, 80, 80);
    const details = "Ce don contribuera au financement des projets communautaires d'éducation, de santé et d'aide au développement dans les 16 villages du Grand Mifi.";
    doc.text(doc.splitTextToSize(details, 118), 15, 110);
    doc.setFont("Helvetica", "italic"); doc.setFontSize(9);
    doc.text("Nous vous remercions chaleureusement pour votre générosité.", 74, 150, { align: "center" });
    doc.setDrawColor(27, 77, 62); doc.setFillColor(27, 77, 62); doc.circle(74, 172, 8, "FD");
    doc.setFont("Helvetica", "bold"); doc.setTextColor(255, 255, 255); doc.setFontSize(6);
    doc.text("ACOGRAMI", 74, 171.5, { align: "center" }); doc.text("SEAL", 74, 174, { align: "center" });
    doc.save(`recu_${receiptInfo.ref}.pdf`);
  };

  return (
    <>
      <section className="rounded-2xl p-8 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--card-border)" }}>
        <div className="flex items-center gap-4 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-acogrami-accent/10 text-acogrami-accent">
            <Heart className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold" style={{ color: "var(--card-foreground)" }}>Faire un don</h2>
            <p style={{ color: "var(--muted-foreground)" }}>Ouvert à tous (membres et visiteurs)</p>
          </div>
        </div>

        <p className="mb-6 leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
          Votre soutien financier est précieux. Il nous permet de financer nos projets de développement
          dans les 16 villages du Grand Mifi et d'organiser nos événements culturels.
          Tout don donne droit à un reçu téléchargeable.
        </p>

        {success ? (
          <div className="rounded-xl p-5 text-center space-y-4" style={{ backgroundColor: "color-mix(in srgb, #16a34a 8%, transparent)", border: "1px solid #16a34a" }}>
            <div className="inline-flex p-3 rounded-full" style={{ backgroundColor: "color-mix(in srgb, #16a34a 15%, transparent)", color: "#16a34a" }}>
              <Sparkles className="h-6 w-6 animate-pulse" />
            </div>
            <h3 className="font-bold text-green-800">Merci beaucoup !</h3>
            <p className="text-sm text-green-700">
              Votre don de <span className="font-bold">{receiptInfo?.amount.toLocaleString("fr-FR")} FCFA</span> a été validé.
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <button onClick={generatePDF} className="flex items-center justify-center gap-2 w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-sm transition-colors cursor-pointer">
                <FileText className="h-4 w-4" /> Télécharger mon reçu PDF
              </button>
              <button onClick={() => setSuccess(false)} className="text-xs hover:underline cursor-pointer" style={{ color: "var(--muted-foreground)" }}>
                Faire un autre don
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleStartPayment} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[5000, 10000, 20000].map((amount) => (
                <button
                  type="button"
                  key={amount}
                  onClick={() => { setSelectedAmount(amount); setCustomAmount(""); }}
                  className="rounded-xl border-2 py-3 font-bold transition-all cursor-pointer"
                  style={{
                    borderColor: selectedAmount === amount ? "var(--acogrami-green)" : "var(--card-border)",
                    backgroundColor: selectedAmount === amount ? "color-mix(in srgb, var(--acogrami-green) 8%, transparent)" : "transparent",
                    color: selectedAmount === amount ? "var(--acogrami-green)" : "var(--foreground)",
                  }}
                >
                  {amount.toLocaleString("fr-FR")} FCFA
                </button>
              ))}
              <div className="sm:col-span-3">
                <input
                  type="number"
                  placeholder="Autre montant (FCFA)"
                  value={customAmount}
                  onChange={(e) => { setSelectedAmount(null); setCustomAmount(e.target.value); }}
                  className="w-full rounded-xl px-4 py-3 focus:outline-none"
                  style={IS}
                  onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--ring)"}
                  onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--input-border)"}
                />
              </div>
            </div>

            <button type="submit" className="w-full rounded-xl py-4 font-bold text-white hover:opacity-90 transition-opacity cursor-pointer" style={{ backgroundColor: "var(--acogrami-accent)" }}>
              Procéder au paiement sécurisé
            </button>

            <div className="flex items-center justify-center gap-2 text-xs" style={{ color: "var(--muted-foreground)" }}>
              <FileText className="h-4 w-4" />
              <span>Un reçu sera généré automatiquement après votre don.</span>
            </div>
          </form>
        )}
      </section>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="rounded-2xl p-6 w-full max-w-md shadow-xl" style={{ backgroundColor: "var(--card)", border: "1px solid var(--card-border)" }}>
            <h3 className="text-lg font-bold mb-4" style={{ color: "var(--card-foreground)" }}>Simulation de paiement Mobile Money</h3>
            <p className="text-sm mb-6" style={{ color: "var(--muted-foreground)" }}>
              Montant du don : <span className="font-bold" style={{ color: "var(--acogrami-green)" }}>{getAmount().toLocaleString("fr-FR")} FCFA</span>
            </p>

            <form onSubmit={handleSimulatePayment} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button type="button" onClick={() => setOperator("orange")} className="py-3 rounded-xl border-2 font-bold text-sm transition-all cursor-pointer"
                  style={{ borderColor: operator === "orange" ? "#f97316" : "var(--card-border)", backgroundColor: operator === "orange" ? "color-mix(in srgb, #f97316 8%, transparent)" : "transparent", color: operator === "orange" ? "#f97316" : "var(--muted-foreground)" }}>
                  Orange Money
                </button>
                <button type="button" onClick={() => setOperator("mtn")} className="py-3 rounded-xl border-2 font-bold text-sm transition-all cursor-pointer"
                  style={{ borderColor: operator === "mtn" ? "#f59e0b" : "var(--card-border)", backgroundColor: operator === "mtn" ? "color-mix(in srgb, #f59e0b 8%, transparent)" : "transparent", color: operator === "mtn" ? "#d97706" : "var(--muted-foreground)" }}>
                  MTN Mobile Money
                </button>
              </div>

              {[["prenom", "Prénom du donateur", "text", "Ex: Paul", prenom, setPrenom], ["nom", "Nom du donateur", "text", "Ex: Fobasso", nom, setNom], ["phone", "Numéro de téléphone (9 chiffres)", "tel", "Ex: 654966095", phone, setPhone]].map(([field, label, type, placeholder, value, setter]: any) => (
                <div key={field}>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--foreground)" }}>{label}</label>
                  <input type={type} required placeholder={placeholder} value={value} onChange={e => setter(e.target.value)}
                    className="w-full rounded-xl px-4 py-2.5 focus:outline-none" style={IS}
                    onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--ring)"}
                    onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--input-border)"}
                  />
                </div>
              ))}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl font-bold text-sm cursor-pointer transition-colors"
                  style={{ border: "1px solid var(--card-border)", color: "var(--foreground)", backgroundColor: "var(--muted)" }}>
                  Annuler
                </button>
                <button type="submit" disabled={paying} className="flex-1 py-3 bg-acogrami-green hover:bg-[#13382c] text-white rounded-xl font-bold text-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5">
                  {paying && <Loader2 className="h-4 w-4 animate-spin" />}
                  {paying ? "Paiement..." : "Confirmer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
