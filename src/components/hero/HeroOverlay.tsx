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
