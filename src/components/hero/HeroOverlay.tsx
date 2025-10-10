import { motion } from "framer-motion";
import { useModalStore } from "@/stores/modalStore";

interface HeroOverlayProps {
  title: string;
  subtitle: string;
}

const HeroOverlay = ({ title, subtitle }: HeroOverlayProps) => {
  const { openModal } = useModalStore();

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-8 h-full">
      <div className="flex flex-col items-center justify-center h-full space-y-12 md:space-y-16">
        {/* Headline */}
        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-ancient text-ancient-gold tracking-wider drop-shadow-[0_0_40px_rgba(212,175,55,0.4)]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {title}
        </motion.h1>

        {/* Tagline */}
        <motion.p
          className="text-sm md:text-lg font-romania tracking-wider text-muted-foreground max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.7, y: 0 }}
          transition={{ delay: 2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          {subtitle}
        </motion.p>

        {/* Three Actions - Horizontal Layout */}
        <motion.div
          className="flex flex-col md:flex-row items-center gap-4 md:gap-6 pt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Gold Button - Explore Collections */}
          <motion.button
            onClick={() => openModal('collections')}
            className="
              h-14 px-10 md:px-12 rounded
              bg-ancient-gold text-background
              font-ancient text-sm md:text-base tracking-[0.2em] font-bold
              shadow-[0_0_30px_hsl(var(--ancient-gold)/0.4)]
              hover:shadow-[0_0_40px_hsl(var(--ancient-gold)/0.6)]
              hover:brightness-110
              transition-all duration-500 ease-out
              focus:outline-none focus:ring-2 focus:ring-ancient-gold/50 focus:ring-offset-2
              focus:ring-offset-background
            "
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            EXPLORE COLLECTIONS
          </motion.button>

          {/* Black Button - Philosophy */}
          <motion.button
            onClick={() => openModal('philosophy')}
            className="
              h-14 px-10 md:px-12 rounded
              bg-transparent border-2 border-foreground/30 text-foreground
              font-ancient text-sm md:text-base tracking-[0.2em] font-bold
              hover:border-ancient-gold hover:text-ancient-gold
              hover:shadow-[0_0_20px_hsl(var(--ancient-gold)/0.3)]
              transition-all duration-500 ease-out
              focus:outline-none focus:ring-2 focus:ring-ancient-gold/50 focus:ring-offset-2
              focus:ring-offset-background
            "
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            PHILOSOPHY
          </motion.button>

          {/* Text Link - Mission */}
          <motion.button
            onClick={() => openModal('mission')}
            className="
              h-14 px-6
              text-sm font-romania text-muted-foreground/60 tracking-wider
              hover:text-ancient-gold transition-colors duration-300 
              underline decoration-dotted underline-offset-4
              focus:outline-none focus:ring-2 focus:ring-ancient-gold/50 focus:ring-offset-2
              focus:ring-offset-background rounded
            "
          >
            Mission
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroOverlay;
