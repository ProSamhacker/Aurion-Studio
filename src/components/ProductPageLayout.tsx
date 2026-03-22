import React, { useEffect } from "react";
import { Check, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface ProductFeature {
  title: string;
  description: string;
  icon: React.ElementType;
}

interface ProductPricing {
  tier: string;
  price?: string;
  description?: string;
  features: string[];
  isPopular?: boolean;
}

export interface ProductPageLayoutProps {
  productName: string;
  heroHeadline: string;
  heroSubheadline: string;
  ctaText: string;
  ctaLink: string;
  features: ProductFeature[];
  pricing: ProductPricing[];
}

const ProductPageLayout: React.FC<ProductPageLayoutProps> = ({
  productName,
  heroHeadline,
  heroSubheadline,
  ctaText,
  ctaLink,
  features,
  pricing,
}) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col font-body">
      {/* 
        Minimal Subpage Header 
        We use a simple header for the product subpage so the focus is entirely on the product.
      */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md px-6 py-4 flex justify-center">
        <a href="/" className="font-heading text-lg font-bold tracking-tight text-foreground transition-opacity hover:opacity-80">
          Aurion <span className="text-teal">Stack</span>
        </a>
      </header>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-24 pb-20 lg:pt-32 lg:pb-28 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[400px] bg-teal/10 blur-[100px] rounded-full pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="z-10 max-w-4xl mx-auto"
        >
          <div className="inline-block px-3 py-1 mb-6 border border-teal/30 bg-teal/5 text-teal text-sm font-semibold rounded-full uppercase tracking-wider">
            {productName}
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6 text-balance">
            {heroHeadline}
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-balance">
            {heroSubheadline}
          </p>
          <a
            href={ctaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-teal text-white font-heading font-bold rounded-lg hover:scale-105 transition-transform shadow-teal-glow text-lg"
          >
            {ctaText}
            <ArrowRight size={20} />
          </a>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30 px-6 border-y border-border/40">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Core Features</h2>
            <p className="text-muted-foreground text-lg">Everything you need to scale effortlessly.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-card border border-border/50 p-6 rounded-2xl flex flex-col items-center text-center hover:border-teal/50 transition-colors"
              >
                <div className="w-14 h-14 rounded-full bg-teal/10 flex items-center justify-center text-teal mb-5">
                  <feature.icon size={28} />
                </div>
                <h3 className="font-heading text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-6 relative">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground text-lg">Choose the right plan, with no hidden fees.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricing.map((plan, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className={`relative flex flex-col p-8 rounded-3xl border ${
                  plan.isPopular 
                    ? "border-teal bg-card/80 shadow-teal-glow scale-100 md:scale-105 z-10" 
                    : "border-border/50 bg-card"
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-teal text-primary-foreground px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="font-heading text-2xl font-bold">{plan.tier}</h3>
                  {plan.price && (
                    <div className="flex items-baseline gap-1 mt-4">
                      <span className="text-4xl font-bold font-heading">{plan.price}</span>
                    </div>
                  )}
                  {plan.description && (
                    <p className="text-muted-foreground mt-2 text-sm">{plan.description}</p>
                  )}
                </div>

                <div className="flex-grow space-y-4 mb-8">
                  {plan.features.map((feat, fidx) => (
                    <div key={fidx} className="flex gap-3 items-start">
                      <div className="mt-1 flex-shrink-0 text-teal">
                        <Check size={18} />
                      </div>
                      <span className="text-sm">{feat}</span>
                    </div>
                  ))}
                </div>

                <a
                  href={ctaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-4 rounded-lg font-bold text-center transition-all ${
                    plan.isPopular
                      ? "bg-teal text-white hover:bg-teal-glow"
                      : "bg-secondary text-white hover:bg-secondary/80 border border-border"
                  }`}
                >
                  {ctaText}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-border/30 bg-background flex justify-center text-center">
        <p className="text-sm text-muted-foreground/80 font-medium">
          An Aurion Stack Product | Built with ❤️ in Goa, India
        </p>
      </footer>
    </div>
  );
};

export default ProductPageLayout;
