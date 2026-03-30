/* kaffeegraf B2B Funnel – Moderne Conversion-optimierte Landingpage
   Design: Clean, modern, hochwertig – fokussiert auf Verkostung & Beratung */

import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import ApproachSection from "@/components/ApproachSection";
import ProcessSection from "@/components/ProcessSection";
import TargetGroupsSection from "@/components/TargetGroupsSection";
import SolutionsSection from "@/components/SolutionsSection";
import MainConversionSection from "@/components/MainConversionSection";
import ExistingCustomersSection from "@/components/ExistingCustomersSection";
import TrustSection from "@/components/TrustSection";
import FinalCTASection from "@/components/FinalCTASection";
import KontaktSection from "@/components/KontaktSection";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <HeroSection />
        <ProblemSection />
        <ApproachSection />
        <ProcessSection />
        <TargetGroupsSection />
        <SolutionsSection />
        <MainConversionSection />
        <ExistingCustomersSection />
        <TrustSection />
        <FinalCTASection />
        <KontaktSection />
      </main>
    </div>
  );
}
