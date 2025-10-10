import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useSceneStore } from "@/contexts/SceneContext";

const FixedTempleColumns = () => {
  const { scrollYProgress } = useScroll();
  const { mode } = useSceneStore();
  const [mouseY, setMouseY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseY((e.clientY / window.innerHeight - 0.5) * 20);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const columnRotation = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const glowIntensity = mode === 'circle' ? 1 : 0.3;

  return (
    <>
      {/* Left Column */}
      <motion.div
        className="fixed left-0 top-0 h-screen w-24 md:w-32 z-30 pointer-events-none hidden lg:block"
        style={{
          rotateY: columnRotation,
          y: mouseY,
        }}
      >
        <div className="relative h-full w-full">
          {/* Capital (Top) */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-ancient-gold/20 to-transparent">
            <div className="w-full h-full border-b-2 border-ancient-gold/50 shadow-[0_0_20px_rgba(196,166,97,0.3)]" 
                 style={{ 
                   background: 'linear-gradient(90deg, transparent 0%, hsl(var(--ancient-gold)/0.2) 30%, hsl(var(--ancient-gold)/0.3) 50%, hsl(var(--ancient-gold)/0.2) 70%, transparent 100%)',
                   opacity: glowIntensity
                 }} 
            />
          </div>

          {/* Fluted Shaft */}
          <div className="absolute top-32 bottom-24 left-0 w-full">
            <svg className="w-full h-full opacity-40" preserveAspectRatio="none">
              <defs>
                <linearGradient id="marbleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--background))" stopOpacity="0.3" />
                  <stop offset="15%" stopColor="hsl(var(--ancient-silver))" stopOpacity="0.6" />
                  <stop offset="30%" stopColor="hsl(var(--muted))" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="hsl(var(--ancient-silver))" stopOpacity="1" />
                  <stop offset="70%" stopColor="hsl(var(--muted))" stopOpacity="0.8" />
                  <stop offset="85%" stopColor="hsl(var(--ancient-silver))" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="hsl(var(--background))" stopOpacity="0.3" />
                </linearGradient>
                <pattern id="flutes" x="0" y="0" width="20" height="100%" patternUnits="userSpaceOnUse">
                  <rect x="0" y="0" width="10" height="100%" fill="url(#marbleGradient)" />
                  <rect x="10" y="0" width="10" height="100%" fill="hsl(var(--background)/0.5)" />
                </pattern>
              </defs>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#flutes)" />
            </svg>
            <div 
              className="absolute inset-0 shadow-[inset_0_0_50px_rgba(196,166,97,0.2)]"
              style={{ opacity: glowIntensity }}
            />
          </div>

          {/* Base (Bottom) */}
          <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-ancient-gold/20 to-transparent">
            <div className="w-full h-full border-t-2 border-ancient-gold/50 shadow-[0_0_20px_rgba(196,166,97,0.3)]" 
                 style={{ 
                   background: 'linear-gradient(90deg, transparent 0%, hsl(var(--ancient-gold)/0.2) 30%, hsl(var(--ancient-gold)/0.3) 50%, hsl(var(--ancient-gold)/0.2) 70%, transparent 100%)',
                   opacity: glowIntensity
                 }} 
            />
          </div>
        </div>
      </motion.div>

      {/* Right Column */}
      <motion.div
        className="fixed right-0 top-0 h-screen w-24 md:w-32 z-30 pointer-events-none hidden lg:block"
        style={{
          rotateY: useTransform(scrollYProgress, [0, 1], [0, -360]),
          y: mouseY,
        }}
      >
        <div className="relative h-full w-full">
          {/* Capital (Top) */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-ancient-gold/20 to-transparent">
            <div className="w-full h-full border-b-2 border-ancient-gold/50 shadow-[0_0_20px_rgba(196,166,97,0.3)]" 
                 style={{ 
                   background: 'linear-gradient(90deg, transparent 0%, hsl(var(--ancient-gold)/0.2) 30%, hsl(var(--ancient-gold)/0.3) 50%, hsl(var(--ancient-gold)/0.2) 70%, transparent 100%)',
                   opacity: glowIntensity
                 }} 
            />
          </div>

          {/* Fluted Shaft */}
          <div className="absolute top-32 bottom-24 left-0 w-full">
            <svg className="w-full h-full opacity-40" preserveAspectRatio="none">
              <rect x="0" y="0" width="100%" height="100%" fill="url(#flutes)" />
            </svg>
            <div 
              className="absolute inset-0 shadow-[inset_0_0_50px_rgba(196,166,97,0.2)]"
              style={{ opacity: glowIntensity }}
            />
          </div>

          {/* Base (Bottom) */}
          <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-ancient-gold/20 to-transparent">
            <div className="w-full h-full border-t-2 border-ancient-gold/50 shadow-[0_0_20px_rgba(196,166,97,0.3)]" 
                 style={{ 
                   background: 'linear-gradient(90deg, transparent 0%, hsl(var(--ancient-gold)/0.2) 30%, hsl(var(--ancient-gold)/0.3) 50%, hsl(var(--ancient-gold)/0.2) 70%, transparent 100%)',
                   opacity: glowIntensity
                 }} 
            />
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default FixedTempleColumns;
