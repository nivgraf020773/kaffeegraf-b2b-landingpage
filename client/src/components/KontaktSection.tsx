/* kaffeegraf – B2B Landingpage
   Kontaktformular mit WooCommerce API Integration */
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Mail, Globe, CheckCircle, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import DSGVOConsent from "./DSGVOConsent";

export default function KontaktSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    phone: "",
    uid: "",
    businessType: "",
    priority: "",
    message: "",
  });

  const businessTypeOptions = [
    { value: "buero", label: "Büro / Office (1–50 Mitarbeitende)" },
    { value: "praxis", label: "Praxis / Kanzlei / Dienstleistung" },
    { value: "gastronomie", label: "Fine Dining / anspruchsvolle Gastronomie" },
    { value: "cafe", label: "Café / Kaffeehaus" },
    { value: "hotel", label: "Hotel / Pension / Eventlocation" },
    { value: "retail", label: "Geschäft / Retail (z. B. Feinkost, Concept Store)" },
    { value: "event", label: "Event (einmaliger Bedarf)" },
    { value: "sonstiges", label: "Sonstiges" },
  ];

  const priorityOptions = [
    { value: "geschmack", label: "guter Geschmack" },
    { value: "handhabung", label: "einfache Handhabung" },
    { value: "nachhaltigkeit", label: "nachhaltiger Kaffee" },
    { value: "beratung", label: "Beratung & Einstellung" },
    { value: "anderes", label: "etwas anderes" },
  ];

  const contactMutation = trpc.contact.submit.useMutation();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await contactMutation.mutateAsync({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        company: form.company,
        phone: form.phone,
        uid: form.uid,
        businessType: form.businessType,
        priority: form.priority,
        message: form.message,
      });

      setSubmitted(true);
      setForm({
        firstName: "",
        lastName: "",
        company: "",
        email: "",
        phone: "",
        uid: "",
        businessType: "",
        priority: "",
        message: "",
      });

      toast.success(
        "Vielen Dank! Wir melden uns innerhalb von 24 Stunden bei Ihnen."
      );

      // Reset form after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Es gab einen Fehler beim Verarbeiten Ihrer Anfrage.";
      toast.error(errorMessage);
      console.error("[Contact Form Error]", error);
    } finally {
      setIsLoading(false);
    }
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
              <span className="font-semibold italic text-[#C9A84C]">
                einer Verkostung.
              </span>
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
                  value: "b2b@kaffeegraf.coffee",
                  href: "mailto:b2b@kaffeegraf.coffee",
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
                    <item.icon
                      size={14}
                      className="text-[#C9A84C]/60 group-hover:text-[#C9A84C] transition-colors duration-300"
                    />
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
              <div className="bg-[#1A1512] p-8 border border-[#C9A84C]/30 flex flex-col items-center justify-center min-h-[500px]">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="mb-6"
                >
                  <CheckCircle
                    size={64}
                    className="text-[#C9A84C]"
                    strokeWidth={1.5}
                  />
                </motion.div>
                <h3 className="font-['Poppins'] text-2xl font-light text-cream text-center mb-3">
                  Vielen Dank!
                </h3>
                <p className="font-['Figtree'] text-mokka text-center text-sm">
                  Wir haben Ihre Anfrage erhalten und melden uns innerhalb von
                  24 Stunden bei Ihnen.
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
                      Vorname *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={form.firstName}
                      onChange={handleChange}
                      placeholder="Max"
                      className="w-full bg-[#0D0D0B] border border-white/8 text-cream font-['Figtree'] text-sm px-4 py-3 focus:outline-none focus:border-[#C9A84C]/50 transition-colors placeholder:text-mokka/30"
                    />
                  </div>
                  <div>
                    <label className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest text-mokka block mb-2">
                      Nachname *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={form.lastName}
                      onChange={handleChange}
                      placeholder="Mustermann"
                      className="w-full bg-[#0D0D0B] border border-white/8 text-cream font-['Figtree'] text-sm px-4 py-3 focus:outline-none focus:border-[#C9A84C]/50 transition-colors placeholder:text-mokka/30"
                    />
                  </div>
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

                <div>
                  <label className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest text-mokka block mb-2">
                    UID / Steuernummer *
                  </label>
                  <input
                    type="text"
                    name="uid"
                    required
                    maxLength={11}
                    pattern="ATU\d{8}"
                    value={form.uid}
                    onChange={handleChange}
                    placeholder="ATU12345678"
                    className="w-full bg-[#0D0D0B] border border-white/8 text-cream font-['Figtree'] text-sm px-4 py-3 focus:outline-none focus:border-[#C9A84C]/50 transition-colors placeholder:text-mokka/30"
                    title="UID muss ATU + genau 8 Ziffern sein (z.B. ATU12345678)"
                  />
                  <p className="font-['Figtree'] text-mokka text-xs mt-1">
                    Format: ATU + genau 8 Ziffern (z.B. ATU12345678)
                  </p>
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

                {/* Dropdown 1: Business Type */}
                <div>
                  <label className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest text-mokka block mb-2">
                    Ich bin ... *
                  </label>
                  <select
                    name="businessType"
                    required
                    value={form.businessType}
                    onChange={handleChange}
                    className="w-full bg-[#0D0D0B] border border-white/8 text-cream font-['Figtree'] text-sm px-4 py-3 focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
                  >
                    <option value="" disabled className="text-mokka">
                      Bitte wählen ...
                    </option>
                    {businessTypeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Conditional Dropdown 2: Priority */}
                {form.businessType && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest text-mokka block mb-2">
                      Was ist dir besonders wichtig? *
                    </label>
                    <select
                      name="priority"
                      required={form.businessType !== ""}
                      value={form.priority}
                      onChange={handleChange}
                      className="w-full bg-[#0D0D0B] border border-white/8 text-cream font-['Figtree'] text-sm px-4 py-3 focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
                    >
                      <option value="" disabled className="text-mokka">
                        Bitte wählen ...
                      </option>
                      {priorityOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </motion.div>
                )}

                {/* Message */}
                <div>
                  <label className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest text-mokka block mb-2">
                    Nachricht
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Erzählen Sie uns mehr über Ihre Anforderungen..."
                    rows={4}
                    className="w-full bg-[#0D0D0B] border border-white/8 text-cream font-['Figtree'] text-sm px-4 py-3 focus:outline-none focus:border-[#C9A84C]/50 transition-colors placeholder:text-mokka/30 resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#C9A84C] hover:bg-[#B39A3D] disabled:bg-[#C9A84C]/50 text-[#0D0D0B] font-['Poppins'] font-semibold py-3 px-6 transition-all duration-300 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Wird verarbeitet..." : "Verkostung anfragen"}
                </button>

                {/* DSGVO Consent */}
                <DSGVOConsent />
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
