import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Rocket, Video, Bot, Youtube, BriefcaseBusiness } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const products = [
  { label: "AuraIQ", href: "/auraiq", icon: Bot, desc: "24/7 AI Employees" },
  { label: "Visioscript", href: "/visioscript", icon: Video, desc: "AI Video Editing" },
  { label: "GapTuber", href: "/gaptuber", icon: Youtube, desc: "YouTube Gap Analysis" },
  { label: "BusinessZip", href: "/businesszip", icon: BriefcaseBusiness, desc: "Business Utilities" },
];

const mainLinks = [
  { label: "Services", href: "/services", type: "page" },
  { label: "Case Studies", href: "#our-work", type: "anchor" },
  { label: "Pricing", href: "/pricing", type: "page" },
  { label: "Insights", href: "/insights", type: "page" },
];

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
    ["our-work", "contact"].forEach((id) => {
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
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[999] focus:rounded focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-primary-foreground"
      >
        Skip to content
      </a>

      <div className="scroll-progress" style={{ "--scroll": scrollPct } as React.CSSProperties} />

      <nav
        className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${
          scrolled
            ? "border-border/60 bg-background/80 backdrop-blur-xl shadow-sm"
            : "border-transparent bg-background/40 backdrop-blur-md"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-3" aria-label="Aurion Stack home">
            <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-full overflow-hidden border border-border bg-background flex-shrink-0 transition-transform hover:scale-105">
              <img src="/aurionstack-logo.webp" alt="Aurion Stack Logo" className="h-full w-full object-cover" width={44} height={44} fetchPriority="high" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
              Aurion Stack
            </span>
          </a>

          {/* Desktop Links */}
          <div className="hidden items-center gap-8 md:flex">
            {/* Products Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="group flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground outline-none">
                <Rocket size={16} className="text-primary transition-colors group-hover:text-primary/80" />
                Products
                <ChevronDown size={14} className="opacity-60 transition-transform group-data-[state=open]:rotate-180" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[280px] p-2 mt-2 bg-background/95 backdrop-blur-xl border-border rounded-xl shadow-xl shadow-black/20">
                <div className="px-2 py-1.5 mb-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">Proprietary Software</div>
                {products.map((prod) => (
                  <DropdownMenuItem key={prod.label} className="p-0 mb-1 focus:bg-muted cursor-pointer rounded-lg overflow-hidden border border-transparent">
                    <a href={prod.href} className="flex p-2.5 items-start gap-3 w-full group">
                      <div className="p-2 rounded-md bg-muted text-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <prod.icon size={16} />
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-foreground">{prod.label}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{prod.desc}</div>
                      </div>
                    </a>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <span className="h-4 w-px bg-border group-hover:bg-muted-foreground transition-colors" />

            {/* Standard Links */}
            {mainLinks.map((link) => {
              const isAnchor = link.type === "anchor";
              const isActive = isAnchor
                ? isHomePage && activeSection === link.href.slice(1)
                : location.pathname === link.href;

              return isAnchor ? (
                <button
                  key={link.label}
                  onClick={() => scrollTo(link.href)}
                  className={`relative text-sm font-medium transition-colors duration-200 ${
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-[2px] w-full rounded-full transition-all duration-300 origin-left bg-foreground ${
                      isActive ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
                    }`}
                  />
                </button>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className={`relative text-sm font-medium transition-colors duration-200 ${
                    isActive ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span
                      className="absolute -bottom-1 left-0 h-[2px] w-full rounded-full scale-x-100 opacity-100 bg-foreground"
                    />
                  )}
                </a>
              );
            })}

            <div className="ml-2 flex items-center">
              <a
                href="/#contact"
                onClick={() => scrollTo("#contact")}
                className="rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-transform hover:scale-105 shadow-sm"
              >
                Hire Us
              </a>
            </div>
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
              className="overflow-hidden border-t border-border bg-background/95 backdrop-blur-xl md:hidden"
            >
              <div className="flex flex-col gap-1 px-6 py-5 overflow-y-auto max-h-[85vh]">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-primary mb-3">Our Products</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                  {products.map((prod) => (
                    <a
                      key={prod.label}
                      href={prod.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted transition-colors"
                    >
                      <div className="p-2 rounded-md bg-muted text-foreground">
                        <prod.icon size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{prod.label}</div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">{prod.desc}</div>
                      </div>
                    </a>
                  ))}
                </div>

                <div className="my-2 h-px w-full bg-border" />

                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3 mt-3">Navigation</p>
                {mainLinks.map((link) => {
                  const isAnchor = link.type === "anchor";
                  const isActive = isAnchor
                    ? isHomePage && activeSection === link.href.slice(1)
                    : location.pathname === link.href;

                  return isAnchor ? (
                    <button
                      key={link.label}
                      onClick={() => scrollTo(link.href)}
                      className={`text-left text-sm py-4 transition-colors border-b border-border/40 last:border-0 ${
                        isActive ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {link.label}
                    </button>
                  ) : (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`text-sm py-4 transition-colors border-b border-border/40 last:border-0 ${
                        isActive ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {link.label}
                    </a>
                  );
                })}

                <button
                  onClick={() => scrollTo("#contact")}
                  className="mt-8 rounded-md bg-foreground px-5 py-4 text-center text-sm font-semibold text-background w-full shadow-lg"
                >
                  Hire Us
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;
