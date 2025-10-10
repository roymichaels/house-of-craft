import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useModalStore } from "@/stores/modalStore";
import { categoryShowcase } from "@/data/categoryShowcase";
import CategoryPreviewCard from "@/components/vault/CategoryPreviewCard";
import { ArrowRight } from "lucide-react";

const VaultTeaser = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20% 0px" });
  const { openModalWithCategory, openModal } = useModalStore();

  return (
    <section ref={ref} className="w-full py-20 md:py-32 px-6 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 md:mb-24"
        >
          <h2 className="font-ancient text-6xl md:text-8xl text-ancient-gold mb-6 tracking-wider">
            THE VAULT
          </h2>
          <p className="text-foreground/80 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-serif italic">
            Objects and garments forged for presence, mastery, and modern ritual
          </p>
        </motion.div>

        {/* Horizontal Scroll Carousel - Mobile */}
        <div className="md:hidden relative">
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide -mx-6 px-6">
            {categoryShowcase.map((category, index) => (
              <CategoryPreviewCard
                key={category.id}
                category={category}
                onClick={() => openModalWithCategory(category.id)}
                index={index}
              />
            ))}
          </div>
          {/* Scroll hint */}
          <div className="absolute top-1/2 right-0 -translate-y-1/2 pointer-events-none">
            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-ancient-gold/40"
            >
              <ArrowRight className="w-8 h-8" />
            </motion.div>
          </div>
        </div>

        {/* Grid - Desktop */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-8">
          {categoryShowcase.map((category, index) => (
            <CategoryPreviewCard
              key={category.id}
              category={category}
              onClick={() => openModalWithCategory(category.id)}
              index={index}
            />
          ))}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mt-16 md:mt-20"
        >
          <button
            onClick={() => openModal('collections')}
            className="group inline-flex items-center gap-3 px-8 py-4 border-2 border-ancient-gold/30 hover:border-ancient-gold/60 bg-background/40 backdrop-blur-sm hover:bg-ancient-gold/5 transition-all duration-300 beam-ripple"
          >
            <span className="font-ancient text-lg tracking-wider text-ancient-gold">
              ENTER THE VAULT
            </span>
            <ArrowRight className="w-5 h-5 text-ancient-gold group-hover:translate-x-1 transition-transform duration-300" />
          </button>
          <p className="text-muted-foreground text-sm mt-4 font-serif">
            93 Objects of Mastery
          </p>
        </motion.div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default VaultTeaser;
