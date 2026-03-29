import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Star, Bot, Video, BriefcaseBusiness } from "lucide-react";
import GapTuberIcon from "@/components/icons/GapTuberIcon";
import { useReviews } from "@/context/ReviewsContext";

const AnimatedMetricItem = ({
  label,
  target,
  suffix,
  decimals = 0,
  showStars = false,
  avgRating = 0,
}: {
  label: string;
  target: number;
  suffix: string;
  decimals?: number;
  showStars?: boolean;
  avgRating?: number;
}) => {
  const nodeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    const duration = 1400;
    const start = performance.now();
    let rafId: number;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      node.innerText = (eased * target).toFixed(decimals) + suffix;
      if (t < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [target, decimals, suffix]);

  return (
    <div className="flex flex-col items-center gap-1 py-5 px-2">
      <div className="flex items-center justify-center">
        <span
          ref={nodeRef}
          className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl tabular-nums"
        >
          0{suffix}
        </span>
        {showStars && <Star className="w-[18px] h-[18px] ml-1 mb-1 text-foreground fill-foreground" />}
      </div>
      <span className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase text-center leading-tight mt-1">
        {label}
      </span>
    </div>
  );
};

const ecosystem = [
  { icon: Bot, name: "AuraIQ", color: "hsl(221 83% 53%)", href: "/auraiq" },
  { icon: GapTuberIcon, name: "GapTuber", color: "hsl(154 84% 40%)", href: "/gaptuber" },
  { icon: Video, name: "VisioScript", color: "hsl(270 70% 60%)", href: "/visioscript" },
  { icon: BriefcaseBusiness, name: "BusinessZip", color: "hsl(150 60% 45%)", href: "/businesszip" },
];

const HeroSection = () => {
  const { avgRating } = useReviews();
  const [activeEco, setActiveEco] = useState<number | null>(null);

  return (
    <section
      id="hero"
      className="relative flex items-center overflow-hidden bg-background pt-20 pb-10 sm:pt-20 sm:pb-16 bg-grid"
    >
      {/* Layered ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-primary/8 blur-[140px]" />
        <div className="absolute left-1/4 top-1/2 h-[300px] w-[400px] -translate-y-1/2 rounded-full bg-primary/5 blur-[100px] hidden sm:block" />
      </div>

      <div className="relative mx-auto w-full px-4 sm:px-6 lg:px-8 z-10">
        <div className="mx-auto max-w-5xl text-center">

          {/* Status badge */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 sm:mb-10 inline-flex items-center gap-2.5 rounded-full border border-border bg-muted/30 px-4 py-1.5 shadow-sm backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="text-xs font-semibold tracking-wide text-foreground sm:text-sm">
              <span className="text-primary mr-1">●</span> 3 client slots open
            </span>
          </motion.div>

          {/* Headline — editorial, not generic */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex flex-col gap-1.5 font-heading tracking-tight"
          >
            <span className="text-[3rem] sm:text-5xl md:text-6xl lg:text-[5.5rem] leading-[1.15] text-foreground">
              AI-Powered SaaS
              <br className="sm:hidden" /> & Automation.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mx-auto mt-6 w-[90%] sm:w-auto sm:max-w-xl text-base leading-relaxed text-muted-foreground/80 sm:text-lg text-pretty"
          >
            We build custom AI systems and SaaS products that automate manual work and scale your business.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <a
              href="#contact"
              className="w-full rounded-md bg-foreground px-8 py-[14px] sm:py-3.5 text-sm font-semibold text-background transition-all hover:scale-[1.02] hover:bg-foreground/90 sm:w-auto shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3),_0_10px_20px_rgba(0,0,0,0.2)]"
            >
              Book a Free Strategy Call
            </a>
            <a
              href="#our-work"
              className="w-full rounded-md border border-border bg-transparent px-8 py-[14px] sm:py-3.5 text-sm font-medium text-foreground transition-all hover:scale-[1.02] hover:bg-muted sm:w-auto"
            >
              See What We Build
            </a>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-4 text-xs text-muted-foreground/60 text-center flex flex-wrap justify-center gap-x-2 gap-y-1 items-center max-w-[280px] sm:max-w-none mx-auto"
          >
            <span>Free consultation</span> 
            <span>·</span> 
            <span>No commitment</span> 
            <span className="hidden sm:inline">·</span> 
            <span className="sm:inline hidden">Response within 24h</span>
          </motion.p>

          {/* Metrics + Ecosystem strip */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-12 w-full"
          >
            {/* Metrics frame */}
            <div className="mx-auto max-w-4xl overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-md shadow-2xl ring-1 ring-white/10">
              {/* Window chrome */}
              <div className="flex h-9 w-full items-center gap-2 border-b border-white/10 bg-black/50 px-4">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500/50" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/50" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-500/50" />
                <span className="ml-2 text-[10px] text-muted-foreground/50 font-mono">
                  aurionstack.dev — live dashboard
                </span>
              </div>

              {/* 3-metric row */}
              <div className="grid grid-cols-3 divide-x divide-white/10 bg-black/40">
                <AnimatedMetricItem label="Years Active" target={5} suffix="+" />
                <AnimatedMetricItem label="Apps Shipped" target={24} suffix="+" />
                <AnimatedMetricItem
                  label="Client Rating"
                  target={avgRating}
                  suffix=""
                  decimals={1}
                  showStars
                  avgRating={avgRating}
                />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
