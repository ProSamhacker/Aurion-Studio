import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Phone } from "lucide-react";
import { PACKAGES, ALL_FEATURES } from "@/components/PricingSection";

const PricingDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <div className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-xl">
        <div className="container mx-auto flex items-center gap-4 px-4 py-4 sm:px-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="flex-1" />
          <span className="font-heading text-sm font-bold text-teal">Aurion Stack · Pricing</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 sm:px-6 sm:py-16 max-w-5xl">

        {/* Hero heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <span className="inline-block font-body text-xs font-semibold uppercase tracking-widest text-teal mb-3">
            Complete Pricing Guide
          </span>
          <h1 className="font-heading text-4xl font-black text-foreground sm:text-5xl">
            Transparent <span className="text-gradient-teal">Pricing</span>
          </h1>
          <p className="mt-3 font-body text-sm text-muted-foreground max-w-lg mx-auto sm:text-base">
            Everything you need to know — from starter packages to full digital transformation. Mix &amp; match any features.
          </p>
        </motion.div>

        {/* ── Packages ───────────────────────────────────────────────── */}
        <section className="mb-16">
          <h2 className="font-heading text-2xl font-black text-foreground mb-6">
            📦 Suggested Packages
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PACKAGES.map((pkg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                className={`rounded-2xl border ${pkg.borderColor} bg-card/60 p-5`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`inline-flex items-center gap-2 rounded-full ${pkg.badgeBg} px-3 py-1`}>
                    <span>{pkg.emoji}</span>
                    <span className={`font-heading text-xs font-bold ${pkg.color}`}>{pkg.name}</span>
                  </div>
                  {pkg.discountPct > 0 && (
                    <span className="rounded-full bg-teal/20 px-2 py-1 font-heading text-[10px] font-black text-teal">
                      SAVE {pkg.discountPct}%
                    </span>
                  )}
                </div>
                <div className="flex items-end gap-2">
                  <p className="font-heading text-3xl font-black text-foreground">{pkg.priceText}</p>
                  <p className="mb-1 font-body text-xs text-muted-foreground line-through decoration-muted-foreground/50">
                    ₹{pkg.totalValue.toLocaleString('en-IN')}
                  </p>
                </div>
                <p className="mt-1 mb-4 font-body text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground/70">{pkg.monthly}</span> — {pkg.monthlyNote}
                </p>
                <ul className="space-y-1.5">
                  {pkg.bullets.map((b, bi) => (
                    <li key={bi} className="flex items-start gap-2 font-body text-xs text-muted-foreground">
                      <span className="text-teal mt-0.5">✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Feature Breakdown Table ────────────────────────────────── */}
        <section className="mb-16">
          <h2 className="font-heading text-2xl font-black text-foreground mb-2">
            🔍 Pricing Breakdown — Per Feature
          </h2>
          <p className="font-body text-sm text-muted-foreground mb-6">
            Choose only what you need. Every feature can be purchased individually or as part of a package.
          </p>

          <div className="rounded-2xl border border-border/60 overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[2fr_1fr] bg-card/80 border-b border-border/60 px-5 py-3">
              <span className="font-heading text-xs font-bold uppercase tracking-widest text-muted-foreground">Feature</span>
              <span className="font-heading text-xs font-bold uppercase tracking-widest text-muted-foreground text-right">Price</span>
            </div>

            {ALL_FEATURES.map((f, i) => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.05 + i * 0.04 }}
                className={`grid grid-cols-[2fr_1fr] items-start px-5 py-4 gap-4 ${i % 2 === 0 ? "bg-card/30" : "bg-transparent"} border-b border-border/30 last:border-0`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <span className="text-xl flex-shrink-0 mt-0.5">{f.emoji}</span>
                  <div className="min-w-0">
                    <p className="font-heading text-sm font-bold text-foreground leading-snug">{i + 1}. {f.title}</p>
                    {f.subtitle.map((s, si) => (
                      <p key={si} className="font-body text-xs text-muted-foreground mt-0.5">{s}</p>
                    ))}
                  </div>
                </div>
                <p className="font-heading text-sm font-black text-gradient-teal text-right pt-0.5">{f.price}</p>
              </motion.div>
            ))}
          </div>

          <p className="mt-4 font-body text-xs text-muted-foreground text-center">
            * Prices are indicative. Final quote is based on scope &amp; customisation needs.
          </p>
        </section>

        {/* ── Monthly Plans ──────────────────────────────────────────── */}
        <section className="mb-16">
          <h2 className="font-heading text-2xl font-black text-foreground mb-6">
            📅 Monthly Maintenance Plans
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              {
                name: "Starter Maintenance",
                price: "₹500/month",
                items: ["Hosting", "SSL certificate", "Basic uptime monitoring"],
                note: "For Basic Package clients",
                color: "border-green-500/40 bg-green-500/5",
              },
              {
                name: "Pro Maintenance",
                price: "₹1,500/month",
                items: ["Hosting + SSL", "Monthly menu content updates", "Monthly SEO performance report", "Priority support"],
                note: "For Growth & Premium clients",
                color: "border-yellow-500/40 bg-yellow-500/5",
              },
            ].map((plan, i) => (
              <div key={i} className={`rounded-2xl border ${plan.color} p-5`}>
                <p className="font-body text-xs text-muted-foreground mb-1">{plan.note}</p>
                <p className="font-heading text-lg font-bold text-foreground">{plan.name}</p>
                <p className="font-heading text-2xl font-black text-gradient-teal mt-1 mb-4">{plan.price}</p>
                <ul className="space-y-1.5">
                  {plan.items.map((item, ii) => (
                    <li key={ii} className="flex items-start gap-2 font-body text-sm text-muted-foreground">
                      <span className="text-teal">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── Contact CTA ────────────────────────────────────────────── */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-teal/30 bg-teal/5 p-8 text-center"
          >
            <div className="flex justify-center mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal/10 border border-teal/30">
                <Phone size={20} className="text-teal" />
              </div>
            </div>
            <h2 className="font-heading text-2xl font-black text-foreground mb-2">
              Not Sure Which Package Fits?
            </h2>
            <p className="font-body text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Let's have a quick call. We'll understand your cafe's needs and build a custom quote — no obligations.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="mailto:aurionstack@gmail.com"
                className="geometric-clip bg-gradient-teal px-8 py-3 font-heading text-sm font-bold text-primary-foreground shadow-teal-glow transition-all hover:scale-105"
              >
                Email Us
              </a>
              <a
                href="https://instagram.com/aurionstack"
                target="_blank"
                rel="noopener noreferrer"
                className="geometric-clip-sm border-2 border-teal/50 bg-transparent px-8 py-3 font-heading text-sm font-bold text-teal transition-all hover:bg-teal/10"
              >
                DM on Instagram
              </a>
            </div>
          </motion.div>
        </section>

      </div>
    </div>
  );
};

export default PricingDashboard;
