/* kaffeegraf KontaktSection – Refined Dark Elegance
   Kontaktformular für Verkostungsanfragen */
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Mail, Phone, Globe, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function KontaktSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    type: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    toast.success("Ihre Anfrage wurde gesendet! Wir melden uns innerhalb von 24 Stunden.");
    setSubmitted(true);
  };

  return (
    <section id="kontakt" className="py-24 md:py-32 bg-[#0D0D0B]">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Info */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-[#C9A84C] opacity-60" />
              <span className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.25em] text-[#C9A84C]">
                Kontakt
              </span>
            </div>
            <h2 className="font-['Poppins'] text-4xl md:text-5xl font-light text-cream leading-tight mb-6">
              Starten wir mit
              <br />
              <span className="font-semibold italic text-[#C9A84C]">einer Verkostung.</span>
            </h2>
            <p className="font-['Figtree'] text-mokka text-sm leading-relaxed mb-10">
              Füllen Sie das Formular aus und wir melden uns innerhalb von 24
              Stunden bei Ihnen. Die erste Verkostung ist selbstverständlich
              kostenlos und unverbindlich.
            </p>

            {/* Contact details */}
            <div className="space-y-5">
              {[
                {
                  icon: Mail,
                  label: "E-Mail",
                  value: "office@kaffeegraf.coffee",
                  href: "mailto:office@kaffeegraf.coffee",
                },
                {
                  icon: Globe,
                  label: "Website",
                  value: "www.kaffeegraf.coffee",
                  href: "https://www.kaffeegraf.coffee",
                },
              ].map((item) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 border border-[#C9A84C]/20 flex items-center justify-center group-hover:border-[#C9A84C]/50 transition-colors duration-300">
                    <item.icon size={14} className="text-[#C9A84C]/60 group-hover:text-[#C9A84C] transition-colors duration-300" />
                  </div>
                  <div>
                    <div className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest text-mokka">
                      {item.label}
                    </div>
                    <div className="font-['Figtree'] text-sm text-cream group-hover:text-[#C9A84C] transition-colors duration-300">
                      {item.value}
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Promise */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="mt-12 p-6 border-l-2 border-[#C9A84C]/40 bg-[#1A1512]"
            >
              <p className="font-['Poppins'] text-lg italic text-cream/80">
                "Wir glauben, dass jedes Unternehmen den Kaffee verdient, der
                wirklich zu ihm passt. Deshalb kommen wir zu Ihnen – nicht
                umgekehrt."
              </p>
              <div className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest text-mokka mt-3">
                — kaffeegraf Team
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-[#1A1512] border border-[#C9A84C]/20">
                <CheckCircle size={40} className="text-[#C9A84C] mb-6" />
                <h3 className="font-['Poppins'] text-3xl font-semibold text-cream mb-4">
                  Vielen Dank!
                </h3>
                <p className="font-['Figtree'] text-sm text-mokka leading-relaxed">
                  Ihre Anfrage ist bei uns eingegangen. Wir melden uns innerhalb
                  von 24 Stunden bei Ihnen, um einen Termin für die kostenlose
                  Verkostung zu vereinbaren.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-[#1A1512] p-8 border border-white/5 space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest text-mokka block mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Max Mustermann"
                      className="w-full bg-[#0D0D0B] border border-white/8 text-cream font-['Figtree'] text-sm px-4 py-3 focus:outline-none focus:border-[#C9A84C]/50 transition-colors placeholder:text-mokka/30"
                    />
                  </div>
                  <div>
                    <label className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest text-mokka block mb-2">
                      Unternehmen *
                    </label>
                    <input
                      type="text"
                      name="company"
                      required
                      value={form.company}
                      onChange={handleChange}
                      placeholder="Muster GmbH"
                      className="w-full bg-[#0D0D0B] border border-white/8 text-cream font-['Figtree'] text-sm px-4 py-3 focus:outline-none focus:border-[#C9A84C]/50 transition-colors placeholder:text-mokka/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest text-mokka block mb-2">
                      E-Mail *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="max@muster.at"
                      className="w-full bg-[#0D0D0B] border border-white/8 text-cream font-['Figtree'] text-sm px-4 py-3 focus:outline-none focus:border-[#C9A84C]/50 transition-colors placeholder:text-mokka/30"
                    />
                  </div>
                  <div>
                    <label className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest text-mokka block mb-2">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+43 ..."
                      className="w-full bg-[#0D0D0B] border border-white/8 text-cream font-['Figtree'] text-sm px-4 py-3 focus:outline-none focus:border-[#C9A84C]/50 transition-colors placeholder:text-mokka/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest text-mokka block mb-2">
                    Ich bin ... *
                  </label>
                  <select
                    name="type"
                    required
                    value={form.type}
                    onChange={handleChange}
                    className="w-full bg-[#0D0D0B] border border-white/8 text-cream font-['Figtree'] text-sm px-4 py-3 focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
                  >
                    <option value="" disabled className="text-mokka">
                      Bitte wählen ...
                    </option>
                    <option value="buero">Büro / Unternehmen</option>
                    <option value="gastronomie">Gehobene Gastronomie</option>
                    <option value="cafe">Selbständiges Café</option>
                    <option value="sonstiges">Sonstiges</option>
                  </select>
                </div>

                <div>
                  <label className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest text-mokka block mb-2">
                    Nachricht
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Erzählen Sie uns kurz von Ihrem Bedarf – Teamgröße, vorhandene Maschinen, Präferenzen ..."
                    className="w-full bg-[#0D0D0B] border border-white/8 text-cream font-['Figtree'] text-sm px-4 py-3 focus:outline-none focus:border-[#C9A84C]/50 transition-colors resize-none placeholder:text-mokka/30"
                  />
                </div>

                <button type="submit" className="btn-gold w-full text-center">
                  Kostenlose Verkostung anfragen
                </button>

                <p className="font-['Figtree'] text-[10px] text-mokka/50 text-center">
                  Unverbindlich · Kostenlos · Antwort innerhalb von 24 Stunden
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
