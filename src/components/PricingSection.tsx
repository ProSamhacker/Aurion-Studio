import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, CheckCircle2, ArrowRight, Zap, Briefcase,
  LayoutTemplate, Shield, Bot, Video,
  BriefcaseBusiness, MoveRight
} from "lucide-react";
import GapTuberIcon from "@/components/icons/GapTuberIcon";
import { useNavigate } from "react-router-dom";

export const PACKAGES = [
  {
    icon: LayoutTemplate,
    name: "Foundation",
    tagline: "For businesses still doing everything manually.",
    priceText: "$2,999",
    monthly: "Growth Partnership",
    monthlyNote: "Hosting, CMS updates, analytics",
    popular: false,
    bullets: [
      "AI-wired business website",
      "Automated lead capture & routing",
      "WhatsApp AI assistant setup",
      "Google Business local optimization"
    ],
    outcomes: [
      { id: "presence", emoji: "🌐", title: "24/7 Lead Capture", desc: "Automated forms, chat, and WhatsApp flows that qualify and route leads while you sleep." },
      { id: "local", emoji: "📍", title: "Local Discoverability", desc: "Optimized Google profiles that surface you to buyers with high local search intent." },
      { id: "whatsapp", emoji: "💬", title: "Instant AI Reply", desc: "AI-powered WhatsApp assistant that greets, qualifies, and routes every inquiry automatically." }
    ]
  },
  {
    icon: Briefcase,
    name: "SaaS MVP",
    tagline: "For founders who need a working product, not a pitch deck.",
    priceText: "$8,999",
    monthly: "Tech Partnership",
    monthlyNote: "Cloud infra, SLA-backed support",
    popular: true,
    bullets: [
      "Everything in Foundation",
      "Automated booking & payment engine",
      "Client portals with real-time data",
      "Third-party API & CRM integrations"
    ],
    outcomes: [
      { id: "revenue", emoji: "💳", title: "Bookings Run Themselves", desc: "Strip out manual invoicing. Clients book, pay, and receive confirmations automatically." },
      { id: "portal", emoji: "🔐", title: "Client Portals", desc: "Secure dashboards so clients can track their own projects in real time." },
      { id: "scale", emoji: "📈", title: "Built to Scale", desc: "Infrastructure designed to handle 10 users or 10,000 without a rewrite." }
    ]
  },
  {
    icon: Zap,
    name: "AI Evolution",
    tagline: "For operators drowning in repetitive tasks.",
    priceText: "$14,999",
    monthly: "AI Ops Partnership",
    monthlyNote: "API cost mgmt, prompt tuning",
    popular: false,
    bullets: [
      "Everything in SaaS MVP",
      "AI agent that qualifies & closes leads",
      "Custom knowledge base trained on your data",
      "Automated internal ops & reporting"
    ],
    outcomes: [
      { id: "salesbot", emoji: "🤖", title: "AI Sales Agent", desc: "Qualifies leads, answers objections, and books calls — automatically, around the clock." },
      { id: "brain", emoji: "🧠", title: "Your Company's Brain", desc: "AI trained on your actual data so it answers like your best employee, not a generic bot." },
      { id: "efficiency", emoji: "⏱️", title: "Ops on Autopilot", desc: "Recurring reports, internal updates, and task routing handled by AI — zero manual effort." }
    ]
  },
  {
    icon: Shield,
    name: "Enterprise",
    tagline: "For funded teams that need a dedicated automation department.",
    priceText: "Custom Quote",
    monthly: "Dedicated Engineering",
    monthlyNote: "Dedicated engineering pod",
    popular: false,
    bullets: [
      "Everything in AI Evolution",
      "iOS & Android mobile applications",
      "Bespoke internal tooling & dashboards",
      "Priority SLA & dedicated project manager"
    ],
    outcomes: [
      { id: "mobile", emoji: "📱", title: "Mobile Apps", desc: "Premium native experiences delivered to both iOS and Android app stores." },
      { id: "tools", emoji: "🏗️", title: "Custom Internal Tools", desc: "Dashboards, ops tools, and workflows built specifically for how your team actually works." },
      { id: "sla", emoji: "🛡️", title: "Enterprise SLA", desc: "Guaranteed uptime, dedicated PM, and a support line that picks up." }
    ]
  },
];

// Low-ticket wedge tools — the entry point
const WEDGE_TOOLS = [
  {
    icon: GapTuberIcon,
    name: "GapTuber",
    tagline: "YouTube content gap analysis",
    price: "$19",
    period: "/mo",
    hook: "Find your next viral video today.",
    href: "/gaptuber",
    color: "hsl(154 84% 40%)",
  },
  {
    icon: BriefcaseBusiness,
    name: "BusinessZip",
    tagline: "Invoices, docs & expense tracking",
    price: "Free",
    period: "",
    hook: "Start free. Scale when you're ready.",
    href: "/businesszip",
    color: "hsl(150 60% 45%)",
  },
  {
    icon: Bot,
    name: "AuraIQ",
    tagline: "24/7 AI support agent for your site",
    price: "$149",
    period: " setup",
    hook: "Never miss a lead again.",
    href: "/auraiq",
    color: "hsl(221 83% 53%)",
  },
  {
    icon: Video,
    name: "VisioScript",
    tagline: "Script → voice → captions → video",
    price: "$39",
    period: "/mo",
    hook: "From idea to published in minutes.",
    href: "/visioscript",
    color: "hsl(270 70% 60%)",
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
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4 sm:p-6"
        onClick={onClose}
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-border bg-background shadow-2xl"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby={headingId}
        >
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/5 bg-background/90 backdrop-blur-md px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-muted/50 text-foreground">
                <pkg.icon size={20} />
              </div>
              <div>
                <h3 id={headingId} className="text-xl font-bold tracking-tight text-foreground">{pkg.name} Engine</h3>
                <p className="text-sm text-muted-foreground">{pkg.tagline}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="px-6 py-4">
            <h4 className="text-[10px] font-bold text-muted-foreground mb-4 uppercase tracking-[0.15em]">What You're Buying</h4>
            <div className="space-y-3">
              {pkg.outcomes.map((fb) => (
                <div key={fb.id} className="flex items-start gap-4 rounded-lg border border-white/5 bg-card p-4">
                  <span className="text-2xl mt-0.5 flex-shrink-0">{fb.emoji}</span>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{fb.title}</p>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{fb.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sticky bottom-0 z-10 border-t border-white/5 bg-background/95 backdrop-blur-md px-6 py-5 flex items-center justify-between gap-4">
            <p className="text-3xl font-bold tracking-tight text-foreground">{pkg.priceText}</p>
            <a
              href="#contact"
              onClick={onClose}
              className="rounded-md bg-foreground px-6 py-2.5 text-sm font-semibold text-background transition-all hover:bg-foreground/90 hover:scale-[1.02]"
            >
              Start Conversation
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

      <section id="packages" className="relative py-12 sm:py-16 bg-background border-t border-white/5">
        <div className="container relative mx-auto px-4 sm:px-6 z-10">

          {/* ── WEDGE: Try Our Tools ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8 max-w-2xl"
          >
            <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-3">
              Start Here
            </span>
            <h2 className="text-3xl font-heading font-normal tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Try the automation first.
              <span className="block text-muted-foreground italic">
                Buy the full buildout when you're ready.
              </span>
            </h2>
            <p className="mt-4 text-base text-muted-foreground max-w-lg">
              All four products are live and automating real work right now. Pick the one that kills your biggest bottleneck and start today — no sales call, no commitment.
            </p>
          </motion.div>

          {/* Tool cards — horizontal scroll on mobile */}
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible sm:pb-0 mb-8">
            {WEDGE_TOOLS.map((tool, i) => {
              const Icon = tool.icon;
              return (
                <motion.a
                  key={tool.name}
                  href={tool.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="min-w-[75vw] snap-center sm:min-w-0 group flex flex-col rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1"
                  style={{ "--tool-color": tool.color } as React.CSSProperties}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                      style={{ background: tool.color + "20" }}
                    >
                      <Icon size={20} style={{ color: tool.color }} />
                    </div>
                    <span className="text-xl font-bold text-foreground tabular-nums">
                      {tool.price}<span className="text-xs font-medium text-muted-foreground">{tool.period}</span>
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-foreground mb-1">{tool.name}</h3>
                  <p className="text-xs text-muted-foreground mb-4 leading-relaxed flex-grow">{tool.tagline}</p>
                  <p className="text-xs font-semibold italic" style={{ color: tool.color }}>{tool.hook}</p>
                </motion.a>
              );
            })}
          </div>

          {/* Bridge — the strategic upsell divider */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative flex items-center gap-4 mb-16"
          >
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            <div className="flex items-center gap-2 rounded-full border border-border bg-muted/30 px-5 py-2.5 text-center flex-shrink-0">
              <MoveRight size={14} className="text-primary flex-shrink-0" />
              <span className="text-xs font-semibold text-foreground whitespace-nowrap">
                Ready to go further? Our agency builds the full system.
              </span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-border to-transparent" />
          </motion.div>

          {/* ── AGENCY PACKAGES ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8 max-w-2xl"
          >
            <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3">
              Full Agency Engagement
            </span>
            <h2 className="text-3xl font-heading font-normal tracking-tight text-foreground sm:text-4xl">
              Transparent pricing.<br />
              <span className="text-muted-foreground italic">Measurable outcomes.</span>
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">
              Fixed-price retainers. No hourly billing, no surprise invoices.
            </p>
          </motion.div>

          <div className="flex overflow-x-auto snap-x snap-mandatory gap-5 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible sm:pb-0">
            {PACKAGES.map((pkg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.09 }}
                className={`min-w-[85vw] snap-center sm:min-w-0 flex-shrink-0 sm:flex-shrink-1 relative flex flex-col rounded-xl border p-6 sm:p-7 transition-all duration-300 bg-card ${
                  pkg.popular
                    ? "border-primary/50 shadow-2xl shadow-primary/5 md:-translate-y-2"
                    : "border-white/5 hover:border-white/10 hover:shadow-lg"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3.5 left-0 right-0 flex justify-center">
                    <span className="animate-shimmer rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">
                      Most Selected
                    </span>
                  </div>
                )}

                <div className="mb-5 flex items-center gap-3">
                  <div className={`p-2 rounded-lg border ${pkg.popular ? "border-primary/20 bg-primary/10 text-primary" : "border-white/5 bg-muted/50 text-foreground"}`}>
                    <pkg.icon size={18} />
                  </div>
                  <span className="text-base font-bold text-foreground">{pkg.name}</span>
                </div>

                <p className="text-xs font-medium text-muted-foreground mb-5 min-h-[36px]">{pkg.tagline}</p>

                <div className="mb-5 pb-5 border-b border-white/5">
                  <p className="text-3xl font-bold tracking-tight text-foreground">{pkg.priceText}</p>
                  <p className="text-xs text-muted-foreground mt-1">{pkg.monthlyNote}</p>
                </div>

                <ul className="flex-1 space-y-3 mb-7">
                  {pkg.bullets.map((b, bi) => (
                    <li key={bi} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                      <CheckCircle2 size={14} className={`mt-0.5 flex-shrink-0 ${pkg.popular ? "text-primary" : "text-foreground/60"}`} />
                      <span className="leading-snug">{b}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setSelectedPkg(pkg)}
                  className={`w-full rounded-md px-4 py-2.5 text-xs font-semibold transition-all duration-200 ${
                    pkg.popular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02]"
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
            className="mt-6 flex justify-center"
          >
            <button
              onClick={() => navigate("/pricing")}
              className="group flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              See full retainer breakdown
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>

        </div>
      </section>
    </>
  );
};

export default PricingSection;
