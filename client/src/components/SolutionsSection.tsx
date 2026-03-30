import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function SolutionsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const solutions = [
    {
      title: "Bürokaffee",
      desc: "Einfach, konstant gut, stressfrei",
      details: "Der perfekte Kaffee für dein Team – ohne Umschweife."
    },
    {
      title: "Gastronomie (Fine Dining)",
      desc: "Espresso auf Niveau, perfekt abgestimmt",
      details: "Kaffee als Abschluss des Erlebnisses – hochwertig und konsistent."
    },
    {
      title: "Meetings & Filterkaffee",
      desc: "Klar, zugänglich, hochwertig",
      details: "Der Kaffee, der im Gespräch überzeugt."
    },
    {
      title: "Koffeinfreie Optionen",
      desc: "Genuss ohne Kompromisse",
      details: "Auch ohne Koffein: voller Geschmack und Qualität."
    }
  ];

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-['Poppins'] text-4xl md:text-5xl font-light text-[#1A1410]">
            Individuelle Lösungen statt Standardkaffee
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {solutions.map((solution, index) => (
            <motion.div
              key={solution.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="p-8 bg-[#F8F6F1] rounded-lg border border-[#E0D9D0] hover:border-[#8B6F47] transition-colors"
            >
              <h3 className="font-['Poppins'] text-2xl font-semibold text-[#1A1410] mb-2">
                {solution.title}
              </h3>
              <p className="font-['Figtree'] text-[#8B6F47] font-semibold mb-4">
                {solution.desc}
              </p>
              <p className="font-['Figtree'] text-[#5A5550] leading-relaxed">
                {solution.details}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
