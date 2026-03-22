import { ReviewsProvider } from "@/context/ReviewsContext";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductsSection from "@/components/ProductsSection";
import ServicesSection from "@/components/ServicesSection";
import PortfolioSection from "@/components/PortfolioSection";
import TechStackSection from "@/components/TechStackSection";
import ReviewsSection from "@/components/ReviewsSection";
import PricingSection from "@/components/PricingSection";
import ContactSection from "@/components/ContactSection";
import BackToTop from "@/components/BackToTop";
import SchemaOrg, {
  organizationSchema,
  websiteSchema,
  localBusinessSchema,
} from "@/components/SchemaOrg";

const Index = () => {
  return (
    <ReviewsProvider>
      <SchemaOrg schemas={[organizationSchema, websiteSchema, localBusinessSchema]} />
      <div className="min-h-screen bg-background">
        <Navbar />
        <HeroSection />
        <ProductsSection />
        <ServicesSection />
        <PortfolioSection />
        <TechStackSection />
        <ReviewsSection />
        <PricingSection />
        <ContactSection />
        <BackToTop />
      </div>
    </ReviewsProvider>
  );
};

export default Index;
