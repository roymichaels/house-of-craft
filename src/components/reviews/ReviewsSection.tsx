import { motion } from "framer-motion";
import { Star, ThumbsUp, VerifiedIcon } from "lucide-react";
import { useState } from "react";

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  verified: boolean;
  helpful: number;
}

interface ReviewsSectionProps {
  productId?: string;
  averageRating?: number;
  totalReviews?: number;
}

// Mock reviews data (in a real app, this would come from API/database)
const mockReviews: Review[] = [
  {
    id: '1',
    author: 'Marcus A.',
    rating: 5,
    date: '2025-09-15',
    title: 'Exceptional craftsmanship',
    content: 'The attention to detail is remarkable. This piece exceeded my expectations in every way. The quality speaks for itself.',
    verified: true,
    helpful: 12
  },
  {
    id: '2',
    author: 'James K.',
    rating: 5,
    date: '2025-09-10',
    title: 'Worth every penny',
    content: 'A timeless addition to my collection. The heritage and precision are evident in every aspect of this masterpiece.',
    verified: true,
    helpful: 8
  },
  {
    id: '3',
    author: 'David R.',
    rating: 4,
    date: '2025-09-05',
    title: 'Beautiful design',
    content: 'Stunning piece with excellent build quality. Delivery was fast and packaging was premium. Highly recommended.',
    verified: true,
    helpful: 5
  }
];

const ReviewsSection = ({ 
  productId, 
  averageRating = 4.8, 
  totalReviews = 127 
}: ReviewsSectionProps) => {
  const [reviews] = useState<Review[]>(mockReviews);

  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={
              star <= rating
                ? "fill-primary text-primary"
                : "fill-muted/20 text-muted/20"
            }
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="flex items-center gap-6 pb-6 border-b border-border/20">
        <div className="text-center">
          <div className="text-4xl font-ancient text-ancient-gold mb-2">
            {averageRating}
          </div>
          <StarRating rating={Math.round(averageRating)} />
          <p className="text-xs text-muted-foreground mt-2">
            {totalReviews} reviews
          </p>
        </div>

        {/* Rating Distribution */}
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => {
            const percentage = stars === 5 ? 82 : stars === 4 ? 15 : 3;
            return (
              <div key={stars} className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground w-8">{stars}★</span>
                <div className="flex-1 h-2 bg-muted/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, delay: stars * 0.1 }}
                  />
                </div>
                <span className="text-muted-foreground w-10">{percentage}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-lg bg-card/20 backdrop-blur-sm border border-border/20"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-foreground text-sm">
                    {review.author}
                  </span>
                  {review.verified && (
                    <div className="flex items-center gap-1 text-primary">
                      <VerifiedIcon size={12} />
                      <span className="text-[10px]">Verified</span>
                    </div>
                  )}
                </div>
                <StarRating rating={review.rating} />
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(review.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>

            <h4 className="font-medium text-foreground mb-2 text-sm">
              {review.title}
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              {review.content}
            </p>

            <motion.button
              className="flex items-center gap-1.5 text-xs text-muted-foreground 
                         hover:text-foreground transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ThumbsUp size={12} />
              <span>Helpful ({review.helpful})</span>
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* View All Reviews Button */}
      <motion.button
        className="w-full py-3 rounded-full border border-border/30
                   text-foreground text-sm font-medium
                   hover:border-primary/40 hover:bg-primary/5
                   transition-all"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        View All {totalReviews} Reviews
      </motion.button>
    </div>
  );
};

export default ReviewsSection;
