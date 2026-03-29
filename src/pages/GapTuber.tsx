import React from "react";
import ProductPageLayout from "@/components/ProductPageLayout";
import { TrendingUp, Search, Target } from "lucide-react";
import GapTuberIcon from "@/components/icons/GapTuberIcon";

const GapTuber = () => {
  return (
    <ProductPageLayout
      productName="GapTuber"
      heroHeadline="Find winning content gaps on YouTube. Instantly."
      heroSubheadline="Stop guessing what to film next. AI-driven analysis surfaces high-demand, low-competition video ideas that your niche is crying out for — before your competitors find them."
      ctaText="Try Now"
      ctaLink="https://gaptuber.aurionstack.dev"
      features={[
        { title: "Gap Analysis Engine", description: "Spots topics your audience is actively searching for that competitors have completely ignored.", icon: GapTuberIcon },
        { title: "Trend Forecasting", description: "Identifies rising search curves before they peak — so you publish while everyone else is still catching up.", icon: TrendingUp },
        { title: "Smart Keyword Search", description: "Surfaces exact phrases real people type into YouTube's search bar, ranked by volume and competition.", icon: Search },
        { title: "Actionable Briefs", description: "Not just keywords — structured video briefs with angles, hooks, and thumbnail direction.", icon: Target },
      ]}
      steps={[
        { title: "Connect your YouTube channel", description: "One-click OAuth. We read your existing content to understand your niche and what's already been covered." },
        { title: "AI scans your niche and competitors", description: "The engine maps demand vs. supply across your entire topic space and identifies the whitespace." },
        { title: "Get ranked content ideas weekly", description: "A curated list of high-confidence video briefs lands in your dashboard every Monday morning." },
      ]}
      testimonials={[
        { quote: "My last three videos all hit 50k+ views. Every single one started as a GapTuber idea. I don't make content any other way now.", author: "T. Nakamura", role: "Tech YouTuber, 120k subs" },
        { quote: "Finally a tool that tells you what to make, not just what's already performing. The gap framing is the whole insight.", author: "A. Williams", role: "Finance content creator" },
        { quote: "Paid for itself with one sponsored video. The brief quality is surprisingly thorough.", author: "M. Bautista", role: "Travel vlogger" },
      ]}
      pricing={[
        {
          tier: "Starter",
          price: "$19/mo",
          description: "For creators finding their footing.",
          features: [
            "Up to 50 gap analyses per month",
            "Basic keyword tracking",
            "Standard content ideas",
            "Email support",
          ],
        },
        {
          tier: "Pro",
          price: "$49/mo",
          description: "For serious creators scaling their channel.",
          isPopular: true,
          features: [
            "Unlimited gap analyses",
            "Advanced keyword & competitor tracking",
            "Full video briefs with hooks & angles",
            "Early trend alerts",
            "Priority support",
          ],
        },
      ]}
    />
  );
};

export default GapTuber;
