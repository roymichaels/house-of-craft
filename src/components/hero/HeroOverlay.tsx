import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import HeroSeal from "./HeroSeal";
import HeroLogo from "./HeroLogo";
import ScrollIndicator from "./ScrollIndicator";
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
        className="absolute bottom-32 left-0 right-0 z-10 text-center px-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 0.6, y: 0 }}
        transition={{ delay: 5, duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        style={prefersReducedMotion ? {} : { opacity: fadeOpacity }}
      >
        <p className="text-sm md:text-base tracking-wider max-w-3xl mx-auto text-balance">
          {subtitle}
        </p>
      </motion.div>

      {/* Main Title - Scroll-triggered reveal */}
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

      {/* CTA - appears later */}
      <motion.div
        className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 7, duration: 1.2, ease: "easeOut" }}
        style={prefersReducedMotion ? {} : { opacity: fadeOpacity }}
      >
        {ctaStyle === "seal" ? (
          <HeroSeal ctaLink={ctaLink} />
        ) : (
          <a
            href={ctaLink}
            className="text-sm tracking-widest opacity-70 hover:opacity-100 
                       transition-opacity duration-300 font-sans pointer-events-auto"
          >
            ENTER
          </a>
        )}
      </motion.div>

      {/* Scroll Indicator */}
      <ScrollIndicator />
    </>
  );
};

export default HeroOverlay;
