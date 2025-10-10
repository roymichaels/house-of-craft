import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useState } from 'react';
import type { Category, Product } from '@/data/catalog';
import ProductCard from '@/components/collections/ProductCard';
import ProductCardSkeleton from '@/components/vault/ProductCardSkeleton';
import SegmentedControl from '@/components/vault/SegmentedControl';
import { BrandLanguage } from '@/lib/brandLanguage';

interface VaultEcommerceProps {
  category: Category;
}

interface ExtendedProduct extends Product {
  subcategoryName: string;
}

const VaultEcommerce = ({ category }: VaultEcommerceProps) => {
  const [activeSubcategory, setActiveSubcategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Aggregate all products with their subcategory names
  const allProducts: ExtendedProduct[] = useMemo(() => {
    return category.subcategories.flatMap(subcategory =>
      subcategory.products.map(product => ({
        ...product,
        subcategoryName: subcategory.name,
      }))
    );
  }, [category]);

  // Filter products based on active subcategory
  const displayedProducts = useMemo(() => {
    if (activeSubcategory === 'all') return allProducts;
    return allProducts.filter(product => 
      product.subcategoryName === category.subcategories.find(s => s.id === activeSubcategory)?.name
    );
  }, [activeSubcategory, allProducts, category.subcategories]);

  // Prepare segmented control options
  const segmentedOptions = useMemo(() => {
    return [
      { id: 'all', label: 'All', count: allProducts.length },
      ...category.subcategories.map(sub => ({
        id: sub.id,
        label: sub.name,
        count: sub.products.length,
      })),
    ];
  }, [category.subcategories, allProducts.length]);

  // Handle subcategory change with loading state
  const handleSubcategoryChange = (subcategoryId: string) => {
    setIsLoading(true);
    setActiveSubcategory(subcategoryId);
    setTimeout(() => setIsLoading(false), 300);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="ecommerce"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        className="min-h-[600px]"
      >
        {/* Compact Scrollable Header */}
        <div className="relative z-10 bg-background/95 backdrop-blur-xl border-b border-primary/10">
          <div className="px-6 pt-16 pb-3">
            {/* Category Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="mb-3 text-center"
            >
              {/* Category Title */}
              <h2 className="text-2xl md:text-3xl font-ancient text-ancient-gold mb-2 
                             drop-shadow-[0_0_20px_rgba(196,166,97,0.3)]">
                {category.name.toUpperCase()}
              </h2>

              {/* Category Tagline */}
              <p className="text-xs text-foreground/60 max-w-2xl mx-auto">
                {category.tagline}
              </p>
            </motion.div>

            {/* Segmented Control for Subcategories */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="flex justify-center pb-1"
            >
              <SegmentedControl
                options={segmentedOptions}
                activeOption={activeSubcategory}
                onChange={handleSubcategoryChange}
              />
            </motion.div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="px-6 py-8">
          {/* Product Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSubcategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto"
            >
              {isLoading ? (
                // Skeleton loaders
                Array.from({ length: 6 }).map((_, index) => (
                  <motion.div
                    key={`skeleton-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.05,
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  >
                    <ProductCardSkeleton />
                  </motion.div>
                ))
              ) : displayedProducts.length > 0 ? (
                displayedProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                      delay: index * 0.05,
                    }}
                  >
                    <ProductCard
                      product={{
                        id: product.id,
                        name: product.name,
                        category: product.subcategoryName,
                        subcategory: product.subcategory,
                        description: product.description,
                        price: product.price,
                        image: product.images[0],
                      }}
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full text-center py-20"
                >
                  <p className="text-muted-foreground/60 text-lg mb-2">
                    No products available
                  </p>
                  <p className="text-sm text-muted-foreground/40 italic">
                    This collection is being carefully curated
                  </p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VaultEcommerce;
