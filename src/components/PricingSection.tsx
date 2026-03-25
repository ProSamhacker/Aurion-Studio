import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, ArrowRight, Zap, Code, LayoutTemplate, Shield, Database, Smartphone, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

// ─── Feature items keyed by id ─────────────────────────────────────────────
export const ALL_FEATURES = [
  { id: "discovery", emoji: "🔍", title: "Discovery & Architecture", price: "$1,500", subtitle: ["System design, DB schema, user flows", "Technical specification document"] },
  { id: "frontend",  emoji: "✨", title: "Custom Frontend (Next.js)", price: "$4,000", subtitle: ["Pixel-perfect, accessible UI", "Framer Motion animations, strict TS typing"] },
  { id: "backend",   emoji: "⚙️", title: "Scalable Backend (Node/Python)", price: "$5,000", subtitle: ["REST or GraphQL API", "PostgreSQL/Redis integration"] },
  { id: "auth",      emoji: "🔐", title: "Auth & RBAC", price: "$1,500", subtitle: ["SSO, OAuth, passwordless login", "Role-based access control"] },
  { id: "ai",        emoji: "🧠", title: "LLM / AI Integration", price: "$6,500", subtitle: ["OpenAI/Anthropic integration", "RAG pipelines, custom agents"] },
  { id: "payments",  emoji: "💳", title: "Payments (Stripe)", price: "$2,000", subtitle: ["Subscription billing, usage-based", "Webhooks and invoice generation"] },
  { id: "mobile",    emoji: "📱", title: "React Native Mobile App", price: "$12,000", subtitle: ["iOS and Android codebase", "App Store & Play Store deployment"] },
  { id: "ci-cd",     emoji: "🚀", title: "DevOps & CI/CD", price: "$2,500", subtitle: ["GitHub Actions, Docker containerization", "Vercel / AWS deployment pipelines"] },
];

const FEATURE_VALUES: Record<string, number> = {
  "discovery": 1500,
  "frontend": 4000,
  "backend": 5000,
  "auth": 1500,
  "ai": 6500,
  "payments": 2000,
  "mobile": 12000,
  "ci-cd": 2500,
};

// ─── Packages ──────────────────────────────────────────────────────────────
const basePackages = [
  {
    icon: LayoutTemplate,
    name: "Foundation",
    tagline: "High-conversion marketing site",
    priceText: "$2,999",
    priceNum: 2999,
    monthly: "$199/month",
    monthlyNote: "Hosting, CMS updates, analytics",
    popular: false,
    featureIds: ["discovery", "frontend", "ci-cd"],
    bullets: ["Custom UI/UX Design", "Next.js / React Frontend", "Vercel Deployment Pipeline", "Basic SEO & Analytics"],
  },
  {
    icon: Code,
    name: "SaaS MVP",
    tagline: "Get to market in 6 weeks",
    priceText: "$8,999",
    priceNum: 8999,
    monthly: "$499/month",
    monthlyNote: "Cloud infra, SLA-backed support",
    popular: true,
    featureIds: ["discovery", "frontend", "backend", "auth", "payments", "ci-cd"],
    bullets: ["Everything in Foundation", "Custom Backend API", "Authentication & RBAC", "Stripe Subscriptions"],
  },
  {
    icon: Zap,
    name: "AI Evolution",
    tagline: "Intelligent product engineering",
    priceText: "$14,999",
    priceNum: 14999,
    monthly: "$699/month",
    monthlyNote: "API cost mgmt, prompt tuning",
    popular: false,
    featureIds: ["discovery", "frontend", "backend", "auth", "ai", "ci-cd"],
    bullets: ["Everything in SaaS MVP", "Deep LLM Integration", "RAG Pipelines & Agents", "Vector Database Setup"],
  },
  {
    icon: Shield,
    name: "Enterprise",
    tagline: "Full-scale custom ecosystem",
    priceText: "$24,999",
    priceNum: 24999,
    monthly: "$999/month",
    monthlyNote: "Dedicated engineering pod",
    popular: false,
    featureIds: ["discovery", "frontend", "backend", "auth", "ai", "payments", "mobile", "ci-cd"],
    bullets: ["Everything in AI Evolution", "iOS & Android Mobile App", "Advanced DevOps/CI-CD", "Priority SLA"],
  },
];

export const PACKAGES = basePackages.map((pkg) => {
  const totalValue = pkg.featureIds.reduce((sum, id) => sum + (FEATURE_VALUES[id] || 0), 0);
  const discountPct = Math.round(((totalValue - pkg.priceNum) / totalValue) * 100);
  return { ...pkg, totalValue, discountPct };
});

// ─── Modal ─────────────────────────────────────────────────────────────────
const PackageModal = ({ pkg, onClose }: { pkg: typeof PACKAGES[0]; onClose: () => void }) => {
  const features = ALL_FEATURES.filter((f) => pkg.featureIds.includes(f.id));
  const headingId = `modal-title-${pkg.name}`;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md px-4 sm:p-6"
        onClick={onClose}
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-border bg-background shadow-2xl"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby={headingId}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/90 backdrop-blur-md px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-foreground">
                <pkg.icon size={20} />
              </div>
              <div>
                <h3 id={headingId} className="text-xl font-bold tracking-tight text-foreground">{pkg.name} Package</h3>
                <p className="text-sm text-primary font-medium">{pkg.tagline}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Features */}
          <div className="px-6 py-4">
            <h4 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Included Architecture</h4>
            <div className="space-y-4">
              {features.map((f) => (
                <div key={f.id} className="flex items-start justify-between rounded-lg border border-border bg-card p-4">
                  <div className="flex items-start gap-4">
                    <span className="text-2xl mt-0.5">{f.emoji}</span>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{f.title}</p>
                      <div className="mt-1 space-y-0.5">
                        {f.subtitle.map((s, i) => (
                          <p key={i} className="text-xs text-muted-foreground">{s}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-foreground">{f.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 z-10 border-t border-border bg-background/95 backdrop-blur-md px-6 py-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-2xl font-bold tracking-tight text-foreground">{pkg.priceText}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{pkg.monthly} • {pkg.monthlyNote}</p>
            </div>
            <a
              href="#contact"
              onClick={onClose}
              className="rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
            >
              Select Package
            </a>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ─── Main Section ──────────────────────────────────────────────────────────
const PricingSection = () => {
  const [selectedPkg, setSelectedPkg] = useState<typeof PACKAGES[0] | null>(null);
  const navigate = useNavigate();

  return (
    <>
      {selectedPkg && <PackageModal pkg={selectedPkg} onClose={() => setSelectedPkg(null)} />}

      <section id="packages" className="relative py-24 sm:py-32 bg-background border-t border-border">
        <div className="container relative mx-auto px-4 sm:px-6 z-10">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 max-w-2xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Transparent Pricing. <br/><span className="text-muted-foreground">No Surprises.</span>
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              We offer flat-rate, milestone-based pricing for most projects so you know exactly what you'll pay. 
            </p>
          </motion.div>

          {/* Package Cards — 4 cols */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
            {PACKAGES.map((pkg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative flex flex-col rounded-xl border p-6 sm:p-8 transition-all duration-300 bg-card ${
                  pkg.popular 
                    ? "border-primary shadow-[0_0_30px_-5px_hsl(221.2_83.2%_53.3%_/_0.2)] md:-translate-y-2 cursor-default" 
                    : "border-border hover:border-border/80"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3.5 left-0 right-0 flex justify-center">
                    <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${pkg.popular ? 'bg-primary/10 text-primary' : 'bg-muted text-foreground'}`}>
                      <pkg.icon size={20} />
                    </div>
                    <span className="text-lg font-bold text-foreground">{pkg.name}</span>
                  </div>
                </div>

                <p className="text-sm font-medium text-muted-foreground mb-6 min-h-[40px]">{pkg.tagline}</p>

                {/* Price */}
                <div className="mb-6 pb-6 border-b border-border">
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-bold tracking-tight text-foreground">{pkg.priceText}</p>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground font-medium">
                    <span className="text-foreground">{pkg.monthly}</span> retained
                  </p>
                </div>

                {/* Bullets */}
                <ul className="flex-1 space-y-3.5 mb-8">
                  {pkg.bullets.map((b, bi) => (
                    <li key={bi} className="flex items-start gap-3 text-sm text-foreground">
                      <CheckCircle2 size={16} className={`mt-0.5 flex-shrink-0 ${pkg.popular ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className="leading-snug">{b}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setSelectedPkg(pkg)}
                  className={`w-full rounded-md px-4 py-2.5 text-sm font-semibold transition-colors ${
                    pkg.popular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                >
                  View Details
                </button>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 flex justify-center"
          >
            <button
              onClick={() => navigate("/pricing")}
              className="group flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              See complete feature breakdown
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default PricingSection;
