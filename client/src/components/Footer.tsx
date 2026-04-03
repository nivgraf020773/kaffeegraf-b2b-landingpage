/* kaffeegraf Footer – 3-Column Main + Legal Bottom Bar */
import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#080806] text-cream border-t border-white/5">
      {/* MAIN FOOTER: 3-Column Structure */}
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
          </div>
        </div>
      </div>

      {/* LEGAL FOOTER BAR: Bottom Links */}
      <div className="border-t border-white/5 bg-[#0A0A08]">
        <div className="max-w-7xl mx-auto px-8 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-8">
            {/* Copyright - Left Side */}
            <p className="font-['Figtree'] text-xs text-cream/60 whitespace-nowrap order-last md:order-first">
              © 2026 Kaffeegraf. Alle Rechte vorbehalten.
            </p>
            
            {/* Legal Links - Center/Right */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {[
                { label: "Impressum", href: "https://kaffeegraf.coffee/impressum" },
                { label: "Datenschutz", href: "https://kaffeegraf.coffee/datenschutz" },
                { label: "AGB", href: "https://kaffeegraf.coffee/agb" },
                { label: "Cookie-Einstellungen", href: "#" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.label === "Cookie-Einstellungen" ? undefined : "_blank"}
                  rel={link.label === "Cookie-Einstellungen" ? undefined : "noopener noreferrer"}
                  onClick={(e) => {
                    if (link.label === "Cookie-Einstellungen") {
                      e.preventDefault();
                      // Trigger cookie consent banner
                      const event = new CustomEvent('openCookieSettings');
                      window.dispatchEvent(event);
                    }
                  }}
                  className="font-['Figtree'] text-sm text-cream/70 hover:text-[#C9A84C] transition-colors duration-200 whitespace-nowrap"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
