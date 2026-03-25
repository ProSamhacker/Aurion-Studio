import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ServicesDetailSection from "@/components/ServicesDetailSection";
import FAQSection from "@/components/FAQSection";
import SchemaOrg, { buildServiceSchema, buildFaqSchema } from "@/components/SchemaOrg";
import { faqs } from "@/data/faqData";
import usePageMeta from "@/hooks/usePageMeta";

const serviceSchemas = [
  buildServiceSchema(
    "Custom Web Development",
    "Lightning-fast, SEO-optimised websites and web applications built with React, Next.js, TypeScript and Tailwind CSS. Mobile-first, accessible, and production-ready.",
    "https://aurionstack.dev/services#custom-web-development",
    ["React", "Next.js", "TypeScript", "Tailwind CSS", "SEO", "Web Development", "Remote"]
  ),
  buildServiceSchema(
    "Cross-Platform Mobile App Development",
    "iOS and Android apps from a single React Native and Expo codebase. Push notifications, in-app payments, offline support, and App Store submission handled end-to-end.",
    "https://aurionstack.dev/services#mobile-app-development",
    ["React Native", "Expo", "iOS", "Android", "Mobile App Development", "Global"]
  ),
  buildServiceSchema(
    "AI Automation & Chatbot Integration",
    "Custom AI chatbots and automation pipelines using GPT-4, LLaMA, Groq, LangChain, and n8n. Streamline customer support, data processing, and internal workflows.",
    "https://aurionstack.dev/services#ai-automation",
    ["AI Automation", "Chatbot", "LangChain", "OpenAI", "Groq", "n8n"]
  ),
  buildServiceSchema(
    "E-Commerce & Online Ordering Systems",
    "Conversion-optimised online stores with real-time inventory, Stripe/Razorpay payments, WhatsApp ordering, and admin dashboards your team can manage without code.",
    "https://aurionstack.dev/services#ecommerce",
    ["E-Commerce", "Stripe", "Razorpay", "WooCommerce", "Online Store"]
  ),
  buildServiceSchema(
    "Analytics, SEO & Performance Audits",
    "GA4 setup, Google Search Console integration, Core Web Vitals optimisation, keyword gap analysis, and monthly SEO reports to grow your organic search traffic.",
    "https://aurionstack.dev/services#seo-analytics",
    ["SEO", "Google Analytics 4", "Core Web Vitals", "Performance Audit"]
  ),
  buildServiceSchema(
    "Ongoing Product Maintenance & SLA",
    "Monthly retained engineering covering managed hosting, SSL, security patches, continuous optimization, and priority support — starting at $199/month.",
    "https://aurionstack.dev/services#maintenance",
    ["Website Maintenance", "DevOps", "Retained Engineering", "Hosting", "SLA"]
  ),
];


const ServicesPage = () => {
  const navigate = useNavigate();
  usePageMeta(
    "Services — Aurion Stack | Web, Mobile & AI Development",
    "Full-range digital services: custom websites, cross-platform mobile apps, AI chatbots, e-commerce, SEO audits, and monthly maintenance. Remote-first — building for global brands."
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SchemaOrg schemas={[...serviceSchemas, buildFaqSchema(faqs)]} />

      {/* Top bar */}
      <div className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-xl">
        <div className="container mx-auto flex items-center gap-4 px-4 py-4 sm:px-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="flex-1" />
          <span className="font-heading text-sm font-bold text-teal">
            Aurion Stack · Services
          </span>
        </div>
      </div>

      {/* Sections */}
      <ServicesDetailSection />
      <FAQSection />
    </div>
  );
};

export default ServicesPage;
