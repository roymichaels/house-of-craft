import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import HeroSeal from "./HeroSeal";
import HeroLogo from "./HeroLogo";
import ScrollIndicator from "./ScrollIndicator";

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

  // Scroll-driven animations
  const textY = useTransform(scrollYProgress, [0, 0.2], [0, -100]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

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

      {/* Main Content */}
      <motion.div
        ref={containerRef}
        className="relative z-10 container mx-auto px-6 text-center flex flex-col items-center justify-center min-h-screen"
        style={prefersReducedMotion ? {} : { y: textY, opacity: textOpacity }}
      >
        {/* Tagline */}
        <motion.p
          className="text-base md:text-lg tracking-wider mb-6 max-w-2xl mx-auto text-balance"
          style={
            prefersReducedMotion
              ? { opacity: 0.7 }
              : {
                  opacity: 0.7,
                  x: mousePosition.x * 0.3,
                  y: mousePosition.y * 0.3,
                }
          }
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.7, y: 0 }}
          transition={{ delay: baseDelay + 1, duration: 1.5, ease: "easeOut" }}
        >
          {subtitle}
        </motion.p>

        {/* Main Title */}
        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-serif mb-10 tracking-tight text-balance"
          style={
            prefersReducedMotion
              ? { opacity: 0.85 }
              : {
                  opacity: 0.85,
                  x: mousePosition.x * 0.5,
                  y: mousePosition.y * 0.5,
                }
          }
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 0.85, scale: 1 }}
          transition={{
            delay: baseDelay + 2,
            duration: 1.5,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {title}
        </motion.h1>

        {/* CTA */}
        {ctaStyle === "seal" ? (
          <HeroSeal ctaLink={ctaLink} />
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: baseDelay + 4, duration: 1.2, ease: "easeOut" }}
          >
            <a
              href={ctaLink}
              className="text-sm tracking-widest opacity-70 hover:opacity-100 
                         transition-opacity duration-300 font-sans"
            >
              ENTER
            </a>
          </motion.div>
        )}

        {/* Scroll Indicator */}
        <ScrollIndicator />
      </motion.div>
    </>
  );
};

export default HeroOverlay;
