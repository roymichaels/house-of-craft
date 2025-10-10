import { motion } from "framer-motion";
import { ChevronRight, Watch, Crown, Wallet, Shirt, BookOpen, PenTool, Sparkles } from "lucide-react";
import type { Category } from "@/data/catalog";
import { GoldenIcon } from "@/components/ui/GoldenIcon";
import { categoryShowcase } from "@/data/categoryShowcase";
import type { LucideIcon } from "lucide-react";

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string | null;
  onSelectCategory: (categoryId: string) => void;
}

// Icon mapping for direct imports
const iconMap: Record<string, LucideIcon> = {
  'Watch': Watch,
  'Crown': Crown,
  'Wallet': Wallet,
  'Shirt': Shirt,
  'BookOpen': BookOpen,
  'PenTool': PenTool,
  'Sparkles': Sparkles,
};

const CategoryTabs = ({ categories, activeCategory, onSelectCategory }: CategoryTabsProps) => {
  return (
    <motion.div
      key="category-tabs"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      className="px-4 md:px-12 pb-12"
    >
      {/* Vertical List */}
      <div className="max-w-3xl mx-auto space-y-2">
        {categories.map((category, index) => {
          const productCount = category.subcategories.reduce(
            (acc, sub) => acc + sub.products.length,
            0
          );

          // Find matching icon from categoryShowcase
          const showcaseData = categoryShowcase.find(c => c.id === category.id);
          const IconComponent = showcaseData?.icon ? iconMap[showcaseData.icon] : Watch;

          return (
            <motion.button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                delay: index * 0.06,
              }}
              className="group w-full p-5 md:p-6 text-left 
                         bg-card/20 backdrop-blur-sm rounded-xl
                         border border-border/20 hover:border-primary/40
                         hover:bg-card/40
                         transition-all duration-300
                         flex items-center gap-4 md:gap-6"
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Icon */}
              <div className="flex-shrink-0">
                <GoldenIcon 
                  icon={IconComponent}
                  size="lg"
                  glow="medium"
                  className="transition-all duration-300"
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Category Name */}
                <h3 className="text-lg md:text-xl font-ancient text-ancient-gold 
                               mb-1 tracking-wide
                               group-hover:drop-shadow-[0_0_12px_rgba(196,166,97,0.4)]
                               transition-all duration-300">
                  {category.name}
                </h3>

                {/* Tagline */}
                <p className="text-xs md:text-sm text-foreground/60 leading-relaxed">
                  {category.tagline}
                </p>
              </div>

              {/* Right Side */}
              <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
                {/* Product Count Badge */}
                <div className="px-2.5 md:px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
                  <span className="text-[10px] md:text-xs font-medium text-ancient-gold tracking-wider">
                    {productCount} {productCount === 1 ? 'ITEM' : 'ITEMS'}
                  </span>
                </div>
                
                {/* Arrow */}
                <motion.div
                  className="text-ancient-gold opacity-40 group-hover:opacity-100
                             transition-opacity duration-300"
                  initial={{ x: 0 }}
                  whileHover={{ x: 4 }}
                >
                  <ChevronRight className="w-5 h-5" strokeWidth={2} />
                </motion.div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default CategoryTabs;
