import { ReviewsProvider } from "@/context/ReviewsContext";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import PricingSection from "@/components/PricingSection";
import TechStackSection from "@/components/TechStackSection";
import PortfolioSection from "@/components/PortfolioSection";
import ReviewsSection from "@/components/ReviewsSection";
import ContactSection from "@/components/ContactSection";

const Index = () => {
  return (
    <ReviewsProvider>
      <div className="min-h-screen bg-background">
        <Navbar />
        <HeroSection />
        <ServicesSection />
        <PortfolioSection />
        <PricingSection />
        <TechStackSection />
        <ReviewsSection />
        <ContactSection />
      </div>
    </ReviewsProvider>
  );
};

export default Index;
