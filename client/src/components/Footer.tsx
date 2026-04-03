/* kaffeegraf Footer – Clean Single-Level Structure */
import React from 'react';

declare global {
  interface Window {
    CookieConsent?: {
      show: () => void;
    };
  }
}

export default function Footer() {
  const handleCookieSettings = () => {
    const w = window as any;
    if (w.CookieConsent) {
      w.CookieConsent.show();
    }
  };

  return (
    <footer className="bg-[#080806] text-cream border-t border-white/5">
      <div className="max-w-7xl mx-auto px-8 lg:px-8 py-16 lg:py-20">
        {/* Desktop: 3-column grid | Tablet: 2-column | Mobile: 1-column */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr] gap-8 lg:gap-16">
          {/* COLUMN 1: BRAND (LEFT-ALIGNED) */}
          <div className="lg:col-span-1">
            {/* Logo + Brand Name */}
            <div className="flex items-center gap-3 mb-5">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663492934822/L7t4bFiPiLxiqH6LDV52Qk/RZ_Kaffeegraf_Logo_negativ_97f5444f.webp"
                alt="kaffeegraf logo"
                className="h-10 w-auto"
              />
              <span className="font-['Poppins'] text-base font-semibold tracking-wide uppercase">
                Kaffeegraf
              </span>
            </div>
            
            {/* Supporting Text */}
            <p className="font-['Figtree'] text-sm leading-relaxed opacity-70 max-w-xs">
              100% Specialty Coffee für Büros, Gastronomie und Cafés. Individuelle Beratung, Verkostung vor Ort, transparente Lieferkette.
            </p>

            {/* Copyright - Mobile/Tablet */}
            <p className="font-['Figtree'] text-xs leading-relaxed opacity-50 mt-8 lg:hidden">
              © {new Date().getFullYear()} Kaffeegraf. Alle Rechte vorbehalten.
            </p>
          </div>

          {/* COLUMN 2: NAVIGATION */}
          <div className="lg:col-span-1">
            {/* Heading: Match Hero section typography */}
            <h3 className="font-['Poppins'] text-sm font-semibold uppercase tracking-[0.15em] text-[#C9A84C] mb-6">
              Navigation
            </h3>
            <ul className="space-y-3.5 flex flex-col">
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
                    className="font-['Figtree'] text-base leading-6 text-cream hover:text-[#C9A84C] transition-colors duration-200 text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: CONTACT */}
          <div className="lg:col-span-1">
            {/* Heading: Match Hero section typography */}
            <h3 className="font-['Poppins'] text-sm font-semibold uppercase tracking-[0.15em] text-[#C9A84C] mb-6">
              Kontakt
            </h3>
            <div className="space-y-3.5 flex flex-col">
              <a
                href="mailto:b2b@kaffeegraf.coffee"
                className="font-['Figtree'] text-base leading-6 text-cream hover:text-[#C9A84C] transition-colors duration-200"
              >
                b2b@kaffeegraf.coffee
              </a>
              <a
                href="https://www.kaffeegraf.coffee"
                target="_blank"
                rel="noopener noreferrer"
                className="font-['Figtree'] text-base leading-6 text-cream hover:text-[#C9A84C] transition-colors duration-200"
              >
                www.kaffeegraf.coffee
              </a>
            </div>

            {/* Copyright - Desktop only */}
            <p className="font-['Figtree'] text-xs leading-relaxed opacity-50 mt-8 hidden lg:block">
              © {new Date().getFullYear()} Kaffeegraf. Alle Rechte vorbehalten.
            </p>
          </div>
        </div>

        {/* Legal Links - CENTER ALIGNED (no separate black bar) */}
        <div className="flex flex-col lg:flex-row lg:justify-center gap-4 lg:gap-8 mt-12 pt-8 border-t border-white/10">
          <a
            href="https://kaffeegraf.coffee/impressum/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-['Figtree'] text-xs text-cream opacity-60 hover:opacity-100 transition-opacity duration-200"
          >
            Impressum
          </a>
          <a
            href="https://kaffeegraf.coffee/datenschutzerklaerung/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-['Figtree'] text-xs text-cream opacity-60 hover:opacity-100 transition-opacity duration-200"
          >
            Datenschutz
          </a>
          <a
            href="https://kaffeegraf.coffee/agb/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-['Figtree'] text-xs text-cream opacity-60 hover:opacity-100 transition-opacity duration-200"
          >
            AGB
          </a>
          <button
            onClick={handleCookieSettings}
            className="font-['Figtree'] text-xs text-cream opacity-60 hover:opacity-100 transition-opacity duration-200 text-left"
          >
            Cookie-Einstellungen
          </button>
        </div>
      </div>
    </footer>
  );
}
