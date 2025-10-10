import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import HeroLogo from "./HeroLogo";
import { useTitleReveal } from "@/hooks/useTitleReveal";
import { useModalStore } from "@/stores/modalStore";

interface HeroOverlayProps {
  title: string;
  subtitle: string;
  ctaLink: string;
  ctaStyle: string;
  showLogo: boolean;
  logoText: string;
  textDelayMs: number;
}

const HeroOverlay = ({
  title,
  subtitle,
  ctaLink,
  ctaStyle,
  showLogo,
  logoText,
  textDelayMs,
}: HeroOverlayProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const { openModal } = useModalStore();
  
  // Title reveal hook for scroll-triggered entrance
  const { titleOpacity, titleY, titleScale } = useTitleReveal();

  // Scroll-driven animations for fade out
  const fadeOpacity = useTransform(scrollYProgress, [0.8, 1], [1, 0]);
  
  // Only show title after 60% scroll (0.6) to prevent initial interference
  const showTitle = useTransform(scrollYProgress, (value) => value > 0.6);

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const baseDelay = textDelayMs / 1000;

  return (
    <>
      {/* Tagline - appears at 4s in lower third */}
      <motion.div
        className="absolute bottom-[35vh] md:bottom-[42vh] left-0 right-0 z-20 text-center px-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 0.6, y: 0 }}
        transition={{ delay: 4, duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        style={prefersReducedMotion ? {} : { opacity: fadeOpacity }}
      >
        <p className="text-sm md:text-base font-romania tracking-wider max-w-lg md:max-w-3xl mx-auto text-balance">
          {subtitle}
        </p>
      </motion.div>

      {/* The Summoning CTAs - Ceremonial Buttons - appears at 5.5s */}
      <motion.div
        className="absolute bottom-[15vh] md:bottom-[20vh] left-0 right-0 z-30 flex flex-col items-center gap-8 md:gap-12 px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 5.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={prefersReducedMotion ? {} : { opacity: fadeOpacity }}
      >
        {/* Primary CTA - Explore the Instruments */}
        <div className="relative group">
          {/* Initial pulse ring */}
          <motion.div
            className="absolute inset-0 rounded border-2 border-primary/60 pointer-events-none"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ delay: 6.5, duration: 1.5, ease: "easeOut" }}
          />

          {/* Continuous breathing pulse */}
          <motion.div
            className="absolute inset-0 rounded pointer-events-none"
            initial={{ scale: 1, opacity: 0 }}
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0, 0.3, 0]
            }}
            transition={{ 
              delay: 6.5,
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "easeInOut"
            }}
            style={{
              border: '2px solid hsl(var(--primary))',
            }}
          />

          <motion.a
            href="#objects"
            className="
              relative px-16 py-5 md:px-20 md:py-6 rounded block
              bg-primary text-primary-foreground
              font-ancient text-base md:text-lg tracking-[0.2em] font-bold
              shadow-[0_0_30px_hsl(var(--primary)/0.4)]
              hover:shadow-[0_0_40px_hsl(var(--primary)/0.7)]
              hover:brightness-110
              transition-all duration-500 ease-out
              focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
              focus:ring-offset-background
              
              before:absolute before:inset-0 before:rounded
              before:border-2 before:border-primary/30
              before:scale-100 before:opacity-0
              hover:before:scale-110 hover:before:opacity-100
              before:transition-all before:duration-700
              before:pointer-events-none
            "
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ delay: 6, duration: 0.6, ease: "easeOut" }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            EXPLORE THE INSTRUMENTS
          </motion.a>
        </div>
        
        {/* Secondary CTA - Explore the Philosophy */}
        <motion.a
          href="#doctrine"
          className="text-xs font-romania text-muted-foreground/50 tracking-wider
                     hover:text-primary transition-colors duration-300 underline decoration-dotted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 7, duration: 1 }}
        >
          Explore the Philosophy
        </motion.a>
      </motion.div>

      {/* Main Title - Scroll-triggered reveal (only after 60% scroll) */}
      {showTitle.get() && (
        <motion.div
          ref={containerRef}
          className="relative z-10 container mx-auto px-6 text-center flex flex-col items-center justify-center min-h-screen pointer-events-none"
          style={
            prefersReducedMotion
              ? {}
              : { 
                  opacity: titleOpacity, 
                  y: titleY, 
                  scale: titleScale 
                }
          }
        >
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-serif tracking-tight text-balance"
            style={
              prefersReducedMotion
                ? { opacity: 0.85 }
                : {
                    opacity: 0.85,
                    x: mousePosition.x * 0.5,
                    y: mousePosition.y * 0.5,
                  }
            }
          >
            {title}
          </motion.h1>
        </motion.div>
      )}

    </>
  );
};

export default HeroOverlay;
