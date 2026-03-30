import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function MainConversionSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const benefits = [
    "Individuell auf deinen Betrieb abgestimmt",
    "Direkt vor Ort verkostet",
    "Klare Empfehlung statt Auswahlstress"
  ];

  return (
    <section id="main-conversion" className="py-24 md:py-32 bg-gradient-to-br from-[#1A1815] via-[#0D0D0B] to-[#0D0D0B]">
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center space-y-8"
        >
          <div>
            <h2 className="font-['Cormorant_Garamond'] text-5xl md:text-6xl font-light text-white mb-4">
              Verkoste Kaffeegraf direkt bei dir im Betrieb
            </h2>
            <p className="font-['Figtree'] text-lg text-[#D4C5B0] leading-relaxed">
              Erlebe, wie gut Kaffee bei dir wirklich sein kann – abgestimmt auf dein Setup.
            </p>
          </div>

          <div className="space-y-4 pt-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex gap-3 items-start justify-center"
              >
                <CheckCircle2 className="text-[#C9A84C] flex-shrink-0 mt-1" size={20} />
                <span className="font-['Figtree'] text-[#D4C5B0] text-lg">{benefit}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="pt-8"
          >
            <Button
              onClick={() => {
                const el = document.querySelector("#kontakt");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-[#C9A84C] hover:bg-[#B39A3D] text-[#0D0D0B] px-10 py-6 text-lg font-['Poppins'] font-semibold rounded-lg transition-all"
            >
              Verkostung anfragen
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
