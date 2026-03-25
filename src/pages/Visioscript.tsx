import React from "react";
import ProductPageLayout from "@/components/ProductPageLayout";
import { Video, Mic, Type, Wand2 } from "lucide-react";

const Visioscript = () => {
  return (
    <ProductPageLayout
      productName="Visioscript"
      heroHeadline="AI Video Editing. From Script to Screen."
      heroSubheadline="Create engaging, professional-quality videos in minutes. Let AI handle the heavy lifting of scriptwriting, voice generation, and captivating captions."
      ctaText="Launch App"
      ctaLink="https://visioscript.aurionstack.dev"
      features={[
        {
          title: "AI Scriptwriter",
          description: "Generate compelling narratives tailored to your niche.",
          icon: Type,
        },
        {
          title: "Human-like AI Voice",
          description: "Lifelike voiceovers in multiple languages and tones.",
          icon: Mic,
        },
        {
          title: "Dynamic Captions",
          description: "Auto-sync stylistic, engaging captions perfectly to audio.",
          icon: Type,
        },
        {
          title: "Smart Editing Magic",
          description: "Automated cuts, transitions, and B-roll suggestions.",
          icon: Wand2,
        },
      ]}
      pricing={[
        {
          tier: "Starter",
          price: "$39 / mo",
          description: "For new creators starting their journey.",
          features: [
            "Up to 30 mins of video generation",
            "Standard AI voices",
            "Basic caption styles",
            "720p exports",
          ],
        },
        {
          tier: "Pro",
          price: "$99 / mo",
          description: "For high-volume creators and agencies.",
          isPopular: true,
          features: [
            "Unlimited video generation",
            "Premium ultra-realistic voices",
            "Advanced glowing & dynamic captions",
            "4K exports",
            "Priority rendering & support",
          ],
        },
      ]}
    />
  );
};

export default Visioscript;
