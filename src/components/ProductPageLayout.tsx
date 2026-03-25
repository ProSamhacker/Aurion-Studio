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
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary/30">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl px-6 py-4 flex justify-between items-center">
        <a href="/" className="text-lg font-bold tracking-tight text-foreground transition-opacity hover:opacity-80">
          Aurion Stack
        </a>
        <a href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          Back to Studio
        </a>
      </header>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center px-4 pt-24 pb-20 lg:pt-32 lg:pb-32 overflow-hidden border-b border-border">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="z-10 max-w-4xl mx-auto"
        >
          <div className="inline-block px-3 py-1 mb-6 border border-border bg-muted/50 text-foreground text-xs font-bold rounded-full uppercase tracking-widest">
            {productName}
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tighter mb-6 text-balance text-foreground">
            {heroHeadline}
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-balance">
            {heroSubheadline}
          </p>
          <a
            href={ctaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-foreground text-background font-semibold rounded-md hover:bg-foreground/90 transition-colors shadow-lg shadow-black/10 text-lg"
          >
            {ctaText}
            <ArrowRight size={20} />
          </a>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-muted/20 border-b border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">Core Architecture</h2>
            <p className="text-muted-foreground text-lg">Scalable infrastructure built for performance.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-card border border-border p-8 rounded-xl flex flex-col hover:border-primary/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-foreground mb-6">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-foreground mb-3">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-4 relative bg-background">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">Transparent Pricing</h2>
            <p className="text-muted-foreground text-lg">Choose the tier that fits your scale.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricing.map((plan, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className={`relative flex flex-col p-8 rounded-xl border bg-card ${
                  plan.isPopular 
                    ? "border-primary shadow-lg md:-translate-y-2" 
                    : "border-border hover:border-border/80"
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                    Most Popular
                  </div>
                )}
                
                <div className="mb-8">
                  <h3 className="text-2xl font-bold tracking-tight text-foreground">{plan.tier}</h3>
                  {plan.price && (
                    <div className="mt-4">
                      <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                    </div>
                  )}
                  {plan.description && (
                    <p className="text-muted-foreground mt-3 text-sm">{plan.description}</p>
                  )}
                </div>

                <div className="flex-grow space-y-4 mb-8">
                  {plan.features.map((feat, fidx) => (
                    <div key={fidx} className="flex gap-3 items-start">
                      <div className="mt-0.5 flex-shrink-0 text-primary">
                        <Check size={16} />
                      </div>
                      <span className="text-sm text-foreground leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>

                <a
                  href={ctaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3.5 rounded-md font-semibold text-sm text-center transition-colors ${
                    plan.isPopular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-muted text-foreground hover:bg-muted/80"
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
      <footer className="mt-auto py-8 border-t border-border bg-background flex justify-center text-center">
        <p className="text-xs text-muted-foreground font-medium">
          An Aurion Stack Product • Remote First • Shipping Globally
        </p>
      </footer>
    </div>
  );
};

export default ProductPageLayout;
