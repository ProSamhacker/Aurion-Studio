import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useReviews } from "@/context/ReviewsContext";

const StarRating = ({
  rating,
  onRate,
}: {
  rating: number;
  onRate?: (r: number) => void;
}) => (
  <div className="flex gap-1">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={18}
        className={`${
          i < rating ? "fill-orange text-orange" : "fill-transparent text-orange/40"
        } ${onRate ? "cursor-pointer transition-transform hover:scale-125" : ""}`}
        onClick={() => onRate && onRate(i + 1)}
      />
    ))}
  </div>
);

const ReviewCard = ({ review }: { review: { text: string; author: string; rating: number } }) => (
  <div className="flex-shrink-0 w-64 geometric-clip border border-border bg-card p-5 mx-3 sm:w-72 sm:p-6">
    <StarRating rating={review.rating} />
    <p className="mt-3 font-body text-xs leading-relaxed text-muted-foreground italic line-clamp-3 sm:text-sm">
      "{review.text}"
    </p>
    <p className="mt-3 font-heading text-xs font-bold text-foreground sm:text-sm">— {review.author}</p>
  </div>
);

const ReviewsSection = () => {
  const { reviews, addReview } = useReviews();
  const [newText, setNewText] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const posRef = useRef<number>(0);

  const doubled = [...reviews, ...reviews];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let lastTime = 0;
    const speed = 0.45;
    const animate = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp;
      const delta = timestamp - lastTime;
      lastTime = timestamp;
      posRef.current -= speed * (delta / 16.67);
      const halfWidth = track.scrollWidth / 2;
      if (Math.abs(posRef.current) >= halfWidth) posRef.current = 0;
      track.style.transform = `translateX(${posRef.current}px)`;
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [reviews]);

  const handleSubmit = () => {
    if (!newText.trim() || !newAuthor.trim()) return;
    addReview({ text: newText.trim(), author: newAuthor.trim(), rating: newRating });
    setNewText("");
    setNewAuthor("");
    setNewRating(5);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section id="reviews" className="relative border-t border-border/60 bg-background py-20 overflow-hidden sm:py-28">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-5xl md:text-6xl">
            Client <span className="text-gradient-orange">Feedback</span>
          </h2>
          <p className="mt-2 font-body text-sm text-muted-foreground sm:mt-3">
            What our clients say about working with Aurion Stack
          </p>
        </div>
      </div>

      {/* Infinite scrolling ticker */}
      <div className="mt-10 relative sm:mt-14">
        <div className="pointer-events-none absolute left-0 top-0 h-full w-12 z-10 bg-gradient-to-r from-background to-transparent sm:w-24" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-12 z-10 bg-gradient-to-l from-background to-transparent sm:w-24" />
        <div className="overflow-hidden">
          <div ref={trackRef} className="flex" style={{ willChange: "transform" }}>
            {doubled.map((review, i) => (
              <ReviewCard key={i} review={review} />
            ))}
          </div>
        </div>
      </div>

      {/* Leave a Review form */}
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mt-12 max-w-lg sm:mt-16"
        >
          <p className="mb-1.5 font-heading text-base font-bold text-foreground text-center sm:text-lg sm:mb-2">
            Leave a Review
          </p>
          <p className="mb-5 font-body text-xs text-muted-foreground text-center sm:text-sm sm:mb-6">
            Rate our work — it'll appear in the ticker above!
          </p>

          <div className="space-y-3">
            <input
              type="text"
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
              placeholder="Your name..."
              className="w-full geometric-clip-sm border border-border bg-secondary px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-teal focus:outline-none"
            />

            <div className="flex items-center gap-3 px-1">
              <span className="font-body text-sm text-muted-foreground">Rating:</span>
              <StarRating rating={newRating} onRate={setNewRating} />
            </div>

            <div className="flex gap-2 sm:gap-3">
              <input
                type="text"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="Share your experience..."
                className="flex-1 min-w-0 geometric-clip-sm border border-border bg-secondary px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-teal focus:outline-none"
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
              <button
                onClick={handleSubmit}
                className="flex-shrink-0 geometric-clip-sm bg-gradient-teal px-4 py-3 font-heading text-sm font-bold text-primary-foreground transition-all hover:shadow-teal-glow sm:px-6"
              >
                Submit
              </button>
            </div>

            {submitted && (
              <p className="text-center font-body text-sm text-teal animate-fade-in">
                ✓ Your review has been added!
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ReviewsSection;
