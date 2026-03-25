import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, ArrowRight, Zap, Briefcase, LayoutTemplate, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const PACKAGES = [
  {
    icon: LayoutTemplate,
    name: "Foundation",
    tagline: "The Digital Transformation Starter",
    priceText: "$2,999",
    monthly: "Growth Partnership",
    monthlyNote: "Hosting, CMS updates, analytics",
    popular: false,
    bullets: [
      "High-Speed Custom Website",
      "Google Maps Local Optimization",
      "WhatsApp AI Assistant Setup",
      "Lead Capture & Routing System"
    ],
    outcomes: [
      { id: "presence", emoji: "🌐", title: "Global Footprint", desc: "A lightning-fast, premium digital storefront that builds immediate trust." },
      { id: "local", emoji: "📍", title: "Local Dominance", desc: "Optimized profiles to capture high-intent local search traffic." },
      { id: "whatsapp", emoji: "💬", title: "Automated Lead Capture", desc: "Never miss an inquiry. Instant AI-driven greeting and routing via WhatsApp." }
    ]
  },
  {
    icon: Briefcase,
    name: "SaaS MVP",
    tagline: "Get to market in 6 weeks",
    priceText: "$8,999",
    monthly: "Tech Partnership",
    monthlyNote: "Cloud infra, SLA-backed support",
    popular: true,
    bullets: [
      "Everything in Foundation",
      "Automated Direct Booking & Payment Engine",
      "Secure Customer Portals & Dashboards",
      "Seamless Third-Party API Integrations"
    ],
    outcomes: [
      { id: "revenue", emoji: "💳", title: "Automated Bookings & Payments", desc: "Strip out manual invoicing. Clients can book and pay autonomously 24/7." },
      { id: "portal", emoji: "🔐", title: "Client Portals", desc: "Secure operational dashboards for a premium post-sale customer experience." },
      { id: "scale", emoji: "📈", title: "Scalable Infrastructure", desc: "Built on enterprise-grade architecture that won't break as you scale." }
    ]
  },
  {
    icon: Zap,
    name: "AI Evolution",
    tagline: "Intelligent product engineering",
    priceText: "$14,999",
    monthly: "AI Ops Partnership",
    monthlyNote: "API cost mgmt, prompt tuning",
    popular: false,
    bullets: [
      "Everything in SaaS MVP",
      "Automated 24/7 AI Sales Dispatcher",
      "Custom Knowledge-Base Brain",
      "Internal Operations Automation"
    ],
    outcomes: [
      { id: "salesbot", emoji: "🤖", title: "24/7 AI Sales Dispatcher", desc: "A highly-trained AI agent that qualifies leads and closes deals while you sleep." },
      { id: "brain", emoji: "🧠", title: "Custom Company Brain", desc: "We map your operational data so the AI knows your business better than new hires." },
      { id: "efficiency", emoji: "⏱️", title: "Operational Automation", desc: "Slash administrative overhead by automating repetitive operational tasks." }
    ]
  },
  {
    icon: Shield,
    name: "Enterprise",
    tagline: "Full-scale custom ecosystem",
    priceText: "Custom Quote",
    monthly: "Dedicated Engineering",
    monthlyNote: "Dedicated engineering pod",
    popular: false,
    bullets: [
      "Everything in AI Evolution",
      "iOS & Android Mobile Applications",
      "Bespoke Internal Tooling",
      "Priority SLA & Dedicated PM"
    ],
    outcomes: [
      { id: "mobile", emoji: "📱", title: "Cross-Platform Mobile Apps", desc: "Premium native experiences delivered to both iOS and Android stores." },
      { id: "tools", emoji: "🏗️", title: "Bespoke Architecture", desc: "Custom-engineered solutions for highly specific, complex, multi-system workflows." },
      { id: "sla", emoji: "🛡️", title: "Enterprise Reliability", desc: "Ironclad security, compliance, and guaranteed uptime with a dedicated support line." }
    ]
  },
];

const PackageModal = ({ pkg, onClose }: { pkg: typeof PACKAGES[0]; onClose: () => void }) => {
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
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/5 bg-background/90 backdrop-blur-md px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-muted/50 text-foreground shadow-sm">
                <pkg.icon size={20} />
              </div>
              <div>
                <h3 id={headingId} className="text-xl font-bold tracking-tight text-foreground">{pkg.name} Engine</h3>
                <p className="text-sm font-medium text-muted-foreground">{pkg.tagline}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Business Outcomes */}
          <div className="px-6 py-4">
            <h4 className="text-xs font-semibold text-muted-foreground mb-4 uppercase tracking-widest">Business Outcomes</h4>
            <div className="space-y-4">
              {pkg.outcomes.map((fb) => (
                <div key={fb.id} className="flex items-start justify-between rounded-lg border border-white/5 bg-card p-4 shadow-sm">
                  <div className="flex items-start gap-4">
                    <span className="text-2xl mt-0.5">{fb.emoji}</span>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{fb.title}</p>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                        {fb.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 z-10 border-t border-white/5 bg-background/95 backdrop-blur-md px-6 py-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-3xl font-bold tracking-tight text-foreground">{pkg.priceText}</p>
            </div>
            <a
              href="#contact"
              onClick={onClose}
              className="rounded-md bg-foreground px-6 py-2.5 text-sm font-semibold text-background shadow-sm transition-all hover:bg-foreground/90"
            >
              Select Engine
            </a>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const PricingSection = () => {
  const [selectedPkg, setSelectedPkg] = useState<typeof PACKAGES[0] | null>(null);
  const navigate = useNavigate();

  return (
    <>
      {selectedPkg && <PackageModal pkg={selectedPkg} onClose={() => setSelectedPkg(null)} />}

      <section id="packages" className="relative py-24 sm:py-32 bg-background border-t border-white/5">
        <div className="container relative mx-auto px-4 sm:px-6 z-10">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 max-w-2xl mx-auto text-center"
          >
            <h2 className="text-3xl font-heading font-normal tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Transparent Pricing. <br/><span className="text-muted-foreground italic">Business Outcomes.</span>
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              We replace complex technical jargon with pure business outcomes. Choose the engine that solves your biggest bottleneck.
            </p>
          </motion.div>

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
                    ? "border-primary/50 shadow-2xl shadow-primary/5 md:-translate-y-2 cursor-default" 
                    : "border-white/5 hover:border-white/10 shadow-sm"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3.5 left-0 right-0 flex justify-center">
                    <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground shadow-sm">
                      Most Selected
                    </span>
                  </div>
                )}

                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg border ${pkg.popular ? 'border-primary/20 bg-primary/10 text-primary' : 'border-white/5 bg-muted/50 text-foreground'}`}>
                      <pkg.icon size={20} />
                    </div>
                    <span className="text-lg font-bold text-foreground">{pkg.name}</span>
                  </div>
                </div>

                <p className="text-sm font-medium text-muted-foreground mb-6 min-h-[40px]">{pkg.tagline}</p>

                <div className="mb-6 pb-6 border-b border-white/5">
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-bold tracking-tight text-foreground">{pkg.priceText}</p>
                  </div>
                </div>

                <ul className="flex-1 space-y-3.5 mb-8">
                  {pkg.bullets.map((b, bi) => (
                    <li key={bi} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <CheckCircle2 size={16} className={`mt-0.5 flex-shrink-0 ${pkg.popular ? 'text-primary' : 'text-foreground'}`} />
                      <span className="leading-snug">{b}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setSelectedPkg(pkg)}
                  className={`w-full rounded-md px-4 py-2.5 text-sm font-semibold transition-colors shadow-sm ${
                    pkg.popular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "border border-white/10 bg-transparent text-foreground hover:bg-muted"
                  }`}
                >
                  View Outcomes
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
              See detailed retainer strategies
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default PricingSection;
