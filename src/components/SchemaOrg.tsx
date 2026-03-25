/**
 * SchemaOrg
 * ─────────
 * Injects one or more Schema.org JSON-LD <script> blocks into the DOM.
 * Place at the top of any page component to give crawlers (Google, Bing,
 * Gemini, ChatGPT) machine-readable entity signals about your business.
 *
 * Usage:
 *   <SchemaOrg schemas={[orgSchema, serviceSchema]} />
 */

interface SchemaOrgProps {
  schemas: object[];
}

const SchemaOrg = ({ schemas }: SchemaOrgProps) => (
  <>
    {schemas.map((schema, i) => (
      <script
        key={i}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
      />
    ))}
  </>
);

export default SchemaOrg;

// ─── Pre-built schema objects ────────────────────────────────────────────────

/**
 * Organization — global entity signal.
 * No physical address so Google doesn't cap rankings to a local map pack.
 */
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://aurionstack.dev/#organization",
  name: "Aurion Stack",
  url: "https://aurionstack.dev",
  logo: {
    "@type": "ImageObject",
    url: "https://aurionstack.dev/aurionstack-logo.webp",
    width: 512,
    height: 512,
  },
  image: "https://aurionstack.dev/aurionstack-logo.webp",
  description:
    "Aurion Stack is a remote-first product engineering studio specialising in custom web platforms, cross-platform mobile apps, and AI-powered automation solutions for startups and enterprise brands worldwide.",
  foundingDate: "2024",
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "aurionstack@gmail.com",
      availableLanguage: ["English"],
    },
  ],
  sameAs: [
    "https://instagram.com/aurionstack",
    "https://github.com/ProSamhacker",
  ],
  // Explicit multi-region service intent — tells Google this is a global entity
  areaServed: ["US", "GB", "AU", "CA", "SG", "AE", "IN"],
  knowsAbout: [
    "React",
    "Next.js",
    "TypeScript",
    "React Native",
    "Node.js",
    "AI Automation",
    "LangChain",
    "OpenAI",
    "Groq",
    "Full-Stack Development",
    "SEO Optimisation",
    "Product Engineering",
  ],
};

/** WebSite — enables Google Sitelinks Search Box in SERPs */
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://aurionstack.dev/#website",
  url: "https://aurionstack.dev",
  name: "Aurion Stack",
  description:
    "Full-stack web, mobile & AI development studio — building for global brands.",
  publisher: {
    "@id": "https://aurionstack.dev/#organization",
  },
  inLanguage: "en-US",
};

/** Helper — build a Service schema for a single offering */
export const buildServiceSchema = (
  name: string,
  description: string,
  url: string,
  keywords: string[]
) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name,
  description,
  url,
  keywords: keywords.join(", "),
  provider: {
    "@id": "https://aurionstack.dev/#organization",
  },
  // Worldwide service delivery
  areaServed: { "@type": "AdministrativeArea", name: "Worldwide" },
  serviceType: name,
});

/** Helper — build a FAQPage schema from a Q&A array */
export const buildFaqSchema = (faqs: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: {
      "@type": "Answer",
      text: a,
    },
  })),
});
