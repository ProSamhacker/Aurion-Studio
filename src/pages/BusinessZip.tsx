import React from "react";
import ProductPageLayout from "@/components/ProductPageLayout";
import { BriefcaseBusiness, FileText, Receipt, PieChart } from "lucide-react";

const BusinessZip = () => {
  return (
    <ProductPageLayout
      productName="BusinessZip"
      heroHeadline="Stop doing admin. Start running your business."
      heroSubheadline="Invoices, contracts, expense tracking — all of it in one clean dashboard. BusinessZip handles the repetitive operations stack so your time goes to work that actually matters."
      ctaText="Open Tool"
      ctaLink="https://businesszip.aurionstack.dev"
      features={[
        { title: "Invoice Generation", description: "Create professional, branded invoices in 30 seconds. Automated reminders chase late payments so you don't have to.", icon: Receipt },
        { title: "Document Automation", description: "Auto-populate proposals, contracts, NDAs, and quotes from a template library. Send for e-signatures in two clicks.", icon: FileText },
        { title: "Central Dashboard", description: "Every client, every project, every outstanding payment — visible from one screen. No spreadsheets involved.", icon: BriefcaseBusiness },
        { title: "Expense Tracking", description: "Log expenses, assign to projects, and categorise automatically. End-of-year accounting becomes a five-minute task.", icon: PieChart },
      ]}
      steps={[
        { title: "Create a free account", description: "No credit card. No commitment. Onboarding takes three minutes and you'll have your first invoice ready in five." },
        { title: "Add your clients and projects", description: "Import from a CSV, connect your calendar, or add manually. The dashboard structures itself around your workflow." },
        { title: "Automate the rest", description: "Set up recurring invoices, payment reminders, and approval workflows once. They run themselves from that point." },
      ]}
      testimonials={[
        { quote: "I used to spend Sunday evenings doing invoices. Now I spend them with my family. BusinessZip is genuinely life-improving.", author: "C. Andersen", role: "Freelance designer" },
        { quote: "The document automation alone is worth the subscription. I generate proposals in under a minute that used to take an hour.", author: "B. Tremblay", role: "Consulting firm owner" },
        { quote: "Clean, fast, and it just works. I recommended it to every freelancer I know.", author: "N. Gupta", role: "Independent developer" },
      ]}
      pricing={[
        {
          tier: "Starter",
          price: "Free",
          description: "Essential tools for freelancers and solo founders.",
          features: [
            "Up to 5 invoices per month",
            "3 document templates",
            "Basic expense logging",
            "Community support",
          ],
        },
        {
          tier: "Pro",
          price: "$29/mo",
          description: "A complete operations suite for growing teams.",
          isPopular: true,
          features: [
            "Unlimited invoices & clients",
            "Custom branding on all documents",
            "Full template library + custom templates",
            "Advanced analytics & reporting",
            "Automated payment reminders",
            "Priority email support",
          ],
        },
      ]}
    />
  );
};

export default BusinessZip;
