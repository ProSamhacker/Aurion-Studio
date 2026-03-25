import { useEffect, useRef } from "react";
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
    <div className="flex flex-col items-center gap-1.5 py-6 px-2">
      <span ref={nodeRef} className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        0{suffix}
      </span>
      {showStars && avgRating > 0 && (
        <div className="flex gap-0.5 mt-1">
          {Array.from({ length: 5 }).map((_, s) => (
            <Star key={s} size={13} className={
              s < Math.floor(avgRating) ? "fill-primary text-primary"
                : s < avgRating ? "fill-primary/50 text-primary"
                  : "fill-transparent text-primary/30"
            } />
          ))}
        </div>
      )}
      <span className="text-[11px] font-medium tracking-widest text-muted-foreground uppercase text-center mt-1">
        {label}
      </span>
    </div>
  );
};

const HeroSection = () => {
  const { avgRating } = useReviews();

  return (
    <section className="relative flex items-center overflow-hidden bg-background px-4 pt-32 pb-20 sm:px-6 sm:pt-40 sm:pb-32 bg-grid-white bg-grid">
      {/* Subtle Premium Background Glows, restricted by a radial mask to create depth */}
      <div className="absolute inset-0 pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]">
        <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[100px]" />
      </div>

      <div className="container relative mx-auto z-10">
        <div className="mx-auto max-w-4xl text-center">
          
          {/* Availability Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-border bg-muted/30 px-4 py-1.5 shadow-sm backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </span>
            <span className="text-xs font-medium tracking-wide text-foreground sm:text-sm">
              Available for New Projects
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex flex-col gap-2 font-heading tracking-tight text-foreground sm:gap-3"
          >
            <span className="text-5xl sm:text-7xl md:text-8xl lg:text-[5.5rem] leading-[1.05]">
              Product Engineering
            </span>
            <span className="text-4xl sm:text-6xl md:text-7xl lg:text-[4.5rem] leading-[1.05] italic text-muted-foreground/80">
              Built for Scale.
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl text-balance"
          >
            Aurion Stack is a remote-first product engineering studio. We partner with fast-growing
            startups and enterprise brands worldwide to replace slow, manual processes with high-speed
            web apps and custom AI infrastructure.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <a
              href="#our-work"
              className="w-full rounded-md bg-foreground px-8 py-3.5 text-sm font-semibold text-background transition-transform hover:scale-[1.02] sm:w-auto shadow-xl shadow-black/20"
            >
              Explore Our Work
            </a>
            <a
              href="#contact"
              className="w-full rounded-md border border-border bg-transparent px-8 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-muted sm:w-auto"
            >
              Book a Consultation
            </a>
          </motion.div>

          {/* Metrics Bar & Mockup wrapper */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-16 w-full"
          >
            {/* Minimal Dashboard Mockup Frame */}
            <div className="mx-auto max-w-5xl overflow-hidden rounded-xl border border-white/5 bg-surface-gradient backdrop-blur-sm shadow-2xl ring-1 ring-white/10">
              {/* Browser/Window Header */}
              <div className="flex h-10 w-full items-center gap-2 border-b border-white/5 bg-black/40 px-4">
                <div className="h-3 w-3 rounded-full bg-white/20" />
                <div className="h-3 w-3 rounded-full bg-white/20" />
                <div className="h-3 w-3 rounded-full bg-white/20" />
              </div>
              
              {/* Internal Content (Metrics inside the "dashboard") */}
              <div className="grid grid-cols-3 divide-x divide-white/5 bg-black/20 p-6 sm:p-10">
                <AnimatedMetricItem label="Years Experience" target={5} suffix="+" />
                <AnimatedMetricItem label="Production Deployments" target={24} suffix="+" />
                <AnimatedMetricItem label="Client Rating" target={avgRating} suffix="★" decimals={1} showStars avgRating={avgRating} />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
