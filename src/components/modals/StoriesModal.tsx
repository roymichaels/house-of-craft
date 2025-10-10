import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useModalStore } from "@/stores/modalStore";
import { useEffect } from "react";
import Timeline from "@/components/stories/Timeline";
import Philosophy from "@/components/stories/Philosophy";

const StoriesModal = () => {
  const { activeModal, closeModal } = useModalStore();
  const isOpen = activeModal === 'stories';

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
                      The House of Time
                    </p>
                    <h2 className="text-4xl md:text-6xl font-serif mb-4">
                      Our Story
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                      Where heritage meets innovation, and every timepiece carries the weight of history forward into tomorrow
                    </p>
                  </motion.div>
                </div>

                {/* Content */}
                <div className="px-6 py-12">
                  <Philosophy />
                  <Timeline />

                  {/* Founder's Message */}
                  <motion.div
                    className="max-w-4xl mx-auto text-center mt-24"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8 }}
                  >
                    <blockquote className="text-2xl md:text-3xl font-serif italic text-balance mb-8">
                      "We don't just sell timepieces. We preserve legacies, honor craftsmanship,
                      and connect collectors with pieces that will define their own stories."
                    </blockquote>
                    <p className="text-primary font-ancient tracking-wider">
                      — The Founders
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default StoriesModal;
