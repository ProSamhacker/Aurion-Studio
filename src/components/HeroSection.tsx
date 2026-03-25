import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useReviews } from "@/context/ReviewsContext";

// Animated metric sub-component that mutates DOM directly for performance
const AnimatedMetricItem = ({
  label, target, suffix, decimals = 0, showStars = false, avgRating = 0,
}: {
  label: string; target: number; suffix: string; decimals?: number; showStars?: boolean; avgRating?: number;
}) => {
  const nodeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    const duration = 1200;
    const start = performance.now();
    let rafId: number;

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      const current = eased * target;
      node.innerText = current.toFixed(decimals) + suffix;
      if (t < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [target, decimals, suffix]);

  return (
    <div className="flex flex-col items-center gap-1 py-5 px-2">
      <span ref={nodeRef} className="font-heading text-2xl font-black text-gradient-teal leading-none sm:text-3xl">
        0{suffix}
      </span>
      {showStars && avgRating > 0 && (
        <div className="flex gap-0.5 mt-0.5">
          {Array.from({ length: 5 }).map((_, s) => (
            <Star key={s} size={11} className={
              s < Math.floor(avgRating) ? "fill-orange text-orange"
              : s < avgRating ? "fill-orange/50 text-orange"
              : "fill-transparent text-orange/30"
            } />
          ))}
        </div>
      )}
      <span className="font-body text-[10px] text-muted-foreground tracking-wide uppercase text-center leading-tight sm:text-xs">
        {label}
      </span>
    </div>
  );
};

const HeroSection = () => {
  const { avgRating } = useReviews();

  return (

    <section className="relative flex items-center overflow-hidden bg-background px-4 pt-24 pb-16 sm:px-6 sm:pt-28 sm:pb-24">
      {/* Subtle background grid — low opacity, no animation */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <svg className="h-full w-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="geo-mesh" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M0 30 L30 0 L60 30 L30 60 Z" fill="none" stroke="hsl(190 76% 37%)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#geo-mesh)" />
        </svg>
      </div>

      <div className="container relative mx-auto">
        <div className="mx-auto max-w-4xl text-center">

          {/* Availability Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-border bg-muted/50 px-4 py-1.5 backdrop-blur-sm sm:mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-teal"></span>
            </span>
            <span className="font-body text-xs font-medium text-foreground tracking-wide sm:text-sm">
              Currently accepting new clients
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heading font-black tracking-tight text-foreground flex flex-col gap-1 sm:gap-2"
          >
            <span className="text-[7vw] sm:text-6xl md:text-7xl lg:text-[5rem] leading-[1.1] whitespace-nowrap">
              We build software
            </span>
            <span className="text-teal text-[6.5vw] sm:text-5xl md:text-6xl lg:text-[4rem] leading-[1.1] whitespace-nowrap">
              that runs your business.
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-5 max-w-2xl font-body text-base leading-relaxed text-muted-foreground sm:text-lg sm:mt-6 md:text-xl"
          >
            Aurion Stack is a product engineering studio based in Goa. We help local and global brands
            capture more revenue by replacing slow, manual processes with high-speed web apps and
            custom AI workflows.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
          >
            <a
              href="#our-work"
              className="w-full geometric-clip bg-gradient-teal px-8 py-3.5 font-heading text-sm font-bold text-primary-foreground shadow-teal-glow transition-all hover:scale-105 sm:w-auto"
            >
              View Our Work
            </a>
            <a
              href="#contact"
              className="w-full geometric-clip border-2 border-orange bg-transparent px-8 py-3 font-heading text-sm font-bold text-orange transition-all hover:bg-orange/10 sm:w-auto"
            >
              Contact Us
            </a>
          </motion.div>

          {/* Metrics Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="mt-12 grid grid-cols-3 divide-x divide-border/60 rounded-xl border border-border/40 bg-card/40 backdrop-blur-sm"
          >
            <AnimatedMetricItem label="Years Experience" target={1} suffix="+" />
            <AnimatedMetricItem label="Projects Delivered" target={10} suffix="+" />
            <AnimatedMetricItem label="Client Rating" target={avgRating} suffix="★" decimals={1} showStars avgRating={avgRating} />
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
