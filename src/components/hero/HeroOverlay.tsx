import { motion } from "framer-motion";
import { useModalStore } from "@/stores/modalStore";
import { Eye, Scroll, Sparkles } from "lucide-react";

interface HeroOverlayProps {
  title: string;
  subtitle: string;
}

const HeroOverlay = ({ title, subtitle }: HeroOverlayProps) => {
  const { openModal } = useModalStore();

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-8 h-full pointer-events-none">
      <div className="flex flex-col items-center justify-center h-full space-y-12 md:space-y-16">
        {/* Title - Hidden as it's now 3D in the scene */}

        {/* Subtitle with decorative divider */}
        <motion.div
          className="max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-ancient-gold/40 to-ancient-gold/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-ancient-gold animate-pulse" />
            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-ancient-gold/40 to-ancient-gold/40" />
          </div>
          <p className="text-lg md:text-xl text-ancient-silver/80 font-light tracking-wide text-center">
            {subtitle}
          </p>
          <div className="flex items-center gap-4 mt-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-ancient-gold/40 to-ancient-gold/40" />
            <div className="imperial-caps text-xs text-ancient-gold/60 tracking-widest">EST. MMXXIV</div>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-ancient-gold/40 to-ancient-gold/40" />
          </div>
        </motion.div>

        {/* Three Actions - Enhanced with icons and glow */}
        <motion.div
          className="flex flex-col md:flex-row items-center gap-4 md:gap-6 pt-8 pointer-events-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Gold Button - Explore Collections */}
          <motion.button
            onClick={() => openModal('collections')}
            className="
              relative group h-14 px-10 md:px-12 rounded overflow-hidden
              bg-gradient-to-r from-ancient-gold via-aureate to-ancient-gold
              bg-[length:200%_100%]
              text-background
              font-romania text-sm md:text-base tracking-[0.2em] font-bold
              shadow-[0_0_30px_hsl(var(--ancient-gold)/0.5),inset_0_1px_1px_rgba(255,255,255,0.3)]
              hover:shadow-[0_0_50px_hsl(var(--ancient-gold)/0.8),inset_0_1px_1px_rgba(255,255,255,0.5)]
              hover:bg-[position:100%_0]
              transition-all duration-500 ease-out
              focus:outline-none focus:ring-2 focus:ring-ancient-gold focus:ring-offset-2
              focus:ring-offset-background
              before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
              before:translate-x-[-100%] before:transition-transform before:duration-700
              hover:before:translate-x-[100%]
            "
            whileHover={{ scale: 1.05, rotateX: 2 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              EXPLORE COLLECTIONS
            </span>
          </motion.button>

          {/* Glass Button - Philosophy */}
          <motion.button
            onClick={() => openModal('philosophy')}
            className="
              relative group h-14 px-10 md:px-12 rounded
              bg-black/20 backdrop-blur-md
              border-2 border-ancient-gold/40
              text-ancient-gold
              font-romania text-sm md:text-base tracking-[0.2em] font-bold
              hover:border-ancient-gold hover:bg-ancient-gold/10
              hover:shadow-[0_0_30px_hsl(var(--ancient-gold)/0.4),inset_0_0_20px_hsl(var(--ancient-gold)/0.1)]
              transition-all duration-500 ease-out
              focus:outline-none focus:ring-2 focus:ring-ancient-gold/50 focus:ring-offset-2
              focus:ring-offset-background
            "
            whileHover={{ scale: 1.05, rotateX: 2 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              PHILOSOPHY
            </span>
          </motion.button>

          {/* Minimal Text Link - Mission */}
          <motion.button
            onClick={() => openModal('mission')}
            className="
              relative group h-14 px-10 md:px-12
              text-ancient-gold
              font-romania text-sm md:text-base tracking-[0.2em] font-bold
              hover:text-aureate
              transition-all duration-300 ease-out
              focus:outline-none
              before:absolute before:bottom-3 before:left-0 before:right-0 before:h-px
              before:bg-gradient-to-r before:from-transparent before:via-ancient-gold before:to-transparent
              before:scale-x-0 before:origin-center before:transition-transform before:duration-500
              hover:before:scale-x-100
            "
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 flex items-center gap-2">
              <Scroll className="w-4 h-4" />
              MISSION
            </span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroOverlay;
