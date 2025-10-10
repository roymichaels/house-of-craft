import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeroSeal from "./hero/HeroSeal";
import { OrderLanguage } from "@/lib/orderLanguage";
import { playModalClick } from "@/lib/audio";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const RitualEntry = () => {
  const [showEntry, setShowEntry] = useState(false);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Migrate old storage keys
    const oldHouseKey = localStorage.getItem("house-visited");
    if (oldHouseKey) {
      localStorage.removeItem("house-visited");
    }

    const hasVisited = localStorage.getItem("apollon-visited");
    const hasSignedUp = localStorage.getItem("apollon_email_signup");
    
    if (!hasVisited && !hasSignedUp) {
      setShowEntry(true);
    } else if (hasVisited && !hasSignedUp) {
      setShowEmailCapture(true);
    } else {
      setHasEntered(true);
    }
  }, []);

  const handleEnter = () => {
    playModalClick();
    localStorage.setItem("apollon-visited", "true");
    setShowEntry(false);
    // Show email capture after ritual
    setTimeout(() => setShowEmailCapture(true), 1000);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      setIsSubmitting(false);
      return;
    }

    localStorage.setItem("apollon_email_signup", email);
    localStorage.setItem("apollon_initiation_code", "APOLLON10");

    toast.success("Welcome to APOLLON! Your initiation code: APOLLON10", {
      duration: 8000,
      description: "You have been granted early access to sacred instruments and teachings.",
    });

    setShowEmailCapture(false);
    setTimeout(() => setHasEntered(true), 1000);
    setIsSubmitting(false);
  };

  const handleSkipEmail = () => {
    sessionStorage.setItem("apollon_email_dismissed", "true");
    setShowEmailCapture(false);
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

      {showEmailCapture && (
        <motion.div
          className="fixed inset-0 z-[200] bg-background flex flex-col items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Orb */}
          <motion.div
            className="w-32 h-32 rounded-full bg-gradient-radial from-ancient-gold/20 via-ancient-gold/10 to-transparent mb-8"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />

          {/* Title */}
          <motion.h2
            className="font-ancient text-4xl md:text-6xl text-ancient-gold mb-4 tracking-wider text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            style={{
              textShadow: "0 0 40px rgba(196,166,97,0.5)",
            }}
          >
            {OrderLanguage.latin.circle}
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            className="text-ancient-silver/80 text-base md:text-lg tracking-wide mb-2 text-center max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1 }}
          >
            Receive early access to APOLLON's curated instruments and sacred teachings.
          </motion.p>

          <motion.p
            className="text-ancient-gold font-medium mb-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1.5 }}
          >
            10% initiation gift granted.
          </motion.p>

          {/* Email Form */}
          <motion.form
            onSubmit={handleEmailSubmit}
            className="w-full max-w-sm space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 2 }}
          >
            <Input
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 border-ancient-gold/20 focus:border-ancient-gold transition-colors bg-background/50 text-center"
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 text-base bg-ancient-gold/10 border border-ancient-gold/50 hover:bg-ancient-gold/20 hover:border-ancient-gold text-ancient-gold font-order tracking-wider transition-all duration-300"
            >
              {isSubmitting ? "Processing..." : "Take the Oath"}
            </Button>

            <button
              type="button"
              onClick={handleSkipEmail}
              className="w-full text-xs text-ancient-silver/60 hover:text-ancient-silver/80 transition-colors tracking-wide"
            >
              Continue without oath
            </button>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RitualEntry;
