import React, { useEffect } from "react";
import { Check, ArrowRight, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface ProductFeature {
  title: string;
  description: string;
  icon: React.ElementType;
}

interface ProductPricing {
  tier: string;
  price?: string;
  description?: string;
  features: string[];
  isPopular?: boolean;
}

interface ProductStep {
  title: string;
  description: string;
}

interface ProductTestimonial {
  quote: string;
  author: string;
  role: string;
}

export interface ProductPageLayoutProps {
  productName: string;
  heroHeadline: string;
  heroSubheadline: string;
  ctaText: string;
  ctaLink: string;
  features: ProductFeature[];
  pricing: ProductPricing[];
  steps?: ProductStep[];
  testimonials?: ProductTestimonial[];
}

const defaultSteps: ProductStep[] = [
  { title: "Connect your data", description: "Link your existing workflow, upload documents, or integrate your accounts in under five minutes." },
  { title: "The AI learns your context", description: "Our engine reads your data and configures itself to your specific business logic — no manual setup required." },
  { title: "Results on autopilot", description: "From day one, the system works in the background — surfacing insights, automating tasks, and saving you hours." },
];

const defaultTestimonials: ProductTestimonial[] = [
  { quote: "Set it up on a Friday afternoon. By Monday morning it had already handled 40 customer queries I would have spent half a day on.", author: "M. Rahman", role: "E-commerce founder" },
  { quote: "I was sceptical of AI tools but this one actually knew what it was doing. The ROI was immediate.", author: "S. Pereira", role: "Marketing consultant" },
  { quote: "Runs quietly in the background and just works. That's exactly what I needed.", author: "J. Whitfield", role: "Agency owner" },
];

const ProductPageLayout: React.FC<ProductPageLayoutProps> = ({
  productName,
  heroHeadline,
  heroSubheadline,
  ctaText,
  ctaLink,
  features,
  pricing,
  steps = defaultSteps,
  testimonials = defaultTestimonials,
}) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary/30">

      {/* ── Minimal product header ── */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft size={15} />
            Aurion Stack
          </Link>
          <span className="text-sm font-bold text-foreground tracking-tight">{productName}</span>
          <a
            href={ctaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-foreground px-4 py-2 text-xs font-semibold text-background transition-all hover:scale-[1.02] hover:bg-foreground/90"
          >
            {ctaText}
          </a>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative flex flex-col items-center justify-center text-center px-4 pt-16 pb-10 lg:pt-20 lg:pb-14 overflow-hidden border-b border-border bg-grid">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-primary/8 blur-[120px]" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="z-10 max-w-4xl mx-auto"
        >
          <div className="inline-block px-3 py-1 mb-4 border border-border/60 bg-muted/40 text-foreground text-[10px] font-bold rounded-full uppercase tracking-[0.18em]">
            {productName}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-normal tracking-tight mb-4 text-balance text-foreground leading-[1.08]">
            {heroHeadline}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mb-7 max-w-2xl mx-auto text-balance leading-relaxed">
            {heroSubheadline}
          </p>
          <a
            href={ctaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-foreground text-background font-semibold rounded-md hover:bg-foreground/90 hover:scale-[1.02] transition-all shadow-lg text-sm animate-pulse-glow"
          >
            {ctaText}
            <ArrowRight size={16} />
          </a>
        </motion.div>
      </section>
      {/* ── Features ── */}
      <section className="py-10 sm:py-12 px-4 bg-background border-b border-border">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-6"
          >
            <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3">
              What's Included
            </span>
            <h2 className="text-2xl md:text-4xl font-heading font-normal tracking-tight text-foreground">
              Built to actually work.
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="bg-card border border-border px-4 py-5 sm:p-6 rounded-xl flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 sm:gap-4 hover:border-white/15 transition-all duration-300"
              >
                <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-muted flex items-center justify-center text-foreground">
                  <feature.icon size={18} />
                </div>
                <h3 className="text-xs sm:text-sm font-bold tracking-tight text-foreground leading-tight sm:mt-2.5">{feature.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-10 sm:py-12 px-4 bg-muted/10 border-b border-border">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-6"
          >
            <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3">
              Real Users
            </span>
            <h2 className="text-2xl md:text-3xl font-heading font-normal tracking-tight text-foreground">
              What people say.
            </h2>
          </motion.div>
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] md:grid md:grid-cols-3 sm:overflow-visible sm:pb-0">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="min-w-[85vw] snap-center sm:min-w-0 rounded-xl border border-border bg-card p-6 flex flex-col gap-4 flex-shrink-0"
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <svg key={s} width="12" height="12" viewBox="0 0 12 12" fill="hsl(221 83% 53%)">
                      <path d="M6 0l1.5 4.5h4.5l-3.6 2.7 1.4 4.8L6 9.3l-3.8 2.7 1.4-4.8L0 4.5h4.5z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-foreground leading-relaxed italic flex-grow">"{t.quote}"</p>
                <div>
                  <p className="text-xs font-semibold text-foreground">{t.author}</p>
                  <p className="text-[11px] text-muted-foreground">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="py-10 sm:py-12 px-4 bg-background border-b border-border">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-6"
          >
            <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3">
              Pricing
            </span>
            <h2 className="text-2xl md:text-4xl font-heading font-normal tracking-tight text-foreground">
              No surprises. Just results.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {pricing.map((plan, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className={`relative flex flex-col p-7 rounded-xl border bg-card transition-all duration-300 ${
                  plan.isPopular
                    ? "border-primary shadow-lg md:-translate-y-1.5"
                    : "border-border hover:border-white/15"
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-shimmer rounded-full px-3 py-1 text-[10px] font-bold tracking-widest uppercase text-white">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-lg font-bold tracking-tight text-foreground">{plan.tier}</h3>
                  {plan.price && (
                    <div className="mt-3">
                      <span className="text-4xl font-bold tracking-tight text-foreground">{plan.price}</span>
                    </div>
                  )}
                  {plan.description && (
                    <p className="text-muted-foreground mt-2 text-xs">{plan.description}</p>
                  )}
                </div>
                <div className="flex-grow space-y-3 mb-7">
                  {plan.features.map((feat, fidx) => (
                    <div key={fidx} className="flex gap-3 items-start">
                      <Check size={14} className={`mt-0.5 flex-shrink-0 ${plan.isPopular ? "text-primary" : "text-foreground/50"}`} />
                      <span className="text-sm text-foreground leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
                <a
                  href={ctaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3 rounded-md font-semibold text-sm text-center transition-all duration-200 ${
                    plan.isPopular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02]"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                >
                  {ctaText}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Hard CTA Banner ── */}
      <section className="py-10 sm:py-12 px-4 bg-muted/10">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-4xl font-heading font-normal tracking-tight text-foreground mb-4 text-balance">
              Want us to set it up for you?
            </h2>
            <p className="text-sm text-muted-foreground mb-5 max-w-md mx-auto leading-relaxed">
              Our agency team handles all configuration, integration, and deployment. You focus on the outcome, not the setup.
            </p>
            <Link
              to="/#contact"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-transparent px-8 py-3.5 text-sm font-semibold text-foreground transition-all hover:bg-muted"
            >
              Talk to our team
              <ArrowRight size={15} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="mt-auto py-7 border-t border-border bg-background">
        <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Aurion Stack · Remote-first · Shipping globally
          </p>
          <div className="flex items-center gap-5">
            {["Home", "Services", "Pricing", "Contact"].map((l) => (
              <Link
                key={l}
                to={l === "Home" ? "/" : l === "Contact" ? "/#contact" : `/${l.toLowerCase()}`}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {l}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProductPageLayout;
