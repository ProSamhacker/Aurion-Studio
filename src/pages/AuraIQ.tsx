import React from "react";
import ProductPageLayout from "@/components/ProductPageLayout";
import { Bot, BrainCircuit, Zap, Users } from "lucide-react";

const AuraIQ = () => {
  return (
    <ProductPageLayout
      productName="AuraIQ"
      heroHeadline="24/7 AI Employees for Local Businesses."
      heroSubheadline="Automate your customer support, capture leads around the clock, and scale your business with an intelligent AI agent trained specifically on your data."
      ctaText="Try Demo"
      ctaLink="https://auraiq.aurionstack.dev"
      features={[
        { title: "24/7 Support Agent", description: "Never miss a customer inquiry — day, night, or public holiday. The agent handles it all.", icon: Bot },
        { title: "Custom Knowledge Base", description: "Trained on your specific SOPs, FAQs, product docs, and brand voice. Not a generic bot.", icon: BrainCircuit },
        { title: "Instant Responses", description: "Sub-second replies. No loading spinner. No 'Thanks for your patience' delays.", icon: Zap },
        { title: "Automated Lead Gen", description: "Captures contact details and buying intent automatically — passed straight to your CRM.", icon: Users },
      ]}
      steps={[
        { title: "Upload your business data", description: "Share your FAQs, SOPs, product docs, or website URL. Takes under 10 minutes." },
        { title: "We train and brand your agent", description: "Our team configures the agent's voice, tone, and knowledge base to match your business exactly." },
        { title: "Deploy to your site in 30 minutes", description: "One script tag. Works on any website, WhatsApp, or social inbox. Live within the hour." },
      ]}
      testimonials={[
        { quote: "It handled 300 customer messages in the first week without me touching a single one. Honestly felt like hiring a full-time person.", author: "D. Okafor", role: "Local restaurant owner" },
        { quote: "The setup was shockingly fast. I expected weeks. It was up and running the same afternoon.", author: "R. Mehta", role: "Clinic manager" },
        { quote: "Leads stopped falling through the cracks the moment we turned it on. The ROI was immediate.", author: "L. Santos", role: "Real estate agent" },
      ]}
      pricing={[
        {
          tier: "Starter",
          price: "$149",
          description: "One-time setup for single-location businesses.",
          features: [
            "Custom AI Agent setup",
            "Website chat integration",
            "Core knowledge base (up to 50 FAQs)",
            "Up to 1,000 messages/month",
          ],
        },
        {
          tier: "Premium",
          price: "$249",
          description: "+ $29/month maintenance & tuning",
          isPopular: true,
          features: [
            "Everything in Starter",
            "Advanced knowledge base (docs + URLs + PDFs)",
            "WhatsApp & social media integration",
            "Unlimited messages",
            "Monthly performance tuning session",
            "Priority support",
          ],
        },
      ]}
    />
  );
};

export default AuraIQ;
