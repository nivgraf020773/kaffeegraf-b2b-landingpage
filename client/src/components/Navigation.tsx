/* kaffeegraf Navigation
   Sticky top nav with blur backdrop, gold accent on scroll */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Sortiment", href: "#sortiment" },
  { label: "Beratung", href: "#beratung" },
  { label: "Verkostung", href: "#verkostung" },
  { label: "Nachhaltigkeit", href: "#nachhaltigkeit" },
  { label: "Referenzen", href: "#referenzen" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleB2BClick = () => {
    setMobileOpen(false);
    window.location.hash = "#b2b-access-request";
  };

  const handleLoginClick = () => {
    setMobileOpen(false);
    window.location.hash = "#b2b-login";
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0D0D0B]/90 backdrop-blur-md border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className={`flex-shrink-0 transition-all duration-500 ${scrolled ? "md:scale-90" : ""}`}
          >
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663492934822/L7t4bFiPiLxiqH6LDV52Qk/kaffeegraf-logo_55fb2e87.webp"
              alt="kaffeegraf Logo"
              className={`w-auto transition-all duration-500 ${scrolled ? "h-10" : "h-12"}`}
            />
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 flex-1 justify-center">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-mokka hover:text-gold transition-colors duration-300 font-['Figtree'] text-xs font-medium uppercase tracking-widest"
                style={{ letterSpacing: "0.1em" }}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Desktop Right Section: B2B Zugang, Login, CTA */}
          <div className="hidden md:flex items-center gap-4 flex-shrink-0">
            {/* B2B Zugang - Hidden in sticky state */}
            {!scrolled && (
              <motion.button
                initial={{ opacity: 1 }}
                animate={{ opacity: scrolled ? 0 : 1 }}
                transition={{ duration: 0.3 }}
                onClick={handleB2BClick}
                className="text-mokka hover:text-gold transition-colors duration-300 font-['Figtree'] text-xs font-medium uppercase tracking-widest"
                style={{ letterSpacing: "0.1em" }}
              >
                B2B Zugang
              </motion.button>
            )}

            {/* Login - Always visible */}
            <button
              onClick={handleLoginClick}
              className="text-mokka/60 hover:text-mokka transition-colors duration-300 font-['Figtree'] text-xs font-medium uppercase tracking-widest"
              style={{ letterSpacing: "0.1em" }}
            >
              Login
            </button>

            {/* Primary CTA */}
            <button
              onClick={() => handleNavClick("#kontakt")}
              className="btn-gold text-xs whitespace-nowrap"
            >
              {scrolled ? "Jetzt verkosten" : "Verkostung anfragen"}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-cream p-2 flex-shrink-0"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0D0D0B]/95 backdrop-blur-md border-t border-white/5"
          >
            <div className="container py-6 flex flex-col gap-4">
              {/* Navigation Items */}
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="text-left text-mokka hover:text-gold transition-colors duration-300 font-['Figtree'] text-sm font-medium uppercase tracking-widest py-2 border-b border-white/5"
                >
                  {link.label}
                </button>
              ))}

              {/* Divider */}
              <div className="border-t border-white/5 my-2" />

              {/* B2B Zugang beantragen */}
              <button
                onClick={handleB2BClick}
                className="text-left text-mokka hover:text-gold transition-colors duration-300 font-['Figtree'] text-sm font-medium uppercase tracking-widest py-2"
              >
                B2B Zugang beantragen
              </button>

              {/* Login */}
              <button
                onClick={handleLoginClick}
                className="text-left text-mokka/60 hover:text-mokka transition-colors duration-300 font-['Figtree'] text-sm font-medium uppercase tracking-widest py-2"
              >
                Login
              </button>

              {/* Divider */}
              <div className="border-t border-white/5 my-2" />

              {/* Primary CTA */}
              <button
                onClick={() => handleNavClick("#kontakt")}
                className="btn-gold mt-4 text-center"
              >
                Verkostung anfragen
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sticky Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: scrolled ? 1 : 0, y: scrolled ? 0 : 100 }}
        transition={{ duration: 0.3 }}
        className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0D0D0B]/95 backdrop-blur-md border-t border-white/5 p-4 z-40"
      >
        <button
          onClick={() => handleNavClick("#kontakt")}
          className="btn-gold w-full text-center text-sm"
        >
          Verkostung anfragen
        </button>
      </motion.div>
    </header>
  );
}
