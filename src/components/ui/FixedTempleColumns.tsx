import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useSceneStore } from "@/contexts/SceneContext";

const FixedTempleColumns = () => {
  const { scrollYProgress } = useScroll();
  const { mode } = useSceneStore();
  const [mouseY, setMouseY] = useState(0);
  const [continuousRotation, setContinuousRotation] = useState(0);
  const [breathingScale, setBreathingScale] = useState(1);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseY((e.clientY / window.innerHeight - 0.5) * 15);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Continuous rotation animation
  useEffect(() => {
    let animationFrameId: number;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      setContinuousRotation((elapsed * 0.1) % 360);
      setBreathingScale(1 + Math.sin(elapsed * 0.5) * 0.02);
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const scrollRotation = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const glowIntensity = mode === 'circle' ? 1 : 0.6;

  return (
    <>
      {/* Left Column */}
      <motion.div
        className="fixed left-0 top-0 h-screen w-24 md:w-32 lg:w-36 z-30 pointer-events-none hidden lg:block"
        style={{
          rotateY: continuousRotation,
          y: mouseY,
          scale: breathingScale,
          willChange: 'transform',
          transform: 'translateZ(0)',
        }}
      >
        <div className="relative h-full w-full">
          {/* Capital (Top) */}
          <div className="absolute top-0 left-0 w-full h-32">
            {/* Divine Crown Glow */}
            <div className="absolute top-0 left-0 w-full h-40 z-29 pointer-events-none"
                 style={{
                   background: 'radial-gradient(circle, rgba(255,217,102,0.5) 0%, transparent 70%)',
                   mixBlendMode: 'screen',
                   animation: 'pulse 2s ease-in-out infinite',
                   opacity: glowIntensity
                 }} 
            />
            {/* Point Light */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full z-29"
                 style={{
                   background: '#ffd966',
                   boxShadow: '0 0 30px 10px rgba(255,217,102,0.8)',
                   animation: 'float 3s ease-in-out infinite',
                   opacity: glowIntensity
                 }}
            />
            <div className="w-full h-full border-b-4 border-[#d4af37] shadow-[0_0_40px_rgba(212,175,55,0.6),inset_0_0_30px_rgba(212,175,55,0.3)]" 
                 style={{ 
                   background: 'linear-gradient(90deg, #8b7021 0%, #b8902d 30%, #d4af37 50%, #b8902d 70%, #8b7021 100%)',
                   opacity: glowIntensity
                 }} 
            />
          </div>

          {/* Fluted Shaft */}
          <div className="absolute top-32 bottom-24 left-0 w-full">
            <svg className="w-full h-full opacity-90" preserveAspectRatio="none">
              <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8b7021" stopOpacity="1" />
                  <stop offset="25%" stopColor="#b8902d" stopOpacity="1" />
                  <stop offset="50%" stopColor="#d4af37" stopOpacity="1" />
                  <stop offset="75%" stopColor="#b8902d" stopOpacity="1" />
                  <stop offset="100%" stopColor="#8b7021" stopOpacity="1" />
                </linearGradient>
                <linearGradient id="goldHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6d5a1a" stopOpacity="1" />
                  <stop offset="50%" stopColor="#f1d68b" stopOpacity="1" />
                  <stop offset="100%" stopColor="#6d5a1a" stopOpacity="1" />
                </linearGradient>
                <pattern id="flutes" x="0" y="0" width="30" height="100%" patternUnits="userSpaceOnUse">
                  <rect x="0" y="0" width="15" height="100%" fill="url(#goldGradient)" />
                  <rect x="15" y="0" width="15" height="100%" fill="url(#goldHighlight)" />
                </pattern>
              </defs>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#flutes)" />
            </svg>
            <div 
              className="absolute inset-0 shadow-[inset_0_0_80px_rgba(212,175,55,0.4),0_0_60px_rgba(212,175,55,0.3)]"
              style={{ opacity: glowIntensity }}
            />
          </div>

          {/* Base (Bottom) */}
          <div className="absolute bottom-0 left-0 w-full h-24">
            <div className="w-full h-full border-t-4 border-[#d4af37] shadow-[0_0_50px_rgba(212,175,55,0.7),inset_0_0_40px_rgba(212,175,55,0.4)]" 
                 style={{ 
                   background: 'linear-gradient(90deg, #8b7021 0%, #b8902d 30%, #d4af37 50%, #b8902d 70%, #8b7021 100%)',
                   opacity: glowIntensity
                 }} 
            />
          </div>
        </div>
      </motion.div>

      {/* Right Column */}
      <motion.div
        className="fixed right-0 top-0 h-screen w-24 md:w-32 lg:w-36 z-30 pointer-events-none hidden lg:block"
        style={{
          rotateY: -continuousRotation,
          y: mouseY,
          scale: breathingScale,
          willChange: 'transform',
          transform: 'translateZ(0)',
        }}
      >
        <div className="relative h-full w-full">
          {/* Capital (Top) */}
          <div className="absolute top-0 left-0 w-full h-32">
            {/* Divine Crown Glow */}
            <div className="absolute top-0 left-0 w-full h-40 z-29 pointer-events-none"
                 style={{
                   background: 'radial-gradient(circle, rgba(255,217,102,0.5) 0%, transparent 70%)',
                   mixBlendMode: 'screen',
                   animation: 'pulse 2s ease-in-out infinite',
                   opacity: glowIntensity
                 }} 
            />
            {/* Point Light */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full z-29"
                 style={{
                   background: '#ffd966',
                   boxShadow: '0 0 30px 10px rgba(255,217,102,0.8)',
                   animation: 'float 3s ease-in-out infinite',
                   opacity: glowIntensity
                 }}
            />
            <div className="w-full h-full border-b-4 border-[#d4af37] shadow-[0_0_40px_rgba(212,175,55,0.6),inset_0_0_30px_rgba(212,175,55,0.3)]" 
                 style={{ 
                   background: 'linear-gradient(90deg, #8b7021 0%, #b8902d 30%, #d4af37 50%, #b8902d 70%, #8b7021 100%)',
                   opacity: glowIntensity
                 }} 
            />
          </div>

          {/* Fluted Shaft */}
          <div className="absolute top-32 bottom-24 left-0 w-full">
            <svg className="w-full h-full opacity-90" preserveAspectRatio="none">
              <rect x="0" y="0" width="100%" height="100%" fill="url(#flutes)" />
            </svg>
            <div 
              className="absolute inset-0 shadow-[inset_0_0_80px_rgba(212,175,55,0.4),0_0_60px_rgba(212,175,55,0.3)]"
              style={{ opacity: glowIntensity }}
            />
          </div>

          {/* Base (Bottom) */}
          <div className="absolute bottom-0 left-0 w-full h-24">
            <div className="w-full h-full border-t-4 border-[#d4af37] shadow-[0_0_50px_rgba(212,175,55,0.7),inset_0_0_40px_rgba(212,175,55,0.4)]" 
                 style={{ 
                   background: 'linear-gradient(90deg, #8b7021 0%, #b8902d 30%, #d4af37 50%, #b8902d 70%, #8b7021 100%)',
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
