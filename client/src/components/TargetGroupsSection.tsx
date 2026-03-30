import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Building2, Briefcase, UtensilsCrossed, Hotel, ShoppingBag } from "lucide-react";

export default function TargetGroupsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const groups = [
    { icon: Building2, title: "Büro / Teams", desc: "Konstant guter Kaffee für dein Team" },
    { icon: Briefcase, title: "Praxis / Kanzlei", desc: "Professioneller Eindruck für Klienten" },
    { icon: UtensilsCrossed, title: "Fine Dining", desc: "Espresso auf Niveau, perfekt abgestimmt" },
    { icon: Hotel, title: "Hotel / Eventlocation", desc: "Kaffee als Teil des Erlebnisses" },
    { icon: ShoppingBag, title: "Retail / Concept Store", desc: "Hochwertige Kaffee-Experience" }
  ];

  return (
    <section className="py-24 md:py-32 bg-[#1A1815]">
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-['Poppins'] text-5xl md:text-6xl font-light text-white">
            Für wen ist Kaffeegraf B2B gemacht?
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {groups.map((group, index) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-[#252220] p-6 rounded-lg border border-[#3A3530] hover:border-[#C9A84C] transition-colors cursor-pointer group"
            >
              <div className="mb-4">
                <div className="w-12 h-12 rounded-full bg-[#C9A84C]/20 group-hover:bg-[#C9A84C]/30 flex items-center justify-center transition-colors">
                  <group.icon className="text-[#C9A84C]" size={24} />
                </div>
              </div>
              <h3 className="font-['Poppins'] font-semibold text-white mb-2">
                {group.title}
              </h3>
              <p className="font-['Figtree'] text-sm text-[#D4C5B0]">
                {group.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
