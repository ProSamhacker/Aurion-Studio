import { useEffect } from "react";

/**
 * usePageMeta — sets document.title and meta description on mount.
 * Used by sub-pages so each route has unique SEO metadata in the SPA.
 */
const usePageMeta = (title: string, description: string) => {
  useEffect(() => {
    // Title
    document.title = title;

    // Meta description
    let metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description;

    // og:title
    let ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = title;

    // og:description
    let ogDesc = document.querySelector<HTMLMetaElement>('meta[property="og:description"]');
    if (ogDesc) ogDesc.content = description;

    // Restore homepage defaults on unmount
    return () => {
      document.title = "Aurion Stack – Full-Stack Web, Mobile & AI Development";
      if (metaDesc) metaDesc.content =
        "Aurion Stack builds scalable web platforms, cross-platform mobile apps, and AI-powered automation solutions. Based in Goa, India. Available for projects worldwide.";
    };
  }, [title, description]);
};

export default usePageMeta;
