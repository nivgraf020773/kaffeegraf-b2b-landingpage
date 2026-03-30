import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function ApproachSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const points = [
    "Verkostung direkt bei dir im Betrieb",
    "Einstellung auf deine Maschine & Nutzung",
    "Individuelle Empfehlung statt Standardlösung"
  ];

  return (
    <section className="py-24 md:py-32 bg-[#1A1815]">
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="font-['Cormorant_Garamond'] text-5xl md:text-6xl font-light text-white mb-12">
            Kaffee, der bei dir wirklich funktioniert
          </h2>
          <div className="space-y-6">
            {points.map((point, index) => (
              <motion.div
                key={point}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex gap-4 items-start"
              >
                <div className="w-8 h-8 rounded-full bg-[#C9A84C] flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-[#0D0D0B] font-['Poppins'] font-semibold text-sm">{index + 1}</span>
                </div>
                <p className="font-['Figtree'] text-lg text-[#D4C5B0] leading-relaxed pt-1">
                  {point}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
