import React from "react";
import ProductPageLayout from "@/components/ProductPageLayout";
import { Youtube, TrendingUp, Search, Target } from "lucide-react";

const GapTuber = () => {
  return (
    <ProductPageLayout
      productName="GapTuber"
      heroHeadline="Find Winning Content Gaps on YouTube instantly."
      heroSubheadline="Stop guessing what to film next. Use AI-driven search analysis to discover high-demand, low-competition video ideas and dominate your niche."
      ctaText="Try Now"
      ctaLink="https://gaptuber.aurionstack.dev"
      features={[
        {
          title: "Gap Analysis Engine",
          description: "Spot topics your audience wants but competitors missed.",
          icon: Youtube,
        },
        {
          title: "Trend Forecasting",
          description: "Predict what will go viral before it happens.",
          icon: TrendingUp,
        },
        {
          title: "Smart Keyword Search",
          description: "Discover exactly what people are typing in the search bar.",
          icon: Search,
        },
        {
          title: "Actionable Insights",
          description: "Get specific, data-backed video concepts.",
          icon: Target,
        },
      ]}
      pricing={[
        {
          tier: "Starter",
          price: "$19 / mo",
          description: "For new creators finding their footing.",
          features: [
            "Up to 50 gap analyses / month",
            "Basic keyword tracking",
            "Standard content ideas",
            "Email support",
          ],
        },
        {
          tier: "Pro",
          price: "$49 / mo",
          description: "For serious creators scaling their channels.",
          isPopular: true,
          features: [
            "Unlimited gap analyses",
            "Advanced keyword & competitor tracking",
            "Premium algorithm insights",
            "Early trend alerts",
            "Priority support",
          ],
        },
      ]}
    />
  );
};

export default GapTuber;
