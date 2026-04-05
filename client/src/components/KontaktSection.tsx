/* kaffeegraf – B2B Kontaktformular
   Minimal stable version without motion wrappers
   Direct form handling with plain React controlled inputs
*/
import { useState, useRef } from "react";
import { Mail, Globe, CheckCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import DSGVOConsent from "./DSGVOConsent";

interface FormData {
  firstName: string;
  lastName: string;
  company: string;
  uid: string;
  email: string;
  phone: string;
  businessType: string;
  priority: string;
  message: string;
}

export default function KontaktSection() {
  const formRef = useRef<HTMLFormElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    company: "",
    uid: "",
    email: "",
    phone: "",
    businessType: "",
    priority: "",
    message: "",
  });

  const contactMutation = trpc.contact.submit.useMutation();

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate required fields
    const requiredFields: (keyof FormData)[] = ["firstName", "lastName", "company", "uid", "email", "businessType"];
    const emptyFields = requiredFields.filter(field => !formData[field]);

    if (emptyFields.length > 0) {
      toast.error(`Bitte füllen Sie folgende Felder aus: ${emptyFields.join(", ")}`);
      return;
    }

    setIsLoading(true);

    try {
      const response = await contactMutation.mutateAsync({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        company: formData.company,
        phone: formData.phone,
        uid: formData.uid,
        businessType: formData.businessType,
        priority: formData.priority,
        message: formData.message,
      });

      setSubmitted(true);
      setFormData({
        firstName: "",
        lastName: "",
        company: "",
        uid: "",
        email: "",
        phone: "",
        businessType: "",
        priority: "",
        message: "",
      });

      toast.success("Vielen Dank – Ihre Anfrage ist bei uns eingegangen. Wir prüfen diese und melden uns zeitnah persönlich bei Ihnen.");

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
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <section id="kontakt" className="py-24 md:py-32 bg-[#0D0D0B]">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div />
            <div className="bg-[#1A1512] p-8 border border-[#C9A84C]/30 flex flex-col items-center justify-center min-h-[500px]">
              <CheckCircle size={64} className="text-[#C9A84C] mb-6" strokeWidth={1.5} />
              <h3 className="font-['Poppins'] text-2xl font-light text-cream text-center mb-3">
                Vielen Dank
              </h3>
              <p className="font-['Figtree'] text-mokka text-center text-sm">
                Ihre Anfrage ist bei uns eingegangen.<br />Wir prüfen diese und melden uns zeitnah persönlich bei Ihnen.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="kontakt" className="py-24 md:py-32 bg-[#0D0D0B]">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-[#C9A84C] opacity-60" />
              <span className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.25em] text-[#C9A84C]">
                Kontakt
              </span>
            </div>
            <h2 className="font-['Poppins'] text-4xl md:text-5xl font-light text-cream mb-6">
              Lassen Sie uns ins Gespräch kommen
            </h2>
            <p className="font-['Figtree'] text-mokka text-lg leading-relaxed mb-8">
              Haben Sie Fragen zu unseren Kaffees oder benötigen Sie eine individuelle Beratung? Kontaktieren Sie uns gerne – wir freuen uns auf den Austausch mit Ihnen.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Mail size={24} className="text-[#C9A84C] flex-shrink-0 mt-1" />
                <div>
                  <p className="font-['Figtree'] text-cream font-semibold mb-1">E-Mail</p>
                  <a
                    href="mailto:team@kaffeegraf.coffee"
                    className="font-['Figtree'] text-mokka hover:text-[#C9A84C] transition-colors"
                  >
                    team@kaffeegraf.coffee
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Globe size={24} className="text-[#C9A84C] flex-shrink-0 mt-1" />
                <div>
                  <p className="font-['Figtree'] text-cream font-semibold mb-1">Website</p>
                  <a
                    href="https://www.kaffeegraf.coffee"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-['Figtree'] text-mokka hover:text-[#C9A84C] transition-colors"
                  >
                    www.kaffeegraf.coffee
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div>
            <form ref={formRef} onSubmit={handleSubmit} className="bg-[#1A1512] p-8 border border-white/5 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest text-mokka block mb-2">
                    Vorname *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
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
                    value={formData.lastName}
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
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Muster GmbH"
                  className="w-full bg-[#0D0D0B] border border-white/8 text-cream font-['Figtree'] text-sm px-4 py-3 focus:outline-none focus:border-[#C9A84C]/50 transition-colors placeholder:text-mokka/30"
                />
              </div>

              <div>
                <label className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest text-mokka block mb-2">
                  UID (Unternehmens-ID) *
                </label>
                <input
                  type="text"
                  name="uid"
                  required
                  value={formData.uid}
                  onChange={handleChange}
                  placeholder="ATU12345678"
                  title="UID muss ATU + genau 8 Ziffern sein (z.B. ATU12345678)"
                  className="w-full bg-[#0D0D0B] border border-white/8 text-cream font-['Figtree'] text-sm px-4 py-3 focus:outline-none focus:border-[#C9A84C]/50 transition-colors placeholder:text-mokka/30"
                />
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
                    value={formData.email}
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
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+43 ..."
                    className="w-full bg-[#0D0D0B] border border-white/8 text-cream font-['Figtree'] text-sm px-4 py-3 focus:outline-none focus:border-[#C9A84C]/50 transition-colors placeholder:text-mokka/30"
                  />
                </div>
              </div>

              <div>
                <label className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest text-mokka block mb-2">
                  Unternehmenstyp *
                </label>
                <select
                  name="businessType"
                  required
                  value={formData.businessType}
                  onChange={handleChange}
                  className="w-full bg-[#0D0D0B] border border-white/8 text-cream font-['Figtree'] text-sm px-4 py-3 focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
                >
                  <option value="">Bitte wählen ...</option>
                  {businessTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest text-mokka block mb-2">
                  Was ist Ihnen am wichtigsten?
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full bg-[#0D0D0B] border border-white/8 text-cream font-['Figtree'] text-sm px-4 py-3 focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
                >
                  <option value="">Bitte wählen ...</option>
                  {priorityOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest text-mokka block mb-2">
                  Nachricht
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Erzählen Sie uns mehr über Ihre Anforderungen..."
                  rows={5}
                  className="w-full bg-[#0D0D0B] border border-white/8 text-cream font-['Figtree'] text-sm px-4 py-3 focus:outline-none focus:border-[#C9A84C]/50 transition-colors placeholder:text-mokka/30 resize-none"
                />
              </div>

              <DSGVOConsent />

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#C9A84C] text-[#0D0D0B] font-['Poppins'] font-semibold py-3 px-6 hover:bg-[#D4B85F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Wird versendet..." : "Verkostung anfragen"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
