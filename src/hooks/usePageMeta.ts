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
      document.title = "Aurion Stack | Full-Stack Web App & AI Development Studio";
      if (metaDesc) metaDesc.content =
        "Aurion Stack is a remote-first product engineering studio building high-speed web apps, mobile apps, and custom AI workflows for startups and global brands.";
    };
  }, [title, description]);
};

export default usePageMeta;
