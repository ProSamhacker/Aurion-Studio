import { motion } from "framer-motion";

const projects = [
  {
    title: "Thick to Ripped",
    image: "/project-thicktoripped.png",
    tags: ["Web App", "Restaurant", "Fitness"],
    description: "High-protein meals & macro-friendly nutrition platform for fitness enthusiasts in Goa.",
    featured: true,
  },
  {
    title: "HHS Bloom",
    image: "/project-hhsbloom.png",
    tags: ["Web App", "Florist", "E-Commerce"],
    description: "Premium florist website for Mapusa's finest bloom delivery service.",
    featured: false,
  },
  {
    title: "KleanBee",
    image: "/project-kleanbee.png",
    tags: ["Web App", "Cleaning", "Booking"],
    description: "Professional cleaning service platform with online booking for Goa homes & offices.",
    featured: false,
  },
];

const PortfolioSection = () => {
  return (
    <section id="our-work" className="relative border-t border-border/60 bg-secondary/20 py-20 sm:py-28">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-5xl md:text-6xl">
            Featured <span className="text-gradient-orange">Projects</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl font-body text-sm text-muted-foreground sm:text-base sm:mt-4">
            A selection of our recent work across web and mobile platforms.
          </p>
        </div>

        {/* Mobile: single column stack. Desktop: bento grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-16 sm:gap-8 lg:grid-cols-2">
          {projects.map((project, i) => (
            <div
              key={project.title}
              className={`group overflow-hidden rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm transition-all duration-300 hover:border-orange/50 hover:shadow-orange-glow ${
                i === 0 ? "lg:col-span-2" : ""
              }`}
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className={`w-full object-cover object-top transition-transform duration-500 group-hover:scale-105 ${
                    project.featured ? "h-52 sm:h-72" : "h-48 sm:h-56"
                  }`}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
              </div>

              {/* Info */}
              <div className="p-4 sm:p-6">
                <h3 className="font-heading text-base font-bold text-foreground sm:text-lg">
                  {project.title}
                </h3>
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
