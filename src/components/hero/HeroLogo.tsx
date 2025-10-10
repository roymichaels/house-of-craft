import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface HeroLogoProps {
  logoText: string;
  show: boolean;
}

const HeroLogo = ({ logoText, show }: HeroLogoProps) => {
  const [shimmer, setShimmer] = useState(false);

  useEffect(() => {
    // Shimmer effect every 60 seconds
    const interval = setInterval(() => {
      setShimmer(true);
      setTimeout(() => setShimmer(false), 2000);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  if (!show) return null;

  return (
    <motion.div
      className="absolute top-8 left-1/2 -translate-x-1/2 md:left-[10%] md:translate-x-0 z-20 flex flex-col gap-1 items-center md:items-start group cursor-pointer"
      initial={{ opacity: 0, y: -30, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: shimmer ? 1.05 : 1 
      }}
      transition={{ delay: 3, duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.05 }}
    >
      {/* Gold reflection sweep effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-ancient-gold/30 to-transparent"
        initial={{ x: "-100%" }}
        animate={{ x: shimmer ? "200%" : "-100%" }}
        transition={{ delay: 3.5, duration: 1.5, ease: "easeInOut" }}
      />
      
      {/* Hover repeat sweep */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-ancient-gold/40 to-transparent opacity-0 group-hover:opacity-100"
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 1.2, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.5 }}
      />
      
      <h2 className="font-ancient text-lg md:text-xl tracking-[0.03em] text-ancient-gold 
        bg-gradient-to-b from-[#FFE5A0] via-[#D4B56D] to-[#A68F5C] bg-clip-text text-transparent
        drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]
        [text-shadow:_0_1px_2px_rgba(255,229,160,0.9),_0_4px_12px_rgba(196,166,97,0.6),_0_-1px_4px_rgba(255,255,255,0.3)]
        group-hover:[text-shadow:_0_1px_2px_rgba(255,229,160,1),_0_6px_20px_rgba(196,166,97,0.9),_0_-1px_6px_rgba(255,255,255,0.5)]
        transition-all duration-300">
        {logoText}
      </h2>
      <p className="imperial-caps text-[9px] tracking-widest text-ancient-silver/60">
        The Order of Light
      </p>
    </motion.div>
  );
};

export default HeroLogo;
