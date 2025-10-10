import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { X, Heart, Share2 } from "lucide-react";
import { useState } from "react";
import { GoldenIcon } from "@/components/ui/GoldenIcon";

interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  price: string;
  image: string;
}

interface ProductBottomSheetProps {
  product: Product | null;
  onClose: () => void;
}

const ProductBottomSheet = ({ product, onClose }: ProductBottomSheetProps) => {
  const [dragOffset, setDragOffset] = useState(0);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.y > 150 || info.velocity.y > 300) {
      onClose();
    }
    setDragOffset(0);
  };

  return (
    <AnimatePresence>
      {product && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: dragOffset }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDrag={(_, info) => setDragOffset(Math.max(0, info.offset.y))}
            onDragEnd={handleDragEnd}
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[90vh] overflow-hidden"
          >
            {/* Glass morphism container */}
            <div className="bg-background/95 backdrop-blur-2xl border-t border-primary/20 rounded-t-3xl shadow-2xl">
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-6 pb-4">
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-primary/10 transition-colors"
                >
                  <GoldenIcon icon={X} size="md" glow="subtle" />
                </button>
                
                <div className="flex gap-2">
                  <button className="p-2 rounded-full hover:bg-primary/10 transition-colors">
                    <GoldenIcon icon={Heart} size="md" glow="subtle" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-primary/10 transition-colors">
                    <GoldenIcon icon={Share2} size="md" glow="subtle" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 pb-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                {/* Hero Image */}
                <div className="relative aspect-square rounded-2xl overflow-hidden mb-6">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="space-y-4">
                  {/* Category */}
                  <div className="inline-block px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
                    <span className="text-xs font-medium text-ancient-gold tracking-wider">
                      {product.category.toUpperCase()}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-3xl font-ancient text-ancient-gold">
                    {product.name}
                  </h2>

                  {/* Description */}
                  <p className="text-foreground/80 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Price */}
                  <div className="pt-4 border-t border-border/50">
                    <p className="text-2xl font-semibold text-foreground">
                      {product.price}
                    </p>
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-medium text-lg
                               hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                  >
                    Contact Concierge
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProductBottomSheet;
