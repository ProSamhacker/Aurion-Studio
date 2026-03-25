import { motion } from "framer-motion";
import { Bot, Youtube, Video, BriefcaseBusiness, ArrowRight } from "lucide-react";

const products = [
  {
    icon: Bot,
    name: "AuraIQ",
    tagline: "24/7 AI Employees for Local Businesses.",
    description: "Train a custom AI agent on your business data and let it handle customer queries, leads, and support — around the clock.",
    href: "/auraiq",
    badge: "AI Agent",
  },
  {
    icon: Youtube,
    name: "GapTuber",
    tagline: "Find Winning Content Gaps Instantly.",
    description: "AI-powered search analysis that reveals high-demand, low-competition video ideas so you can grow your channel faster.",
    href: "/gaptuber",
    badge: "YouTube Tool",
  },
  {
    icon: Video,
    name: "Visioscript",
    tagline: "AI Video Editing. From Script to Screen.",
    description: "Generate scripts, apply lifelike AI voices, and sync dynamic captions — all in minutes, not hours.",
    href: "/visioscript",
    badge: "Video AI",
  },
  {
    icon: BriefcaseBusiness,
    name: "BusinessZip",
    tagline: "All-in-One Business Utilities.",
    description: "Invoices, document automation, and tracking in a single, beautiful hub. Save hours every week.",
    href: "/businesszip",
    badge: "Productivity",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.1, ease: "easeOut" },
  }),
};

const ProductsSection = () => {
  return (
    <section id="products" className="relative border-t border-border bg-muted/20 py-24 sm:py-32 overflow-hidden">
      <div className="container relative mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            Our Products
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl text-balance">
            Proprietary <span className="text-muted-foreground">Software</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
            We don't just build client apps — we engineer scalable AI-powered products used by businesses worldwide.
          </p>
        </motion.div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((prod, i) => {
            const Icon = prod.icon;
            return (
              <motion.a
                key={prod.name}
                href={prod.href}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={cardVariants}
                className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg sm:p-7"
              >
                {/* Badge + Icon */}
                <div className="mb-6 flex items-start justify-between gap-2">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-muted text-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon size={24} />
                  </div>
                  <span className="rounded-md bg-muted px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground">
                    {prod.badge}
                  </span>
                </div>

                {/* Text */}
                <h3 className="text-xl font-bold tracking-tight text-foreground mb-2">{prod.name}</h3>
                <p className="text-sm font-semibold text-primary mb-3">
                  {prod.tagline}
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground flex-grow">
                  {prod.description}
                </p>

                {/* CTA */}
                <div className="mt-6 flex items-center text-sm font-semibold text-primary/80 transition-colors group-hover:text-primary">
                  Explore MVP
                  <ArrowRight size={16} className="ml-1.5 transition-transform group-hover:translate-x-1" />
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
