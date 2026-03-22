import { useEffect, useRef } from "react";
import { ChevronUp } from "lucide-react";

const BackToTop = () => {
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (btnRef.current) {
        btnRef.current.classList.toggle("visible", window.scrollY > 400);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      ref={btnRef}
      aria-label="Back to top"
      className="back-to-top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <ChevronUp size={20} strokeWidth={2.5} />
    </button>
  );
};

export default BackToTop;
