/* kaffeegraf – B2B Landingpage
   Design: Refined Dark Elegance
   Sections: Hero → USP → Sortiment → Verkostung → Beratung → Nachhaltigkeit → Testimonials → Kontakt → Footer
*/
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

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  const { user, loading, error, isAuthenticated, logout } = useAuth();

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
    </div>
  );
}
