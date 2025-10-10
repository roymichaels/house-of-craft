import { motion, AnimatePresence } from 'framer-motion';
import { Relic } from '@/data/vaultOrders';
import ProductCard from '@/components/collections/ProductCard';

interface VaultRelicGridProps {
  relics: Relic[];
  instrumentName: string;
  orderTitle: string;
  onBack: () => void;
}

const VaultRelicGrid = ({ relics, instrumentName, orderTitle, onBack }: VaultRelicGridProps) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="relics"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="px-6 py-12 border-t border-primary/10"
      >
        {/* Breadcrumb Navigation */}
        <div className="text-center mb-10">
          <button
            onClick={onBack}
            className="text-xs font-sans text-muted-foreground/60 hover:text-primary 
                       tracking-widest mb-2 transition-colors"
          >
            ← {orderTitle.toUpperCase()}
          </button>
          <h3 className="text-3xl font-ancient-tulip text-primary mb-2 tracking-wide">
            {instrumentName}
          </h3>
          <p className="text-sm font-ancient-tulip text-muted-foreground italic">
            Select your relic
          </p>
        </div>

        {/* Relic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {relics.map((relic, index) => (
            <motion.div
              key={relic.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <ProductCard
                product={{
                  id: relic.id,
                  name: relic.name,
                  category: '',
                  description: relic.philosophicalEssence || relic.description,
                  price: relic.price,
                  image: relic.image,
                }}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VaultRelicGrid;
