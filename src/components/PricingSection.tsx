import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

// ─── Feature items keyed by id ─────────────────────────────────────────────
export const ALL_FEATURES = [
  { id: "website",   emoji: "🌐", title: "Base Website",              price: "₹7,000",           subtitle: ["Home, Menu, About, Contact pages", "Mobile responsive design"] },
  { id: "domain",    emoji: "🌍", title: "Domain Registration",       price: "₹899 – ₹1,299",   subtitle: [".in → ₹899  |  .com → ₹1,299"] },
  { id: "location",  emoji: "📍", title: "Location + Open/Close Status", price: "₹1,000",        subtitle: ["Google Maps embed + live timing logic"] },
  { id: "seo-basic", emoji: "🔎", title: "Basic Local SEO",           price: "₹5,000",           subtitle: ["Google Business profile optimisation", 'Keywords: "cafe near me", "restaurant near me"'] },
  { id: "seo-adv",   emoji: "🚀", title: "Advanced Local SEO",        price: "₹7,000",           subtitle: ["Menu item indexing (burger, fries…)", "Rich snippets + schema markup"] },
  { id: "dashboard", emoji: "⚙️", title: "Admin Dashboard",           price: "₹6,000",           subtitle: ["Edit menu, prices, offers & content"] },
  { id: "social",    emoji: "📲", title: "Social Media Auto Sync",    price: "₹2,000",           subtitle: ["Show latest Instagram posts live on site"] },
  { id: "qr",        emoji: "🔳", title: "QR Code System",            price: "₹1,500",           subtitle: ["QR for menu · order · review collection"] },
  { id: "chatbot",   emoji: "🤖", title: "AI WhatsApp Chatbot",       price: "₹8,000 – ₹12,000", subtitle: ["Menu sharing + auto replies", "Order handling (price depends on complexity)"] },
  { id: "feedback",  emoji: "⭐", title: "Automated Feedback System", price: "₹5,000",           subtitle: ["Rating filter: bad → manager, good → public"] },
  { id: "upsell",    emoji: "🧠", title: "Smart Upselling System",    price: "₹3,000",           subtitle: ["AI suggestions (coke with burger etc.)"] },
  { id: "app",       emoji: "📱", title: "Mobile Application",        price: "₹30,000",          subtitle: ["Dedicated iOS + Android app (menu + order)"] },
];

// ─── Automated Value Calculation ───────────────────────────────────────────
const FEATURE_VALUES: Record<string, number> = {
  "website": 7000,
  "domain": 1299,
  "location": 1000,
  "seo-basic": 5000,
  "seo-adv": 7000,
  "dashboard": 6000,
  "social": 2000,
  "qr": 1500,
  "chatbot": 12000,
  "feedback": 5000,
  "upsell": 3000,
  "app": 30000,
};

// ─── Packages (3 tiers) ────────────────────────────────────────────────────
const basePackages = [
  {
    emoji: "🟢",
    name: "Basic",
    tagline: "Get online fast",
    priceText: "₹8,000",
    priceNum: 8000,
    monthly: "₹500/month",
    monthlyNote: "Hosting + SSL",
    color: "text-green-400",
    borderColor: "border-green-500/40",
    badgeBg: "bg-green-500/10",
    featureIds: ["website", "domain", "location"],
    bullets: ["Website + Domain", "Location & Business Hours", "Google Maps integration"],
  },
  {
    emoji: "🟡",
    name: "Growth",
    tagline: "Attract more customers",
    priceText: "₹20,000",
    priceNum: 20000,
    monthly: "₹1,500/month",
    monthlyNote: "Hosting + Menu Updates + SEO Report",
    color: "text-yellow-400",
    borderColor: "border-yellow-500/40",
    badgeBg: "bg-yellow-500/10",
    featureIds: ["website", "domain", "location", "seo-basic", "seo-adv", "dashboard", "social", "qr"],
    bullets: ["Everything in Basic", "Local SEO + Adv SEO", "Admin Dashboard", "Social Sync & QR"],
  },
  {
    emoji: "🔴",
    name: "Premium",
    tagline: "Full digital powerhouse",
    priceText: "₹50,000",
    priceNum: 50000,
    monthly: "₹1,500/month",
    monthlyNote: "Hosting + Menu Updates + SEO Report",
    color: "text-red-400",
    borderColor: "border-red-500/40",
    badgeBg: "bg-red-500/10",
    featureIds: ["website", "domain", "location", "seo-basic", "seo-adv", "dashboard", "social", "qr", "chatbot", "feedback", "upsell"],
    bullets: ["Everything in Growth", "Advanced SEO + AI Chatbot", "Feedback Automation", "Upselling System"],
  },
  {
    emoji: "⚫",
    name: "Ultimate",
    tagline: "The complete ecosystem",
    priceText: "₹80,000",
    priceNum: 80000,
    monthly: "₹1,500/month",
    monthlyNote: "Hosting + Menu Updates + SEO Report",
    color: "text-gray-300",
    borderColor: "border-gray-500/40",
    badgeBg: "bg-gray-500/10",
    featureIds: ["website", "domain", "location", "seo-basic", "seo-adv", "dashboard", "social", "qr", "chatbot", "feedback", "upsell", "app"],
    bullets: ["Everything in Premium", "Mobile Application"],
  },
];

export const PACKAGES = basePackages.map((pkg) => {
  const totalValue = pkg.featureIds.reduce((sum, id) => sum + (FEATURE_VALUES[id] || 0), 0);
  const discountPct = Math.round(((totalValue - pkg.priceNum) / totalValue) * 100);
  return { ...pkg, totalValue, discountPct };
});

// ─── Per-package modal ─────────────────────────────────────────────────────
const PackageModal = ({ pkg, onClose }: { pkg: typeof PACKAGES[0]; onClose: () => void }) => {
  const features = ALL_FEATURES.filter((f) => pkg.featureIds.includes(f.id));
  const headingId = `modal-title-${pkg.name}`;

  // Close on Escape key
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
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
        onClick={onClose}
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.93, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 24 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-border/60 bg-background shadow-2xl"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby={headingId}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border/60 bg-background/95 backdrop-blur-sm px-6 py-4">
            <div>
              <span className={`font-heading text-xs font-bold uppercase tracking-widest ${pkg.color}`}>{pkg.emoji} {pkg.name} Package</span>
              <h3 id={headingId} className="font-heading text-xl font-black text-foreground mt-0.5">What's Included</h3>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-muted/40 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Features */}
          <div className="divide-y divide-border/40 px-4 py-2">
            {features.map((f) => (
              <div key={f.id} className="flex items-start gap-4 py-4">
                <span className="text-2xl flex-shrink-0 mt-0.5">{f.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-heading text-sm font-bold text-foreground">{f.title}</p>
                  {f.subtitle.map((s, i) => (
                    <p key={i} className="font-body text-xs text-muted-foreground mt-0.5">{s}</p>
                  ))}
                </div>
                <span className="font-heading text-sm font-black text-gradient-teal flex-shrink-0">{f.price}</span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="border-t border-border/40 px-6 py-4 flex items-center justify-between gap-4">
            <div>
              <p className="font-heading text-lg font-black text-foreground">{pkg.priceText}</p>
              <p className="font-body text-xs text-muted-foreground">{pkg.monthly} — {pkg.monthlyNote}</p>
            </div>
            <a
              href="#contact"
              onClick={onClose}
              className="geometric-clip-sm bg-gradient-teal px-6 py-2.5 font-heading text-xs font-bold text-primary-foreground shadow-teal-glow transition-all hover:scale-105"
            >
              Get This Package
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

      <section id="packages" className="relative py-20 sm:py-28 bg-background border-t border-border/60">
        {/* Subtle bg glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 h-72 w-96 rounded-full bg-teal/5 blur-[120px]" />
        </div>

        <div className="container relative mx-auto px-4 sm:px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <span className="inline-block font-body text-xs font-semibold uppercase tracking-widest text-teal mb-3">
              📦 Suggested Packages
            </span>
            <h2 className="font-heading text-3xl font-black text-foreground sm:text-5xl">
              Choose Your <span className="text-gradient-teal">Package</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl font-body text-sm text-muted-foreground sm:text-base">
              Transparent, flexible pricing tailored for cafes &amp; restaurants. Click <strong>View Details</strong> to see what each package includes.
            </p>
          </motion.div>

          {/* Package Cards — 4 cols */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PACKAGES.map((pkg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative flex flex-col rounded-2xl border ${pkg.borderColor} bg-card/60 p-5 backdrop-blur-sm hover:-translate-y-1 transition-all duration-300`}
              >
                {/* Badge section with discount */}
                <div className="mb-4 flex items-center justify-between">
                  <div className={`inline-flex items-center gap-2 rounded-full ${pkg.badgeBg} px-3 py-1`}>
                    <span className="text-base">{pkg.emoji}</span>
                    <span className={`font-heading text-xs font-bold ${pkg.color}`}>{pkg.name}</span>
                  </div>
                  {pkg.discountPct > 0 && (
                    <span className="rounded-full bg-teal/20 px-2 py-1 font-heading text-[10px] font-black text-teal">
                      SAVE {pkg.discountPct}%
                    </span>
                  )}
                </div>

                <p className="font-body text-xs text-muted-foreground mb-2">{pkg.tagline}</p>

                {/* Price */}
                <div className="mb-4">
                  <div className="flex items-end gap-2">
                    <p className="font-heading text-3xl font-black text-foreground">{pkg.priceText}</p>
                    <p className="mb-1 font-body text-xs text-muted-foreground line-through decoration-muted-foreground/50">
                      ₹{pkg.totalValue.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <p className="mt-1 font-body text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground/70">{pkg.monthly}</span> — {pkg.monthlyNote}
                  </p>
                </div>

                {/* Bullets */}
                <ul className="flex-1 space-y-2 mb-5">
                  {pkg.bullets.map((b, bi) => (
                    <li key={bi} className="flex items-start gap-2 font-body text-sm text-muted-foreground">
                      <Check size={14} className="mt-0.5 flex-shrink-0 text-teal" />
                      {b}
                    </li>
                  ))}
                </ul>

                {/* View Details */}
                <button
                  onClick={() => setSelectedPkg(pkg)}
                  className={`w-full geometric-clip-sm border ${pkg.borderColor} bg-transparent py-2.5 font-heading text-xs font-bold ${pkg.color} transition-all hover:bg-white/5`}
                >
                  📋 View Details
                </button>
              </motion.div>
            ))}
          </div>

          {/* Wide Show More CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6"
          >
            <button
              onClick={() => navigate("/pricing")}
              className="group w-full flex items-center justify-center gap-3 rounded-2xl border border-teal/30 bg-teal/5 py-5 font-heading text-base font-bold text-teal transition-all hover:bg-teal/10 hover:border-teal/60 hover:shadow-teal-glow"
            >
              <span>Explore Full Pricing Breakdown &amp; Feature Guide</span>
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default PricingSection;
