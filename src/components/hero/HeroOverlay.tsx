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
      {/* Hero Logo */}
      <HeroLogo logoText={logoText} show={showLogo} />

      {/* Tagline - appears at 5-7s in lower third */}
      <motion.div
        className="absolute bottom-[25vh] md:bottom-[30vh] left-0 right-0 z-20 text-center px-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 0.6, y: 0 }}
        transition={{ delay: 5, duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        style={prefersReducedMotion ? {} : { opacity: fadeOpacity }}
      >
        <p className="text-sm md:text-base tracking-wider max-w-3xl mx-auto text-balance">
          {subtitle}
        </p>
      </motion.div>

      {/* The Summoning CTA - appears at 7-9s */}
      <motion.div
        className="absolute bottom-[15vh] md:bottom-[20vh] left-0 right-0 z-30 flex flex-col items-center gap-6 px-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 7, duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        style={prefersReducedMotion ? {} : { opacity: fadeOpacity }}
      >
        {/* Sacred Sigil Button */}
        <button
          onClick={() => openModal('collections')}
          className="group relative w-24 h-24 rounded-full 
                     border-2 border-primary/40 backdrop-blur-sm
                     hover:border-primary/80 transition-all duration-700
                     hover:shadow-[0_0_40px_rgba(196,166,97,0.4)]
                     focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          {/* Rotating outer ring */}
          <span className="absolute inset-0 rounded-full border border-primary/20 
                           animate-[spin_20s_linear_infinite]" />
          
          {/* Inner sigil */}
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="font-ancient text-primary text-2xl">☉</span>
          </span>
          
          {/* Hover glow */}
          <span className="absolute inset-0 rounded-full bg-primary/5 
                           opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </button>
        
        {/* CTA Text */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 8, duration: 1 }}
        >
          <p className="font-ancient text-primary text-base tracking-[0.2em] mb-1">
            ENTER THE ORDER
          </p>
          <p className="text-xs text-muted-foreground/60 tracking-wider">
            The Vault of Instruments Awaits
          </p>
        </motion.div>
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
