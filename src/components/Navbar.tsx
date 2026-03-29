import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Rocket, Video, Bot, BriefcaseBusiness } from "lucide-react";
import GapTuberIcon from "@/components/icons/GapTuberIcon";
import { useLocation, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const products = [
  { label: "AuraIQ", href: "/auraiq", icon: Bot, desc: "24/7 AI Employees" },
  { label: "Visioscript", href: "/visioscript", icon: Video, desc: "AI Video Editing" },
  { label: "GapTuber", href: "/gaptuber", icon: GapTuberIcon, desc: "YouTube Gap Analysis" },
  { label: "BusinessZip", href: "/businesszip", icon: BriefcaseBusiness, desc: "Business Utilities" },
];

const mainLinks = [
  { label: "Services", href: "/services", type: "page" },
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
              <DropdownMenuContent align="start" className="w-[290px] p-2 mt-2 bg-background/95 backdrop-blur-xl border-border rounded-xl shadow-xl shadow-black/20">
                <div className="px-2 py-1.5 mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground/50">Live Products</div>
                {products.map((prod) => (
                  <DropdownMenuItem key={prod.label} className="p-0 mb-1 focus:bg-muted cursor-pointer rounded-lg overflow-hidden border border-transparent">
                    <a href={prod.href} className="flex p-2.5 items-center gap-3 w-full group">
                      <div className="p-2 rounded-md bg-muted text-foreground transition-all duration-200 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-105">
                        <prod.icon size={15} />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm text-foreground">{prod.label}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{prod.desc}</div>
                      </div>
                      <div className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
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
                className="rounded-md bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-transform hover:scale-105 shadow-sm animate-pulse-glow"
              >
                Hire Us
              </a>
            </div>
          </div>

          {/* Mobile Toggle & Sheet */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                className="text-foreground md:hidden p-1"
                aria-label="Open menu"
              >
                <Menu size={24} />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85vw] sm:w-[400px] p-0 flex flex-col border-r border-border bg-background">
              <div className="flex flex-col gap-1 px-6 py-8 overflow-y-auto flex-1">
                <a href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 mb-8">
                  <div className="h-10 w-10 rounded-full overflow-hidden border border-border bg-background flex-shrink-0">
                    <img src="/aurionstack-logo.webp" alt="Aurion Stack Logo" className="h-full w-full object-cover" width={44} height={44} fetchPriority="high" />
                  </div>
                  <span className="text-lg font-bold tracking-tight text-foreground">
                    Aurion Stack
                  </span>
                </a>

                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary mb-3">Live Products</p>
                <div className="flex flex-col gap-2.5 mb-5 rounded-xl border border-white/5 bg-gradient-to-b from-muted/30 to-transparent p-3">
                  {products.map((prod) => (
                    <a
                      key={prod.label}
                      href={prod.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 p-2.5 rounded-lg border border-transparent hover:border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="p-2 rounded-md bg-muted text-foreground flex-shrink-0">
                        <prod.icon size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold">{prod.label}</div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">{prod.desc}</div>
                      </div>
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/60 flex-shrink-0" />
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
              </div>

              {/* Thumb-Zone Fixed CTA */}
              <div className="p-6 border-t border-border bg-background mt-auto">
                <button
                  onClick={() => scrollTo("#contact")}
                  className="rounded-md bg-foreground px-5 py-4 text-center text-sm font-semibold text-background w-full shadow-lg transition-transform hover:scale-[1.02]"
                >
                  Hire Us
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
