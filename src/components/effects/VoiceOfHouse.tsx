import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const words = ["Observe", "Command", "Refine", "Master"];

const VoiceOfHouse = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isIdle, setIsIdle] = useState(false);
  const [lastScrollTime, setLastScrollTime] = useState(Date.now());

  useEffect(() => {
    const handleScroll = () => {
      setLastScrollTime(Date.now());
      setIsIdle(false);
    };

    window.addEventListener("scroll", handleScroll);

    // Check for idle state
    const idleInterval = setInterval(() => {
      const timeSinceScroll = Date.now() - lastScrollTime;
      if (timeSinceScroll > 5000) {
        setIsIdle(true);
      }
    }, 1000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(idleInterval);
    };
  }, [lastScrollTime]);

  useEffect(() => {
    if (!isIdle) return;

    const wordInterval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }, 8000); // 3s fade in + 2s hold + 3s fade out

    return () => clearInterval(wordInterval);
  }, [isIdle]);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
      <AnimatePresence mode="wait">
        {isIdle && (
          <motion.div
            key={currentWordIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 3 }}
            className="font-ancient text-6xl md:text-8xl text-ancient-gold tracking-wider"
            style={{
              textShadow: "0 0 40px rgba(196,166,97,0.6), 0 0 80px rgba(196,166,97,0.3)",
            }}
          >
            {words[currentWordIndex]}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceOfHouse;
