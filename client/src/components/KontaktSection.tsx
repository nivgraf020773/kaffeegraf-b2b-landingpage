/* kaffeegraf KontaktSection – Refined Dark Elegance
   Kontaktformular mit WooCommerce API Integration */
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Mail, Globe, CheckCircle, AlertCircle, AlertTriangle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { normalizeVAT, validateVATFormat, getVATErrorMessage, getVATHelpText, getVATPlaceholder } from "@shared/vat-validation";

export default function KontaktSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    uid: "",
    businessType: "",
    priority: "",
    message: "",
  });
  const [uidValidationStatus, setUidValidationStatus] = useState<"idle" | "validating" | "valid" | "invalid" | "error">("idle");
  const [uidValidationMessage, setUidValidationMessage] = useState("");

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
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "uid" && uidValidationStatus !== "idle") {
      setUidValidationStatus("idle");
      setUidValidationMessage("");
    }
  };

  const handleUidBlur = async () => {
    if (!form.uid.trim()) {
      setUidValidationStatus("idle");
      setUidValidationMessage("");
      return;
    }

    const normalized = normalizeVAT(form.uid);
    
    if (!validateVATFormat(normalized)) {
      setUidValidationStatus("invalid");
      setUidValidationMessage(getVATErrorMessage("format_error"));
      return;
    }

    setUidValidationStatus("validating");
    try {
      const params = new URLSearchParams();
      params.append("input", JSON.stringify({ uid: normalized }));
      
      const response = await fetch(`/api/trpc/vat.validate?${params}`, {
        method: "GET",
        credentials: "include",
      });
      
      const data = await response.json();
      const result = data.result?.data;
      
      if (result?.status === "valid") {
        setUidValidationStatus("valid");
        setUidValidationMessage("UID ist gültig");
        setForm({ ...form, uid: normalized });
      } else {
        setUidValidationStatus("invalid");
        setUidValidationMessage(getVATErrorMessage(result?.status || "service_unavailable"));
      }
    } catch (error) {
      setUidValidationStatus("error");
      setUidValidationMessage(getVATErrorMessage("service_unavailable"));
      console.error("[UID Validation Error]", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (uidValidationStatus !== "valid") {
        toast.error("Bitte prüfen Sie Ihre UID / Steuernummer.");
        setIsLoading(false);
        return;
      }

      await contactMutation.mutateAsync({
        name: form.name,
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
        name: "",
        company: "",
        email: "",
        phone: "",
        uid: "",
        businessType: "",
        priority: "",
        message: "",
      });
      setUidValidationStatus("idle");
      setUidValidationMessage("");

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
                  value: "team@kaffeegraf.coffee",
                  href: "mailto:team@kaffeegraf.coffee",
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

                {/* B2B UID Requirement Info */}
                <div className="bg-[#C9A84C]/5 border border-[#C9A84C]/20 p-3 rounded mb-5">
                  <p className="text-[10px] text-mokka font-['Figtree']">
                    <span className="text-[#C9A84C] font-semibold">B2B Anfrage:</span> Bitte geben Sie Ihre Umsatzsteuer-ID (UID) oder Steuernummer ein. Diese wird automatisch validiert.
                  </p>
                </div>

                {/* UID / VAT Number Field */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest text-mokka block">
                      UID / Steuernummer *
                    </label>
                    {uidValidationStatus === "validating" && (
                      <span className="text-[9px] text-[#C9A84C] animate-pulse">Prüfung läuft...</span>
                    )}
                    {uidValidationStatus === "valid" && (
                      <span className="text-[9px] text-green-500 flex items-center gap-1">
                        <CheckCircle size={12} /> Gültig
                      </span>
                    )}
                    {uidValidationStatus === "invalid" && (
                      <span className="text-[9px] text-red-500 flex items-center gap-1">
                        <AlertTriangle size={12} /> Ungültig
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    name="uid"
                    required
                    value={form.uid}
                    onChange={handleChange}
                    onBlur={handleUidBlur}
                    placeholder={getVATPlaceholder()}
                    className={`w-full bg-[#0D0D0B] border text-cream font-['Figtree'] text-sm px-4 py-3 focus:outline-none transition-colors placeholder:text-mokka/30 ${
                      uidValidationStatus === "valid"
                        ? "border-green-500/50 focus:border-green-500"
                        : uidValidationStatus === "invalid"
                          ? "border-red-500/50 focus:border-red-500"
                          : "border-white/8 focus:border-[#C9A84C]/50"
                    }`}
                  />
                  {uidValidationMessage && (
                    <p className={`text-[11px] mt-2 ${
                      uidValidationStatus === "valid" ? "text-green-400" : "text-red-400"
                    }`}>
                      {uidValidationMessage}
                    </p>
                  )}
                  <p className="text-[10px] text-mokka/50 mt-1">{getVATHelpText()}</p>
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
                  className="w-full bg-[#C9A84C] text-[#0D0D0B] font-['Poppins'] font-semibold py-3 px-6 hover:bg-[#D4B85F] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Wird verarbeitet..." : "Verkostung anfragen"}
                </button>

                <p className="font-['Figtree'] text-[11px] text-mokka/60 text-center">
                  Ihre Daten werden sicher verarbeitet und nicht an Dritte
                  weitergegeben.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
