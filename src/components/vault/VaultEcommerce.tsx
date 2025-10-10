import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useState } from 'react';
import { VaultOrder, Relic } from '@/data/vaultOrders';
import ProductCard from '@/components/collections/ProductCard';
import { ScrollArea } from '@/components/ui/scroll-area';

interface VaultEcommerceProps {
  order: VaultOrder;
}

interface ExtendedRelic extends Relic {
  instrumentName: string;
}

const VaultEcommerce = ({ order }: VaultEcommerceProps) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Aggregate all relics with their instrument names
  const allRelics: ExtendedRelic[] = useMemo(() => {
    return order.instruments.flatMap(instrument =>
      instrument.relics.map(relic => ({
        ...relic,
        instrumentName: instrument.name,
      }))
    );
  }, [order]);

  // Filter relics based on active category
  const displayedRelics = useMemo(() => {
    if (activeCategory === 'all') return allRelics;
    return allRelics.filter(relic => 
      relic.instrumentName === order.instruments.find(i => i.id === activeCategory)?.name
    );
  }, [activeCategory, allRelics, order.instruments]);

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
                  CATEGORIES
                </h3>
              </div>

              {/* ALL Category */}
              <button
                onClick={() => setActiveCategory('all')}
                className={`
                  w-full text-left px-4 py-3 rounded-sm transition-all duration-300
                  ${activeCategory === 'all'
                    ? 'bg-primary/10 text-primary border-l-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card'
                  }
                `}
              >
                <span className="text-sm font-medium tracking-wide">
                  ALL
                </span>
                <span className="text-xs text-muted-foreground/60 block mt-1">
                  {allRelics.length} items
                </span>
              </button>

              {/* Instrument Categories */}
              <div className="space-y-2">
                {order.instruments.map((instrument) => {
                  const relicCount = instrument.relics.length;
                  return (
                    <button
                      key={instrument.id}
                      onClick={() => setActiveCategory(instrument.id)}
                      className={`
                        w-full text-left px-4 py-3 rounded-sm transition-all duration-300
                        ${activeCategory === instrument.id
                          ? 'bg-primary/10 text-primary border-l-2 border-primary'
                          : 'text-muted-foreground hover:text-foreground hover:bg-card'
                        }
                      `}
                    >
                      <span className="text-sm font-medium tracking-wide">
                        {instrument.name}
                      </span>
                      <span className="text-xs text-muted-foreground/60 block mt-1">
                        {relicCount} {relicCount === 1 ? 'item' : 'items'}
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
                {order.latinInscription}
              </p>

              {/* Order Title */}
              <h2 className="text-4xl md:text-5xl font-ancient text-ancient-gold mb-4 
                             drop-shadow-[0_0_20px_rgba(196,166,97,0.3)]">
                {order.title.toUpperCase()}
              </h2>

              {/* Order Essence */}
              <p className="text-base text-foreground/80 max-w-2xl mx-auto">
                {order.essence}
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
                key={activeCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
              >
                {displayedRelics.length > 0 ? (
                  displayedRelics.map((relic, index) => (
                    <motion.div
                      key={relic.id}
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
                          name: relic.name,
                          category: relic.instrumentName,
                          description: relic.philosophicalEssence || relic.description,
                          price: relic.price,
                          image: relic.image,
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
                      No relics available
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
