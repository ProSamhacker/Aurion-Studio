import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const projects = [
  {
    title: "Thick to Ripped",
    url: "https://thick-to-ripped.vercel.app",
    image: "/project-thicktoripped.webp",
    tags: ["Web App", "Restaurant", "Fitness"],
    description: "High-protein meals & macro-friendly nutrition platform for fitness enthusiasts in Goa.",
    featured: true,
  },
  {
    title: "HHS Bloom",
    url: "https://hhs-flower.vercel.app",
    image: "/project-hhsbloom.webp",
    tags: ["Web App", "Florist", "E-Commerce"],
    description: "Premium florist website for Mapusa's finest bloom delivery service.",
    featured: false,
  },
  {
    title: "KleanBee",
    url: "https://goa-clean-bee.vercel.app",
    image: "/kleanbee-cleaning-project.webp",
    tags: ["Web App", "Cleaning", "Booking"],
    description: "Professional cleaning service platform with online booking for Goa homes & offices.",
    featured: false,
  },
];

const PortfolioSection = () => {
  return (
    <section id="our-work" className="relative border-t border-border/60 bg-secondary/20 py-20 sm:py-28">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="inline-block font-body text-xs font-semibold uppercase tracking-widest text-orange mb-3">
            Our Work
          </span>
          <h2 className="font-heading text-3xl font-black text-foreground sm:text-5xl md:text-6xl text-balance">
            Featured <span className="text-gradient-orange">Projects</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl font-body text-sm text-muted-foreground sm:text-base sm:mt-4">
            A selection of recent work across web and mobile platforms — each built for speed, SEO, and real-world results.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-16 sm:gap-8 lg:grid-cols-2">
          {projects.map((project, i) => (
            <motion.a
              key={project.title}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`group block overflow-hidden rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm transition-all duration-300 hover:border-orange/50 hover:shadow-orange-glow hover:-translate-y-1 ${
                i === 0 ? "lg:col-span-2" : ""
              }`}
            >
              {/* Image + hover overlay */}
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={`${project.title} — Aurion Stack project`}
                  className={`w-full object-cover object-top transition-transform duration-500 group-hover:scale-105 ${
                    project.featured ? "h-52 sm:h-72" : "h-48 sm:h-56"
                  }`}
                  loading="lazy"
                  decoding="async"
                  width={800}
                  height={project.featured ? 288 : 224}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />

                {/* Hover CTA overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
                  <span className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 font-heading text-sm font-bold text-white backdrop-blur-sm">
                    View Live <ExternalLink size={14} />
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-heading text-base font-bold text-foreground sm:text-lg">
                    {project.title}
                  </h3>
                  <ExternalLink
                    size={14}
                    className="mt-1 flex-shrink-0 text-muted-foreground/40 transition-colors group-hover:text-orange"
                  />
                </div>
                <p className="mt-1 font-body text-xs text-muted-foreground leading-relaxed sm:text-sm sm:mt-1.5">
                  {project.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5 sm:gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="geometric-clip-sm bg-secondary px-2.5 py-1 font-body text-xs text-muted-foreground"
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
