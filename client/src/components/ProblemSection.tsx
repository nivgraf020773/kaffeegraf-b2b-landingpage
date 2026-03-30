import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function ProblemSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="problem" className="py-24 md:py-32 bg-[#0D0D0B]">
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center space-y-6"
        >
          <h2 className="font-['Cormorant_Garamond'] text-5xl md:text-6xl font-light text-white">
            Warum Kaffee im Unternehmen oft nicht überzeugt
          </h2>
          <p className="font-['Figtree'] text-lg text-[#D4C5B0] leading-relaxed">
            In den meisten Fällen liegt es nicht am Kaffee – sondern an der Zubereitung. Maschine, Mahlgrad, Wasser und Einstellung entscheiden über den Geschmack.
          </p>
          <p className="font-['Figtree'] text-lg font-semibold text-[#C9A84C]">
            Deshalb verkosten wir den Kaffee direkt bei dir.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
