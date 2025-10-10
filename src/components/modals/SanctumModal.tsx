import { motion, AnimatePresence } from "framer-motion";
import { X, Crown, Users, Zap } from "lucide-react";
import { useModalStore } from "@/stores/modalStore";
import { useEffect } from "react";
import { GoldenIcon } from "@/components/ui/GoldenIcon";

const benefits = [
  {
    icon: Crown,
    title: "First Access",
    description: "First access to rare instruments before public release. Reserved collections curated for masters only.",
  },
  {
    icon: Users,
    title: "The Guild",
    description: "Direct counsel with men who command their domains. Private gatherings of the initiated.",
  },
  {
    icon: Zap,
    title: "Master's Council",
    description: "Invitation to sealed chambers where strategy, philosophy, and mastery converge.",
  },
];

const SanctumModal = () => {
  const { activeModal, closeModal, openModal } = useModalStore();
  const isOpen = activeModal === 'sanctum';

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) closeModal();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeModal]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
            onClick={closeModal}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-6"
            onClick={(e) => e.target === e.currentTarget && closeModal()}
          >
            <div className="relative bg-background/95 backdrop-blur-sm max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-ancient-gold/20 shadow-[0_0_60px_rgba(212,175,55,0.15)]">
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-6 right-6 p-2 rounded-full bg-background/80 hover:bg-ancient-gold/20 transition-all group z-10"
                aria-label="Close modal"
              >
                <GoldenIcon icon={X} size="md" glow="medium" className="hover:rotate-90 duration-500" />
              </button>

              {/* Header */}
              <div className="text-center pt-16 pb-12 px-6 border-b border-ancient-gold/10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-2 border-ancient-gold/30 bg-ancient-gold/5 mb-6">
                    <GoldenIcon icon={Crown} size="xl" glow="strong" />
                  </div>
                  <h2 className="text-4xl md:text-6xl font-ancient text-ancient-gold mb-4 tracking-wider drop-shadow-[0_0_40px_rgba(212,175,55,0.4)]">
                    The Chamber
                  </h2>
                  <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-romania italic leading-relaxed">
                    Private access for those who lead, create, and command through light
                  </p>
                </motion.div>
              </div>

              {/* Benefits Grid */}
              <div className="px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={benefit.title}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                      className="text-center group"
                    >
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-ancient-gold/30 bg-ancient-gold/5 mb-6 group-hover:border-ancient-gold group-hover:bg-ancient-gold/10 transition-all duration-300">
                        <GoldenIcon icon={benefit.icon} size="lg" glow="medium" />
                      </div>
                      <h3 className="font-ancient text-xl md:text-2xl text-foreground mb-3 tracking-wide group-hover:text-ancient-gold transition-colors">
                        {benefit.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                        {benefit.description}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-center pt-8 border-t border-ancient-gold/10"
                >
                  <button
                    onClick={() => {
                      closeModal();
                      setTimeout(() => openModal('concierge'), 300);
                    }}
                    className="inline-flex items-center gap-3 px-8 py-4 border-2 border-ancient-gold text-ancient-gold font-ancient tracking-widest hover:bg-ancient-gold hover:text-background transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_40px_rgba(212,175,55,0.4)]"
                  >
                    Request Access
                  </button>
                  <p className="text-muted-foreground/60 text-sm mt-6 italic">
                    Membership is selective
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SanctumModal;
