import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const builds = [
  { 
    num: "01", 
    label: "AI-Powered SaaS", 
    detail: "Full-stack SaaS applications built to generate revenue. From authentication to AI integration and payment infrastructure — we handle everything from scratch to launch." 
  },
  { 
    num: "02", 
    label: "Custom AI Agents", 
    detail: "Intelligent systems trained on your company's data. We build sales dispatchers, customer support bots, and internal workflow assistants that operate 24/7." 
  },
  { 
    num: "03", 
    label: "Internal Dashboards", 
    detail: "Stop running your business on spreadsheets. We build secure, real-time admin panels and operational hubs tailored precisely to your team's workflow." 
  },
  { 
    num: "04", 
    label: "API & Backend Systems", 
    detail: "The invisible plumbing that makes automation work. We engineer custom APIs, webhooks, and complex database architectures that scale without breaking." 
  },
];

const WhatWeBuildSection = () => {
  return (
    <section className="bg-background py-16 sm:py-24 px-4 border-t border-white/5">
      <div className="container mx-auto max-w-4xl">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 sm:mb-16 md:text-center"
        >
          <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-3">
            Our Capability
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-normal tracking-tight text-foreground">
            What we actually build.
          </h2>
        </motion.div>

        {/* Premium List */}
        <div className="flex flex-col border-t border-white/10">
          {builds.map((item, i) => (
            <motion.div
              key={item.num}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="group flex flex-col sm:flex-row sm:items-baseline gap-4 sm:gap-8 border-b border-white/10 py-6 sm:py-8 hover:bg-white/[0.02] transition-colors duration-500"
            >
              <div className="flex items-center gap-4 sm:w-1/3 flex-shrink-0">
                <span className="text-xs font-mono text-muted-foreground/50 sm:pl-4">
                  {item.num}
                </span>
                <h3 className="text-lg sm:text-xl font-medium text-foreground tracking-tight">
                  {item.label}
                </h3>
              </div>
              
              <div className="flex-grow sm:pr-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground/80 leading-relaxed max-w-md">
                  {item.detail}
                </p>
                <div className="hidden sm:flex h-8 w-8 rounded-full border border-white/10 items-center justify-center opacity-0 -translate-x-4 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                  <ArrowRight size={14} className="text-primary" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhatWeBuildSection;
