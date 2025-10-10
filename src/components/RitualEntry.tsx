import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeroSeal from "./hero/HeroSeal";
import { OrderLanguage } from "@/lib/orderLanguage";
import { playModalClick } from "@/lib/audio";
import { useModalStore } from "@/stores/modalStore";

const RitualEntry = () => {
  const [showEntry, setShowEntry] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const { openModal } = useModalStore();

  useEffect(() => {
    const hasVisited = localStorage.getItem("apollo-visited");
    
    if (!hasVisited) {
      setShowEntry(true);
    } else {
      setHasEntered(true);
    }
  }, []);

  const handleEnter = () => {
    playModalClick();
    localStorage.setItem("apollo-visited", "true");
    setShowEntry(false);
    setTimeout(() => {
      setHasEntered(true);
      
      // Show email capture modal after entry if user hasn't signed up yet
      const hasSignedUp = localStorage.getItem("apollo_email_signup");
      if (!hasSignedUp) {
        setTimeout(() => openModal('email-capture'), 2000);
      }
    }, 1000);
  };

  if (hasEntered) return null;

  return (
    <AnimatePresence>
      {showEntry && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {/* Orb fade in */}
          <motion.div
            className="w-32 h-32 rounded-full bg-gradient-radial from-ancient-gold/20 via-ancient-gold/10 to-transparent mb-12"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
          />

          {/* Latin phrase - primary entrance */}
          <motion.h1
            className="font-ancient text-5xl md:text-7xl text-ancient-gold mb-6 tracking-wider"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2, delay: 2 }}
            style={{
              textShadow: "0 0 40px rgba(196,166,97,0.5)",
            }}
          >
            {OrderLanguage.latin.hero}
          </motion.h1>

          {/* English translation */}
          <motion.p
            className="text-ancient-silver/80 text-base md:text-lg tracking-wide mb-4 italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 4 }}
          >
            {OrderLanguage.phrases.hero}
          </motion.p>

          {/* Subtitle */}
          <motion.p
            className="text-ancient-silver/60 text-sm tracking-widest uppercase mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 5 }}
          >
            {OrderLanguage.phrases.sanctuary}
          </motion.p>

          {/* Enter button */}
          <motion.button
            onClick={handleEnter}
            className="group flex flex-col items-center gap-4 cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 6.5 }}
            whileHover={{ scale: 1.05 }}
          >
            <HeroSeal ctaLink="#" />
            <span className="font-ancient text-ancient-gold text-sm tracking-widest uppercase group-hover:text-ancient-gold/80 transition-colors">
              {OrderLanguage.actions.enter}
            </span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RitualEntry;
