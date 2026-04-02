/* kaffeegraf – B2B Landingpage
   Design: Refined Dark Elegance
   Sections: Hero → USP → Sortiment → Verkostung → Beratung → Nachhaltigkeit → Testimonials → Kontakt → Footer
*/
import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import USPSection from "@/components/USPSection";
import SortimentSection from "@/components/SortimentSection";
import VerkostungSection from "@/components/VerkostungSection";
import BeratungSection from "@/components/BeratungSection";
import NachhaltigkeitSection from "@/components/NachhaltigkeitSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import KontaktSection from "@/components/KontaktSection";
import Footer from "@/components/Footer";
import B2BAccessRequestModal from "@/components/B2BAccessRequestModal";

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  const { user, loading, error, isAuthenticated, logout } = useAuth();
  const [isB2BModalOpen, setIsB2BModalOpen] = useState(false);

  // Handle hash-based navigation for B2B modal
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === "#b2b-access-request") {
        setIsB2BModalOpen(true);
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0D0D0B" }}>
      <Navigation />
      <HeroSection />
      <USPSection />
      <SortimentSection />
      <VerkostungSection />
      <BeratungSection />
      <NachhaltigkeitSection />
      <TestimonialsSection />
      <KontaktSection />
      <Footer />
      <B2BAccessRequestModal
        isOpen={isB2BModalOpen}
        onClose={() => {
          setIsB2BModalOpen(false);
          window.location.hash = "";
        }}
      />
    </div>
  );
}
