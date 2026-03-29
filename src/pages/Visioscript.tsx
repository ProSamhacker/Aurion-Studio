import React from "react";
import ProductPageLayout from "@/components/ProductPageLayout";
import { Video, Mic, Wand2, Captions } from "lucide-react";

const Visioscript = () => {
  return (
    <ProductPageLayout
      productName="VisioScript"
      heroHeadline="Script to screen. No editing suite required."
      heroSubheadline="Write a topic. Watch it become a fully-voiced, captioned, edited video. VisioScript handles the entire production pipeline so you can focus on ideas, not software."
      ctaText="Launch App"
      ctaLink="https://visioscript.aurionstack.dev"
      features={[
        { title: "AI Scriptwriter", description: "Generates structured, engaging scripts tailored to your niche, audience, and platform — not one-size-fits-all.", icon: Video },
        { title: "Lifelike AI Voices", description: "Ultra-realistic voiceovers in 20+ languages and dozens of tones. Indistinguishable from a professional studio recording.", icon: Mic },
        { title: "Dynamic Captions", description: "Auto-synced, animated captions that follow the speech rhythm exactly. Multiple premium styles included.", icon: Captions },
        { title: "Smart Editing", description: "Automated cuts at silence, B-roll matching, and transition suggestions — without you touching a timeline.", icon: Wand2 },
      ]}
      steps={[
        { title: "Enter your topic or niche", description: "Type a topic, paste a rough idea, or give a keyword. The AI handles research, structure, and script writing." },
        { title: "AI voices, captions, and edits", description: "Select a voice, tone, and caption style. The pipeline renders your video automatically in the background." },
        { title: "Download and publish", description: "Export in 4K. File formats ready for YouTube, Instagram Reels, TikTok, or LinkedIn in one click." },
      ]}
      testimonials={[
        { quote: "I published 30 days of content in one afternoon. The quality was high enough that my audience didn't notice the difference.", author: "P. Osei", role: "Health & wellness creator" },
        { quote: "The voice quality is what got me. I've tried every AI voice tool and VisioScript is the only one that doesn't sound robotic.", author: "F. Kowalski", role: "Online course creator" },
        { quote: "Saved my agency approximately 60 hours a month in video production costs. This pays for itself ten times over.", author: "K. Johansson", role: "Social media agency owner" },
      ]}
      pricing={[
        {
          tier: "Starter",
          price: "$39/mo",
          description: "For new creators starting their journey.",
          features: [
            "Up to 30 mins of generated video/month",
            "Standard AI voices (10 options)",
            "Basic caption styles",
            "720p exports",
          ],
        },
        {
          tier: "Pro",
          price: "$99/mo",
          description: "For high-volume creators and agencies.",
          isPopular: true,
          features: [
            "Unlimited video generation",
            "Ultra-realistic premium voices (50+ options)",
            "Advanced animated captions",
            "4K exports",
            "Priority rendering queue",
            "Priority support",
          ],
        },
      ]}
    />
  );
};

export default Visioscript;
