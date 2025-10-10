import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, Circle, Search } from "lucide-react";
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
  const [searchQuery, setSearchQuery] = useState<string>('');

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

  // Keyboard navigation and body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    // Lock body scroll when modal is open
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    
    // Get scrollbar width to prevent layout shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    const handleEscape = (e: KeyboardEvent) => {
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
    
    return () => {
      window.removeEventListener('keydown', handleEscape);
      // Restore body scroll
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
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
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
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
            className="fixed inset-0 z-50 overflow-hidden"
          >
            <div className="relative w-full h-full bg-background/98 backdrop-blur-2xl 
                            border-y border-primary/20 overflow-hidden">
              {/* Top Navigation Bar */}
              <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 md:p-6">
                {/* Left Side - Back Button or Search */}
                {viewState === 'categories' ? (
                  <motion.div
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <GoldenIcon icon={Circle} size="lg" glow="strong" className="opacity-60" />
                  </motion.div>
                ) : (
                  <div className="flex items-center gap-2">
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
                      <span className="hidden md:inline text-xs md:text-sm font-medium text-ancient-gold">Back</span>
                    </motion.button>

                    {/* Search Bar */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative hidden md:block"
                    >
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-64 pl-9 pr-4 py-2 rounded-full
                                   bg-background/60 backdrop-blur-sm
                                   border border-primary/20 focus:border-primary/40
                                   text-sm text-foreground placeholder:text-muted-foreground
                                   focus:outline-none transition-all"
                      />
                    </motion.div>
                  </div>
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
              <div className="h-full overflow-y-auto momentum-scroll flex flex-col"
                   onClick={(e) => e.target === e.currentTarget && closeModal()}>
                {/* Header - Only show when viewing categories */}
                {viewState === 'categories' && (
                  <div className="relative text-center pt-12 pb-4 px-6">
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
                      <p className="font-serif italic text-muted-foreground/60 text-xs tracking-[0.2em] mb-1.5">
                        Arcanum Sapientis
                      </p>
                      
                      {/* Main title */}
                      <h2 className="text-4xl md:text-5xl font-ancient text-ancient-gold mb-2 
                                     drop-shadow-[0_0_30px_rgba(196,166,97,0.4)] tracking-wider">
                        COLLECTIO
                      </h2>
                      
                      {/* Subtitle */}
                      <p className="text-sm md:text-base text-foreground/80 max-w-xl mx-auto mb-1 leading-relaxed">
                        {BrandLanguage.voice.tagline}
                      </p>
                      
                      {/* Secondary copy */}
                      <p className="text-xs text-muted-foreground/50 max-w-xl mx-auto italic">
                        Choose your category to explore our curated selection.
                      </p>
                    </motion.div>
                  </div>
                )}

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
                    <VaultEcommerce category={currentCategory} searchQuery={searchQuery} />
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
