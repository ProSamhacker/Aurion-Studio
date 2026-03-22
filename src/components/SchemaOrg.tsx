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

/** Organization — who Aurion Stack is as a business entity */
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
    "Aurion Stack is a full-stack software development agency based in Goa, India, specialising in custom web platforms, cross-platform mobile apps, and AI-powered automation solutions for startups and businesses worldwide.",
  foundingDate: "2024",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Goa",
    addressRegion: "Goa",
    addressCountry: "IN",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: "+91-93227-20861",
      email: "aurionstack@gmail.com",
      availableLanguage: ["English", "Hindi"],
    },
  ],
  sameAs: [
    "https://instagram.com/aurionstack",
    "https://wa.me/919322720861",
  ],
  areaServed: ["IN", "US", "GB", "AU", "SG"],
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
    "Full-stack web, mobile & AI development agency based in Goa, India.",
  publisher: {
    "@id": "https://aurionstack.dev/#organization",
  },
  inLanguage: "en-US",
};

/** LocalBusiness — reinforces geographic entity for local AI results */
export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "ProfessionalService"],
  "@id": "https://aurionstack.dev/#localbusiness",
  name: "Aurion Stack",
  url: "https://aurionstack.dev",
  telephone: "+91-93227-20861",
  email: "aurionstack@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Panaji",
    addressRegion: "Goa",
    postalCode: "403001",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 15.4909,
    longitude: 73.8278,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "09:00",
      closes: "19:00",
    },
  ],
  priceRange: "₹₹",
  currenciesAccepted: "INR, USD, EUR",
  paymentAccepted: "Bank Transfer, UPI, Stripe, Wise",
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
  areaServed: { "@type": "Country", name: "India" },
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
