import { motion } from "framer-motion";
import { Mail, MessageCircle } from "lucide-react";

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const contacts = [
  {
    href: "mailto:aurionstack@gmail.com",
    label: "aurionstack@gmail.com",
    Icon: Mail,
    external: false,
  },
  {
    href: "https://discord.com/users/1222025472142217257",
    label: "Discord",
    Icon: MessageCircle,
    external: true,
  },
  {
    href: "https://instagram.com/aurionstack",
    label: "@aurionstack",
    Icon: InstagramIcon,
    external: true,
  },
];

const ContactSection = () => {
  return (
    <section id="contact" className="relative border-t border-border/60 bg-secondary/30 py-20 sm:py-28">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-5xl md:text-6xl">
            Let's Build Something{" "}
            <span className="text-gradient-teal">Great</span>
          </h2>
          <p className="mt-3 font-body text-sm text-muted-foreground sm:text-lg sm:mt-4">
            Ready to scale your tech? Reach out to us directly.
          </p>

          {/* Contact links — stacked on mobile, row on sm+ */}
          <div className="mt-10 flex flex-col items-center gap-4 sm:mt-12 sm:flex-row sm:justify-center sm:gap-6">
            {contacts.map(({ href, label, Icon, external }) => (
              <a
                key={label}
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-card px-5 py-4 font-body text-sm text-foreground transition-all hover:border-teal hover:text-teal hover:shadow-teal-glow sm:w-auto sm:justify-start sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:hover:shadow-none"
              >
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center bg-gradient-teal geometric-clip-sm text-primary-foreground sm:h-10 sm:w-10">
                  <Icon />
                </div>
                <span className="truncate">{label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="container mx-auto mt-16 border-t border-border px-4 pt-8 sm:mt-20 sm:px-6">
        <p className="text-center font-body text-xs text-muted-foreground">
          © 2026 Aurion Stack. All rights reserved.
        </p>
      </div>
    </section>
  );
};

export default ContactSection;
