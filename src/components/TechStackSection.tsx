import { motion } from "framer-motion";

const mobileTech = [
  { name: "Android", icon: "🤖" },
  { name: "Kotlin", icon: "🎯" },
  { name: "KMP", icon: "🔀" },
  { name: "iOS / Swift", icon: "🍎" },
  { name: "Jetpack Compose", icon: "🎨" },
  { name: "Ktor", icon: "⚡" },
];

const webTech = [
  { name: "Next.js", icon: "▲" },
  { name: "React", icon: "⚛️" },
  { name: "Node.js", icon: "🟢" },
  { name: "TypeScript", icon: "🔷" },
  { name: "Tailwind CSS", icon: "🌊" },
  { name: "PostgreSQL", icon: "🐘" },
  { name: "Neon DB", icon: "💡" },
  { name: "REST APIs", icon: "🔗" },
];

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, delay: i * 0.06, ease: "easeOut" },
  }),
};

interface TechBadgeProps {
  name: string;
  icon: string;
  index: number;
}

const TechBadge = ({ name, icon, index }: TechBadgeProps) => (
  <motion.div
    custom={index}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-30px" }}
    variants={badgeVariants}
    className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-border/40 bg-card/40 p-3 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal/50 hover:bg-card hover:shadow-teal-glow sm:gap-3 sm:p-4"
  >
    <span className="text-xl transition-transform duration-300 group-hover:scale-110">{icon}</span>
    <span className="font-body text-xs font-medium text-foreground sm:text-sm">{name}</span>
  </motion.div>
);

const TechStackSection = () => {
  return (
    <section id="tech-stack" className="relative border-t border-border/60 bg-secondary/20 py-20 sm:py-28">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="inline-block font-body text-xs font-semibold uppercase tracking-widest text-teal mb-3">
            Built With
          </span>
          <h2 className="font-heading text-3xl font-black text-foreground sm:text-5xl md:text-6xl text-balance">
            Our <span className="text-gradient-teal">Tech Stack</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl font-body text-sm text-muted-foreground sm:text-base sm:mt-4">
            We build with the most powerful, modern technologies to ensure performance, scalability, and long-term maintainability.
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-14 sm:gap-8 md:grid-cols-2">
          {/* Mobile Dev */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col rounded-2xl border border-border/30 bg-background/50 p-6 sm:p-8"
          >
            <h3 className="mb-6 flex items-center gap-3 font-heading text-xl font-bold text-foreground sm:text-2xl">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal/10 text-xl text-teal">
                💻
              </span>
              Mobile Development
            </h3>
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {mobileTech.map((tech, i) => (
                <TechBadge key={tech.name} name={tech.name} icon={tech.icon} index={i} />
              ))}
            </div>
          </motion.div>

          {/* Web Dev */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col rounded-2xl border border-border/30 bg-background/50 p-6 sm:p-8"
          >
            <h3 className="mb-6 flex items-center gap-3 font-heading text-xl font-bold text-foreground sm:text-2xl">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange/10 text-xl">
                🌐
              </span>
              Web Development
            </h3>
            <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:grid-cols-4">
              {webTech.map((tech, i) => (
                <TechBadge key={tech.name} name={tech.name} icon={tech.icon} index={i} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;
