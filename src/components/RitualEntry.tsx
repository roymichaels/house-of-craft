import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeroSeal from "./hero/HeroSeal";

const RitualEntry = () => {
  const [showEntry, setShowEntry] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem("house-visited");
    
    if (!hasVisited) {
      setShowEntry(true);
    } else {
      setHasEntered(true);
    }
  }, []);

  const handleEnter = () => {
    localStorage.setItem("house-visited", "true");
    setShowEntry(false);
    setTimeout(() => setHasEntered(true), 1000);
  };

  if (hasEntered) return null;

  return (
    <AnimatePresence>
      {showEntry && (
        <motion.div
          className="fixed inset-0 z-[200] bg-background flex flex-col items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {/* Orb fade in */}
          <motion.div
            className="w-32 h-32 rounded-full bg-gradient-radial from-ancient-gold/20 via-ancient-gold/10 to-transparent mb-12"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 5, ease: "easeOut" }}
          />

          {/* Welcome text */}
          <motion.h1
            className="font-ancient text-4xl md:text-6xl text-ancient-gold mb-4 tracking-wider"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2, delay: 3 }}
            style={{
              textShadow: "0 0 40px rgba(196,166,97,0.5)",
            }}
          >
            Welcome to The House
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-ancient-silver/60 text-sm tracking-widest uppercase mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 4 }}
          >
            A Sanctuary of Mastery
          </motion.p>

          {/* Enter button */}
          <motion.button
            onClick={handleEnter}
            className="group flex flex-col items-center gap-4 cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 5 }}
            whileHover={{ scale: 1.05 }}
          >
            <HeroSeal ctaLink="#" />
            <span className="font-ancient text-ancient-gold text-sm tracking-widest uppercase group-hover:text-ancient-gold/80 transition-colors">
              Click to Enter
            </span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RitualEntry;
