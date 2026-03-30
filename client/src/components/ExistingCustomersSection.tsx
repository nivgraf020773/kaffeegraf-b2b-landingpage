import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

export default function ExistingCustomersSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="existing-customers" className="py-24 md:py-32 bg-[#1A1815]">
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto text-center space-y-8"
        >
          <div>
            <h2 className="font-['Cormorant_Garamond'] text-5xl md:text-6xl font-light text-white mb-4">
              Bereits Kunde?
            </h2>
            <p className="font-['Figtree'] text-lg text-[#D4C5B0] leading-relaxed">
              Bestelle deinen Kaffee in wenigen Klicks nach oder passe deine Lieferung an.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                className="bg-[#C9A84C] hover:bg-[#B39A3D] text-[#0D0D0B] px-8 py-6 text-lg font-['Poppins'] font-semibold rounded-lg transition-all"
              >
                Zum B2B Login
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                className="border-2 border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0D0D0B] px-8 py-6 text-lg font-['Poppins'] font-semibold rounded-lg transition-all"
              >
                Schnell nachbestellen
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
