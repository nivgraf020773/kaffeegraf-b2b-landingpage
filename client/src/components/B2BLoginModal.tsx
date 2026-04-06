import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

interface B2BLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function B2BLoginModal({
  isOpen,
  onClose,
}: B2BLoginModalProps) {
  const [form, setForm] = useState({
    identifier: "", // Can be email or customer number
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginType, setLoginType] = useState<"email" | "customerNumber">("customerNumber");

  const b2bLoginMutation = trpc.b2b.login.useMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.identifier || !form.password) {
      setError("Bitte füllen Sie alle Felder aus");
      return;
    }

    setIsLoading(true);

    try {
      const result = await b2bLoginMutation.mutateAsync({
        identifier: form.identifier,
        password: form.password,
        type: loginType,
      });

      if (result.success) {
        // Store session token if provided
        if (result.token) {
          localStorage.setItem("b2b_token", result.token);
        }
        
        // Redirect to dashboard — always use the exact target URL
        window.location.href = result.dashboardUrl || "https://kaffeebizdash-fqjhwufg.manus.space";
      } else {
        // Show the status-specific denial message from the server.
        // The server enforces access gating based on b2b_access_status only.
        // b2b_status is never used for access control.
        setError(result.message || "Anmeldung fehlgeschlagen");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.";
      setError(errorMessage);
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

              {/* Login Type Tabs */}
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
                {/* Identifier Field */}
                <div>
                  <label className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest text-mokka block mb-2">
                    {loginType === "customerNumber" ? "Kundennummer" : "E-Mail"} *
                  </label>
                  <input
                    type={loginType === "email" ? "email" : "text"}
                    name="identifier"
                    required
                    value={form.identifier}
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
