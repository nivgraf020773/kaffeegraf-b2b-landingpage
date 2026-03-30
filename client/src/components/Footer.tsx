/* kaffeegraf Footer – Refined Dark Elegance */
import { toast } from "sonner";

export default function Footer() {
  return (
    <footer className="bg-[#080806] border-t border-white/5 py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center overflow-hidden">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663492934822/L7t4bFiPiLxiqH6LDV52Qk/kaffeegraf-product_0d6dfc56.png"
                  alt="kaffeegraf"
                  className="w-full h-full object-cover scale-[2.2] object-center"
                />
              </div>
              <span className="font-['Cormorant_Garamond'] text-base font-semibold tracking-[0.2em] uppercase text-cream">
                kaffeegraf
              </span>
            </div>
            <p className="font-['Outfit'] text-xs text-mokka leading-relaxed max-w-xs">
              100% Specialty Coffee für Büros, Gastronomie und Cafés.
              Individuelle Beratung, Verkostung vor Ort, transparente
              Lieferkette.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <div className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest text-[#C9A84C] mb-4">
              Navigation
            </div>
            <ul className="space-y-2">
              {[
                { label: "Sortiment", href: "#sortiment" },
                { label: "Maschinenberatung", href: "#beratung" },
                { label: "Verkostung", href: "#verkostung" },
                { label: "Nachhaltigkeit", href: "#nachhaltigkeit" },
                { label: "Kontakt", href: "#kontakt" },
              ].map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => {
                      const el = document.querySelector(link.href);
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="font-['Outfit'] text-xs text-mokka hover:text-[#C9A84C] transition-colors duration-300"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest text-[#C9A84C] mb-4">
              Kontakt
            </div>
            <div className="space-y-2">
              <a
                href="mailto:office@kaffeegraf.coffee"
                className="font-['Outfit'] text-xs text-mokka hover:text-[#C9A84C] transition-colors duration-300 block"
              >
                office@kaffeegraf.coffee
              </a>
              <a
                href="https://www.kaffeegraf.coffee"
                target="_blank"
                rel="noopener noreferrer"
                className="font-['Outfit'] text-xs text-mokka hover:text-[#C9A84C] transition-colors duration-300 block"
              >
                www.kaffeegraf.coffee
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="gold-line mb-6" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-['Outfit'] text-[10px] text-mokka/50">
            © {new Date().getFullYear()} kaffeegraf. Alle Rechte vorbehalten.
          </p>
          <div className="flex gap-6">
            {["Impressum", "Datenschutz", "AGB"].map((item) => (
              <button
                key={item}
              onClick={() => toast.info(`${item} – Seite folgt in Kürze`)}
                className="font-['Outfit'] text-[10px] text-mokka/50 hover:text-mokka transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
