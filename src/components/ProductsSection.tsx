import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bot, Video, BriefcaseBusiness, ArrowUpRight } from "lucide-react";
import GapTuberIcon from "@/components/icons/GapTuberIcon";

const products = [
  {
    icon: Bot,
    name: "AuraIQ",
    tagline: "Automates your customer support. 24/7.",
    description: "A custom AI agent trained on your SOPs and FAQs. It qualifies leads, handles queries, and routes urgent issues — without a support team on the payroll.",
    href: "/auraiq",
    badge: "AI Agent",
    color: "hsl(221 83% 53%)",
    stat: "1,000+ queries handled daily",
  },
  {
    icon: GapTuberIcon,
    name: "GapTuber",
    tagline: "Kills 10 hours of content research weekly.",
    description: "Instead of manually scrolling YouTube to find what to create, GapTuber surfaces high-demand gaps your competitors haven't touched — in seconds.",
    href: "/gaptuber",
    badge: "Content AI",
    color: "hsl(154 84% 40%)",
    stat: "50+ gap reports per month",
  },
  {
    icon: Video,
    name: "VisioScript",
    tagline: "Replaces a video production team.",
    description: "Script → AI voiceover → auto-captions → export. A full video production pipeline in your browser. What used to take days takes 20 minutes.",
    href: "/visioscript",
    badge: "Video AI",
    color: "hsl(270 70% 60%)",
    stat: "4K export, 20+ languages",
  },
  {
    icon: BriefcaseBusiness,
    name: "BusinessZip",
    tagline: "Eliminates admin from your week.",
    description: "Invoices auto-generated. Contracts sent in two clicks. Expenses categorised automatically. The paperwork tasks that eat your Sundays, done.",
    href: "/businesszip",
    badge: "Ops AI",
    color: "hsl(150 60% 45%)",
    stat: "Free plan available",
  },
];

const ProductsSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const index = Math.round(el.scrollLeft / el.offsetWidth);
      setActiveDot(Math.min(index, products.length - 1));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (i: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.offsetWidth * 0.85, behavior: "smooth" });
  };

  return (
    <section id="products" className="relative border-t border-border bg-muted/10 py-12 sm:py-16 overflow-hidden">
      <div className="container relative mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8"
        >
          <div className="max-w-xl">
            <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-3">
              Our Products
            </span>
            <h2 className="text-3xl font-heading font-normal tracking-tight text-foreground sm:text-5xl text-balance">
              Automation tools we built.
              <span className="block text-muted-foreground italic mt-1">Live. In production. Today.</span>
            </h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs md:text-right leading-relaxed">
            When a client asks us to build something, we often already have the infrastructure. That's the advantage.
          </p>
        </motion.div>

        {/* Cards — snap scroll on mobile, grid on desktop */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-5 pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible sm:pb-0"
        >
          {products.map((prod, i) => {
            const Icon = prod.icon;
            return (
              <motion.a
                key={prod.name}
                href={prod.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.09 }}
                className="min-w-[82vw] snap-center sm:min-w-0 group flex flex-col rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-white/15 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] sm:p-7"
              >
                {/* Badge + Icon */}
                <div className="mb-5 flex items-start justify-between gap-2">
                  <div
                    className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg transition-all duration-300 group-hover:scale-110"
                    style={{ background: prod.color + "20" }}
                  >
                    <Icon size={22} style={{ color: prod.color }} />
                  </div>
                  <span className="rounded-md border border-white/5 bg-muted/50 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                    {prod.badge}
                  </span>
                </div>

                {/* Text */}
                <h3 className="text-lg font-bold tracking-tight text-foreground mb-1">{prod.name}</h3>
                <p className="text-xs font-semibold mb-3 flex-grow" style={{ color: prod.color }}>
                  {prod.tagline}
                </p>

                {/* Stat pill */}
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-[10px] font-medium text-muted-foreground/60 italic">{prod.stat}</span>
                  <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground transition-colors group-hover:text-foreground">
                    Explore
                    <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>

        {/* Pagination dots — mobile only */}
        <div className="flex sm:hidden items-center justify-center gap-2 mt-5">
          {products.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`carousel-dot ${activeDot === i ? "active" : ""}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default ProductsSection;
