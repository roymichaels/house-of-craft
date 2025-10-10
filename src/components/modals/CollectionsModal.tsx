import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, Circle } from "lucide-react";
import { useModalStore } from "@/stores/modalStore";
import { useState, useEffect } from "react";
import { catalog } from "@/data/catalog";
import type { Category } from "@/data/catalog";
import CategoryTabs from "@/components/vault/CategoryTabs";
import VaultEcommerce from "@/components/vault/VaultEcommerce";
import { BrandLanguage } from "@/lib/brandLanguage";
import { GoldenIcon } from "@/components/ui/GoldenIcon";

type ViewState = 'categories' | 'category-detail';

const CollectionsModal = () => {
  const { activeModal, closeModal, selectedCategory } = useModalStore();
  const isOpen = activeModal === 'collections';

  // State management
  const [viewState, setViewState] = useState<ViewState>('categories');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Handle initial category selection from VaultTeaser or reset state when modal closes
  useEffect(() => {
    if (isOpen && selectedCategory) {
      setActiveCategory(selectedCategory);
      setViewState('category-detail');
    } else if (!isOpen) {
      setViewState('categories');
      setActiveCategory(null);
    }
  }, [isOpen, selectedCategory]);

  // Keyboard navigation
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        if (viewState === 'category-detail') {
          setViewState('categories');
          setActiveCategory(null);
        } else {
          closeModal();
        }
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, viewState, closeModal]);

  // Navigation handlers
  const handleCategorySelect = (categoryId: string) => {
    setActiveCategory(categoryId);
    setViewState('category-detail');
  };

  const handleBackToCategories = () => {
    setActiveCategory(null);
    setViewState('categories');
  };

  // Get current data
  const currentCategory = catalog.find(c => c.id === activeCategory);

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
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 md:p-8"
          >
            <div className="relative w-full max-w-7xl max-h-[90vh] bg-background/98 backdrop-blur-2xl 
                            rounded-3xl border border-primary/20 shadow-2xl overflow-hidden">
              {/* Top Navigation Bar */}
              <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 md:p-6">
                {/* Decorative Icon / Back Button */}
                {viewState === 'categories' ? (
                  <motion.div
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <GoldenIcon icon={Circle} size="lg" glow="strong" className="opacity-60" />
                  </motion.div>
                ) : (
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onClick={handleBackToCategories}
                    className="px-3 py-2 rounded-full
                               bg-background/60 hover:bg-primary/10 backdrop-blur-sm
                               border border-primary/20 hover:border-primary/40
                               transition-all group flex items-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    aria-label="Go back"
                  >
                    <GoldenIcon icon={ChevronLeft} size="sm" glow="subtle" 
                                className="group-hover:-translate-x-0.5 duration-300" />
                    <span className="text-xs md:text-sm font-medium text-ancient-gold">Back</span>
                  </motion.button>
                )}
                
                {/* Close Button (Right) */}
                <motion.button
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  onClick={closeModal}
                  className="p-2 rounded-full bg-background/60 hover:bg-primary/10 backdrop-blur-sm
                             border border-primary/20 hover:border-primary/40 transition-all group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Close modal"
                >
                  <GoldenIcon icon={X} size="md" glow="medium" 
                              className="group-hover:rotate-90 duration-300" />
                </motion.button>
              </div>

              {/* Scrollable Content */}
              <div className="h-[90vh] overflow-y-auto momentum-scroll"
                   onClick={(e) => e.target === e.currentTarget && closeModal()}>
                {/* Header */}
                <div className="relative text-center pt-24 pb-12 px-6">
                  {/* Golden aura backdrop */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] 
                                  bg-primary/5 blur-[120px] pointer-events-none" />
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    className="relative z-10"
                  >
                    {/* Latin inscription */}
                    <p className="font-serif italic text-muted-foreground/60 text-xs tracking-[0.2em] mb-4">
                      Arcanum Sapientis
                    </p>
                    
                    {/* Main title */}
                    <h2 className="text-5xl md:text-7xl font-ancient text-ancient-gold mb-6 
                                   drop-shadow-[0_0_30px_rgba(196,166,97,0.4)] tracking-wider">
                      {viewState === 'categories' ? 'COLLECTIO' : currentCategory?.name.toUpperCase()}
                    </h2>
                    
                    {/* Subtitle */}
                    <p className="text-base md:text-lg text-foreground/80 max-w-2xl mx-auto mb-3 leading-relaxed">
                      {viewState === 'categories'
                        ? BrandLanguage.voice.tagline
                        : currentCategory?.tagline
                      }
                    </p>
                    
                    {/* Secondary copy */}
                    <p className="text-sm text-muted-foreground/50 max-w-xl mx-auto italic">
                      {viewState === 'categories'
                        ? 'Choose your category to explore our curated selection.'
                        : 'Discover pieces forged for presence and mastery.'
                      }
                    </p>
                  </motion.div>
                </div>

                {/* Content Area - State-Based Rendering */}
                <AnimatePresence mode="wait">
                  {viewState === 'categories' && (
                    <CategoryTabs
                      categories={catalog}
                      activeCategory={activeCategory}
                      onSelectCategory={handleCategorySelect}
                    />
                  )}

                  {viewState === 'category-detail' && currentCategory && (
                    <VaultEcommerce category={currentCategory} />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CollectionsModal;
