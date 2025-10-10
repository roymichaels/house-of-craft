import { motion } from "framer-motion";

const ProductCardSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-2xl bg-card/30 backdrop-blur-sm border border-border/30">
      {/* Image skeleton */}
      <div className="relative aspect-[4/5] bg-gradient-to-br from-muted/30 to-muted/10 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Content skeleton */}
      <div className="p-6 space-y-3">
        {/* Title */}
        <div className="h-6 bg-muted/30 rounded-md w-3/4 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-transparent via-primary/5 to-transparent"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
              delay: 0.1,
            }}
          />
        </div>
        
        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 bg-muted/20 rounded-md w-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-transparent via-primary/5 to-transparent"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
                delay: 0.2,
              }}
            />
          </div>
          <div className="h-4 bg-muted/20 rounded-md w-2/3 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-transparent via-primary/5 to-transparent"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
                delay: 0.3,
              }}
            />
          </div>
        </div>

        {/* Price & Button */}
        <div className="flex items-center justify-between pt-2">
          <div className="h-5 bg-muted/20 rounded-md w-20 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-transparent via-primary/5 to-transparent"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
                delay: 0.4,
              }}
            />
          </div>
          <div className="h-9 bg-muted/20 rounded-md w-28 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-transparent via-primary/5 to-transparent"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
                delay: 0.5,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
