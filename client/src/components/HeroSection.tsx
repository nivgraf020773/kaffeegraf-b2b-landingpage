/* kaffeegraf Hero Section – Dark Elegance B2B Funnel
   Dunkles Tiefschwarz, Goldakzente, Kaffeebohnen-Hintergrund, Premium-Feeling */

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663492934822/L7t4bFiPiLxiqH6LDV52Qk/kaffeegraf-hero-bg-7JtjuGuTkw526Bgd324JiM.webp";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_BG}
          alt="Kaffeebohnen"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0B]/95 via-[#0D0D0B]/80 to-[#0D0D0B]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0B] via-transparent to-[#0D0D0B]/30" />
      </div>

      {/* Content */}
      <div className="container relative z-10 pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center space-y-8"
          >
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center gap-3"
            >
              <div className="h-px w-8 bg-[#C9A84C] opacity-60" />
              <span className="font-['Poppins'] text-[#C9A84C] text-xs uppercase tracking-[0.25em] font-semibold">
                100% Specialty Coffee · B2B
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="font-['Poppins'] text-6xl md:text-7xl lg:text-8xl font-light leading-[0.95] text-white"
            >
              Bester Kaffee
              <br />
              <span className="font-semibold italic text-[#C9A84C]">direkt bei dir</span>
              <br />
              <span className="font-light">verkostet.</span>
            </motion.h1>

            {/* Subline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="font-['Figtree'] text-[#D4C5B0] text-base md:text-lg leading-relaxed max-w-md"
            >
              Wir verkosten den Kaffee direkt bei dir im Betrieb – abgestimmt auf Maschine, Wasser und Nutzung. Keine Standardlösung, sondern die perfekte Lösung für dich.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Button
                onClick={() => {
                  const el = document.querySelector("#main-conversion");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-[#C9A84C] hover:bg-[#B39A3D] text-[#0D0D0B] px-8 py-6 text-lg font-['Poppins'] font-semibold rounded-lg transition-all"
              >
                Kaffee bei dir verkosten
              </Button>
              <Button
                onClick={() => {
                  const el = document.querySelector("#existing-customers");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                variant="outline"
                className="border-2 border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0D0D0B] px-8 py-6 text-lg font-['Poppins'] font-semibold rounded-lg transition-all"
              >
                B2B-Zugang
              </Button>
            </motion.div>

            {/* Trust signals */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="flex items-center gap-6 mt-12 pt-8 border-t border-white/8"
            >
              {[
                { value: "100%", label: "Specialty Coffee" },
                { value: "Vor Ort", label: "Verkostung" },
                { value: "Persönlich", label: "Beratung" },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="font-['Poppins'] text-xl font-semibold text-[#C9A84C]">
                    {item.value}
                  </div>
                  <div className="font-['Figtree'] text-xs text-[#D4C5B0] uppercase tracking-wider mt-1">
                    {item.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="hidden lg:flex items-center justify-center relative"
          >
            {/* Glow behind product */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-64 h-64 rounded-full opacity-25 blur-3xl"
                style={{ background: "radial-gradient(circle, #C9A84C 0%, transparent 70%)" }}
              />
            </div>
            <svg
              className="relative z-10 w-72 xl:w-96"
              viewBox="0 0 200 240"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Coffee cup */}
              <path
                d="M50 80 L50 160 Q50 180 70 180 L130 180 Q150 180 150 160 L150 80 Z"
                stroke="#C9A84C"
                strokeWidth="2"
                fill="none"
              />
              {/* Cup handle */}
              <path
                d="M150 100 Q170 100 170 130 Q170 160 150 160"
                stroke="#C9A84C"
                strokeWidth="2"
                fill="none"
              />
              {/* Coffee liquid */}
              <path
                d="M52 140 L148 140 Q148 165 130 170 L70 170 Q52 165 52 140 Z"
                fill="#C9A84C"
                opacity="0.3"
              />
            </svg>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={() => {
          const el = document.querySelector("#problem");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-[#D4C5B0] hover:text-[#C9A84C] transition-colors"
      >
        <span className="font-['Figtree'] text-xs uppercase tracking-widest">Entdecken</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ArrowDown size={16} />
        </motion.div>
      </motion.button>
    </section>
  );
}
