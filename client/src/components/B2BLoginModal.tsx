/**
 * B2BLoginModal – Login-Flow
 *
 * Auth-Architektur (MASTER DECISION NOTE – verbindlich):
 * - Login-Request geht DIREKT vom Browser an b2b-api.kaffeegraf.coffee
 * - KEIN Server-Proxy über die Landingpage (CDN filtert Set-Cookie-Header)
 * - Cookie wird direkt durch die B2B-API im Browser gesetzt
 * - credentials: "include" ist zwingend für Cross-Origin Cookie-Setzung
 * - Kein Token in localStorage, kein Token in URL
 * - Nur E-Mail + Passwort (Kundennummer: out of scope)
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const B2B_API_URL = "https://b2b-api.kaffeegraf.coffee";
const DASHBOARD_URL = "https://b2b-dashboard.kaffeegraf.coffee";

interface B2BLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function B2BLoginModal({
  isOpen,
  onClose,
}: B2BLoginModalProps) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  // loginType bleibt für UI-Kompatibilität erhalten – Kundennummer-Login ist out of scope
  const [loginType, setLoginType] = useState<"email" | "customerNumber">("email");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Bitte füllen Sie alle Felder aus.");
      return;
    }

    // Saubere Ablehnung: Kundennummer-Tab wurde gewählt aber kein E-Mail-Format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      setError("Bitte geben Sie eine gültige E-Mail-Adresse ein. Login mit Kundennummer wird aktuell nicht unterstützt.");
      return;
    }

    setIsLoading(true);

    try {
      // ─── Direkter Browser→API-Call ────────────────────────────────────
      // credentials: "include" ist zwingend damit der Browser das HttpOnly-Cookie
      // von b2b-api.kaffeegraf.coffee speichert (Cross-Origin Cookie-Setzung).
      const response = await fetch(`${B2B_API_URL}/api/b2b/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Cookie wurde direkt durch die B2B-API im Browser gesetzt.
        // Kein Token in localStorage – direkt zum Dashboard weiterleiten.
        window.location.href = DASHBOARD_URL;
        return;
      }

      // ─── Fehlerbehandlung ─────────────────────────────────────────────
      const code = data?.code ?? data?.error?.code ?? "";
      const DENIAL_MESSAGES: Record<string, string> = {
        INVALID_CREDENTIALS: "E-Mail oder Passwort ungültig.",
        VALIDATION_ERROR: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
        ACCOUNT_NOT_ACTIVE: "Für Ihr Konto ist derzeit noch kein B2B-Zugang freigeschaltet.\nBei Fragen melden wir uns gerne persönlich bei Ihnen.",
        DASHBOARD_ACCESS_DENIED: "Ihr Zugang ist derzeit nicht freigeschaltet.\nBei Fragen melden wir uns gerne persönlich bei Ihnen.",
        TOO_MANY_REQUESTS: "Zu viele Anmeldeversuche. Bitte warten Sie einen Moment.",
      };

      setError(
        DENIAL_MESSAGES[code] ??
        data?.message ??
        "Anmeldung fehlgeschlagen. Bitte prüfen Sie Ihre Zugangsdaten."
      );
    } catch {
      setError("Verbindungsfehler. Bitte prüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative z-10 w-full max-w-md mx-4 bg-[#0D0D0B] border border-white/10 rounded-lg p-8"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <>
              <h2 className="font-['Poppins'] text-2xl font-semibold text-white mb-2">
                B2B Login
              </h2>
              <p className="font-['Figtree'] text-sm text-mokka/70 mb-6">
                Melden Sie sich mit Ihrer Kundennummer oder E-Mail an, um auf Ihr Dashboard zuzugreifen.
              </p>

              {/* Login Type Tabs – UI bleibt erhalten, Kundennummer-Logik out of scope */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setLoginType("customerNumber")}
                  className={`flex-1 py-2 px-3 rounded text-sm font-['Figtree'] transition-colors ${
                    loginType === "customerNumber"
                      ? "bg-[#C9A84C] text-[#0D0D0B]"
                      : "bg-[#1A1A18] text-mokka hover:bg-[#252520]"
                  }`}
                >
                  Kundennummer
                </button>
                <button
                  onClick={() => setLoginType("email")}
                  className={`flex-1 py-2 px-3 rounded text-sm font-['Figtree'] transition-colors ${
                    loginType === "email"
                      ? "bg-[#C9A84C] text-[#0D0D0B]"
                      : "bg-[#1A1A18] text-mokka hover:bg-[#252520]"
                  }`}
                >
                  E-Mail
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* E-Mail / Identifier Field */}
                <div>
                  <label className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest text-mokka block mb-2">
                    {loginType === "customerNumber" ? "Kundennummer" : "E-Mail"} *
                  </label>
                  <input
                    type={loginType === "email" ? "email" : "text"}
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder={loginType === "customerNumber" ? "z.B. KG-2024-0042" : "ihre@email.com"}
                    className="w-full bg-[#1A1A18] border border-white/8 text-cream font-['Figtree'] text-sm px-3 py-2 focus:outline-none focus:border-[#C9A84C]/50 transition-colors placeholder:text-mokka/30 rounded"
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest text-mokka block mb-2">
                    Passwort *
                  </label>
                  <input
                    type="password"
                    name="password"
                    required
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-[#1A1A18] border border-white/8 text-cream font-['Figtree'] text-sm px-3 py-2 focus:outline-none focus:border-[#C9A84C]/50 transition-colors placeholder:text-mokka/30 rounded"
                  />
                </div>

                {/* Error message */}
                {error && (
                  <div className="bg-red-900/20 border border-red-500/30 text-red-200 text-sm p-3 rounded whitespace-pre-line">
                    {error}
                  </div>
                )}

                {/* Submit button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#C9A84C] hover:bg-[#B39A3D] text-[#0D0D0B] font-['Poppins'] font-semibold py-2 px-4 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                >
                  {isLoading ? "Wird verarbeitet..." : "Anmelden"}
                </Button>
              </form>
            </>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
