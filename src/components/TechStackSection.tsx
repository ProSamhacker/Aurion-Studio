import { motion } from "framer-motion";
import { Smartphone, Globe } from "lucide-react";

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

interface TechBadgeProps {
  name: string;
  icon: string;
  delay: number;
}

const TechBadge = ({ name, icon, delay }: TechBadgeProps) => (
  <div
    className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-border/40 bg-card/40 p-3 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal/50 hover:bg-card hover:shadow-teal-glow sm:gap-3 sm:p-4"
  >
    <div className="text-muted-foreground transition-colors duration-300 group-hover:text-teal sm:scale-110">
      {icon}
    </div>
    <span className="font-body text-xs font-medium text-foreground sm:text-sm">
      {name}
    </span>
  </div>
);

const TechStackSection = () => {
  return (
    <section id="tech-stack" className="relative border-t border-border/60 bg-secondary/20 py-20 sm:py-28">
      <div className="container mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-5xl md:text-6xl">
            Our <span className="text-gradient-teal">Tech Stack</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl font-body text-sm text-muted-foreground sm:text-base sm:mt-4">
            We build with the most powerful, modern technologies to ensure performance, scalability, and security.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-16 sm:gap-8 md:grid-cols-2">

          {/* Mobile Dev Column */}
          <div className="flex flex-col rounded-2xl border border-border/30 bg-background/50 p-6 sm:p-8">
            <h3 className="mb-6 flex items-center gap-3 font-heading text-xl font-bold text-foreground sm:text-2xl">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal/10 text-teal">
                💻
              </span>
              Mobile Development
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mobileTech.map((tech, i) => (
                <TechBadge key={tech.name} {...tech} delay={i * 0.05} />
              ))}
            </div>
          </div>

          {/* Web Dev Column */}
          <div className="flex flex-col rounded-2xl border border-border/30 bg-background/50 p-6 sm:p-8">
            <h3 className="mb-6 flex items-center gap-3 font-heading text-xl font-bold text-foreground sm:text-2xl">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange/10 text-orange">
                🌐
              </span>
              Web Development
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {webTech.map((tech, i) => (
                <TechBadge key={tech.name} name={tech.name} icon={tech.icon} delay={i * 0.06} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TechStackSection;
