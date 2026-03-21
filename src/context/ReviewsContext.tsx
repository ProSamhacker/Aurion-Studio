import { createContext, useContext, useState, ReactNode } from "react";

export interface Review {
  text: string;
  author: string;
  rating: number;
}

const defaultReviews: Review[] = [
  {
    text: "Aurion Stack completely transformed our backend infrastructure and delivered a flawless app. Highly recommend!",
    author: "Sarah J.",
    rating: 5,
  },
  {
    text: "The AI automation they integrated saved us hundreds of hours a month. Brilliant team.",
    author: "Mark T.",
    rating: 5,
  },
  {
    text: "Their attention to detail and technical expertise is unmatched. A true partner in innovation.",
    author: "David R.",
    rating: 5,
  },
  {
    text: "Delivered a pixel-perfect mobile app on time and under budget. Exceptional communication throughout.",
    author: "Priya K.",
    rating: 5,
  },
  {
    text: "The full-stack solution they built scales effortlessly. Our users love the experience.",
    author: "James L.",
    rating: 5,
  },
];

interface ReviewsContextType {
  reviews: Review[];
  addReview: (r: Review) => void;
  avgRating: number;
}

const ReviewsContext = createContext<ReviewsContextType>({
  reviews: defaultReviews,
  addReview: () => {},
  avgRating: 5,
});

export const ReviewsProvider = ({ children }: { children: ReactNode }) => {
  const [reviews, setReviews] = useState<Review[]>(defaultReviews);

  const addReview = (r: Review) => setReviews((prev) => [...prev, r]);

  const avgRating =
    reviews.length === 0
      ? 0
      : Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10;

  return (
    <ReviewsContext.Provider value={{ reviews, addReview, avgRating }}>
      {children}
    </ReviewsContext.Provider>
  );
};

export const useReviews = () => useContext(ReviewsContext);
