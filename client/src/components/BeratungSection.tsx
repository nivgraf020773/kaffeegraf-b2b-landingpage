/* kaffeegraf BeratungSection – Refined Dark Elegance
   Maschinenberatung für Büros, Gastronomie, Cafés */
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Settings, Coffee, Building2, UtensilsCrossed } from "lucide-react";

const OFFICE_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663492934822/L7t4bFiPiLxiqH6LDV52Qk/kaffeegraf-office-3yLxLQ9Xq93aBnk76PXK8e.webp";

const targets = [
  {
    icon: Building2,
    title: "Büros & Unternehmen",
    description:
      "Vom kleinen Team bis zum Großraumbüro: Wir empfehlen den passenden Vollautomaten und die richtige Sorte für Ihren täglichen Kaffeebedarf.",
    machines: ["Vollautomaten", "Kapselmaschinen", "Filter-Systeme"],
  },
  {
    icon: UtensilsCrossed,
    title: "Gehobene Gastronomie",
    description:
      "Für Restaurants, die Kaffee als Teil des Erlebnisses verstehen. Siebträger-Systeme und Single-Origin-Sorten für den perfekten Abschluss.",
    machines: ["Siebträger", "Mühlen", "Espresso-Systeme"],
  },
  {
    icon: Coffee,
    title: "Selbständige Cafés",
    description:
      "Individuelle Beratung für Café-Betreiber: Maschine, Sorte, Röstgrad und White-Label-Option für Ihr eigenes Branding.",
    machines: ["Siebträger", "Vollautomaten", "White-Label"],
  },
];

export default function BeratungSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="beratung" className="py-24 md:py-32 bg-[#1A1512]">
      <div className="container">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-16">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-[#C9A84C] opacity-60" />
              <span className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.25em] text-[#C9A84C]">
                Maschinenberatung
              </span>
            </div>
            <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl font-light text-cream leading-tight">
              Die richtige Maschine
              <br />
              <span className="font-semibold italic text-[#C9A84C]">für jeden Bedarf.</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-col justify-end"
          >
            <p className="font-['Outfit'] text-mokka text-sm leading-relaxed">
              Ob Vollautomat für das Büro oder Siebträger für das Café – wir
              beraten Sie herstellerunabhängig und individuell. Unser Ziel ist
              nicht der schnelle Verkauf, sondern die langfristig richtige
              Lösung für Ihr Unternehmen.
            </p>
          </motion.div>
        </div>

        {/* Target groups */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {targets.map((target, index) => (
            <motion.div
              key={target.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.15 }}
              className="p-8 bg-[#0D0D0B] card-glow group"
            >
              <div className="mb-6">
                <target.icon
                  size={24}
                  className="text-[#C9A84C] opacity-70 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <h3 className="font-['Cormorant_Garamond'] text-2xl font-semibold text-cream mb-3">
                {target.title}
              </h3>
              <p className="font-['Outfit'] text-sm text-mokka leading-relaxed mb-6">
                {target.description}
              </p>
              <div className="gold-line mb-4" />
              <div className="flex flex-wrap gap-2">
                {target.machines.map((machine) => (
                  <span
                    key={machine}
                    className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest text-[#C9A84C]/70 border border-[#C9A84C]/20 px-2 py-1"
                  >
                    {machine}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Image + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden"
        >
          <img
            src={OFFICE_IMG}
            alt="Kaffeegraf Büro-Kaffee"
            className="w-full h-64 md:h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0B]/80 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="container">
              <div className="max-w-lg">
                <h3 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl font-light text-cream mb-4">
                  Bereit für besseren
                  <br />
                  <span className="font-semibold italic text-[#C9A84C]">Bürokaffee?</span>
                </h3>
                <button
                  onClick={() => {
                    const el = document.querySelector("#kontakt");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="btn-gold"
                >
                  Beratungsgespräch anfragen
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
