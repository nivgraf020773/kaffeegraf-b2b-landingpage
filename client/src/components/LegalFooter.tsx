import React from 'react';

declare global {
  interface Window {
    CookieConsent?: {
      show: () => void;
    };
  }
}

export default function LegalFooter() {
  const handleCookieSettings = () => {
    // Trigger cookie consent manager to show settings
    const w = window as any;
    if (w.CookieConsent) {
      w.CookieConsent.show();
    }
  };

  return (
    <footer className="bg-background border-t border-border py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-8">
          {/* Legal Links */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-xs md:text-sm text-muted-foreground">
            <a
              href="https://kaffeegraf.coffee/impressum/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Impressum
            </a>
            <span className="hidden md:inline text-border">|</span>
            <a
              href="https://kaffeegraf.coffee/datenschutzerklaerung/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Datenschutz
            </a>
            <span className="hidden md:inline text-border">|</span>
            <a
              href="https://kaffeegraf.coffee/agb/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              AGB
            </a>
            <span className="hidden md:inline text-border">|</span>
            <button
              onClick={handleCookieSettings}
              className="hover:text-foreground transition-colors text-left"
            >
              Cookie-Einstellungen
            </button>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Kaffeegraf. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  );
}
