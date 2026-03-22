import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen, Zap, Globe, Brain, Smartphone, BarChart3 } from "lucide-react";
import SchemaOrg, { organizationSchema } from "@/components/SchemaOrg";
import usePageMeta from "@/hooks/usePageMeta";

// ─── Topic Cluster Data ───────────────────────────────────────────────────────

const pillarSummary = `
Full-Stack AI Development is the convergence of modern frontend frameworks, scalable backend infrastructure,
and large language model (LLM) integration into a single, cohesive product. As of 2025, AI is no longer
an add-on — it's the core differentiator for any digital product competing in a global market.

At Aurion Stack, full-stack AI development means building end-to-end systems where React or Next.js
frontends talk to Node.js or Python backends that, in turn, orchestrate calls to OpenAI, Groq, or
Anthropic APIs — all deployed on Vercel, Railway, or GCP with automated CI/CD pipelines.

The key pillars are: (1) a fast, SEO-optimised frontend that delivers great Core Web Vitals;
(2) a secure, type-safe API layer that handles auth, rate limiting, and data persistence;
(3) LLM integration with proper prompt engineering, streaming responses, and context management;
and (4) observability — logging, error tracking, and performance monitoring in production.

For startups in India, particularly those operating out of Goa, Bengaluru, or Mumbai, the cost advantage
of working with a specialised agency like Aurion Stack — versus hiring a full team in-house — is
significant. A typical full-stack AI project that would cost $80,000+ in the US can be delivered at
a fraction of that cost without compromising on code quality, test coverage, or deployment reliability.
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
    color: "teal",
  },
  {
    icon: Globe,
    category: "Deployment",
    title: "Vercel Deployment for Indian Startups — The Complete Guide",
    description:
      "Edge functions, ISR, image optimisation, and environment variable management on Vercel — optimised for low-latency delivery to Indian users and budget-conscious startup teams.",
    keywords: ["Vercel", "Next.js", "Deployment", "India", "Edge Functions"],
    readTime: "9 min read",
    color: "orange",
  },
  {
    icon: Zap,
    category: "Performance",
    title: "Achieving Sub-2s LCP on a React SPA Without SSR",
    description:
      "A deep-dive into lazy loading, code splitting, WebP images, fetchPriority, and resource hints that push a client-side React app into green Core Web Vitals — without migrating to Next.js.",
    keywords: ["Core Web Vitals", "LCP", "React SPA", "Performance", "SEO"],
    readTime: "10 min read",
    color: "teal",
  },
  {
    icon: Brain,
    category: "AI & LLMs",
    title: "Fine-Tuning Gemma 2 on Google Cloud for Domain-Specific Chatbots",
    description:
      "Using Vertex AI and GCP's TPU infrastructure to fine-tune Google's Gemma 2 model on custom business data — a practical walkthrough for engineering teams without ML backgrounds.",
    keywords: ["Gemma 2", "Fine-tuning", "GCP", "Vertex AI", "LLM", "India"],
    readTime: "15 min read",
    color: "orange",
  },
  {
    icon: Smartphone,
    category: "Mobile",
    title: "Building an Offline-First React Native App with Expo and SQLite",
    description:
      "Architecture patterns for apps that work without internet — using expo-sqlite for local storage, conflict resolution strategies for bi-directional sync, and optimistic UI updates.",
    keywords: ["React Native", "Expo", "Offline-first", "SQLite", "Mobile Dev"],
    readTime: "11 min read",
    color: "teal",
  },
  {
    icon: BarChart3,
    category: "SEO & GEO",
    title: "GEO vs SEO: How to Optimise Your Website for AI Overviews in 2025",
    description:
      "Traditional SEO gets you into Google's blue links. GEO gets you cited inside Gemini AI Overviews and ChatGPT answers. This post covers Schema.org markup, topic clusters, semantic clarity, and entity building for AI-era search.",
    keywords: ["GEO", "SEO", "AI Overview", "Schema Markup", "Gemini", "ChatGPT"],
    readTime: "8 min read",
    color: "orange",
  },
  {
    icon: Globe,
    category: "Web Development",
    title: "Why Indian Startups Are Choosing Next.js Over WordPress in 2025",
    description:
      "A frank comparison of Next.js vs WordPress for business websites in India — covering hosting costs, developer availability, SEO performance, and long-term maintainability.",
    keywords: ["Next.js", "WordPress", "India", "Web Development", "Startups"],
    readTime: "7 min read",
    color: "teal",
  },
  {
    icon: Brain,
    category: "AI & LLMs",
    title: "Building a RAG Pipeline with LangChain, Pinecone, and OpenAI",
    description:
      "Retrieval-Augmented Generation step-by-step: ingest business documents into a Pinecone vector store, retrieve semantically similar chunks at query time, and return grounded answers via GPT-4.",
    keywords: ["RAG", "LangChain", "Pinecone", "OpenAI", "Vector Database", "AI"],
    readTime: "13 min read",
    color: "orange",
  },
];

const categoryColors: Record<string, string> = {
  "AI & LLMs": "bg-teal/10 text-teal border-teal/30",
  "Deployment": "bg-orange/10 text-orange border-orange/30",
  "Performance": "bg-teal/10 text-teal border-teal/30",
  "Mobile": "bg-teal/10 text-teal border-teal/30",
  "SEO & GEO": "bg-orange/10 text-orange border-orange/30",
  "Web Development": "bg-teal/10 text-teal border-teal/30",
};

// Article schema for the pillar page
const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Full-Stack AI Development — The Complete Guide for 2025",
  description:
    "A topic cluster pillar page covering full-stack AI development: LLM integration, React/Next.js deployment, mobile apps, SEO, and GEO strategies for startups and agencies in India.",
  url: "https://aurionstack.dev/insights",
  datePublished: "2026-03-22",
  dateModified: "2026-03-22",
  author: { "@id": "https://aurionstack.dev/#organization" },
  publisher: { "@id": "https://aurionstack.dev/#organization" },
  inLanguage: "en-US",
  keywords:
    "Full-Stack Development, AI Development, React, Next.js, LLM, Groq, Vercel, India, Startup, GEO, SEO",
};

// ─── Page Component ───────────────────────────────────────────────────────────

const InsightsPage = () => {
  const navigate = useNavigate();
  usePageMeta(
    "Insights — Full-Stack AI Development Guide | Aurion Stack",
    "Topic cluster pillar page covering Full-Stack AI Development: React, Next.js, LLM integration, Vercel deployment for Indian startups, SEO, and Generative Engine Optimization."
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SchemaOrg schemas={[organizationSchema, articleSchema]} />

      {/* Top bar */}
      <div className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-xl">
        <div className="container mx-auto flex items-center gap-4 px-4 py-4 sm:px-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="flex-1" />
          <span className="font-heading text-sm font-bold text-teal">
            Aurion Stack · Insights
          </span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-14 sm:px-6 sm:py-20 max-w-5xl">

        {/* ── Pillar Page Hero ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="inline-flex items-center gap-2 font-body text-xs font-semibold uppercase tracking-widest text-teal mb-4">
            <BookOpen size={13} />
            Topic Cluster · Pillar Page
          </span>
          <h1 className="font-heading text-4xl font-black text-foreground sm:text-5xl md:text-6xl">
            Full-Stack{" "}
            <span className="text-gradient-teal">AI Development</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl font-body text-base leading-relaxed text-muted-foreground sm:text-lg">
            The complete guide to building modern AI-powered products in 2025 — from LLM integration
            and React architecture to SEO, deployment, and Generative Engine Optimization.
          </p>
        </motion.div>

        {/* ── Pillar Content ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-16 rounded-2xl border border-teal/20 bg-teal/5 p-8 sm:p-10"
        >
          <h2 className="font-heading text-2xl font-black text-foreground mb-5 sm:text-3xl">
            What Is Full-Stack AI Development?
          </h2>
          {pillarSummary.split("\n\n").map((para, i) => (
            <p
              key={i}
              className="font-body text-sm leading-relaxed text-muted-foreground sm:text-base mb-4 last:mb-0"
            >
              {para}
            </p>
          ))}

          {/* Key pillars grid */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              { label: "Frontend", detail: "React, Next.js, TypeScript, Tailwind CSS — fast, SEO-optimised, Core Web Vitals green." },
              { label: "Backend & API", detail: "Node.js / Python / Go with auth, rate limiting, type-safe APIs, and database ORM." },
              { label: "LLM Integration", detail: "OpenAI, Groq, Anthropic, LangChain — streaming, RAG pipelines, prompt engineering." },
              { label: "Observability", detail: "Sentry, PostHog, Datadog — error tracking, user analytics, and performance monitoring in prod." },
            ].map((pillar) => (
              <div
                key={pillar.label}
                className="rounded-xl border border-teal/20 bg-background/60 p-5"
              >
                <p className="font-heading text-sm font-bold text-teal mb-1">{pillar.label}</p>
                <p className="font-body text-xs text-muted-foreground leading-relaxed">{pillar.detail}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── Topic Cluster Articles ── */}
        <section>
          <div className="mb-8 flex items-end justify-between">
            <div>
              <span className="font-body text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Cluster Articles
              </span>
              <h2 className="font-heading text-2xl font-black text-foreground mt-1 sm:text-3xl">
                Deep-Dive <span className="text-gradient-orange">Guides</span>
              </h2>
            </div>
            <span className="font-body text-xs text-muted-foreground hidden sm:block">
              {clusterArticles.length} articles in this cluster
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {clusterArticles.map((article, i) => {
              const Icon = article.icon;
              const isTeal = article.color === "teal";
              return (
                <motion.article
                  key={article.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.45, delay: i * 0.07 }}
                  className="group flex flex-col rounded-2xl border border-border/50 bg-card/30 p-6 transition-all duration-300 hover:border-teal/40 hover:shadow-teal-glow/20"
                >
                  {/* Category + read time */}
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-body text-[10px] font-semibold ${categoryColors[article.category] ?? "bg-secondary text-muted-foreground"}`}
                    >
                      <Icon size={10} />
                      {article.category}
                    </span>
                    <span className="font-body text-[10px] text-muted-foreground/60">
                      {article.readTime}
                    </span>
                  </div>

                  {/* Title & description */}
                  <h3 className="font-heading text-base font-bold text-foreground leading-snug sm:text-lg">
                    {article.title}
                  </h3>
                  <p className="mt-2 mb-4 font-body text-xs leading-relaxed text-muted-foreground sm:text-sm flex-1">
                    {article.description}
                  </p>

                  {/* Keywords */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {article.keywords.map((kw) => (
                      <span
                        key={kw}
                        className="rounded-md bg-secondary px-2 py-0.5 font-body text-[10px] text-muted-foreground"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>

                  {/* "Coming soon" CTA */}
                  <div
                    className={`flex items-center gap-1.5 font-heading text-xs font-bold ${isTeal ? "text-teal" : "text-orange"}`}
                  >
                    <span>Coming Soon</span>
                    <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
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
          className="mt-16 rounded-2xl border border-teal/30 bg-teal/5 px-8 py-10 text-center"
        >
          <h2 className="font-heading text-2xl font-black text-foreground sm:text-3xl">
            Ready to Build Your AI-Powered Product?
          </h2>
          <p className="mx-auto mt-3 max-w-xl font-body text-sm text-muted-foreground sm:text-base">
            Aurion Stack handles the full stack — from ideation and architecture to deployment and
            ongoing maintenance. Based in Goa, India. Shipping worldwide.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="https://wa.me/919322720861"
              target="_blank"
              rel="noopener noreferrer"
              className="geometric-clip bg-gradient-teal px-8 py-3.5 font-heading text-sm font-bold text-primary-foreground shadow-teal-glow transition-all hover:scale-105"
            >
              Start a Project
            </a>
            <a
              href="/services"
              className="geometric-clip-sm border-2 border-teal/50 bg-transparent px-8 py-3 font-heading text-sm font-bold text-teal transition-all hover:bg-teal/10"
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
