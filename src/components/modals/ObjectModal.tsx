import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useModalStore } from "@/stores/modalStore";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useEffect } from "react";
import { OrderLanguage } from "@/lib/orderLanguage";
import { latin } from "@/lib/brandLanguage";

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
          {/* Cinematic background with radial gold glow */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-[#0a0a08] via-obsidian-core to-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            {/* Radial gold glow - simulates sunlight through blinds */}
            <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-ancient-gold/10 blur-[150px] rounded-full" />
            
            {/* Animated dust particles */}
            <div className="absolute inset-0 opacity-20">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-ancient-gold/30 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -100, 0],
                    opacity: [0, 0.6, 0],
                  }}
                  transition={{
                    duration: 8 + Math.random() * 4,
                    repeat: Infinity,
                    delay: Math.random() * 5,
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Modal Content */}
          <motion.div
            className="relative z-10 w-full h-screen flex flex-col md:grid md:grid-cols-[60%_40%] gap-4 md:gap-8 p-4 md:p-12 
                       bg-gradient-to-b from-card/30 via-card/50 to-card/30 
                       border-y border-ancient-gold/20"
            initial={{ 
              scale: 0.98, 
              y: 20, 
              opacity: 0,
              filter: "blur(8px)"
            }}
            animate={{ 
              scale: 1, 
              y: 0, 
              opacity: 1,
              filter: "blur(0px)"
            }}
            exit={{ 
              scale: 0.98, 
              y: 20, 
              opacity: 0,
              filter: "blur(8px)"
            }}
            transition={{ 
              duration: 0.5, 
              ease: [0.25, 0.1, 0.25, 1] 
            }}
          >
            {/* Close Button */}
            <motion.button
              onClick={closeModal}
              className="absolute top-6 right-6 z-20 p-2 rounded-full
                         bg-black/40 backdrop-blur-sm border border-ancient-gold/20
                         text-ancient-gold/60 hover:text-ancient-gold hover:bg-ancient-gold/10
                         transition-all duration-300 group"
              whileHover={{ scale: 1.05, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </motion.button>

            {/* Left Panel - Image Viewer */}
            <div className="relative h-[50vh] md:h-full flex items-center justify-center rounded-lg overflow-hidden 
                            bg-gradient-to-br from-black/80 to-obsidian-core/90 
                            border border-ancient-gold/20 group">
              
              {/* Cinematic lighting overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-ancient-gold/5 to-transparent 
                              pointer-events-none z-10" />
              
              <TransformWrapper
                initialScale={1}
                minScale={1}
                maxScale={3}
                centerOnInit
              >
                <TransformComponent>
                  <motion.img
                    src={objectData.image}
                    alt={objectData.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 4, ease: "easeOut" }}
                  />
                </TransformComponent>
              </TransformWrapper>
            </div>

            {/* Right Panel - Story & Details */}
            <div className="flex-1 flex flex-col justify-center space-y-4 md:space-y-6 relative pb-20 md:pb-0">
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
                
                {/* Latin inscription based on category */}
                <p className="font-serif italic text-ancient-gold/40 text-xs tracking-[0.3em] uppercase mb-2">
                  {latin[objectData.category.toLowerCase()] || "Forma Sequitur Rationem"}
                </p>

                {/* Category badge */}
                <p className="text-xs font-cinzel tracking-[0.2em] text-ancient-gold uppercase mb-3">
                  {objectData.category}
                </p>

                {/* Title with ambient glow */}
                <div className="relative mb-4">
                  {/* Glow backdrop */}
                  <div className="absolute -inset-4 bg-ancient-gold/10 blur-2xl rounded-full" />
                  
                  <h2 className="relative font-ancient text-4xl md:text-5xl text-ancient-gold 
                                 tracking-[0.05em] leading-tight
                                 drop-shadow-[0_0_30px_rgba(196,166,97,0.4)]">
                    {objectData.title}
                  </h2>
                </div>

                {/* Subtitle - using Cormorant Garamond */}
                <p className="font-serif text-base md:text-lg leading-relaxed text-foreground/80 mb-1">
                  {objectData.description}
                </p>
              </div>

              {/* Price Display */}
              {objectData.price && (
                <div className="pt-6 pb-4 border-t border-ancient-gold/20">
                  <p className="text-xs font-cinzel tracking-[0.2em] text-ancient-gold/60 uppercase mb-1">
                    Investment
                  </p>
                  <p className="text-3xl font-ancient text-ancient-gold tracking-wide">
                    {objectData.price}
                  </p>
                </div>
              )}

              {/* Philosophical tagline */}
              {objectData.story && (
                <div className="pt-4">
                  <p className="font-serif italic text-sm text-ancient-silver/60 leading-relaxed">
                    "{objectData.story}"
                  </p>
                </div>
              )}
            </div>

            {/* CTA - Fixed at bottom on mobile, inline on desktop */}
            <div className="fixed md:relative bottom-0 left-0 right-0 md:bottom-auto md:left-auto 
                            p-4 md:p-0 bg-gradient-to-t from-black via-black/90 to-transparent 
                            md:bg-none z-20 md:z-auto md:absolute md:bottom-8 md:right-12">
              <motion.button
                onClick={() => {
                  closeModal();
                  setTimeout(() => openModal('concierge'), 300);
                }}
                className="relative w-full md:w-auto px-8 py-3.5 rounded-lg overflow-hidden group
                           bg-gradient-to-r from-[#d4af37] to-[#f2e29f]
                           hover:from-[#f2e29f] hover:to-[#d4af37]
                           transition-all duration-300"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Glow effect */}
                <motion.div
                  className="absolute inset-0 bg-ancient-gold blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                  initial={false}
                />
                
                <span className="relative z-10 block font-cinzel text-sm tracking-[0.15em] 
                                 uppercase text-obsidian-core font-semibold">
                  {OrderLanguage.actions.acquire}
                </span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ObjectModal;
