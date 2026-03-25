import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen, Zap, Globe, Brain, Smartphone, BarChart3 } from "lucide-react";
import SchemaOrg, { organizationSchema } from "@/components/SchemaOrg";
import usePageMeta from "@/hooks/usePageMeta";

// ─── Topic Cluster Data ──────────────────────────────────────────────────────

const pillarSummary = `
Full-Stack AI Development is the convergence of modern frontend frameworks, scalable backend infrastructure,
and large language model (LLM) integration into a single, cohesive product. As of 2026, AI is no longer
an add-on — it's the core differentiator for any digital product competing in a global market.

At Aurion Stack, full-stack AI development means building end-to-end systems where React or Next.js
frontends talk to Node.js or Python backends that, in turn, orchestrate calls to OpenAI, Groq, or
Anthropic APIs — all deployed on Vercel or GCP with automated CI/CD pipelines.

The key pillars are: (1) a fast, SEO-optimised frontend that delivers great Core Web Vitals;
(2) a secure, type-safe API layer that handles auth, rate limiting, and data persistence;
(3) LLM integration with proper prompt engineering, streaming responses, and context management;
and (4) observability — logging, error tracking, and performance monitoring in production.

For fast-growing teams, the cost advantage of partnering with a specialised remote product studio like
Aurion Stack — versus hiring a full in-house team — is significant. A typical full-stack AI project
that would cost $80,000+ at a large agency can be delivered at a fraction of that cost without
compromising on code quality, test coverage, or deployment reliability.
`.trim();

const clusterArticles = [
  {
    icon: Brain,
    category: "AI & LLMs",
    title: "How to Integrate Groq LLaMA 3 into a React App",
    description:
      "A step-by-step guide to streaming LLaMA 3.1 responses from the Groq API into a React frontend using server-sent events, react-markdown, and proper rate-limit handling.",
    keywords: ["Groq API", "LLaMA 3", "React streaming", "AI chatbot"],
    readTime: "12 min read",
  },
  {
    icon: Globe,
    category: "Deployment",
    title: "Vercel Deployment Architecture for Scaing SaaS",
    description:
      "Edge functions, ISR, image optimisation, and environment variable management on Vercel — optimised for low-latency delivery to global users and enterprise clients.",
    keywords: ["Vercel", "Next.js", "Deployment", "Edge Functions"],
    readTime: "9 min read",
  },
  {
    icon: Zap,
    category: "Performance",
    title: "Achieving Sub-2s LCP on a React SPA Without SSR",
    description:
      "A deep-dive into lazy loading, code splitting, WebP images, fetchPriority, and resource hints that push a client-side React app into green Core Web Vitals — without migrating to Next.js.",
    keywords: ["Core Web Vitals", "LCP", "React SPA", "Performance", "SEO"],
    readTime: "10 min read",
  },
  {
    icon: Brain,
    category: "AI & LLMs",
    title: "Fine-Tuning Gemma 2 on Google Cloud for Domain-Specific Context",
    description:
      "Using Vertex AI and GCP's TPU infrastructure to fine-tune Google's Gemma 2 model on custom business data — a practical walkthrough for engineering teams.",
    keywords: ["Gemma 2", "Fine-tuning", "GCP", "Vertex AI", "LLM"],
    readTime: "15 min read",
  },
  {
    icon: Smartphone,
    category: "Mobile",
    title: "Building an Offline-First React Native App with Expo and SQLite",
    description:
      "Architecture patterns for apps that work without internet — using expo-sqlite for local storage, conflict resolution strategies for bi-directional sync, and optimistic UI updates.",
    keywords: ["React Native", "Expo", "Offline-first", "SQLite", "Mobile Dev"],
    readTime: "11 min read",
  },
  {
    icon: BarChart3,
    category: "SEO & GEO",
    title: "GEO vs SEO: How to Optimise Your Platform for AI Overviews in 2026",
    description:
      "Traditional SEO gets you into Google's blue links. GEO gets you cited inside Gemini AI Overviews and ChatGPT answers. This post covers Schema.org markup, semantic clarity, and entity building.",
    keywords: ["GEO", "SEO", "AI Overview", "Schema Markup", "Gemini", "ChatGPT"],
    readTime: "8 min read",
  },
  {
    icon: Globe,
    category: "Web Development",
    title: "Evaluating Next.js App Router for Enterprise Applications",
    description:
      "A frank comparison of Next.js Pages vs App router for large-scale enterprise websites — covering hosting costs, caching layers, and long-term maintainability.",
    keywords: ["Next.js", "Architecture", "Enterprise", "Web Development"],
    readTime: "7 min read",
  },
  {
    icon: Brain,
    category: "AI & LLMs",
    title: "Building a RAG Pipeline with LangChain, Pinecone, and OpenAI",
    description:
      "Retrieval-Augmented Generation step-by-step: ingest business documents into a Pinecone vector store, retrieve semantically similar chunks at query time, and return grounded answers via GPT-4.",
    keywords: ["RAG", "LangChain", "Pinecone", "OpenAI", "Vector Database", "AI"],
    readTime: "13 min read",
  },
];

// Article schema for the pillar page
const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Full-Stack AI Development — The Complete Guide for 2026",
  description:
    "A topic cluster pillar page covering full-stack AI development: LLM integration, React/Next.js deployment, mobile apps, SEO, and GEO strategies for global startups and engineering teams.",
  url: "https://aurionstack.dev/insights",
  datePublished: "2026-03-22",
  dateModified: "2026-03-25",
  author: { "@id": "https://aurionstack.dev/#organization" },
  publisher: { "@id": "https://aurionstack.dev/#organization" },
  inLanguage: "en-US",
  keywords:
    "Full-Stack Development, AI Development, React, Next.js, LLM, Groq, Vercel, GEO, SEO, Product Engineering",
};

// ─── Page Component ───────────────────────────────────────────────────────────

const InsightsPage = () => {
  const navigate = useNavigate();
  usePageMeta(
    "Insights — Full-Stack AI Development Guide | Aurion Stack",
    "Topic cluster on Full-Stack AI Development: React, Next.js, LLM integration, Vercel deployment, SEO, and Generative Engine Optimization for global engineering teams."
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SchemaOrg schemas={[organizationSchema, articleSchema]} />

      {/* Top bar */}
      <div className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex items-center gap-4 px-4 py-4 sm:px-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="flex-1" />
          <span className="text-sm font-bold tracking-tight text-foreground">
            Aurion Stack · Insights
          </span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 sm:px-6 sm:py-24 max-w-5xl">

        {/* ── Pillar Page Hero ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary mb-4">
            <BookOpen size={14} />
            Topic Cluster · Pillar Page
          </span>
          <h1 className="text-4xl font-bold tracking-tighter text-foreground sm:text-5xl md:text-6xl mb-6">
            Full-Stack <span className="text-muted-foreground">AI Development</span>
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            The complete guide to building modern AI-powered products in 2026 — from LLM integration
            and React architecture to SEO, deployment, and Generative Engine Optimization.
          </p>
        </motion.div>

        {/* ── Pillar Content ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-20 rounded-xl border border-border bg-card p-8 sm:p-12 shadow-sm"
        >
          <h2 className="text-2xl font-bold tracking-tight text-foreground mb-6 sm:text-3xl">
            Modern Product Engineering Architecture
          </h2>
          <div className="space-y-4 mb-10 text-muted-foreground text-sm sm:text-base leading-relaxed">
            {pillarSummary.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {/* Key pillars grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {[
              { label: "Frontend", detail: "React, Next.js, TypeScript, Tailwind CSS — fast, SEO-optimised, Core Web Vitals green." },
              { label: "Backend & API", detail: "Node.js / Python / Go with auth, rate limiting, type-safe APIs, and database ORM." },
              { label: "LLM Integration", detail: "OpenAI, Groq, Anthropic, LangChain — streaming, RAG pipelines, prompt engineering." },
              { label: "Observability", detail: "Sentry, PostHog, Datadog — error tracking, user analytics, and performance monitoring in prod." },
            ].map((pillar) => (
              <div
                key={pillar.label}
                className="rounded-lg border border-border bg-muted/50 p-5"
              >
                <p className="text-sm font-bold text-foreground mb-2">{pillar.label}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{pillar.detail}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── Topic Cluster Articles ── */}
        <section>
          <div className="mb-10 flex items-end justify-between border-b border-border pb-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground block mb-2">
                Cluster Architecture
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Engineering <span className="text-muted-foreground">Deep Dives</span>
              </h2>
            </div>
            <span className="text-sm font-medium text-muted-foreground hidden sm:block">
              {clusterArticles.length} guides
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {clusterArticles.map((article, i) => {
              const Icon = article.icon;
              return (
                <motion.article
                  key={article.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
                >
                  {/* Category + read time */}
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 rounded-md bg-muted px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-foreground">
                      <Icon size={12} />
                      {article.category}
                    </span>
                    <span className="text-[11px] font-medium text-muted-foreground">
                      {article.readTime}
                    </span>
                  </div>

                  {/* Title & description */}
                  <h3 className="text-lg font-bold tracking-tight text-foreground leading-snug mb-3">
                    {article.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground flex-1 mb-6">
                    {article.description}
                  </p>

                  {/* Keywords */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {article.keywords.map((kw) => (
                      <span
                        key={kw}
                        className="rounded-md border border-border bg-background px-2 py-1 text-[10px] font-medium text-muted-foreground"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>

                  {/* "Coming soon" CTA */}
                  <div className="flex items-center gap-1.5 text-xs font-bold text-primary opacity-80 group-hover:opacity-100 transition-opacity">
                    <span>Coming Soon</span>
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </motion.article>
              );
            })}
          </div>
        </section>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-24 rounded-xl border border-border bg-gradient-to-br from-card to-background px-6 py-12 text-center sm:px-12"
        >
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl mb-4">
            Ready to Build Your Platform?
          </h2>
          <p className="mx-auto max-w-xl text-sm text-muted-foreground sm:text-base mb-8">
            Aurion Stack handles the full stack — from ideation and architecture to deployment and
            ongoing maintenance. Remote-first. Shipping globally.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="mailto:aurionstack@gmail.com"
              className="flex w-full sm:w-auto items-center justify-center rounded-md bg-foreground px-8 py-3.5 text-sm font-semibold text-background shadow-xl hover:bg-foreground/90 transition-colors"
            >
              Start a Project
            </a>
            <a
              href="/services"
              className="flex w-full sm:w-auto items-center justify-center rounded-md border border-border bg-transparent px-8 py-3.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
            >
              View Services
            </a>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default InsightsPage;
