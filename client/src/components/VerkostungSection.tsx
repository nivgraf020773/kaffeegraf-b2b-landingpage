/* kaffeegraf VerkostungSection – Refined Dark Elegance
   Der 4-Schritte Verkostungs-Prozess mit Bild */
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const TASTING_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663492934822/L7t4bFiPiLxiqH6LDV52Qk/kaffeegraf-tasting-ZNeUaAvg83wK6ZUAnRsWnh.webp";

const steps = [
  {
    number: "01",
    title: "Kontaktaufnahme",
    description:
      "Sie melden sich über unser Formular oder direkt per E-Mail. Wir besprechen kurz Ihren Bedarf, Ihre Maschinen und Ihre Präferenzen.",
  },
  {
    number: "02",
    title: "Terminvereinbarung",
    description:
      "Wir vereinbaren einen Termin, der zu Ihrem Büroalltag passt. Kein Aufwand für Sie – wir kommen zu Ihnen.",
  },
  {
    number: "03",
    title: "Verkostung vor Ort",
    description:
      "Unser Berater bringt die empfohlenen Sorten mit und bereitet sie direkt auf Ihren Maschinen zu. So erleben Sie den Kaffee genau so, wie er täglich schmecken wird.",
  },
  {
    number: "04",
    title: "Individuelle Empfehlung",
    description:
      "Auf Basis der Verkostung empfehlen wir die optimale Sorte und Liefermenge für Ihr Unternehmen – ohne Druck, ohne Mindestbestellmenge beim Einstieg.",
  },
];

export default function VerkostungSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="verkostung" className="py-24 md:py-32 bg-[#0D0D0B]">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="relative"
          >
            <div className="relative overflow-hidden">
              <img
                src={TASTING_IMG}
                alt="Kaffeegraf Verkostung vor Ort"
                className="w-full h-[500px] object-cover"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0B]/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0B]/30 to-transparent" />
            </div>
            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute bottom-8 left-8 bg-[#0D0D0B]/90 backdrop-blur-sm border border-[#C9A84C]/30 p-5"
            >
              <div className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest text-[#C9A84C] mb-2">
                Unser Versprechen
              </div>
              <div className="font-['Poppins'] text-xl font-semibold text-cream">
                Keine Katze im Sack.
              </div>
              <div className="font-['Figtree'] text-xs text-mokka mt-1">
                Erst verkosten, dann entscheiden.
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Steps */}
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
                  Der Prozess
                </span>
              </div>
              <h2 className="font-['Poppins'] text-4xl md:text-5xl font-light text-cream leading-tight">
                Verkostung
                <br />
                <span className="font-semibold italic text-[#C9A84C]">direkt bei Ihnen.</span>
              </h2>
              <p className="font-['Figtree'] text-mokka text-sm mt-4 leading-relaxed">
                Wir glauben, dass Kaffee erlebt werden muss – nicht beschrieben.
                Deshalb kommen wir zu Ihnen und bereiten die Sorten auf Ihren
                eigenen Maschinen zu.
              </p>
            </motion.div>

            {/* Steps */}
            <div className="space-y-0">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: 30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.12 }}
                  className="flex gap-6 py-6 border-b border-white/5 last:border-0 group"
                >
                  <div className="flex-shrink-0">
                    <span className="font-['Poppins'] text-4xl font-light text-[#C9A84C]/30 group-hover:text-[#C9A84C]/60 transition-colors duration-300">
                      {step.number}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-['Poppins'] text-xl font-semibold text-cream mb-2">
                      {step.title}
                    </h4>
                    <p className="font-['Figtree'] text-sm text-mokka leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
              onClick={() => {
                const el = document.querySelector("#kontakt");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="btn-gold mt-8"
            >
              Jetzt Termin vereinbaren
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}
