import React from "react";
import ProductPageLayout from "@/components/ProductPageLayout";
import { BriefcaseBusiness, FileText, Receipt, PieChart } from "lucide-react";

const BusinessZip = () => {
  return (
    <ProductPageLayout
      productName="BusinessZip"
      heroHeadline="All-in-One Business Utilities."
      heroSubheadline="Streamline your operations with our central hub for invoicing, document automation, and intelligent expense tracking. Designed to save you hours every week."
      ctaText="Open Tool"
      ctaLink="https://businesszip.aurionstack.dev"
      features={[
        {
          title: "Invoice Generation",
          description: "Create professional invoices and get paid faster.",
          icon: Receipt,
        },
        {
          title: "Document Automation",
          description: "Auto-fill proposals, contracts, and NDA templates.",
          icon: FileText,
        },
        {
          title: "Central Dashboard",
          description: "Manage all your essential tools from one single screen.",
          icon: BriefcaseBusiness,
        },
        {
          title: "Expense Tracking",
          description: "Categorize and monitor your spending automatically.",
          icon: PieChart,
        },
      ]}
      pricing={[
        {
          tier: "Starter",
          price: "Free",
          description: "Essential tools for freelancers and solo founders.",
          features: [
            "Up to 5 invoices / month",
            "Basic document templates",
            "Simple expense logging",
            "Community support",
          ],
        },
        {
          tier: "Pro",
          price: "$29 / mo",
          description: "A complete suite for growing teams.",
          isPopular: true,
          features: [
            "Unlimited invoices & clients",
            "Custom branding on all documents",
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
