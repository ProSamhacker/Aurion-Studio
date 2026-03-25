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
          i < rating ? "fill-primary text-primary" : "fill-transparent text-primary/30"
        } ${onRate ? "cursor-pointer transition-transform hover:scale-125" : ""}`}
        onClick={() => onRate && onRate(i + 1)}
      />
    ))}
  </div>
);

const ReviewCard = ({ review }: { review: { text: string; author: string; rating: number } }) => (
  <div className="flex-shrink-0 w-72 rounded-xl border border-border bg-card p-6 mx-3 sm:w-80 shadow-sm">
    <StarRating rating={review.rating} />
    <p className="mt-4 text-sm leading-relaxed text-muted-foreground italic sm:text-base">
      "{review.text}"
    </p>
    <p className="mt-4 text-sm font-bold tracking-tight text-foreground">— {review.author}</p>
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

  const isPaused = useRef<boolean>(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let lastTime = 0;
    const speed = 0.45;
    const animate = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp;
      const delta = timestamp - lastTime;
      lastTime = timestamp;
      if (!isPaused.current) {
        posRef.current -= speed * (delta / 16.67);
        const halfWidth = track.scrollWidth / 2;
        if (Math.abs(posRef.current) >= halfWidth) posRef.current = 0;
        track.style.transform = `translateX(${posRef.current}px)`;
      }
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
    <section id="reviews" className="relative border-t border-border bg-background py-24 sm:py-32 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Client <span className="text-muted-foreground">Feedback</span>
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            What our clients globally say about working with Aurion Stack
          </p>
        </div>
      </div>

      {/* Infinite scrolling ticker */}
      <div className="relative mb-20">
        <div className="pointer-events-none absolute left-0 top-0 h-full w-16 z-10 bg-gradient-to-r from-background to-transparent sm:w-32" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-16 z-10 bg-gradient-to-l from-background to-transparent sm:w-32" />
        <div
          className="overflow-hidden cursor-pointer"
          onMouseEnter={() => { isPaused.current = true; }}
          onMouseLeave={() => { isPaused.current = false; }}
          onTouchStart={() => { isPaused.current = true; }}
          onTouchEnd={() => { isPaused.current = false; }}
          aria-label="Client reviews — hover to pause"
        >
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
          className="mx-auto max-w-xl rounded-2xl border border-border bg-muted/20 p-6 sm:p-10 text-center shadow-sm"
        >
          <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl mb-2">
            Leave a Review
          </h3>
          <p className="text-sm text-muted-foreground mb-8">
            Rate our work — it'll securely appear in our pipeline.
          </p>

          <div className="space-y-4 text-left">
            <input
              type="text"
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
              placeholder="Your name or company..."
              className="w-full rounded-md border border-border bg-background px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
            />

            <div className="flex items-center gap-3 px-1 py-2">
              <span className="text-sm font-semibold text-foreground">Rating:</span>
              <StarRating rating={newRating} onRate={setNewRating} />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="Share your experience..."
                className="flex-1 min-w-0 rounded-md border border-border bg-background px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
              <button
                onClick={handleSubmit}
                className="w-full sm:w-auto flex-shrink-0 rounded-md bg-foreground px-6 py-3.5 text-sm font-semibold text-background transition-all hover:bg-foreground/90 shadow-sm"
              >
                Submit Review
              </button>
            </div>

            {submitted && (
              <p
                className="text-center text-sm font-semibold text-primary animate-fade-in mt-4"
                role="status"
                aria-live="polite"
              >
                ✓ Your review has been submitted for approval.
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ReviewsSection;
