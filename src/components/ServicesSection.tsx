import { motion } from "framer-motion";
import { Globe, Smartphone, Brain, Layers, ArrowRight } from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "Custom Web Experiences",
    description: "Lightning-fast, responsive websites and dynamic web apps. Built on React, Next.js, and TypeScript for speed, SEO, and scalability.",
    color: "teal",
  },
  {
    icon: Smartphone,
    title: "Cross-Platform Mobile Apps",
    description: "High-performance native and multiplatform applications for iOS and Android using React Native and Expo.",
    color: "orange",
  },
  {
    icon: Brain,
    title: "Intelligent AI Automation",
    description: "Streamline workflows, integrate smart chatbots, and optimise operations with GPT-4, Groq, and LangChain pipelines.",
    color: "teal",
  },
  {
    icon: Layers,
    title: "End-to-End Solutions",
    description: "Tailored software infrastructure — from database architecture to deployment on Vercel or GCP — designed to scale.",
    color: "orange",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" },
  }),
};

const ServicesSection = () => {
  return (
    <section id="services" className="relative border-t border-border/60 bg-background py-20 sm:py-28">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="inline-block font-body text-xs font-semibold uppercase tracking-widest text-teal mb-3">
            What We Do
          </span>
          <h2 className="font-heading text-3xl font-black text-foreground sm:text-5xl md:text-6xl text-balance">
            Our <span className="text-gradient-teal">Expertise</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl font-body text-sm text-muted-foreground sm:text-base sm:mt-4">
            We combine deep technical expertise with creative thinking to deliver solutions that move the needle — on time, every time.
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:mt-14 sm:gap-6 lg:grid-cols-4">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={cardVariants}
              className={`group geometric-clip border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 ${
                service.color === "teal"
                  ? "hover:border-teal hover:shadow-teal-glow"
                  : "hover:border-orange hover:shadow-orange-glow"
              } sm:p-8`}
            >
              <div
                className={`mb-4 flex h-11 w-11 items-center justify-center geometric-clip-sm ${
                  service.color === "teal" ? "bg-gradient-teal" : "bg-gradient-orange"
                } text-primary-foreground sm:mb-5 sm:h-12 sm:w-12`}
              >
                <service.icon size={20} />
              </div>
              <h3 className="font-heading text-base font-bold text-foreground sm:text-lg">
                {service.title}
              </h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-muted-foreground">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Link to full services page */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 text-center"
        >
          <a
            href="/services"
            className="group inline-flex items-center gap-2 font-body text-sm font-semibold text-teal hover:text-foreground transition-colors"
          >
            See all services & detailed scope
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
