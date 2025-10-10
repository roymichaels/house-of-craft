import { motion } from "framer-motion";

const ScrollIndicator = () => {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, y: [0, 8, 0] }}
      transition={{
        opacity: { delay: 8, duration: 0.8 },
        y: { repeat: Infinity, duration: 2, ease: "easeInOut" }
      }}
    >
      {/* Minimalist vertical line */}
      <div className="w-px h-12 bg-gradient-to-b from-transparent via-primary/40 to-transparent" />

      {/* Subtle text */}
      <span className="text-xs tracking-widest opacity-40 font-sans">DESCEND</span>
    </motion.div>
  );
};

export default ScrollIndicator;
