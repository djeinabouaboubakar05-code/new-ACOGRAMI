"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";

type Message = {
  id: number;
  role: "user" | "bot";
  text: string;
};

// Base de connaissances simulée pour répondre aux questions fréquentes
function getBotResponse(question: string): string {
  const q = question.toLowerCase();
  if (q.includes("acogrami") || q.includes("association"))
    return "L'ACOGRAMI (Association de la Communauté Grand Mifi) est une association culturelle apolitique à but non lucratif basée à Ngaoundéré, Cameroun. Elle regroupe des membres issus de 16 villages de la Mifi.";
  if (q.includes("village") || q.includes("mifi"))
    return "L'ACOGRAMI regroupe 16 villages : Bamougoum, Bayangam, Baleng, Bamendjou, Bangou, Batoufam, Bandjoun, Badenkop, Baméka, Batié, Bapa, Bangam, Bandrefam, Bafoussam, Bahouan et Baham.";
  if (q.includes("adhésion") || q.includes("membre") || q.includes("rejoindre"))
    return "Pour devenir membre, remplissez le formulaire d'adhésion sur la page /adhesion. Le responsable de votre village examinera votre demande et vous recevrez une réponse par email.";
  if (q.includes("cotisation"))
    return "La cotisation annuelle est obligatoire pour les membres. Elle peut être payée depuis votre espace membre (/membre/cotisations). Elle vous donne droit de vote et aux prestations de solidarité.";
  if (q.includes("contact") || q.includes("président") || q.includes("telephone"))
    return "Vous pouvez contacter le président au 654 96 60 95 ou par email : fobiezogang@yahoo.fr. Le siège est à Ngaoundéré, Région de l'Adamaoua, Cameroun.";
  if (q.includes("événement") || q.includes("evenement") || q.includes("agenda"))
    return "Les événements à venir sont visibles sur la page /actualites. Vous pouvez aussi vous abonner à la newsletter pour être informé en priorité.";
  if (q.includes("don"))
    return "Tout le monde peut faire un don à l'ACOGRAMI, membre ou visiteur, depuis la page /soutenir. Un reçu est généré automatiquement après votre contribution.";
  return "Je n'ai pas de réponse précise pour cette question. N'hésitez pas à nous contacter directement via la page Contact ou au 654 96 60 95.";
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: "bot", text: "Bonjour! Je suis l'assistant ACOGRAMI. Comment puis-je vous aider ? (adhésion, villages, cotisation...)" },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: Message = { id: messages.length, role: "user", text: trimmed };
    const botMsg: Message = { id: messages.length + 1, role: "bot", text: getBotResponse(trimmed) };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  };

  return (
    <>
      {/* Fenêtre de chat */}
      {isOpen && (
        <div className="fixed bottom-24 right-5 z-50 w-80 sm:w-96 rounded-2xl shadow-2xl flex flex-col overflow-hidden" style={{ maxHeight: "70vh", backgroundColor: "var(--card)", border: "1px solid var(--card-border)" }}>
          {/* En-tête */}
          <div className="flex items-center justify-between p-4 bg-acogrami-green text-white">
            <div className="flex items-center gap-2.5">
              <Bot className="h-5 w-5" />
              <div>
                <p className="font-bold text-sm">Assistant ACOGRAMI</p>
                <p className="text-xs text-white/70">Répond en FR et EN</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${msg.role === "user" ? "rounded-br-sm" : "rounded-bl-sm"}`}
                  style={msg.role === "user" ? { backgroundColor: "var(--acogrami-green)", color: "#fff" } : { backgroundColor: "var(--muted)", color: "var(--foreground)" }}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Champ de saisie */}
          <div className="p-3 flex gap-2" style={{ borderTop: "1px solid var(--card-border)" }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Posez votre question..."
              className="flex-1 rounded-xl px-3 py-2 text-sm focus:outline-none"
              style={{ backgroundColor: "var(--input-bg)", color: "var(--input-text)", border: "1px solid var(--input-border)" }}
              onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--ring)"}
              onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--input-border)"}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="p-2.5 bg-acogrami-green rounded-xl text-white hover:bg-[#13382c] transition-colors disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Bouton flottant */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Ouvrir le chatbot"
        className="fixed bottom-5 right-5 z-50 h-14 w-14 rounded-full bg-acogrami-green text-white shadow-lg hover:bg-[#13382c] transition-all duration-300 flex items-center justify-center"
        style={{ boxShadow: "0 4px 24px rgba(27,77,62,0.4)" }}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </>
  );
}
