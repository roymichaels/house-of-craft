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
    <div className="absolute inset-0 z-20 flex flex-col text-center px-8 h-full pointer-events-none">
      <div className="flex flex-col h-full justify-between pt-8 pb-0">
        {/* APOLLO Title - Top */}
        <motion.h1
          className="text-6xl md:text-8xl font-ancient text-ancient-gold tracking-[0.15em] drop-shadow-[0_0_40px_rgba(212,175,55,0.6)] pt-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          APOLLO
        </motion.h1>

        {/* Bottom Section - Subtitle + CTAs */}
        <div className="flex flex-col items-center gap-3 pb-0">
          {/* Subtitle with decorative divider */}
          <motion.div
          className="max-w-2xl mx-auto mb-2 md:mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-ancient-gold/40 to-ancient-gold/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-ancient-gold animate-pulse" />
            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-ancient-gold/40 to-ancient-gold/40" />
          </div>
          <p className="text-base md:text-xl text-ancient-silver/80 font-light tracking-wide text-center px-4">
            {subtitle}
          </p>
          <div className="flex items-center gap-3 md:gap-4 mt-2 md:mt-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-ancient-gold/40 to-ancient-gold/40" />
            <div className="imperial-caps text-xs text-ancient-gold/60 tracking-widest">EST. MMXXIV</div>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-ancient-gold/40 to-ancient-gold/40" />
          </div>
          </motion.div>

          {/* Three Actions - Enhanced with icons and glow */}
          <motion.div
          className="flex flex-col md:flex-row items-center gap-2 md:gap-6 pointer-events-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Gold Button - Explore Collections */}
          <motion.button
            onClick={() => openModal('collections')}
            className="
              relative group h-12 px-8 md:px-10 rounded-sm overflow-hidden
              bg-gradient-to-r from-ancient-gold via-aureate to-ancient-gold
              bg-[length:200%_100%]
              text-background
              font-romania text-xs md:text-sm tracking-[0.25em] font-semibold uppercase
              shadow-[0_0_20px_hsl(var(--ancient-gold)/0.4),inset_0_1px_0_rgba(255,255,255,0.2)]
              hover:shadow-[0_0_35px_hsl(var(--ancient-gold)/0.7),inset_0_1px_0_rgba(255,255,255,0.4)]
              hover:bg-[position:100%_0]
              transition-all duration-500 ease-out
              focus:outline-none focus:ring-1 focus:ring-ancient-gold focus:ring-offset-1
              focus:ring-offset-background
              before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/15 before:to-transparent
              before:translate-x-[-100%] before:transition-transform before:duration-700
              hover:before:translate-x-[100%]
            "
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="relative z-10 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              EXPLORE COLLECTIONS
            </span>
          </motion.button>

          {/* Glass Button - Philosophy */}
          <motion.button
            onClick={() => openModal('philosophy')}
            className="
              relative group h-12 px-8 md:px-10 rounded-sm
              bg-black/10 backdrop-blur-sm
              border border-ancient-gold/30
              text-ancient-gold
              font-romania text-xs md:text-sm tracking-[0.25em] font-semibold uppercase
              hover:border-ancient-gold/60 hover:bg-ancient-gold/5
              hover:shadow-[0_0_20px_hsl(var(--ancient-gold)/0.3),inset_0_0_15px_hsl(var(--ancient-gold)/0.05)]
              transition-all duration-500 ease-out
              focus:outline-none focus:ring-1 focus:ring-ancient-gold/50 focus:ring-offset-1
              focus:ring-offset-background
            "
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="relative z-10 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              PHILOSOPHY
            </span>
          </motion.button>

          {/* Minimal Text Link - Mission */}
          <motion.button
            onClick={() => openModal('mission')}
            className="
              relative group h-12 px-8 md:px-10
              text-ancient-gold/90
              font-romania text-xs md:text-sm tracking-[0.25em] font-semibold uppercase
              hover:text-ancient-gold
              transition-all duration-300 ease-out
              focus:outline-none
              before:absolute before:bottom-2 before:left-0 before:right-0 before:h-px
              before:bg-gradient-to-r before:from-transparent before:via-ancient-gold/50 before:to-transparent
              before:scale-x-0 before:origin-center before:transition-transform before:duration-500
              hover:before:scale-x-100
            "
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="relative z-10 flex items-center gap-1.5">
              <Scroll className="w-3.5 h-3.5" />
              MISSION
            </span>
          </motion.button>
        </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroOverlay;
