import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const projects = [
  {
    title: "Thick to Ripped",
    url: "https://thick-to-ripped.vercel.app",
    image: "/project-thicktoripped.webp",
    tags: ["Web App", "Fitness Platform", "E-Commerce"],
    description: "High-performance nutrition & coaching platform for a global fitness brand.",
    featured: true,
  },
  {
    title: "HHS Bloom",
    url: "https://hhs-flower.vercel.app",
    image: "/project-hhsbloom.webp",
    tags: ["Headless CMS", "Luxury Retail", "Stripe"],
    description: "Premium digital storefront and subscription engine for luxury floristry.",
    featured: false,
  },
  {
    title: "KleanBee",
    url: "https://goa-clean-bee.vercel.app",
    image: "/kleanbee-cleaning-project.webp",
    tags: ["Booking Engine", "Marketplace", "Logistics"],
    description: "Multi-tenant booking platform for urban cleaning and facility management.",
    featured: false,
  },
];

const PortfolioSection = () => {
  return (
    <section id="our-work" className="relative border-t border-border bg-background py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl text-left"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl text-balance mb-4">
            Recent <span className="text-muted-foreground">Engineering</span>
          </h2>
          <p className="text-base text-muted-foreground sm:text-lg">
            A selection of recent production deployments across SaaS, E-Commerce, and Internal Tooling. Built for speed and scale.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
          {projects.map((project, i) => (
            <motion.a
              key={project.title}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:-translate-y-1 ${
                project.featured ? "lg:col-span-2 lg:flex-row" : ""
              }`}
            >
              {/* Image */}
              <div className={`relative overflow-hidden ${project.featured ? "lg:w-3/5" : "w-full"}`}>
                <img
                  src={project.image}
                  alt={`${project.title} — Aurion Stack project`}
                  className={`w-full object-cover object-top transition-transform duration-700 group-hover:scale-105 ${
                    project.featured ? "h-64 sm:h-80 lg:h-full lg:min-h-[400px]" : "h-56 sm:h-64"
                  }`}
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Info */}
              <div className={`flex flex-col justify-center p-6 sm:p-8 ${project.featured ? "lg:w-2/5" : ""}`}>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                    {project.title}
                  </h3>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <ExternalLink size={14} />
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground leading-relaxed sm:text-base mb-6">
                  {project.description}
                </p>
                
                <div className="mt-auto flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
