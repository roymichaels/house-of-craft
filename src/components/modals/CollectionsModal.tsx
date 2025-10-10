import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useModalStore } from "@/stores/modalStore";
import { useState, useEffect } from "react";
import CollectionGrid from "@/components/collections/CollectionGrid";

const CollectionsModal = () => {
  const { activeModal, closeModal } = useModalStore();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const isOpen = activeModal === 'collections';

  const categories = [
    { id: "all", label: "All Relics" },
    { id: "modern", label: "Instruments of Now" },
    { id: "classic", label: "Certified Heritage" },
    { id: "vintage", label: "Echoes of Mastery" },
  ];

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
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed inset-0 z-50 overflow-y-auto"
            onClick={(e) => e.target === e.currentTarget && closeModal()}
          >
            <div className="min-h-screen px-6 py-24">
              <div className="relative bg-background/95 backdrop-blur-sm rounded-lg max-w-7xl mx-auto border border-primary/20">
                {/* Close Button */}
                <button
                  onClick={closeModal}
                  className="absolute top-6 right-6 p-2 rounded-full bg-background/80 hover:bg-primary/20 transition-colors z-10"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Header - The Vault */}
                <div className="relative text-center pt-16 pb-12 px-6 border-b border-primary/10">
                  {/* Golden aura backdrop */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] 
                                  bg-primary/10 blur-[100px] pointer-events-none" />
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative z-10"
                  >
                    {/* Latin inscription */}
                    <p className="font-order text-primary/60 text-xs tracking-[0.3em] mb-3">
                      FORMA SEQUITUR RATIONEM
                    </p>
                    
                    {/* Main title */}
                    <h2 className="text-5xl md:text-7xl font-ancient text-ancient-gold mb-6 
                                   drop-shadow-[0_0_30px_rgba(196,166,97,0.3)]">
                      THE VAULT
                    </h2>
                    
                    {/* Subtitle - philosophical framing */}
                    <p className="text-base md:text-lg text-foreground/80 max-w-2xl mx-auto mb-2 leading-relaxed">
                      Objects forged by Light and Discipline
                    </p>
                    
                    {/* Secondary copy */}
                    <p className="text-sm text-muted-foreground/60 max-w-xl mx-auto italic">
                      Each relic is an oath in form — made for men who command their world with intent.
                    </p>
                  </motion.div>
                </div>

                {/* Category Filter - Ritual Selection */}
                <div className="px-6 py-10">
                  <div className="flex flex-wrap gap-4 justify-center">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`
                          group relative px-8 py-3.5 
                          border transition-all duration-500
                          ${activeCategory === category.id
                            ? "border-primary bg-primary/10 text-primary shadow-[0_0_20px_rgba(196,166,97,0.2)]"
                            : "border-border/50 hover:border-primary/50 text-muted-foreground hover:text-foreground"
                          }
                        `}
                      >
                        {/* Marble divider line (left) */}
                        <span className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b 
                                         from-transparent via-primary/20 to-transparent opacity-50" />
                        
                        <span className="font-medium tracking-wider">{category.label}</span>
                        
                        {/* Marble divider line (right) */}
                        <span className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b 
                                         from-transparent via-primary/20 to-transparent opacity-50" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Collection Grid */}
                <div className="px-6 pb-16">
                  <CollectionGrid category={activeCategory} />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CollectionsModal;
