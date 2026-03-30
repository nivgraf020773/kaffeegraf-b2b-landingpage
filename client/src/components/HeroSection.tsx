/* kaffeegraf HeroSection – Refined Dark Elegance
   Full-height hero with coffee bean bg, product image, asymmetric layout */
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663492934822/L7t4bFiPiLxiqH6LDV52Qk/kaffeegraf-hero-bg-7JtjuGuTkw526Bgd324JiM.webp";
const PRODUCT_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663492934822/L7t4bFiPiLxiqH6LDV52Qk/kaffeegraf-product-nobg_ce1893f3.png";

export default function HeroSection() {
  const scrollToNext = () => {
    const el = document.querySelector("#sortiment");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

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
          <div className="flex flex-col justify-center">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="h-px w-8 bg-gold opacity-60" />
              <span className="font--mono-spec text-[#C9A84C] text-xs uppercase tracking-[0.25em] font-['JetBrains_Mono']">
                100% Specialty Coffee · B2B
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="font-['Poppins'] text-5xl md:text-6xl lg:text-7xl font-light leading-[1.05] text-cream mb-6"
            >
              Kaffee, der
              <br />
              <span className="font-semibold italic text-[#C9A84C]">überzeugt.</span>
              <br />
              <span className="font-light">Nicht verspricht.</span>
            </motion.h1>

            {/* Subline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="font-['Figtree'] text-mokka text-base md:text-lg leading-relaxed max-w-md mb-10"
            >
              Wir bringen Specialty Coffee direkt in Ihr Büro – mit persönlicher
              Beratung, Verkostung auf Ihren Maschinen und transparenter
              Lieferkette. Keine Kompromisse bei der Qualität.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button
                onClick={() => {
                  const el = document.querySelector("#kontakt");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="btn-gold"
              >
                Kostenlose Verkostung anfragen
              </button>
              <button
                onClick={() => {
                  const el = document.querySelector("#sortiment");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="btn-outline-gold"
              >
                Sortiment entdecken
              </button>
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
                { value: "3", label: "Sorten für B2B" },
                { value: "Vor Ort", label: "Verkostung" },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="font-['Poppins'] text-2xl font-semibold text-[#C9A84C]">
                    {item.value}
                  </div>
                  <div className="font-['Figtree'] text-xs text-mokka uppercase tracking-wider mt-1">
                    {item.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Product Image */}
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
            <img
              src={PRODUCT_IMG}
              alt="kaffeegraf Kaffeebeutel Complex"
              className="relative z-10 w-72 xl:w-96"
              style={{ filter: "drop-shadow(0 20px 80px rgba(201,168,76,0.25)) drop-shadow(0 0 40px rgba(201,168,76,0.1))" }}
            />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToNext}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-mokka hover:text-gold transition-colors"
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
