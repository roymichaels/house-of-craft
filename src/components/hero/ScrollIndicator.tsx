import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const ScrollIndicator = () => {
  const handleScroll = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 cursor-pointer"
      onClick={handleScroll}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2, duration: 0.8 }}
    >
      <motion.div
        className="flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="text-ancient-gold/60 imperial-caps text-xs tracking-widest">
          Scroll
        </div>
        <div className="relative">
          {/* Outer glow ring */}
          <motion.div
            className="absolute inset-0 rounded-full border border-ancient-gold/30"
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
          {/* Icon container */}
          <div className="relative w-10 h-10 rounded-full border border-ancient-gold/50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <ChevronDown className="w-5 h-5 text-ancient-gold" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ScrollIndicator;
