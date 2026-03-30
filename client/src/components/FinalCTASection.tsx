import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

export default function FinalCTASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 md:py-32 bg-gradient-to-br from-[#1A1815] to-[#0D0D0B]">
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto text-center space-y-8"
        >
          <h2 className="font-['Poppins'] text-5xl md:text-6xl font-light text-white">
            Bereit für besseren Kaffee im Unternehmen?
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
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

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => {
                  const el = document.querySelector("#kontakt");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                variant="outline"
                className="border-2 border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0D0D0B] px-10 py-6 text-lg font-['Poppins'] font-semibold rounded-lg transition-all"
              >
                Kontakt aufnehmen
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
