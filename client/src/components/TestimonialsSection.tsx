/* kaffeegraf TestimonialsSection – Refined Dark Elegance
   Platzhalter-Testimonials für zukünftige Kundenstimmen */
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "Hier kommt Ihr Kundenzitat. Beschreiben Sie, wie kaffeegraf Ihren Büroalltag verändert hat – von der ersten Verkostung bis zur regelmäßigen Lieferung.",
    author: "Vorname Nachname",
    role: "Position",
    company: "Unternehmen GmbH",
    placeholder: true,
  },
  {
    quote:
      "Platz für Ihre Erfahrung mit kaffeegraf. Was hat Sie überzeugt? Die Qualität der Bohnen, die persönliche Beratung oder der unkomplizierte Service?",
    author: "Vorname Nachname",
    role: "Position",
    company: "Restaurant / Café",
    placeholder: true,
  },
  {
    quote:
      "Teilen Sie hier Ihre Geschichte. Wie hat sich die Kaffeeerfahrung in Ihrem Unternehmen durch kaffeegraf verändert?",
    author: "Vorname Nachname",
    role: "Position",
    company: "Partnerunternehmen",
    placeholder: true,
  },
];

export default function TestimonialsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="referenzen" className="py-24 md:py-32 bg-[#1A1512]">
      <div className="container">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-[#C9A84C] opacity-60" />
            <span className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.25em] text-[#C9A84C]">
              Kundenstimmen
            </span>
            <div className="h-px w-8 bg-[#C9A84C] opacity-60" />
          </div>
          <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl font-light text-cream">
            Was unsere Kunden
            <br />
            <span className="font-semibold italic text-[#C9A84C]">sagen.</span>
          </h2>
          {/* Placeholder notice */}
          <div className="mt-6 inline-flex items-center gap-2 border border-[#C9A84C]/20 px-4 py-2 bg-[#C9A84C]/5">
            <span className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest text-[#C9A84C]/60">
              Platzhalter · Testimonials folgen in Kürze
            </span>
          </div>
        </motion.div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.15 }}
              className="p-8 bg-[#0D0D0B] card-glow relative opacity-60"
            >
              {/* Quote icon */}
              <Quote size={20} className="text-[#C9A84C]/40 mb-6" />

              {/* Quote text */}
              <p className="font-['Cormorant_Garamond'] text-lg font-light text-cream/70 leading-relaxed mb-8 italic">
                "{testimonial.quote}"
              </p>

              {/* Divider */}
              <div className="gold-line mb-6" />

              {/* Author */}
              <div>
                <div className="font-['Outfit'] text-sm font-medium text-cream/60">
                  {testimonial.author}
                </div>
                <div className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest text-mokka/60 mt-1">
                  {testimonial.role} · {testimonial.company}
                </div>
              </div>

              {/* Placeholder overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="border border-dashed border-[#C9A84C]/15 absolute inset-4 flex items-center justify-center">
                  <span className="font-['JetBrains_Mono'] text-[8px] uppercase tracking-widest text-[#C9A84C]/20 rotate-[-15deg]">
                    Platzhalter
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA to become a reference */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="font-['Outfit'] text-sm text-mokka mb-6">
            Werden Sie einer unserer ersten Referenzkunden und profitieren Sie
            von exklusiven Konditionen beim Einstieg.
          </p>
          <button
            onClick={() => {
              const el = document.querySelector("#kontakt");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="btn-outline-gold"
          >
            Jetzt Kontakt aufnehmen
          </button>
        </motion.div>
      </div>
    </section>
  );
}
