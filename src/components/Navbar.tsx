import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ExternalLink } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const anchorLinks = [
  { label: "Services", href: "#services" },
  { label: "Our Work", href: "#our-work" },
  { label: "Packages", href: "#packages" },
  { label: "Reviews", href: "#reviews" },
];

const pageLinks = [
  { label: "All Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "Insights", href: "/insights" },
];

const sectionIds = anchorLinks.map((l) => l.href.slice(1));

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [scrollPct, setScrollPct] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const total = el.scrollHeight - el.clientHeight;
      setScrollPct(total > 0 ? (el.scrollTop / total) * 100 : 0);
      setScrolled(el.scrollTop > 20);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isHomePage) return;
    const observers: IntersectionObserver[] = [];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [isHomePage]);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    if (!isHomePage) {
      navigate("/");
      setTimeout(() => {
        const id = href.slice(1);
        const el = document.getElementById(id);
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
      }, 350);
      return;
    }
    setTimeout(() => {
      const id = href.slice(1);
      const el = document.getElementById(id);
      if (!el) return;
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
    }, 150);
  };

  return (
    <>
      {/* Skip to content — keyboard accessibility */}
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[999] focus:rounded focus:bg-teal focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-primary-foreground"
      >
        Skip to content
      </a>

      {/* Scroll progress bar */}
      <div className="scroll-progress" style={{ "--scroll": scrollPct } as React.CSSProperties} />

      <nav
        className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${
          scrolled
            ? "border-border/60 bg-background/95 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
            : "border-transparent bg-background/60 backdrop-blur-md"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3" aria-label="Aurion Stack home">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden border-2 border-teal/40 shadow-teal-glow/30 flex-shrink-0 transition-transform hover:scale-105">
              <img src="/aurionstack-logo.webp" alt="Aurion Stack Logo" className="h-full w-full object-cover" width={48} height={48} fetchPriority="high" />
            </div>
            <span className="font-heading text-lg font-bold tracking-tight text-foreground sm:text-xl">
              Aurion <span className="text-teal">Stack</span>
            </span>
          </a>

          {/* Desktop Links */}
          <div className="hidden items-center gap-5 md:flex">
            {anchorLinks.map((link) => {
              const isActive = isHomePage && activeSection === link.href.slice(1);
              return (
                <button
                  key={link.label}
                  onClick={() => scrollTo(link.href)}
                  className={`relative font-body text-sm font-medium transition-colors duration-200 ${
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-[2px] w-full rounded-full transition-all duration-300 origin-left ${
                      isActive ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
                    }`}
                    style={{ background: "linear-gradient(90deg, hsl(190 76% 37%), hsl(190 80% 55%))" }}
                  />
                </button>
              );
            })}

            <span className="h-4 w-px bg-border/60" />

            {pageLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className={`relative font-body text-sm font-medium transition-colors duration-200 ${
                    isActive ? "text-teal" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span
                      className="absolute -bottom-1 left-0 h-[2px] w-full rounded-full scale-x-100 opacity-100"
                      style={{ background: "linear-gradient(90deg, hsl(190 76% 37%), hsl(190 80% 55%))" }}
                    />
                  )}
                </a>
              );
            })}

            <a
              href="/#contact"
              className="geometric-clip-sm bg-gradient-orange px-5 py-2.5 font-heading text-sm font-bold text-accent-foreground transition-all hover:shadow-orange-glow hover:scale-105"
            >
              Hire Us
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            className="text-foreground md:hidden p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden border-t border-border/50 bg-background/95 backdrop-blur-xl md:hidden"
            >
              <div className="flex flex-col gap-1 px-6 py-5">
                <p className="font-body text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-1">Sections</p>
                {anchorLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => scrollTo(link.href)}
                    className="text-left font-body text-sm py-2.5 text-muted-foreground hover:text-foreground transition-colors border-b border-border/20 last:border-0"
                  >
                    {link.label}
                  </button>
                ))}

                <div className="my-3 h-px w-full bg-border/50" />

                <p className="font-body text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-1">Pages</p>
                {pageLinks.map((link) => {
                  const isActive = location.pathname === link.href;
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between py-2.5 font-body text-sm transition-colors border-b border-border/20 last:border-0 ${
                        isActive ? "text-teal font-semibold" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {link.label}
                      <ExternalLink size={12} className="opacity-40" />
                    </a>
                  );
                })}

                <a
                  href="/#contact"
                  onClick={() => setMobileOpen(false)}
                  className="mt-4 geometric-clip-sm bg-gradient-orange px-5 py-3 text-center font-heading text-sm font-bold text-accent-foreground"
                >
                  Hire Us
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;
