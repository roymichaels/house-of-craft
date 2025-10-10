import { motion } from "framer-motion";

interface HeroLogoProps {
  logoText: string;
  show: boolean;
}

const HeroLogo = ({ logoText, show }: HeroLogoProps) => {
  if (!show) return null;

  return (
    <motion.div
      className="absolute top-8 left-8 z-20"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 0.9, y: 0 }}
      transition={{ delay: 3, duration: 0.8, ease: "easeOut" }}
    >
      <h2 className="font-serif text-sm tracking-wide opacity-90">
        {logoText}
      </h2>
    </motion.div>
  );
};

export default HeroLogo;
