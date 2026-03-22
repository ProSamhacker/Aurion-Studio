import { motion } from "framer-motion";
import { Mail, MessageCircle } from "lucide-react";

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const WhatsappIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

const contacts = [
  {
    href: "https://wa.me/919322720861",
    label: "+91 93227 20861",
    Icon: WhatsappIcon,
    external: true,
  },
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
          <p className="mt-3 font-body text-sm text-muted-foreground sm:text-base sm:mt-4">
            Whether you need a high-performance web app, a cross-platform mobile application,
            or an AI-powered automation system — we'd love to hear about your project. Aurion Stack
            works with startups, small businesses, and growing brands to turn ideas into production-ready
            digital products.
          </p>
          <p className="mt-3 font-body text-sm text-muted-foreground sm:text-base">
            Drop us a message on WhatsApp for the fastest response, or reach out via email or Discord.
            We typically reply within 24 hours and offer a free 30-minute discovery call for new projects.
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
      <footer className="container mx-auto mt-16 border-t border-border px-4 pt-8 sm:mt-20 sm:px-6">
        <p className="text-center font-body text-xs text-muted-foreground">
          © 2026 Aurion Stack. All rights reserved. ·{" "}
          <a href="/services" className="hover:text-foreground transition-colors">Services</a>
          {" · "}
          <a href="/pricing" className="hover:text-foreground transition-colors">Pricing</a>
          {" · "}
          <a href="/insights" className="hover:text-foreground transition-colors">Insights</a>
        </p>
      </footer>
    </section>
  );
};

export default ContactSection;

