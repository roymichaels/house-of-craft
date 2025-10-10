import { motion } from "framer-motion";

interface RomanDividerProps {
  className?: string;
}

const RomanDivider = ({ className = "" }: RomanDividerProps) => {
  return (
    <motion.div
      className={`flex items-center justify-center gap-4 ${className}`}
      initial={{ opacity: 0, scaleX: 0 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true }}
    >
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-ancient-gold/40 to-ancient-gold/40" />
      <div className="w-1.5 h-1.5 rounded-full bg-ancient-gold" />
      <div className="h-px flex-1 bg-gradient-to-l from-transparent via-ancient-gold/40 to-ancient-gold/40" />
    </motion.div>
  );
};

export default RomanDivider;
