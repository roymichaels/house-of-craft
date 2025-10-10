import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useModalStore } from "@/stores/modalStore";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useEffect } from "react";
import { OrderLanguage } from "@/lib/orderLanguage";

const ObjectModal = () => {
  const { activeModal, objectData, closeModal, openModal } = useModalStore();
  const isOpen = activeModal === 'object';

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    
    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    
    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, closeModal]);

  if (!objectData) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Blurred background with orb reflection */}
          <motion.div
            className="absolute inset-0 backdrop-blur-xl bg-background/90"
            initial={{ backdropFilter: "blur(0px)" }}
            animate={{ backdropFilter: "blur(24px)" }}
            exit={{ backdropFilter: "blur(0px)" }}
            onClick={closeModal}
          />

          {/* Modal Content */}
          <motion.div
            className="relative z-10 w-full h-screen grid md:grid-cols-2 gap-8 p-8 md:p-12 bg-card/50 border-y border-border/50"
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors z-20"
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Left Panel - Image Viewer */}
            <div className="flex items-center justify-center bg-background/50 rounded-lg overflow-hidden border border-border/30">
              <TransformWrapper
                initialScale={1}
                minScale={1}
                maxScale={3}
                centerOnInit
              >
                <TransformComponent>
                  <img
                    src={objectData.image}
                    alt={objectData.title}
                    className="w-full h-full object-cover"
                  />
                </TransformComponent>
              </TransformWrapper>
            </div>

            {/* Right Panel - Story & Details */}
            <div className="flex flex-col justify-center space-y-6 relative">
              {/* Rotating sigil watermark */}
              <motion.div
                className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none"
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              >
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="1" className="text-ancient-gold" />
                  <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="1" className="text-ancient-gold" />
                  <path d="M50 5 L50 95 M5 50 L95 50" stroke="currentColor" strokeWidth="1" className="text-ancient-gold" />
                </svg>
              </motion.div>

              <div className="relative">
                {/* Golden geometry frame corners */}
                <div className="absolute -top-2 -left-2 w-6 h-6 border-l-2 border-t-2 border-ancient-gold/50" />
                <div className="absolute -top-2 -right-2 w-6 h-6 border-r-2 border-t-2 border-ancient-gold/50" />
                <div className="absolute -bottom-2 -left-2 w-6 h-6 border-l-2 border-b-2 border-ancient-gold/50" />
                <div className="absolute -bottom-2 -right-2 w-6 h-6 border-r-2 border-b-2 border-ancient-gold/50" />
                
                <p className="text-xs font-sans tracking-widest text-ancient-gold uppercase mb-3">
                  {objectData.category}
                </p>
                <h2 className="font-ancient text-4xl md:text-5xl text-ancient-gold mb-4 tracking-wide">
                  {objectData.title}
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {objectData.description}
                </p>
                
                {objectData.price && (
                  <div className="pt-4">
                    <p className="text-2xl font-ancient text-ancient-gold">
                      {objectData.price}
                    </p>
                  </div>
                )}
              </div>

              {objectData.story && (
                <div className="pt-6 border-t border-border/30">
                  <p className="font-serif text-base leading-relaxed text-foreground/90 italic">
                    {objectData.story}
                  </p>
                </div>
              )}

              {/* CTA */}
              <div className="pt-8">
                <button
                  onClick={() => {
                    closeModal();
                    setTimeout(() => openModal('concierge'), 300);
                  }}
                  className="inline-block font-ancient text-2xl text-ancient-gold hover:text-ancient-gold/80 transition-all duration-300 relative group"
                >
                  <span className="relative">
                    {OrderLanguage.actions.acquire}
                    <motion.span
                      className="absolute bottom-0 left-0 w-full h-px bg-ancient-gold"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                      style={{ transformOrigin: "left" }}
                    />
                  </span>
                  <span className="absolute inset-0 blur-lg opacity-0 group-hover:opacity-30 bg-ancient-gold transition-opacity duration-300" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ObjectModal;
