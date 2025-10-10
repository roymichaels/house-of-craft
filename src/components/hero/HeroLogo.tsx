import { motion } from "framer-motion";

interface HeroLogoProps {
  logoText: string;
  show: boolean;
}

const HeroLogo = ({ logoText, show }: HeroLogoProps) => {
  if (!show) return null;

  return (
    <motion.div
      className="absolute top-8 left-8 z-20 flex flex-col gap-1"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 3, duration: 0.8, ease: "easeOut" }}
    >
      {/* Gold reflection sweep effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-ancient-gold/30 to-transparent"
        initial={{ x: "-100%" }}
        animate={{ x: "200%" }}
        transition={{ delay: 3.5, duration: 1.5, ease: "easeInOut" }}
      />
      
      <h2 className="font-ancient text-2xl tracking-wider text-ancient-gold drop-shadow-[0_0_20px_rgba(196,166,97,0.5)]">
        {logoText}
      </h2>
      <p className="font-sans text-[9px] tracking-widest text-ancient-silver/60 uppercase">
        Est. MMXXV
      </p>
    </motion.div>
  );
};

export default HeroLogo;
