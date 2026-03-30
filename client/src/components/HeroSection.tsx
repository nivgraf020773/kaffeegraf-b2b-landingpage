/* kaffeegraf Hero Section – B2B Funnel
   Headline: "Besserer Kaffee im Unternehmen – direkt bei dir verkostet."
   Fokus: Klare CTAs für Neukunden und Bestandskunden */

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-[#F8F6F1] via-[#FAFAF8] to-[#F5F3EE] overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle at 20% 50%, #8B6F47 0%, transparent 50%)",
          backgroundSize: "200% 200%"
        }} />
      </div>

      <div className="container relative z-10 py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Tagline */}
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-[#8B6F47]" />
              <span className="font-['Poppins'] text-sm font-semibold uppercase tracking-wider text-[#8B6F47]">
                B2B Specialty Coffee
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-['Poppins'] text-5xl md:text-6xl lg:text-7xl font-light leading-tight text-[#1A1410]">
              Besserer Kaffee im Unternehmen –
              <br />
              <span className="font-semibold italic text-[#8B6F47]">direkt bei dir verkostet.</span>
            </h1>

            {/* Subline */}
            <p className="font-['Figtree'] text-lg text-[#5A5550] leading-relaxed max-w-xl">
              Wir verkosten den Kaffee direkt bei dir im Betrieb – abgestimmt auf Maschine, Wasser und Nutzung. Keine Standardlösung, sondern die perfekte Lösung für dich.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => {
                    const el = document.querySelector("#main-conversion");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="bg-[#8B6F47] hover:bg-[#6F5A3A] text-white px-8 py-6 text-lg font-['Poppins'] font-semibold rounded-lg transition-all"
                >
                  Kaffee bei dir im Betrieb verkosten
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => {
                    const el = document.querySelector("#existing-customers");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  variant="outline"
                  className="border-2 border-[#8B6F47] text-[#8B6F47] hover:bg-[#8B6F47] hover:text-white px-8 py-6 text-lg font-['Poppins'] font-semibold rounded-lg transition-all"
                >
                  B2B-Zugang für Bestandskunden
                </Button>
              </motion.div>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-6 pt-8 border-t border-[#E0D9D0]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#8B6F47] rounded-full" />
                <span className="font-['Figtree'] text-sm text-[#5A5550]">100% Specialty Coffee</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#8B6F47] rounded-full" />
                <span className="font-['Figtree'] text-sm text-[#5A5550]">Verkostung vor Ort</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#8B6F47] rounded-full" />
                <span className="font-['Figtree'] text-sm text-[#5A5550]">Persönliche Beratung</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-96 md:h-full flex items-center justify-center"
          >
            {/* Subtle coffee cup illustration */}
            <div className="relative w-full max-w-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-[#8B6F47]/10 to-[#C9A84C]/5 rounded-3xl blur-3xl" />
              <div className="relative bg-white/50 backdrop-blur-sm rounded-3xl p-12 border border-[#E0D9D0]/50">
                <svg
                  className="w-full h-full text-[#8B6F47]"
                  viewBox="0 0 200 240"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Coffee cup */}
                  <path
                    d="M50 80 L50 160 Q50 180 70 180 L130 180 Q150 180 150 160 L150 80 Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                  {/* Cup handle */}
                  <path
                    d="M150 100 Q170 100 170 130 Q170 160 150 160"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                  {/* Coffee liquid */}
                  <path
                    d="M52 140 L148 140 Q148 165 130 170 L70 170 Q52 165 52 140 Z"
                    fill="currentColor"
                    opacity="0.3"
                  />
                  {/* Steam */}
                  <path
                    d="M70 60 Q70 40 80 30"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                    opacity="0.5"
                  />
                  <path
                    d="M100 50 Q100 30 110 20"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                    opacity="0.5"
                  />
                  <path
                    d="M130 60 Q130 40 140 30"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                    opacity="0.5"
                  />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
