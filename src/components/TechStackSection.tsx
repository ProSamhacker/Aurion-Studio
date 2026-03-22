import { motion } from "framer-motion";
import { Bot, Youtube, Video, BriefcaseBusiness, ArrowRight } from "lucide-react";

const products = [
  {
    icon: Bot,
    name: "AuraIQ",
    tagline: "24/7 AI Employees for Local Businesses.",
    description: "Train a custom AI agent on your business data and let it handle customer queries, leads, and support — around the clock.",
    href: "/auraiq",
    color: "teal",
    badge: "AI Agent",
  },
  {
    icon: Youtube,
    name: "GapTuber",
    tagline: "Find Winning YouTube Content Gaps Instantly.",
    description: "AI-powered search analysis that reveals high-demand, low-competition video ideas so you can grow your channel faster.",
    href: "/gaptuber",
    color: "orange",
    badge: "YouTube Tool",
  },
  {
    icon: Video,
    name: "Visioscript",
    tagline: "AI Video Editing. From Script to Screen.",
    description: "Generate scripts, apply lifelike AI voices, and sync dynamic captions — all in minutes, not hours.",
    href: "/visioscript",
    color: "teal",
    badge: "Video AI",
  },
  {
    icon: BriefcaseBusiness,
    name: "BusinessZip",
    tagline: "All-in-One Business Utilities.",
    description: "Invoices, document automation, and expense tracking in a single, beautiful hub. Save hours every week.",
    href: "/businesszip",
    color: "orange",
    badge: "Productivity",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" },
  }),
};

const TechStackSection = () => {
  return (
    <section id="tech-stack" className="relative border-t border-border/60 bg-secondary/20 py-20 sm:py-28 overflow-hidden">
      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-teal/5 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-orange/5 blur-[100px]" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="inline-block font-body text-xs font-semibold uppercase tracking-widest text-orange mb-3">
            Our Products
          </span>
          <h2 className="font-heading text-3xl font-black text-foreground sm:text-5xl md:text-6xl text-balance">
            Premium <span className="text-gradient-orange">Tools</span> We Built
          </h2>
          <p className="mx-auto mt-3 max-w-xl font-body text-sm text-muted-foreground sm:text-base sm:mt-4">
            Beyond agency work — we ship our own products. Battle-tested SaaS tools that any business can deploy today.
          </p>
        </motion.div>

        {/* Product Cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:mt-16 lg:grid-cols-4">
          {products.map((prod, i) => {
            const Icon = prod.icon;
            const isTeal = prod.color === "teal";
            return (
              <motion.a
                key={prod.name}
                href={prod.href}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={cardVariants}
                className={`group flex flex-col rounded-2xl border bg-card/40 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 sm:p-7 ${
                  isTeal
                    ? "border-border/40 hover:border-teal/50 hover:shadow-teal-glow/40"
                    : "border-border/40 hover:border-orange/50 hover:shadow-orange-glow/40"
                }`}
              >
                {/* Badge + Icon */}
                <div className="mb-5 flex items-start justify-between gap-2">
                  <div
                    className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl ${
                      isTeal ? "bg-teal/10 text-teal" : "bg-orange/10 text-orange"
                    }`}
                  >
                    <Icon size={26} />
                  </div>
                  <span
                    className={`mt-1 rounded-full px-2.5 py-0.5 font-body text-[10px] font-bold uppercase tracking-wider ${
                      isTeal ? "bg-teal/10 text-teal" : "bg-orange/10 text-orange"
                    }`}
                  >
                    {prod.badge}
                  </span>
                </div>

                {/* Text */}
                <h3 className="font-heading text-xl font-bold text-foreground mb-2">{prod.name}</h3>
                <p className={`font-body text-sm font-semibold mb-3 ${isTeal ? "text-teal" : "text-orange"}`}>
                  {prod.tagline}
                </p>
                <p className="font-body text-sm leading-relaxed text-muted-foreground flex-grow">
                  {prod.description}
                </p>

                {/* CTA */}
                <div
                  className={`mt-6 flex items-center font-body text-sm font-semibold transition-colors ${
                    isTeal
                      ? "text-teal/70 group-hover:text-teal"
                      : "text-orange/70 group-hover:text-orange"
                  }`}
                >
                  Explore Tool
                  <ArrowRight size={15} className="ml-1.5 transition-transform group-hover:translate-x-1" />
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;
