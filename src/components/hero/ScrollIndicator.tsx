import { motion } from "framer-motion";

const ScrollIndicator = () => {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: [0, 0.4, 0.7, 0.4],
        scale: [1, 1.05, 1.1, 1.05, 1]
      }}
      transition={{
        opacity: { delay: 7, duration: 3, ease: "easeInOut", repeat: Infinity },
        scale: { delay: 7, duration: 3, ease: "easeInOut", repeat: Infinity }
      }}
    >
      {/* Minimalist vertical line */}
      <div className="w-px h-12 bg-gradient-to-b from-transparent via-primary/40 to-transparent" />

      {/* Breathing text */}
      <span className="text-xs tracking-widest font-sans">DISCOVER</span>
    </motion.div>
  );
};

export default ScrollIndicator;
