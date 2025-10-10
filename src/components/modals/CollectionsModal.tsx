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
    { id: "all", label: "All Collections" },
    { id: "modern", label: "Modern Icons" },
    { id: "classic", label: "Certified Classics" },
    { id: "vintage", label: "Vintage Soul" },
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

                {/* Header */}
                <div className="text-center pt-16 pb-12 px-6 border-b border-primary/10">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <p className="font-ancient text-primary text-sm tracking-wider mb-4">
                      Curated Collections
                    </p>
                    <h2 className="text-4xl md:text-6xl font-serif mb-4">
                      The House Collections
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                      Timepieces of exceptional provenance and character
                    </p>
                  </motion.div>
                </div>

                {/* Category Filter */}
                <div className="px-6 py-8">
                  <div className="flex flex-wrap gap-4 justify-center">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`px-6 py-3 rounded-sm border transition-all duration-300 ${
                          activeCategory === category.id
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {category.label}
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
