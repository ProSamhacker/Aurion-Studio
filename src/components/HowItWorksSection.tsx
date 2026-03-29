import { motion } from "framer-motion";
import { Search, Cpu, Rocket, TrendingUp } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: Search,
    title: "Discovery",
    detail: "We map your workflow, identify the exact manual bottlenecks, and define what needs to be built — no bloat, no scope creep.",
  },
  {
    num: "02",
    icon: Cpu,
    title: "Build",
    detail: "We develop your SaaS product or automation system. You see working previews weekly — not a reveal at the end.",
  },
  {
    num: "03",
    icon: Rocket,
    title: "Launch",
    detail: "We deploy, test under real conditions, and hand over a system that's production-ready from day one.",
  },
  {
    num: "04",
    icon: TrendingUp,
    title: "Scale",
    detail: "As your business grows, we tune, expand, and keep the system performing. We're available after launch — not just during it.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="border-t border-border bg-background py-10 sm:py-12 px-4">
      <div className="container mx-auto max-w-5xl">

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">
            How It Works
          </span>
          <h2 className="text-xl sm:text-2xl font-heading font-normal tracking-tight text-foreground">
            What working with us actually looks like.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="relative flex flex-col rounded-xl border border-border bg-card p-5"
              >
                {/* Connector line on desktop */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-4 h-px bg-border z-10" />
                )}
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                    <Icon size={14} className="text-primary" />
                  </div>
                  <span className="text-[10px] font-bold tabular-nums text-muted-foreground/50 tracking-widest">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-foreground mb-1.5">{step.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.detail}</p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default HowItWorksSection;
