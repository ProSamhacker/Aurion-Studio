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
    color: "teal",
    description:
      "We design and build lightning-fast, SEO-optimised websites and web applications tailored to your brand. From sleek marketing sites to complex multi-page platforms, every project is built mobile-first, accessible, and production-ready. Our stack includes React, Next.js, Vite, and TypeScript — giving you code that is maintainable, scalable, and easy to hand off.",
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
    color: "orange",
    description:
      "One codebase, two stores. We build cross-platform mobile apps using React Native and Expo that run natively on both iOS and Android. Whether you need a customer-facing app, an internal field tool, or a full e-commerce experience, we deliver polished, performant apps that users love — and that pass App Store and Play Store review on the first submission.",
    bullets: [
      "iOS and Android from a single React Native codebase",
      "Push notifications, deep links, biometric auth",
      "Offline-first capabilities with local storage sync",
      "In-app payments (Stripe, Razorpay, Apple Pay)",
      "App Store & Play Store submission handled for you",
    ],
  },
  {
    icon: Brain,
    title: "AI Automation & Chatbot Integration",
    keywords: "Groq · OpenAI · LangChain · n8n",
    color: "teal",
    description:
      "Unlock productivity gains by embedding AI directly into your product or workflow. We integrate large language models (GPT-4, LLaMA, Groq) to build context-aware chatbots, document processors, and intelligent automation pipelines. From customer support bots to automated reporting engines, we match the right model to your use case and budget.",
    bullets: [
      "Custom chatbots trained on your business data",
      "Automated email, CRM, and workflow pipelines",
      "Document parsing & summarisation tools",
      "Groq / OpenAI / Anthropic API integration",
      "n8n & Zapier automation flows",
    ],
  },
  {
    icon: ShoppingCart,
    title: "E-Commerce & Online Ordering Systems",
    keywords: "Stripe · Razorpay · WooCommerce · Custom Carts",
    color: "orange",
    description:
      "Turn visitors into buyers with a conversion-optimised online store. We build custom e-commerce experiences with real-time inventory, secure payment gateways (Stripe, Razorpay), and admin dashboards your team can manage without touching code. We also integrate with WhatsApp ordering flows for local businesses looking to convert social traffic directly.",
    bullets: [
      "Product catalogue with search & filters",
      "Secure checkout with Stripe or Razorpay",
      "Order management dashboard",
      "WhatsApp order integration for local businesses",
      "Abandoned cart recovery & email flows",
    ],
  },
  {
    icon: BarChart3,
    title: "Analytics, SEO & Performance Audits",
    keywords: "Google Analytics 4 · Search Console · Core Web Vitals",
    color: "teal",
    description:
      "Data-driven decisions start with accurate measurement. We set up GA4, Google Search Console, and Hotjar on your site, then deliver actionable reports on traffic, conversions, and user behaviour. Our SEO audits cover technical issues, content gaps, keyword opportunities, and backlink health — giving you a clear roadmap to rank higher and grow organic traffic.",
    bullets: [
      "Google Analytics 4 & Search Console setup",
      "Monthly SEO performance reports",
      "Core Web Vitals auditing & optimisation",
      "Keyword gap analysis & content strategy",
      "Conversion funnel analysis with Hotjar",
    ],
  },
  {
    icon: Wrench,
    title: "Ongoing Maintenance & Support",
    keywords: "Hosting · SSL · Updates · Priority Support",
    color: "orange",
    description:
      "Your site going live is just the beginning. Our monthly maintenance plans keep your platform secure, up-to-date, and performing at its best. Every plan includes hosting, SSL certificates, uptime monitoring, and a dedicated support channel. Growth and Premium clients also receive monthly content updates and a personal performance report.",
    bullets: [
      "Managed hosting with 99.9% uptime guarantee",
      "SSL certificate & security patch management",
      "Monthly content & dependency updates",
      "Priority response within 4 business hours",
      "Bi-annual performance & SEO health check",
    ],
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" },
  }),
};

const premiumProducts = [
  {
    icon: Bot,
    title: "AuraIQ",
    hook: "24/7 AI Employees for Local Businesses.",
    link: "/auraiq",
    color: "teal"
  },
  {
    icon: Youtube,
    title: "GapTuber",
    hook: "Find Winning Content Gaps on YouTube instantly.",
    link: "/gaptuber",
    color: "orange"
  },
  {
    icon: Video,
    title: "Visioscript",
    hook: "AI Video Editing. From Script to Screen.",
    link: "/visioscript",
    color: "teal"
  },
  {
    icon: BriefcaseBusiness,
    title: "BusinessZip",
    hook: "All-in-One Business Utilities.",
    link: "/businesszip",
    color: "orange"
  }
];

const ServicesDetailSection = () => {
  return (
    <section
      id="services-detail"
      className="relative border-t border-border/60 bg-background py-20 sm:py-28"
    >
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-teal/5 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-orange/5 blur-[100px]" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-block font-body text-xs font-semibold uppercase tracking-widest text-teal mb-3">
            What We Build
          </span>
          <h2 className="font-heading text-4xl font-black text-foreground sm:text-5xl md:text-6xl">
            Our <span className="text-gradient-teal">Services</span>
          </h2>
          <p className="mt-4 font-body text-base leading-relaxed text-muted-foreground sm:text-lg">
            From a single landing page to a full AI-powered platform — Aurion Stack covers every layer
            of modern digital development. Based in Goa, India and working with clients worldwide.
          </p>
        </motion.div>

        {/* Service cards */}
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
          {services.map((svc, i) => {
            const Icon = svc.icon;
            const isTeal = svc.color === "teal";
            return (
              <motion.div
                key={svc.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={cardVariants}
                className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/30 p-7 backdrop-blur-sm transition-all duration-300 hover:border-teal/40 hover:shadow-teal-glow/30 sm:p-8"
              >
                {/* Icon + badge */}
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div
                    className={`flex h-12 w-12 flex-shrink-0 items-center justify-center geometric-clip ${
                      isTeal ? "bg-gradient-teal" : "bg-gradient-orange"
                    } text-primary-foreground`}
                  >
                    <Icon size={22} />
                  </div>
                  <span className="mt-1 font-body text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
                    {svc.keywords}
                  </span>
                </div>

                {/* Text */}
                <h3 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
                  {svc.title}
                </h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {svc.description}
                </p>

                {/* Bullet list */}
                <ul className="mt-5 space-y-2">
                  {svc.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-2.5 font-body text-sm text-muted-foreground"
                    >
                      <ArrowRight
                        size={14}
                        className={`mt-0.5 flex-shrink-0 ${isTeal ? "text-teal" : "text-orange"}`}
                      />
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Premium Products */}
        <div className="mt-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="inline-block font-body text-xs font-semibold uppercase tracking-widest text-orange mb-3">
              Premium Features
            </span>
            <h2 className="font-heading text-3xl font-black text-foreground sm:text-4xl">
              Our Proprietary <span className="text-gradient-orange">Tools</span>
            </h2>
            <p className="mt-4 font-body text-base text-muted-foreground max-w-2xl mx-auto">
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
                className="group cursor-pointer rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-2 hover:border-teal/50 hover:shadow-teal-glow/30"
              >
                <div className={`mb-5 inline-flex rounded-2xl p-4 ${prod.color === 'teal' ? 'bg-teal/10 text-teal' : 'bg-orange/10 text-orange'}`}>
                  <prod.icon size={28} />
                </div>
                <h3 className="mb-3 font-heading text-xl font-bold">{prod.title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{prod.hook}</p>
                
                <div className="mt-6 flex items-center font-body text-sm font-semibold text-teal opacity-80 transition-opacity group-hover:opacity-100">
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
          className="mt-16 rounded-2xl border border-teal/30 bg-teal/5 px-8 py-10 text-center"
        >
          <h3 className="font-heading text-2xl font-black text-foreground sm:text-3xl">
            Don't See Exactly What You Need?
          </h3>
          <p className="mx-auto mt-3 max-w-xl font-body text-sm text-muted-foreground sm:text-base">
            Every business is unique. We offer fully bespoke digital solutions — just describe your
            idea and we'll scope a custom plan, usually within 24 hours.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="https://wa.me/919322720861"
              target="_blank"
              rel="noopener noreferrer"
              className="geometric-clip bg-gradient-teal px-8 py-3.5 font-heading text-sm font-bold text-primary-foreground shadow-teal-glow transition-all hover:scale-105"
            >
              Chat on WhatsApp
            </a>
            <a
              href="mailto:aurionstack@gmail.com"
              className="geometric-clip-sm border-2 border-teal/50 bg-transparent px-8 py-3 font-heading text-sm font-bold text-teal transition-all hover:bg-teal/10"
            >
              Send an Email
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesDetailSection;
