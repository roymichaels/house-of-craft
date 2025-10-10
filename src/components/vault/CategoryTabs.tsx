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
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      className="p-6 md:p-12"
    >
      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
        {categories.map((category, index) => {
          const productCount = category.subcategories.reduce(
            (acc, sub) => acc + sub.products.length,
            0
          );

          return (
            <motion.button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                delay: index * 0.08,
              }}
              className="group relative p-6 md:p-8 text-left 
                         bg-card/40 backdrop-blur-sm rounded-2xl
                         border border-border/30 hover:border-primary/40
                         shadow-lg hover:shadow-2xl hover:shadow-primary/10
                         transition-all duration-300"
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Golden glow on hover */}
              <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent
                              opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl
                              pointer-events-none" />

              {/* Content */}
              <div className="relative z-10 space-y-4">
                {/* Category Name */}
                <h3 className="text-2xl md:text-3xl font-ancient text-ancient-gold 
                               group-hover:drop-shadow-[0_0_15px_rgba(196,166,97,0.5)]
                               transition-all duration-300">
                  {category.name}
                </h3>

                {/* Tagline */}
                <p className="text-sm text-foreground/70 leading-relaxed min-h-[3rem]">
                  {category.tagline}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-primary/10">
                  {/* Product Count Badge */}
                  <div className="px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
                    <span className="text-xs font-medium text-ancient-gold tracking-wider">
                      {productCount} {productCount === 1 ? 'ITEM' : 'ITEMS'}
                    </span>
                  </div>
                  
                  {/* Arrow */}
                  <motion.span
                    className="text-ancient-gold text-lg opacity-0 group-hover:opacity-100"
                    initial={{ x: -10 }}
                    whileHover={{ x: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 25,
                    }}
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
