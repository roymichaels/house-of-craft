import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface ModalTransitionProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  variant?: 'default' | 'side-panel';
}

export const ModalTransition = ({ 
  isOpen, 
  onClose, 
  children,
  variant = 'default'
}: ModalTransitionProps) => {
  const variants = {
    default: {
      initial: { opacity: 0, scale: 0.95, y: 20 },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.95, y: 20 }
    },
    'side-panel': {
      initial: { opacity: 0, x: 100 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 100 }
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop with sacred geometry vignette */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-40"
            onClick={onClose}
            style={{
              background: 'radial-gradient(circle at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.95) 100%)'
            }}
          />

          {/* Modal Content */}
          <motion.div
            variants={variants[variant]}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ 
              duration: 0.4, 
              ease: [0.4, 0, 0.2, 1] // Cinematic easing
            }}
            className="fixed inset-0 z-50 pointer-events-none"
          >
            <div className="pointer-events-auto">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
