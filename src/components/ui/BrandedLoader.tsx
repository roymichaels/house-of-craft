import { motion } from "framer-motion";

interface BrandedLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const BrandedLoader = ({ size = 'md', text }: BrandedLoaderProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Apollon Seal Animation */}
      <div className="relative" style={{ width: sizeClasses[size], height: sizeClasses[size] }}>
        {/* Outer ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />

        {/* Middle ring */}
        <motion.div
          className="absolute inset-[15%] rounded-full border-2 border-primary/50"
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />

        {/* Inner circle with pulse */}
        <motion.div
          className="absolute inset-[30%] rounded-full bg-primary/20"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Center dot */}
        <div className="absolute inset-[45%] rounded-full bg-primary" />
      </div>

      {/* Loading text */}
      {text && (
        <motion.p
          className="text-sm font-ancient text-ancient-gold tracking-wider"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default BrandedLoader;
