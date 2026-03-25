import { motion } from "framer-motion";

const webTech = [
  { name: "Next.js", icon: "▲" },
  { name: "React", icon: "⚛️" },
  { name: "TypeScript", icon: "🔷" },
  { name: "Node.js", icon: "🟢" },
  { name: "Python", icon: "🐍" },
  { name: "Tailwind CSS", icon: "🌊" },
  { name: "PostgreSQL", icon: "🐘" },
  { name: "Redis", icon: "⚡" },
];

const mobileTech = [
  { name: "React Native", icon: "📱" },
  { name: "Expo", icon: "🚀" },
  { name: "iOS", icon: "🍎" },
  { name: "Android", icon: "🤖" },
  { name: "Firebase", icon: "🔥" },
  { name: "Supabase", icon: "⚡" },
];

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.05, ease: "easeOut" },
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
    viewport={{ once: true, margin: "-40px" }}
    variants={badgeVariants}
    className="group flex flex-col items-center justify-center gap-3 rounded-lg border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:bg-muted"
  >
    <span className="text-2xl transition-transform duration-300 group-hover:scale-110">{icon}</span>
    <span className="text-xs font-semibold text-foreground text-center">{name}</span>
  </motion.div>
);

const TechStackSection = () => {
  return (
    <section id="tech-stack" className="relative border-t border-border bg-background py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl mb-4">
            Production-Grade <span className="text-muted-foreground">Stack</span>
          </h2>
          <p className="text-base text-muted-foreground sm:text-lg">
            We build exclusively with modern, battle-tested technologies to ensure extreme performance, scalable architecture, and developer velocity.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          
          {/* Web Dev */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col rounded-xl border border-border bg-card/50 p-6 sm:p-8"
          >
            <div className="mb-8 flex items-center justify-between">
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                Web & Backend Infrastructure
              </h3>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-foreground">
                🌐
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:grid-cols-4">
              {webTech.map((tech, i) => (
                <TechBadge key={tech.name} name={tech.name} icon={tech.icon} index={i} />
              ))}
            </div>
          </motion.div>

          {/* Mobile Dev */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col rounded-xl border border-border bg-card/50 p-6 sm:p-8"
          >
            <div className="mb-8 flex items-center justify-between">
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                Cross-Platform Mobile
              </h3>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-foreground">
                📱
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {mobileTech.map((tech, i) => (
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
