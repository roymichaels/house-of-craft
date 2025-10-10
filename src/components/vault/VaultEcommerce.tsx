import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useState } from 'react';
import type { Category, Product } from '@/data/catalog';
import ProductCard from '@/components/collections/ProductCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BrandLanguage } from '@/lib/brandLanguage';

interface VaultEcommerceProps {
  category: Category;
}

interface ExtendedProduct extends Product {
  subcategoryName: string;
}

const VaultEcommerce = ({ category }: VaultEcommerceProps) => {
  const [activeSubcategory, setActiveSubcategory] = useState<string>('all');

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

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="ecommerce"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex min-h-[600px]"
      >
        {/* Sidebar */}
        <div className="w-64 border-r border-primary/10 flex-shrink-0">
          <ScrollArea className="h-[600px]">
            <div className="p-6 space-y-6">
              {/* Sidebar Header */}
              <div className="pb-4 border-b border-primary/10">
                <h3 className="text-sm font-ancient text-primary/60 tracking-widest mb-2">
                  {BrandLanguage.micro.filterBy.toUpperCase()}
                </h3>
              </div>

              {/* ALL Subcategory */}
              <button
                onClick={() => setActiveSubcategory('all')}
                className={`
                  w-full text-left px-4 py-3 rounded-sm transition-all duration-300
                  ${activeSubcategory === 'all'
                    ? 'bg-primary/10 text-primary border-l-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card'
                  }
                `}
              >
                <span className="text-sm font-medium tracking-wide">
                  {BrandLanguage.micro.allItems.toUpperCase()}
                </span>
                <span className="text-xs text-muted-foreground/60 block mt-1">
                  {allProducts.length} {allProducts.length === 1 ? BrandLanguage.micro.item : BrandLanguage.micro.items}
                </span>
              </button>

              {/* Subcategory Filters */}
              <div className="space-y-2">
                {category.subcategories.map((subcategory) => {
                  const productCount = subcategory.products.length;
                  return (
                    <button
                      key={subcategory.id}
                      onClick={() => setActiveSubcategory(subcategory.id)}
                      className={`
                        w-full text-left px-4 py-3 rounded-sm transition-all duration-300
                        ${activeSubcategory === subcategory.id
                          ? 'bg-primary/10 text-primary border-l-2 border-primary'
                          : 'text-muted-foreground hover:text-foreground hover:bg-card'
                        }
                      `}
                    >
                      <span className="text-sm font-medium tracking-wide">
                        {subcategory.name.toUpperCase()}
                      </span>
                      <span className="text-xs text-muted-foreground/60 block mt-1">
                        {productCount} {productCount === 1 ? BrandLanguage.micro.item : BrandLanguage.micro.items}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-12 text-center"
            >
              {/* Latin Inscription */}
              <p className="font-order text-primary/60 text-xs tracking-[0.3em] mb-4">
                {BrandLanguage.latin[category.id as keyof typeof BrandLanguage.latin] || BrandLanguage.latin.vault}
              </p>

              {/* Category Title */}
              <h2 className="text-4xl md:text-5xl font-ancient text-ancient-gold mb-4 
                             drop-shadow-[0_0_20px_rgba(196,166,97,0.3)]">
                {category.name.toUpperCase()}
              </h2>

              {/* Category Tagline */}
              <p className="text-base text-foreground/80 max-w-2xl mx-auto">
                {category.tagline}
              </p>

              {/* Divider */}
              <div className="mt-6 flex items-center justify-center gap-4">
                <span className="h-px w-16 bg-gradient-to-r from-transparent to-primary/30" />
                <span className="text-primary/40">◆</span>
                <span className="h-px w-16 bg-gradient-to-l from-transparent to-primary/30" />
              </div>
            </motion.div>

            {/* Product Grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSubcategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
              >
                {displayedProducts.length > 0 ? (
                  displayedProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.1,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <ProductCard
                        product={{
                          id: index,
                          name: product.name,
                          category: product.subcategoryName,
                          description: product.description,
                          price: product.price.toString(),
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
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VaultEcommerce;
