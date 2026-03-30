import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MessageSquare, Users, CheckCircle } from "lucide-react";

export default function ProcessSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    { icon: MessageSquare, title: "Kurze Anfrage senden", desc: "Erzähl uns von deinem Setup" },
    { icon: Users, title: "Wir kommen vorbei und verkosten gemeinsam", desc: "Vor Ort auf deiner Maschine" },
    { icon: CheckCircle, title: "Du bekommst die passende Lösung & Einstellung", desc: "Individuelle Empfehlung" }
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
            So einfach geht's
          </h2>
          <p className="font-['Figtree'] text-[#8B6F47] mt-4">Ohne Verpflichtung</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="text-center space-y-4"
            >
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-[#8B6F47]/10 flex items-center justify-center">
                  <step.icon className="text-[#8B6F47]" size={32} />
                </div>
              </div>
              <h3 className="font-['Poppins'] text-xl font-semibold text-[#1A1410]">
                {step.title}
              </h3>
              <p className="font-['Figtree'] text-[#5A5550]">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
