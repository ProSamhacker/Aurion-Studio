import React from "react";
import ProductPageLayout from "@/components/ProductPageLayout";
import { Bot, BrainCircuit, Zap, Users } from "lucide-react";

const AuraIQ = () => {
  return (
    <ProductPageLayout
      productName="AuraIQ"
      heroHeadline="24/7 AI Employees for Local Businesses."
      heroSubheadline="Automate your customer support, capture leads around the clock, and scale your business with intelligent AI agents trained specifically for you."
      ctaText="Try Demo"
      ctaLink="https://auraiq.aurionstack.dev"
      features={[
        {
          title: "24/7 Support Agent",
          description: "Never miss a customer inquiry, day or night.",
          icon: Bot,
        },
        {
          title: "Custom Knowledge Base",
          description: "Trained on your business data and specific SOPs.",
          icon: BrainCircuit,
        },
        {
          title: "Instant Responses",
          description: "Lightning fast, accurate replies to all FAQs.",
          icon: Zap,
        },
        {
          title: "Automated Lead Gen",
          description: "Capture contact details and intent automatically.",
          icon: Users,
        },
      ]}
      pricing={[
        {
          tier: "Starter",
          price: "$149",
          description: "Perfect for single-location small businesses.",
          features: [
            "Custom AI Agent setup",
            "Website integration",
            "Basic knowledge base",
            "Up to 1,000 messages/month",
          ],
        },
        {
          tier: "Premium",
          price: "$249",
          description: "+ $29/month support & maintenance",
          isPopular: true,
          features: [
            "Everything in Starter",
            "Advanced knowledge base (docs + URLs)",
            "WhatsApp & Social Media integration",
            "Unlimited messages",
            "Monthly performance tuning",
            "Priority Support",
          ],
        },
      ]}
    />
  );
};

export default AuraIQ;
