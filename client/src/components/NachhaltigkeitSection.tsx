/* kaffeegraf NachhaltigkeitSection – Refined Dark Elegance
   Transparenz, Lieferkette, Nachhaltigkeit */
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Leaf, MapPin, Eye, Award } from "lucide-react";

const SUSTAINABILITY_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663492934822/L7t4bFiPiLxiqH6LDV52Qk/kaffeegraf-sustainability-7BVQQ3CHUdrcwy4taJEdiX.webp";

const values = [
  {
    icon: Eye,
    title: "Transparente Lieferkette",
    description:
      "Wir kennen die Herkunft jeder Bohne. Von der Plantage bis zur Rösterei – vollständige Rückverfolgbarkeit ist für uns kein Marketing-Versprechen, sondern Standard.",
  },
  {
    icon: Leaf,
    title: "Nachhaltiger Anbau",
    description:
      "Unsere Partner wirtschaften nach nachhaltigen Prinzipien: schonender Wasserverbrauch, keine Abholzung, faire Entlohnung der Farmarbeiter.",
  },
  {
    icon: MapPin,
    title: "Direkte Partnerschaften",
    description:
      "Wir arbeiten direkt mit Röstereien zusammen, die enge Beziehungen zu den Produzenten pflegen – für faire Preise entlang der gesamten Wertschöpfungskette.",
  },
  {
    icon: Award,
    title: "Specialty Coffee Standard",
    description:
      "Alle Sorten erfüllen den Specialty-Coffee-Standard der SCA (Specialty Coffee Association) – das bedeutet: nur Bohnen mit einem Cupping-Score von 80+ Punkten.",
  },
];

export default function NachhaltigkeitSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="nachhaltigkeit" className="py-24 md:py-32 bg-[#0D0D0B]">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div ref={ref}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="mb-10"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-[#C9A84C] opacity-60" />
                <span className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.25em] text-[#C9A84C]">
                  Nachhaltigkeit & Transparenz
                </span>
              </div>
              <h2 className="font-['Poppins'] text-4xl md:text-5xl font-light text-cream leading-tight">
                Wir wissen,
                <br />
                <span className="font-semibold italic text-[#C9A84C]">woher unser Kaffee kommt.</span>
              </h2>
              <p className="font-['Figtree'] text-mokka text-sm mt-4 leading-relaxed">
                Nachhaltigkeit ist bei kaffeegraf kein Trend, sondern
                Grundprinzip. Wir arbeiten ausschließlich mit Partnern, die
                soziale und ökologische Verantwortung ernst nehmen.
              </p>
            </motion.div>

            {/* Values */}
            <div className="space-y-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  className="flex gap-5 group"
                >
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 border border-[#C9A84C]/20 flex items-center justify-center group-hover:border-[#C9A84C]/50 transition-colors duration-300">
                      <value.icon size={14} className="text-[#C9A84C]/60 group-hover:text-[#C9A84C] transition-colors duration-300" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-['Poppins'] text-lg font-semibold text-cream mb-1">
                      {value.title}
                    </h4>
                    <p className="font-['Figtree'] text-xs text-mokka leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="relative"
          >
            <div className="relative overflow-hidden">
              <img
                src={SUSTAINABILITY_IMG}
                alt="Kaffeeplantage Kolumbien"
                className="w-full h-[550px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0D0D0B]/50" />
            </div>
            {/* Origin badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="absolute top-8 right-8 bg-[#0D0D0B]/90 backdrop-blur-sm border border-[#C9A84C]/30 p-4"
            >
              <div className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest text-[#C9A84C] mb-1">
                Dulima Divina
              </div>
              <div className="font-['Poppins'] text-base font-semibold text-cream">
                Kolumbien
              </div>
              <div className="font-['Figtree'] text-[10px] text-mokka mt-1">
                100% Arabica · Single Origin
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
