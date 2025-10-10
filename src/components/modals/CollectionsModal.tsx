import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft } from "lucide-react";
import { useModalStore } from "@/stores/modalStore";
import { useState, useEffect } from "react";
import { catalog } from "@/data/catalog";
import type { Category } from "@/data/catalog";
import CategoryTabs from "@/components/vault/CategoryTabs";
import VaultEcommerce from "@/components/vault/VaultEcommerce";
import { BrandLanguage } from "@/lib/brandLanguage";

type ViewState = 'categories' | 'category-detail';

const CollectionsModal = () => {
  const { activeModal, closeModal } = useModalStore();
  const isOpen = activeModal === 'collections';

  // State management
  const [viewState, setViewState] = useState<ViewState>('categories');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setViewState('categories');
      setActiveCategory(null);
    }
  }, [isOpen]);

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
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed inset-0 z-50 overflow-y-auto"
            onClick={(e) => e.target === e.currentTarget && closeModal()}
          >
            <div className="min-h-screen">
              <div className="relative bg-background/95 backdrop-blur-sm h-screen overflow-y-auto border-y border-primary/20">
                {/* Close Button */}
                <button
                  onClick={closeModal}
                  className="absolute top-6 right-6 p-2 rounded-full bg-background/80 
                             hover:bg-primary/20 transition-colors z-10"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Back Button (contextual) */}
                {viewState === 'category-detail' && (
                  <button
                    onClick={handleBackToCategories}
                    className="absolute top-6 left-6 p-2 rounded-full bg-background/80 
                               hover:bg-primary/20 transition-colors z-10 flex items-center gap-2"
                    aria-label="Go back"
                  >
                    <ChevronLeft className="h-5 w-5" />
                    <span className="text-sm">Back</span>
                  </button>
                )}

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
                      {viewState === 'categories' 
                        ? BrandLanguage.latin.vault
                        : BrandLanguage.latin[activeCategory as keyof typeof BrandLanguage.latin] || BrandLanguage.latin.vault
                      }
                    </p>
                    
                    {/* Main title */}
                    <h2 className="text-5xl md:text-7xl font-ancient text-ancient-gold mb-6 
                                   drop-shadow-[0_0_30px_rgba(196,166,97,0.3)]">
                      {viewState === 'categories' ? 'COLLECTIONS' : currentCategory?.name.toUpperCase()}
                    </h2>
                    
                    {/* Subtitle */}
                    <p className="text-base md:text-lg text-foreground/80 max-w-2xl mx-auto mb-2 leading-relaxed">
                      {viewState === 'categories'
                        ? BrandLanguage.voice.tagline
                        : currentCategory?.tagline
                      }
                    </p>
                    
                    {/* Secondary copy */}
                    <p className="text-sm text-muted-foreground/60 max-w-xl mx-auto italic">
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
