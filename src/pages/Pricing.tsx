import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, Mail, Globe } from "lucide-react";
import usePageMeta from "@/hooks/usePageMeta";
import { PACKAGES, ALL_FEATURES } from "@/components/PricingSection";

const PricingDashboard = () => {
  const navigate = useNavigate();
  usePageMeta(
    "Pricing — Aurion Stack | Web, Mobile & AI Development Packages",
    "Transparent pricing for custom web development, mobile apps, and AI automation. Choose a package that fits your needs. Remote-first, delivering worldwide."
  );

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Top bar */}
      <div className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex items-center gap-4 px-4 py-4 sm:px-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="flex-1" />
          <span className="text-sm font-bold tracking-tight text-foreground">Pricing Overview</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 sm:px-6 sm:py-24 max-w-5xl">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h1 className="text-4xl font-bold tracking-tighter text-foreground sm:text-5xl md:text-6xl mb-4">
            Engineering that <span className="text-muted-foreground">scales.</span>
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto sm:text-lg text-balance">
            Transparent, flat-rate pricing for product builds. Mix and match features or choose an optimized package to get to market faster.
          </p>
        </motion.div>

        {/* ── Packages ───────────────────────────────────────────────── */}
        <section className="mb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PACKAGES.map((pkg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={`rounded-xl border p-6 flex flex-col ${pkg.popular ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card"}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${pkg.popular ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                    <pkg.icon size={18} />
                  </div>
                  <span className="font-bold text-base text-foreground">{pkg.name}</span>
                </div>
                
                <div className="mb-6">
                  <p className="text-3xl font-bold tracking-tight text-foreground">{pkg.priceText}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-through decoration-muted-foreground/50">
                    ${pkg.totalValue.toLocaleString()}
                  </p>
                </div>
                
                <ul className="space-y-3 mb-6 flex-1">
                  {pkg.bullets.map((b, bi) => (
                    <li key={bi} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-0.5">•</span>
                      <span className="leading-snug">{b}</span>
                    </li>
                  ))}
                </ul>
                
                <p className="text-xs font-medium text-foreground p-3 rounded-lg bg-muted flex flex-col gap-1 text-center">
                  <span>{pkg.monthly} retained</span>
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Feature Breakdown Table ────────────────────────────────── */}
        <section className="mb-24">
          <div className="mb-8 border-b border-border pb-4">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              A-la-carte Architecture
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Every system can be purchased individually or layered into an existing codebase.
            </p>
          </div>

          <div className="rounded-xl border border-border overflow-hidden bg-card">
            <div className="grid grid-cols-[2fr_1fr] bg-muted/50 border-b border-border px-6 py-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Subsystem</span>
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground text-right">Fixed Cost</span>
            </div>

            <div className="divide-y divide-border">
              {ALL_FEATURES.map((f, i) => (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 + i * 0.04 }}
                  className="grid grid-cols-[2fr_1fr] items-center px-6 py-5 gap-4 hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="text-xl flex-shrink-0">{f.emoji}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">{f.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate hidden sm:block">
                        {f.subtitle.join(" • ")}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-foreground text-right">{f.price}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Monthly Plans ──────────────────────────────────────────── */}
        <section className="mb-24">
          <h2 className="text-2xl font-bold tracking-tight text-foreground mb-6">
            Retained Engineering
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                name: "Infrastructure Support",
                price: "$199/mo",
                items: ["Vercel/AWS hosting costs", "SSL & domain management", "24/7 uptime monitoring", "Monthly dependency updates"],
                note: "Standard SLA",
              },
              {
                name: "Product Partner",
                price: "$699/mo",
                items: ["Everything in Infra", "15 hours ad-hoc engineering", "Monthly strategy & analytics review", "Priority Slack channel access"],
                note: "Priority SLA",
              },
            ].map((plan, i) => (
               <div key={i} className="rounded-xl border border-border bg-card p-6 flex flex-col justify-between">
                 <div>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">{plan.note}</p>
                   <p className="text-xl font-bold text-foreground mb-1">{plan.name}</p>
                   <p className="text-3xl font-bold tracking-tight text-foreground mb-6">{plan.price}</p>
                   <ul className="space-y-3">
                     {plan.items.map((item, ii) => (
                       <li key={ii} className="flex items-start gap-3 text-sm text-muted-foreground">
                         <span className="text-primary mt-0.5">•</span>
                         {item}
                       </li>
                     ))}
                   </ul>
                 </div>
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
            className="rounded-xl border border-border bg-gradient-to-br from-card to-background p-10 text-center"
          >
            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-3">
              Ready to scope your project?
            </h2>
            <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto">
              Book a consultation call. We'll map out your technical architecture and provide a binding flat-rate quote within 48 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:aurionstack@gmail.com"
                className="flex items-center justify-center gap-2 rounded-md bg-foreground px-6 py-3 text-sm font-semibold text-background transition-colors hover:bg-foreground/90"
              >
                <Mail size={16} />
                Email Us
              </a>
              <a
                href="https://wa.me/919322720861"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-md border border-border bg-transparent px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                <Phone size={16} />
                Request Call
              </a>
            </div>
          </motion.div>
        </section>

      </div>
    </div>
  );
};

export default PricingDashboard;
