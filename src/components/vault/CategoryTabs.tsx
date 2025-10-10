import { motion } from "framer-motion";
import type { Category } from "@/data/catalog";

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string | null;
  onSelectCategory: (categoryId: string) => void;
}

const CategoryTabs = ({ categories, activeCategory, onSelectCategory }: CategoryTabsProps) => {
  return (
    <motion.div
      key="category-tabs"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="p-12"
    >
      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {categories.map((category, index) => {
          const productCount = category.subcategories.reduce(
            (acc, sub) => acc + sub.products.length,
            0
          );

          return (
            <motion.button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative p-8 text-left border border-primary/10 rounded-sm
                         hover:border-primary/30 bg-card/50 backdrop-blur-sm
                         transition-all duration-500 hover:shadow-[0_0_30px_rgba(196,166,97,0.1)]"
              whileHover={{ y: -8 }}
            >
              {/* Golden glow on hover */}
              <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent
                              opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-sm
                              pointer-events-none" />

              {/* Content */}
              <div className="relative z-10">
                {/* Category Name */}
                <h3 className="text-2xl font-ancient text-ancient-gold mb-3 
                               group-hover:drop-shadow-[0_0_15px_rgba(196,166,97,0.5)]
                               transition-all duration-300">
                  {category.name}
                </h3>

                {/* Tagline */}
                <p className="text-sm text-foreground/70 mb-4 leading-relaxed">
                  {category.tagline}
                </p>

                {/* Product Count */}
                <div className="flex items-center justify-between pt-4 border-t border-primary/10">
                  <span className="text-xs text-muted-foreground/60 tracking-wider">
                    {productCount} {productCount === 1 ? 'ITEM' : 'ITEMS'}
                  </span>
                  
                  {/* Arrow */}
                  <motion.span
                    className="text-primary opacity-0 group-hover:opacity-100"
                    initial={{ x: -10 }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    →
                  </motion.span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default CategoryTabs;
