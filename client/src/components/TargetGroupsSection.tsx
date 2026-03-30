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
    <section className="py-24 md:py-32 bg-[#F8F6F1]">
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-['Poppins'] text-4xl md:text-5xl font-light text-[#1A1410]">
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
              className="bg-white p-6 rounded-lg border border-[#E0D9D0] hover:border-[#8B6F47] transition-colors cursor-pointer group"
            >
              <div className="mb-4">
                <div className="w-12 h-12 rounded-full bg-[#8B6F47]/10 group-hover:bg-[#8B6F47]/20 flex items-center justify-center transition-colors">
                  <group.icon className="text-[#8B6F47]" size={24} />
                </div>
              </div>
              <h3 className="font-['Poppins'] font-semibold text-[#1A1410] mb-2">
                {group.title}
              </h3>
              <p className="font-['Figtree'] text-sm text-[#5A5550]">
                {group.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
