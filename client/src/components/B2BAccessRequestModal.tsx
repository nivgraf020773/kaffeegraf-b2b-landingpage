import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface B2BAccessRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function B2BAccessRequestModal({
  isOpen,
  onClose,
}: B2BAccessRequestModalProps) {
  const [form, setForm] = useState({
    companyName: "",
    name: "",
    email: "",
    phone: "",
    uid: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const validateUID = (uid: string): boolean => {
    const normalized = uid.trim().toUpperCase();
    const regex = /^ATU\d{8}$/;
    return regex.test(normalized);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate UID
    if (!validateUID(form.uid)) {
      setError("UID muss ATU + genau 8 Ziffern sein (z.B. ATU12345678)");
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Call backend endpoint to submit B2B access request
      // For now, just simulate success
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setForm({ companyName: "", name: "", email: "", phone: "", uid: "" });
      }, 3000);
    } catch (err) {
      setError("Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.");
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

            {!submitted ? (
              <>
                <h2 className="font-['Poppins'] text-2xl font-semibold text-white mb-2">
                  B2B-Zugang beantragen
                </h2>
                <p className="font-['Figtree'] text-sm text-mokka/70 mb-6">
                  Dieses Angebot richtet sich ausschließlich an gewerbliche Kunden.
                  Für den Zugang benötigen wir einige Informationen zur Prüfung.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Company Name */}
                  <div>
                    <label className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest text-mokka block mb-2">
                      Firmenname *
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      required
                      value={form.companyName}
                      onChange={handleChange}
                      placeholder="Ihre Firma"
                      className="w-full bg-[#1A1A18] border border-white/8 text-cream font-['Figtree'] text-sm px-3 py-2 focus:outline-none focus:border-[#C9A84C]/50 transition-colors placeholder:text-mokka/30 rounded"
                    />
                  </div>

                  {/* Name */}
                  <div>
                    <label className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest text-mokka block mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Ihr Name"
                      className="w-full bg-[#1A1A18] border border-white/8 text-cream font-['Figtree'] text-sm px-3 py-2 focus:outline-none focus:border-[#C9A84C]/50 transition-colors placeholder:text-mokka/30 rounded"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest text-mokka block mb-2">
                      E-Mail *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="ihre@email.com"
                      className="w-full bg-[#1A1A18] border border-white/8 text-cream font-['Figtree'] text-sm px-3 py-2 focus:outline-none focus:border-[#C9A84C]/50 transition-colors placeholder:text-mokka/30 rounded"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest text-mokka block mb-2">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+43 1 234 56789"
                      className="w-full bg-[#1A1A18] border border-white/8 text-cream font-['Figtree'] text-sm px-3 py-2 focus:outline-none focus:border-[#C9A84C]/50 transition-colors placeholder:text-mokka/30 rounded"
                    />
                  </div>

                  {/* UID */}
                  <div>
                    <label className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest text-mokka block mb-2">
                      UID / Steuernummer *
                    </label>
                    <input
                      type="text"
                      name="uid"
                      required
                      maxLength={11}
                      pattern="ATU\d{8}"
                      value={form.uid}
                      onChange={handleChange}
                      placeholder="ATU12345678"
                      className="w-full bg-[#1A1A18] border border-white/8 text-cream font-['Figtree'] text-sm px-3 py-2 focus:outline-none focus:border-[#C9A84C]/50 transition-colors placeholder:text-mokka/30 rounded"
                      title="UID muss ATU + genau 8 Ziffern sein (z.B. ATU12345678)"
                    />
                    <p className="font-['Figtree'] text-mokka text-xs mt-1">
                      Format: ATU + genau 8 Ziffern (z.B. ATU12345678)
                    </p>
                  </div>

                  {/* Error message */}
                  {error && (
                    <div className="bg-red-900/20 border border-red-500/30 text-red-200 text-sm p-3 rounded">
                      {error}
                    </div>
                  )}

                  {/* Submit button */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#C9A84C] hover:bg-[#B39A3D] text-[#0D0D0B] font-['Poppins'] font-semibold py-2 px-4 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                  >
                    {isLoading ? "Wird verarbeitet..." : "Zugang beantragen"}
                  </Button>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="mb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-900/20 border border-green-500/30 rounded-full">
                    <svg
                      className="w-6 h-6 text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="font-['Poppins'] text-lg font-semibold text-white mb-2">
                  Danke!
                </h3>
                <p className="font-['Figtree'] text-sm text-mokka/70">
                  Wir prüfen deine Angaben und melden uns kurzfristig mit deinem
                  Zugang.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
