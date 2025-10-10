import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CategoryShowcase } from "@/data/categoryShowcase";

interface CategoryPreviewCardProps {
  category: CategoryShowcase;
  onClick: () => void;
  index: number;
}

const CategoryPreviewCard = ({ category, onClick, index }: CategoryPreviewCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="min-w-[280px] md:min-w-[320px] snap-start"
    >
      <button
        onClick={onClick}
        className="group relative overflow-hidden border border-border hover:border-ancient-gold/50 transition-all duration-500 w-full text-left beam-ripple h-full"
      >
        {/* Image container */}
        <div className="aspect-[3/4] overflow-hidden bg-muted relative">
          <img
            src={category.heroImage}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-500" />
          
          {/* Product count badge */}
          <div className="absolute top-4 right-4">
            <div className="bg-background/80 backdrop-blur-sm border border-ancient-gold/30 px-3 py-1 rounded-full">
              <span className="text-xs font-medium text-ancient-gold">
                {category.productCount} Items
              </span>
            </div>
          </div>
        </div>

        {/* Text content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="font-ancient text-2xl md:text-3xl text-foreground mb-2 tracking-widest group-hover:text-ancient-gold transition-colors duration-300">
            {category.name}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4 font-serif italic">
            {category.tagline}
          </p>
          <div className="flex items-center text-ancient-gold text-sm font-medium group-hover:translate-x-2 transition-transform duration-300">
            Explore
            <ArrowRight className="ml-2 w-4 h-4" />
          </div>
        </div>
      </button>
    </motion.div>
  );
};

export default CategoryPreviewCard;
