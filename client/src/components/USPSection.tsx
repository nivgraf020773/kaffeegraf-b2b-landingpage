/* kaffeegraf USPSection – Refined Dark Elegance
   Alleinstellungsmerkmale als kompakte Feature-Leiste */
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star, Users, Leaf, Tag } from "lucide-react";

const usps = [
  {
    icon: Star,
    title: "100% Specialty Coffee",
    description: "Nur Bohnen mit SCA-Score 80+. Keine Kompromisse bei der Qualität.",
  },
  {
    icon: Users,
    title: "Persönliche Beratung",
    description: "Individuelle Empfehlung statt Standardlösung. Wir kommen zu Ihnen.",
  },
  {
    icon: Leaf,
    title: "Transparente Lieferkette",
    description: "Wir kennen die Herkunft jeder Bohne. Nachhaltigkeit als Grundprinzip.",
  },
  {
    icon: Tag,
    title: "White-Label Option",
    description: "Alle Sorten auf Wunsch unter Ihrem eigenen Firmenlabel erhältlich.",
  },
];

export default function USPSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-16 bg-[#1A1512] border-y border-white/5">
      <div className="container">
        <div
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0"
        >
          {usps.map((usp, index) => (
            <motion.div
              key={usp.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex flex-col items-start p-8 border-r border-white/5 last:border-r-0 group"
            >
              <div className="mb-4">
                <usp.icon
                  size={20}
                  className="text-[#C9A84C]/60 group-hover:text-[#C9A84C] transition-colors duration-300"
                />
              </div>
              <h3 className="font-['Poppins'] text-xl font-semibold text-cream mb-2">
                {usp.title}
              </h3>
              <p className="font-['Figtree'] text-xs text-mokka leading-relaxed">
                {usp.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
