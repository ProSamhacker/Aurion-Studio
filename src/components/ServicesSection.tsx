import { motion } from "framer-motion";
import { Globe, Smartphone, Brain, Layers, ArrowRight } from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "Custom Web Experiences",
    description: "Lightning-fast, responsive websites and dynamic web apps. Built on React, Next.js, and TypeScript for speed, SEO, and scalability.",
  },
  {
    icon: Smartphone,
    title: "Cross-Platform Mobile Apps",
    description: "High-performance native and multiplatform applications for iOS and Android using React Native SDKs.",
  },
  {
    icon: Brain,
    title: "Intelligent AI Automation",
    description: "Streamline workflows, integrate smart agents, and optimise data pipelines with LLMs and RAG architectures.",
  },
  {
    icon: Layers,
    title: "Cloud Infrastructure",
    description: "Tailored software infrastructure — from database architecture to deployment on AWS/Vercel — designed to scale.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" },
  }),
};

const ServicesSection = () => {
  return (
    <section id="services" className="relative border-t border-border bg-background py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6">
        
        {/* Header Content */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl text-left"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl text-balance mb-4">
              Core <span className="text-muted-foreground">Capabilities</span>
            </h2>
            <p className="text-base text-muted-foreground sm:text-lg">
              We combine deep technical expertise with efficient system design to deliver high-performance digital products — on time, every time.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden md:block"
          >
            <a
              href="/services"
              className="group inline-flex items-center justify-center gap-2 rounded-md bg-muted px-6 py-3 text-sm font-semibold text-foreground transition-all hover:bg-muted/80"
            >
              See all services
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </a>
          </motion.div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={cardVariants}
              className="group flex flex-col rounded-xl border border-border bg-card p-6 sm:p-8 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <service.icon size={24} />
              </div>
              
              <h3 className="text-lg font-bold tracking-tight text-foreground mb-3">
                {service.title}
              </h3>
              
              <p className="text-sm leading-relaxed text-muted-foreground">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Mobile Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 md:hidden"
        >
          <a
            href="/services"
            className="group flex w-full items-center justify-center gap-2 rounded-md bg-muted px-6 py-4 text-sm font-semibold text-foreground transition-all hover:bg-muted/80"
          >
            See all services
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>
        
      </div>
    </section>
  );
};

export default ServicesSection;
