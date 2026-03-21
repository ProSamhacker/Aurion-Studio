import { motion } from "framer-motion";
import { Globe, Smartphone, Brain, Layers } from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "Custom Web Experiences",
    description: "Lightning-fast, responsive websites and dynamic web apps built on the latest frameworks.",
  },
  {
    icon: Smartphone,
    title: "Cross-Platform Mobile Apps",
    description: "High-performance native and multiplatform applications for iOS and Android.",
  },
  {
    icon: Brain,
    title: "Intelligent AI Automation",
    description: "Streamline workflows, integrate smart chatbots, and optimize operations with AI.",
  },
  {
    icon: Layers,
    title: "End-to-End Solutions",
    description: "Tailored software infrastructure designed to scale with your business.",
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="relative border-t border-border/60 bg-background py-20 sm:py-28">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-5xl md:text-6xl">
            Our <span className="text-gradient-teal">Expertise</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl font-body text-sm text-muted-foreground sm:text-base sm:mt-4">
            We combine deep technical expertise with creative thinking to deliver solutions that move the needle.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:mt-16 sm:gap-6 lg:grid-cols-4">
          {services.map((service, i) => (
            <div
              key={service.title}
              className="group geometric-clip border border-border bg-card p-6 transition-all duration-300 hover:border-teal hover:shadow-teal-glow sm:p-8"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center bg-gradient-teal geometric-clip-sm text-primary-foreground sm:mb-5 sm:h-12 sm:w-12">
                <service.icon size={20} />
              </div>
              <h3 className="font-heading text-base font-bold text-foreground sm:text-lg">
                {service.title}
              </h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-muted-foreground">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
