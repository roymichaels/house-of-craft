import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import HeroLogo from "./HeroLogo";
import { useTitleReveal } from "@/hooks/useTitleReveal";

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
