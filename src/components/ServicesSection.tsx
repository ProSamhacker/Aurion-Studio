import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Globe, Smartphone, Brain, Layers, ArrowRight } from "lucide-react";

const services = [
  {
    num: "01",
    icon: Globe,
    title: "AI-Powered Web Systems",
    description: "Not a website. A working system. We build web platforms wired with AI — from automated lead capture to real-time dashboards that replace manual reporting.",
  },
  {
    num: "02",
    icon: Smartphone,
    title: "Mobile Automation Apps",
    description: "Your team's daily operations, on their phones. Field apps, client portals, and approval workflows — all automated and shipped to iOS and Android.",
  },
  {
    num: "03",
    icon: Brain,
    title: "AI Agents & Automation",
    description: "We replace manual tasks with AI agents. Lead qualification, customer support, invoice chasing, internal reporting — automated using LLMs and APIs we've built before.",
  },
  {
    num: "04",
    icon: Layers,
    title: "Backend & Integrations",
    description: "The plumbing that makes automation actually work. We connect your CRM, payment stack, databases, and third-party tools so data flows without anyone touching it.",
  },
];

const ServicesSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const index = Math.round(el.scrollLeft / el.offsetWidth);
      setActiveDot(Math.min(index, services.length - 1));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (i: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.offsetWidth * 0.88, behavior: "smooth" });
  };

  return (
    <section id="services" className="relative border-t border-border bg-background py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-xl"
          >
            <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3">
              What We Do
            </span>
            <h2 className="text-3xl font-heading font-normal tracking-tight text-foreground sm:text-5xl text-balance">
              The automation work
              <span className="block text-muted-foreground italic mt-1">we do for you.</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="hidden md:block"
          >
            <a
              href="/services"
              className="group inline-flex items-center gap-2 rounded-md border border-border bg-transparent px-5 py-2.5 text-sm font-semibold text-foreground transition-all hover:bg-muted"
            >
              Full capabilities
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </a>
          </motion.div>
        </div>

        {/* Services grid — snap scroll on mobile */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-5 pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-2 lg:grid-cols-4 lg:gap-6 sm:overflow-visible sm:pb-0"
        >
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.09 }}
              className="min-w-[82vw] snap-center sm:min-w-0 group flex flex-col rounded-xl border border-border bg-card p-6 sm:p-8 transition-all duration-300 hover:border-white/15 hover:-translate-y-1 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)]"
            >
              {/* Number + Icon row */}
              <div className="flex items-start justify-between mb-6">
                <span className="editorial-number text-[11px] font-bold tracking-widest text-muted-foreground/40 tabular-nums">
                  {service.num}
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-foreground transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-105">
                  <service.icon size={20} />
                </div>
              </div>

              <h3 className="text-base font-bold tracking-tight text-foreground">
                {service.title}
              </h3>
            </motion.div>
          ))}
        </div>

        {/* Pagination dots — mobile only */}
        <div className="flex sm:hidden items-center justify-center gap-2 mt-5">
          {services.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`carousel-dot ${activeDot === i ? "active" : ""}`}
            />
          ))}
        </div>

        {/* Mobile CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 md:hidden"
        >
          <a
            href="/services"
            className="group flex w-full items-center justify-center gap-2 rounded-md border border-border bg-transparent px-6 py-4 text-sm font-semibold text-foreground transition-all hover:bg-muted"
          >
            Full capabilities
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>

      </div>
    </section>
  );
};

export default ServicesSection;
