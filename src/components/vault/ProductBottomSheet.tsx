import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { X, Heart, Share2, ShoppingBag, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { GoldenIcon } from "@/components/ui/GoldenIcon";
import { useModalStore } from "@/stores/modalStore";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  description: string;
  price: string | number;
  image: string;
}

interface ProductBottomSheetProps {
  product: Product | null;
  onClose: () => void;
}

const ProductBottomSheet = ({ product, onClose }: ProductBottomSheetProps) => {
  const [dragOffset, setDragOffset] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem, getItemQuantity } = useCartStore();
  const { openModal } = useModalStore();
  const inCartQuantity = product ? getItemQuantity(product.id) : 0;

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.y > 150 || info.velocity.y > 300) {
      onClose();
    }
    setDragOffset(0);
  };

  const handleAddToCart = () => {
    if (!product) return;

    const price = typeof product.price === 'string' 
      ? parseFloat(product.price.replace(/[^0-9.]/g, '')) || 0
      : product.price;

    addItem({
      productId: product.id,
      name: product.name,
      price: price,
      image: product.image,
      category: product.category,
      subcategory: product.subcategory || 'general'
    }, quantity);

    toast.success(`${product.name} added to cart`);
    setQuantity(1);
  };

  const incrementQuantity = () => setQuantity(q => q + 1);
  const decrementQuantity = () => setQuantity(q => Math.max(1, q - 1));

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
                    <span className="text-xs font-sans font-medium text-ancient-gold tracking-wider">
                      {product.category.toUpperCase()}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-3xl font-romania text-ancient-gold tracking-wide">
                    {product.name}
                  </h2>

                  {/* Description */}
                  <p className="text-foreground/80 leading-relaxed font-romania">
                    {product.description}
                  </p>

                  {/* Price */}
                  <div className="pt-4 border-t border-border/50">
                    <p className="text-2xl font-sans font-semibold text-foreground">
                      {product.price}
                    </p>
                  </div>

                  {/* In Cart Indicator */}
                  {inCartQuantity > 0 && (
                    <motion.div
                      className="px-4 py-2 bg-primary/10 border border-primary/30 rounded-full
                                 text-ancient-gold text-sm font-medium text-center"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {inCartQuantity} in cart
                    </motion.div>
                  )}

                  {/* Quantity Selector */}
                  <div className="flex items-center justify-between p-4 bg-card/40 backdrop-blur-sm
                                 border border-border/30 rounded-2xl">
                    <span className="text-sm font-sans font-medium text-foreground">Quantity</span>
                    <div className="flex items-center gap-3">
                      <motion.button
                        onClick={decrementQuantity}
                        className="w-9 h-9 rounded-full border border-border/30
                                   flex items-center justify-center
                                   hover:border-primary/40 hover:bg-primary/5
                                   transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Minus size={16} className="text-muted-foreground" />
                      </motion.button>

                      <span className="w-12 text-center font-bold text-lg text-foreground">
                        {quantity}
                      </span>

                      <motion.button
                        onClick={incrementQuantity}
                        className="w-9 h-9 rounded-full border border-border/30
                                   flex items-center justify-center
                                   hover:border-primary/40 hover:bg-primary/5
                                   transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Plus size={16} className="text-muted-foreground" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <motion.button
                    onClick={handleAddToCart}
                    className="w-full py-4 bg-gradient-to-r from-primary via-primary to-primary/80
                               text-background font-sans font-bold text-sm tracking-widest rounded-full
                               hover:shadow-lg hover:shadow-primary/25 transition-all
                               flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ShoppingBag size={18} />
                    ADD TO CART
                  </motion.button>

                  {/* View Cart Link */}
                  <motion.button
                    onClick={() => {
                      onClose();
                      setTimeout(() => openModal('cart'), 300);
                    }}
                    className="text-sm font-sans text-muted-foreground hover:text-ancient-gold transition-colors
                               text-center underline underline-offset-2"
                    whileHover={{ scale: 1.02 }}
                  >
                    View Cart
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
