import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface HeroSealProps {
  ctaLink: string;
}

const HeroSeal = ({ ctaLink }: HeroSealProps) => {
  return (
    <Link to={ctaLink}>
      <motion.button
        className="group relative w-16 h-16 rounded-full border-2 border-primary/30 
                   backdrop-blur-sm hover:border-primary/60 transition-all duration-500
                   focus:outline-none focus:ring-2 focus:ring-primary/50"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 7, duration: 1.2, ease: "easeOut" }}
        whileHover={{ scale: 1.1 }}
        aria-label="Enter The Order"
      >
        {/* Inner dot */}
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="w-2 h-2 rounded-full bg-primary/60 group-hover:bg-primary 
                           transition-colors duration-300" />
        </span>

        {/* Text appears on hover */}
        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 
                         opacity-0 group-hover:opacity-100 transition-opacity duration-300
                         text-xs tracking-widest font-sans text-foreground/90">
          ENTER
        </span>
      </motion.button>
    </Link>
  );
};

export default HeroSeal;
