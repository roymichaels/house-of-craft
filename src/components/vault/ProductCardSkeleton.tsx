import { motion } from "framer-motion";

const ProductCardSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-lg">
      {/* Image skeleton with APOLLON seal animation */}
      <div className="relative aspect-square bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg overflow-hidden">
        {/* Animated golden shimmer */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Apollon seal in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-16 h-16">
            {/* Outer ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-primary/20"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />

            {/* Inner ring */}
            <motion.div
              className="absolute inset-[20%] rounded-full border-2 border-primary/30"
              animate={{ rotate: -360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />

            {/* Center pulse */}
            <motion.div
              className="absolute inset-[35%] rounded-full bg-primary/20"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="mt-3 space-y-2">
        {/* Title */}
        <div className="h-4 bg-muted/20 rounded-md w-3/4 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-transparent via-primary/10 to-transparent"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.2,
            }}
          />
        </div>
        
        {/* Description */}
        <div className="h-3 bg-muted/20 rounded-md w-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-transparent via-primary/10 to-transparent"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.4,
            }}
          />
        </div>

        {/* Price */}
        <div className="h-4 bg-muted/20 rounded-md w-1/4 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-transparent via-primary/10 to-transparent"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.6,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;

