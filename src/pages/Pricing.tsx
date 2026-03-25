import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, Mail } from "lucide-react";
import usePageMeta from "@/hooks/usePageMeta";
import { PACKAGES } from "@/components/PricingSection";

const PricingDashboard = () => {
  const navigate = useNavigate();
  usePageMeta(
    "Pricing — Aurion Stack | Web, Mobile & AI Development Packages",
    "Transparent pricing for custom web development, mobile apps, and AI automation. Choose a package that fits your needs. Remote-first, delivering worldwide."
  );

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 bg-grid-white bg-grid">
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
          <span className="text-sm font-bold tracking-tight text-foreground">Strategic Engagement</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 sm:px-6 sm:py-24 max-w-5xl">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h1 className="text-4xl font-heading font-normal tracking-tight text-foreground sm:text-5xl md:text-6xl mb-4">
            Engineering that <span className="text-muted-foreground italic">drives revenue.</span>
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto sm:text-lg text-balance">
            We don't sell code. We sell scalable business outcomes. Choose the strategic engine that aligns with your current growth bottleneck.
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
                className={`rounded-xl border p-6 flex flex-col shadow-sm ${pkg.popular ? "border-primary bg-card/60" : "border-white/5 bg-card/40 backdrop-blur-sm"}`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-2 rounded-lg border ${pkg.popular ? "bg-primary text-primary-foreground border-primary/50" : "border-white/10 bg-muted/50 text-foreground"}`}>
                    <pkg.icon size={18} />
                  </div>
                  <div>
                    <span className="font-bold text-base text-foreground block">{pkg.name}</span>
                  </div>
                </div>
                
                <div className="mb-6 pb-6 border-b border-white/5">
                  <p className="text-3xl font-bold tracking-tight text-foreground">{pkg.priceText}</p>
                </div>
                
                <ul className="space-y-3 mb-8 flex-1">
                  {pkg.bullets.map((b, bi) => (
                    <li key={bi} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className={`mt-0.5 font-bold ${pkg.popular ? 'text-primary' : 'text-foreground'}`}>•</span>
                      <span className="leading-snug">{b}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Monthly Plans ──────────────────────────────────────────── */}
        <section className="mb-24">
          <div className="mb-8 border-b border-border pb-4">
            <h2 className="text-2xl font-heading tracking-tight text-foreground">
              Continuous Growth & Tech Partnership
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Technology degrades without proactive attention. Ensure your engines never stop compounding.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                name: "AI Bot Optimization, API Limits, Hosting & Security",
                price: "$199/mo",
                items: ["Managed Cloud Infrastructure (Zero downtime)", "Monthly AI Prompt Tuning & Monitoring", "Proactive Security Patches & SSL", "Automated Daily Database Backups"],
                note: "Standard SLA",
              },
              {
                name: "Continuous Growth & Tech Partnership",
                price: "$699/mo",
                items: ["Everything in the Standard SLA", "15 hours of proactive monthly engineering", "Monthly strategy & analytics review with founders", "Priority Slack channel access (4hr response)"],
                note: "Priority SLA",
              },
            ].map((plan, i) => (
               <div key={i} className="rounded-xl border border-white/5 bg-card/40 backdrop-blur-sm shadow-sm p-6 sm:p-8 flex flex-col justify-between">
                 <div>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-3">{plan.note}</p>
                   <p className="text-xl font-bold text-foreground mb-4 pr-4 leading-tight">{plan.name}</p>
                   <p className="text-4xl font-bold tracking-tight text-foreground mb-8">{plan.price}</p>
                   <ul className="space-y-3.5 mt-auto">
                     {plan.items.map((item, ii) => (
                       <li key={ii} className="flex items-start gap-3 text-sm text-muted-foreground">
                         <span className="text-primary mt-0.5 font-bold">•</span>
                         <span className="leading-relaxed">{item}</span>
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
            className="rounded-xl border border-white/5 bg-surface-gradient p-10 sm:p-14 text-center shadow-lg backdrop-blur-sm"
          >
            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">
              Ready to architect your solution?
            </h2>
            <p className="text-base text-muted-foreground mb-10 max-w-lg mx-auto">
              Book a strategic consultation call. We will map out your operational bottlenecks and provide a fixed-rate engineering plan within 48 hours. No hourly billing traps.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:aurionstack@gmail.com"
                className="flex items-center justify-center gap-2 rounded-md bg-foreground px-8 py-3.5 text-sm font-semibold text-background transition-colors hover:bg-foreground/90 shadow-md"
              >
                <Mail size={16} />
                Email Founders
              </a>
              <a
                href="https://wa.me/919322720861"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-md border border-white/10 bg-transparent px-8 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
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
