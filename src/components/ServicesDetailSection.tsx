import { motion } from "framer-motion";
import {
  Globe,
  Smartphone,
  Brain,
  ShoppingCart,
  BarChart3,
  Wrench,
  ArrowRight,
  Bot,
  Youtube,
  Video,
  BriefcaseBusiness,
} from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "Custom Web Development",
    keywords: "React · Next.js · TypeScript · Tailwind CSS",
    description:
      "We design and build lightning-fast, SEO-optimised websites and web applications tailored to your brand. From sleek marketing sites to complex multi-page platforms, every project is built mobile-first, accessible, and production-ready. Our stack includes React, Next.js, and TypeScript.",
    bullets: [
      "Responsive, mobile-first design on all screen sizes",
      "Core Web Vitals optimised for Google rankings",
      "CMS integrations (Sanity, Contentful, Strapi)",
      "REST & GraphQL API integration",
      "Post-launch support & iterative improvements",
    ],
  },
  {
    icon: Smartphone,
    title: "Cross-Platform Mobile App Development",
    keywords: "React Native · Expo · iOS · Android",
    description:
      "One codebase, two stores. We build cross-platform mobile apps using React Native and Expo that run natively on both iOS and Android. Whether you need a customer-facing app, an internal field tool, or a full e-commerce experience, we deliver performant apps.",
    bullets: [
      "iOS and Android from a single React Native codebase",
      "Push notifications, deep links, biometric auth",
      "Offline-first capabilities with local storage sync",
      "In-app payments (Stripe, Apple Pay)",
      "App Store & Play Store submission handled for you",
    ],
  },
  {
    icon: Brain,
    title: "AI Automation & Chatbot Integration",
    keywords: "Groq · OpenAI · LangChain · Vector DBs",
    description:
      "Unlock productivity gains by embedding AI directly into your product or workflow. We integrate large language models (GPT-4, LLaMA, Groq) to build context-aware chatbots, document processors, and intelligent automation pipelines.",
    bullets: [
      "Custom chatbots trained on your business data",
      "Automated email, CRM, and workflow pipelines",
      "Document parsing & summarisation tools",
      "Groq / OpenAI / Anthropic API integration",
      "RAG architecture and Vector Database setup",
    ],
  },
  {
    icon: ShoppingCart,
    title: "E-Commerce & Online Ordering Systems",
    keywords: "Stripe · Medusa · Custom Carts",
    description:
      "Turn visitors into buyers with a conversion-optimised online store. We build custom e-commerce experiences with real-time inventory, secure payment gateways (Stripe), and admin dashboards your team can manage without touching code.",
    bullets: [
      "Product catalogue with search & filters",
      "Secure checkout with Stripe or B2B invoicing",
      "Order management admin dashboard",
      "CRM & ERP integration capabilities",
      "Abandoned cart recovery & email flows",
    ],
  },
  {
    icon: BarChart3,
    title: "Analytics, SEO & Performance Audits",
    keywords: "Google Analytics 4 · PostHog · Core Web Vitals",
    description:
      "Data-driven decisions start with accurate measurement. We set up GA4, PostHog, and Search Console on your site, then deliver actionable reports on traffic, conversions, and user behaviour. Our technical SEO audits give you a clear roadmap to rank higher.",
    bullets: [
      "Google Analytics 4 & PostHog telemetry setup",
      "Monthly SEO performance reports",
      "Core Web Vitals auditing & optimisation",
      "Keyword gap analysis & content strategy",
      "Conversion funnel analysis",
    ],
  },
  {
    icon: Wrench,
    title: "Ongoing Maintenance & SLA Support",
    keywords: "Hosting · SSL · DevOps · Retained Engineering",
    description:
      "Your site going live is just the beginning. Our retained engineering plans keep your platform secure, up-to-date, and performing at its best. Every plan includes hosting, SSL certificates, uptime monitoring, and a dedicated Slack support channel.",
    bullets: [
      "Managed CI/CD with 99.9% uptime guarantee",
      "SSL certificate & security patch management",
      "Monthly dependency updates",
      "Priority SLA response times",
      "Bi-annual architectural health check",
    ],
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.1, ease: "easeOut" },
  }),
};

const premiumProducts = [
  {
    icon: Bot,
    title: "AuraIQ",
    hook: "24/7 AI Employees for Local Businesses.",
    link: "/auraiq",
  },
  {
    icon: Youtube,
    title: "GapTuber",
    hook: "Find Winning Content Gaps on YouTube instantly.",
    link: "/gaptuber",
  },
  {
    icon: Video,
    title: "Visioscript",
    hook: "AI Video Editing. From Script to Screen.",
    link: "/visioscript",
  },
  {
    icon: BriefcaseBusiness,
    title: "BusinessZip",
    hook: "All-in-One Business Utilities.",
    link: "/businesszip",
  }
];

const ServicesDetailSection = () => {
  return (
    <section
      id="services-detail"
      className="relative border-t border-border bg-background py-24 sm:py-32"
    >
      <div className="container relative mx-auto px-4 sm:px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            What We Build
          </span>
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Our <span className="text-muted-foreground">Capabilities</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            From a single landing page to a full AI-powered platform — Aurion Stack covers every layer
            of modern digital development. Remote-first, shipping globally.
          </p>
        </motion.div>

        {/* Service cards */}
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
          {services.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <motion.div
                key={svc.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={cardVariants}
                className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-6 sm:p-8 transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
              >
                <div>
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-muted text-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon size={24} />
                    </div>
                    <span className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      {svc.keywords}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl mb-3">
                    {svc.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {svc.description}
                  </p>
                </div>

                <ul className="mt-8 space-y-3">
                  {svc.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-3 text-sm text-foreground"
                    >
                      <ArrowRight
                        size={16}
                        className="mt-0.5 flex-shrink-0 text-primary"
                      />
                      <span className="leading-snug">{b}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Premium Products */}
        <div className="mt-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-3">
              Premium Features
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Proprietary <span className="text-muted-foreground">Internal Tools</span>
            </h2>
            <p className="mt-4 text-base text-muted-foreground max-w-2xl mx-auto">
              Ready-to-deploy, high-performance software products that give your business an unfair advantage. 
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {premiumProducts.map((prod, i) => (
              <motion.div
                key={prod.title}
                custom={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                onClick={() => window.open(prod.link, "_self")}
                className="group cursor-pointer rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
              >
                <div className="mb-5 inline-flex rounded-lg p-3 bg-muted text-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <prod.icon size={24} />
                </div>
                <h3 className="mb-2 text-xl font-bold tracking-tight text-foreground">{prod.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed min-h-[40px]">{prod.hook}</p>
                
                <div className="mt-6 flex items-center text-sm font-semibold text-primary transition-opacity opacity-80 group-hover:opacity-100">
                  Explore Tool <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-24 rounded-xl border border-border bg-gradient-to-br from-card to-background px-6 py-12 text-center sm:px-12"
        >
          <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Don't See Exactly What You Need?
          </h3>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
            Every business is unique. We offer fully bespoke digital solutions — just describe your
            architecture needs and we'll scope a custom plan, usually within 24 hours.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="mailto:aurionstack@gmail.com"
              className="flex w-full sm:w-auto items-center justify-center rounded-md bg-foreground px-8 py-3.5 text-sm font-semibold text-background shadow-xl hover:bg-foreground/90 transition-colors"
            >
              Send an Email
            </a>
            <a
              href="https://wa.me/919322720861"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full sm:w-auto items-center justify-center rounded-md border border-border bg-transparent px-8 py-3.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
            >
              Chat on WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesDetailSection;
