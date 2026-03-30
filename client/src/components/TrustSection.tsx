import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Coffee, Leaf, Users, Package } from "lucide-react";

export default function TrustSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const points = [
    { icon: Coffee, title: "Specialty Coffee Qualität", desc: "100% zertifizierte Specialty Beans" },
    { icon: Leaf, title: "Direkter Handel & Transparenz", desc: "Wir kennen unsere Farmer" },
    { icon: Users, title: "Persönliche Beratung", desc: "Keine Standardlösungen" },
    { icon: Package, title: "Nachhaltige Verpackung", desc: "Umweltbewusst von Anfang an" },
    { icon: Coffee, title: "Fokus auf echte Genussmomente", desc: "Kaffee, der Freude bereitet" }
  ];

  return (
    <section className="py-24 md:py-32 bg-[#0D0D0B]">
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-['Cormorant_Garamond'] text-5xl md:text-6xl font-light text-white">
            Warum Kaffeegraf?
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {points.map((point, index) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center space-y-3"
            >
              <div className="flex justify-center">
                <div className="w-14 h-14 rounded-full bg-[#C9A84C]/20 flex items-center justify-center">
                  <point.icon className="text-[#C9A84C]" size={28} />
                </div>
              </div>
              <h3 className="font-['Poppins'] font-semibold text-white">
                {point.title}
              </h3>
              <p className="font-['Figtree'] text-sm text-[#D4C5B0]">
                {point.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
