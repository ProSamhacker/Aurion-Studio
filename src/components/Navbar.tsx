import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Our Work", href: "#our-work" },
  { label: "Packages", href: "#packages" },
  { label: "Tech Stack", href: "#tech-stack" },
  { label: "Reviews", href: "#reviews" },
];

const sectionIds = navLinks.map((l) => l.href.slice(1));

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [scrollPct, setScrollPct] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  /* Scroll progress + navbar shadow on scroll */
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

  /* Active section via IntersectionObserver */
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  /* Smooth scroll with easing */
  const scrollTo = (href: string) => {
    setMobileOpen(false); // Close menu first to prevent layout shifts messing up the scroll calculation
    
    setTimeout(() => {
      const id = href.slice(1);
      const el = document.getElementById(id);
      if (!el) return;
      
      const y = el.getBoundingClientRect().top + window.scrollY - 80; // manual offset for the fixed navbar
      window.scrollTo({ top: y, behavior: "smooth" });
    }, 150);
  };

  return (
    <>
      {/* Scroll progress bar */}
      <div
        className="scroll-progress"
        style={{ "--scroll": scrollPct } as React.CSSProperties}
      />

      <nav
        className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${
          scrolled
            ? "border-border/60 bg-background/95 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
            : "border-transparent bg-background/60 backdrop-blur-md"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <a href="#" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-3">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden border-2 border-teal/40 shadow-teal-glow/30 flex-shrink-0 transition-transform hover:scale-105">
              <img src="/logo.png" alt="Aurion Stack Logo" className="h-full w-full object-cover" />
            </div>
            <span className="font-heading text-lg font-bold tracking-tight text-foreground sm:text-xl">
              Aurion <span className="text-teal">Stack</span>
            </span>
          </a>

          {/* Desktop Links */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.slice(1);
              return (
                <button
                  key={link.label}
                  onClick={() => scrollTo(link.href)}
                  className={`relative font-body text-sm font-medium transition-colors duration-200 ${
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                  {/* Active underline */}
                  <span
                    className={`absolute -bottom-1 left-0 h-[2px] w-full rounded-full bg-gradient-to-r from-teal-500 to-teal-300 transition-all duration-300 origin-left ${
                      isActive ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
                    }`}
                    style={{
                      background: "linear-gradient(90deg, hsl(190 76% 37%), hsl(190 80% 55%))",
                    }}
                  />
                </button>
              );
            })}
            <a
              href="#contact"
              className="geometric-clip-sm bg-gradient-orange px-5 py-2.5 font-heading text-sm font-bold text-accent-foreground transition-all hover:shadow-orange-glow hover:scale-105"
            >
              Hire Us
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            className="text-foreground md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
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
              <div className="flex flex-col gap-4 px-6 py-6">
                {navLinks.map((link) => {
                  const isActive = activeSection === link.href.slice(1);
                  return (
                    <button
                      key={link.label}
                      onClick={() => scrollTo(link.href)}
                      className={`text-left font-body text-sm transition-colors ${
                        isActive ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {isActive && (
                        <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-teal-400 align-middle" />
                      )}
                      {link.label}
                    </button>
                  );
                })}
                <a
                  href="#contact"
                  className="geometric-clip-sm bg-gradient-orange px-5 py-2.5 text-center font-heading text-sm font-bold text-accent-foreground"
                  onClick={() => setMobileOpen(false)}
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
