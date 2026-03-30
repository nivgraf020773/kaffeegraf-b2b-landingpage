/* kaffeegraf Navigation – Refined Dark Elegance
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
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
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
            className="flex-shrink-0"
          >
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663492934822/L7t4bFiPiLxiqH6LDV52Qk/kaffeegraf-logo_55fb2e87.webp"
              alt="kaffeegraf Logo"
              className="h-12 w-auto"
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

          {/* CTA */}
          <div className="hidden md:flex items-center gap-4 flex-shrink-0">
            <button
              onClick={() => handleNavClick("#kontakt")}
              className="btn-gold text-xs"
            >
              Verkostung anfragen
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
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="text-left text-mokka hover:text-gold transition-colors duration-300 font-['Figtree'] text-sm font-medium uppercase tracking-widest py-2 border-b border-white/5"
                >
                  {link.label}
                </button>
              ))}
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
    </header>
  );
}
