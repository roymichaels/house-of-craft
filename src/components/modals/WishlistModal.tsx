import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, ShoppingCart, Trash2, Package } from "lucide-react";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useCartStore } from "@/stores/cartStore";
import { useModalStore } from "@/stores/modalStore";
import { GoldenIcon } from "@/components/ui/GoldenIcon";
import { toast } from "sonner";

const WishlistModal = () => {
  const { activeModal, closeModal, openModal } = useModalStore();
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const { addItem: addToCart } = useCartStore();
  const isOpen = activeModal === 'wishlist';

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleMoveToCart = (item: typeof items[0]) => {
    addToCart({
      productId: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
      subcategory: item.subcategory
    }, 1);
    removeItem(item.productId);
    toast.success(`${item.name} moved to cart`);
  };

  const handleRemoveItem = (productId: string, productName: string) => {
    removeItem(productId);
    toast.success(`${productName} removed from wishlist`);
  };

  const handleViewProduct = (item: typeof items[0]) => {
    closeModal();
    setTimeout(() => {
      openModal('object', {
        title: item.name,
        category: item.category,
        description: `${item.subcategory} - ${item.name}`,
        image: item.image,
        price: `$${item.price.toLocaleString()}`
      });
    }, 300);
  };

  const isEmpty = items.length === 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-background/98 backdrop-blur-2xl z-[9998]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeModal}
          />

          {/* Wishlist Modal */}
          <motion.div
            className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center p-0 md:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full md:max-w-3xl h-[90vh] md:h-auto md:max-h-[85vh]
                         bg-background/95 backdrop-blur-xl
                         md:rounded-3xl rounded-t-3xl
                         border-t border-border/30 md:border border-border/30
                         shadow-2xl overflow-hidden flex flex-col"
              initial={{ y: "100%", scale: 0.9 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: "100%", scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border/30">
                <div className="flex items-center gap-3">
                  <GoldenIcon icon={Heart} size={24} />
                  <div>
                    <h2 className="text-xl font-ancient text-foreground">Your Wishlist</h2>
                    {!isEmpty && (
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {items.length} {items.length === 1 ? 'item' : 'items'} saved
                      </p>
                    )}
                  </div>
                </div>

                <motion.button
                  onClick={closeModal}
                  className="w-10 h-10 rounded-full border border-border/30
                             flex items-center justify-center
                             hover:border-primary/40 hover:bg-primary/5
                             transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <GoldenIcon icon={X} size={20} />
                </motion.button>
              </div>

              {/* Wishlist Content */}
              {isEmpty ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <GoldenIcon icon={Heart} size={64} className="mb-4 opacity-30" />
                    <h3 className="text-lg font-ancient text-foreground mb-2">Your wishlist is empty</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Save your favorite items to revisit them later
                    </p>
                    <motion.button
                      onClick={() => {
                        closeModal();
                        setTimeout(() => openModal('collections'), 300);
                      }}
                      className="px-6 py-3 bg-primary/10 border border-primary/30 rounded-full
                                 text-ancient-gold font-medium text-sm tracking-wider
                                 hover:bg-primary/20 hover:border-primary/50
                                 transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      EXPLORE CATALOG
                    </motion.button>
                  </motion.div>
                </div>
              ) : (
                <>
                  {/* Items Grid */}
                  <div className="flex-1 overflow-y-auto momentum-scroll p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <AnimatePresence mode="popLayout">
                        {items.map((item, index) => (
                          <motion.div
                            key={item.productId}
                            className="group relative rounded-2xl overflow-hidden bg-card/20 backdrop-blur-sm
                                       border border-border/30 hover:border-primary/30
                                       transition-all"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ delay: index * 0.05 }}
                            layout
                          >
                            {/* Product Image */}
                            <div 
                              className="relative aspect-square cursor-pointer overflow-hidden"
                              onClick={() => handleViewProduct(item)}
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              
                              {/* Hover overlay */}
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 
                                            transition-opacity flex items-center justify-center">
                                <Package className="w-8 h-8 text-white" />
                              </div>

                              {/* Remove button */}
                              <motion.button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveItem(item.productId, item.name);
                                }}
                                className="absolute top-3 right-3 w-8 h-8 rounded-full
                                         bg-background/80 backdrop-blur-sm border border-border/30
                                         flex items-center justify-center
                                         opacity-0 group-hover:opacity-100 transition-opacity"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Trash2 size={14} className="text-destructive" />
                              </motion.button>
                            </div>

                            {/* Product Info */}
                            <div className="p-4">
                              <h4 className="font-ancient text-foreground mb-1 line-clamp-1">
                                {item.name}
                              </h4>
                              <p className="text-xs text-muted-foreground capitalize mb-2 line-clamp-1">
                                {item.category} · {item.subcategory}
                              </p>
                              <p className="text-lg font-ancient text-ancient-gold mb-3">
                                ${item.price.toLocaleString()}
                              </p>

                              {/* Add to Cart Button */}
                              <motion.button
                                onClick={() => handleMoveToCart(item)}
                                className="w-full py-2.5 rounded-full
                                         bg-gradient-to-r from-primary via-primary to-primary/80
                                         text-background text-sm font-bold tracking-wider
                                         hover:shadow-lg hover:shadow-primary/25
                                         transition-all flex items-center justify-center gap-2"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <ShoppingCart size={16} />
                                ADD TO CART
                              </motion.button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="border-t border-border/30 p-6 bg-background/50 backdrop-blur-sm">
                    <div className="flex gap-3">
                      <motion.button
                        onClick={() => {
                          clearWishlist();
                          toast.success('Wishlist cleared');
                        }}
                        className="flex-1 py-3 rounded-full border border-border/30
                                   text-muted-foreground text-sm font-medium tracking-wider
                                   hover:border-destructive/50 hover:text-destructive
                                   transition-all"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        CLEAR WISHLIST
                      </motion.button>

                      <motion.button
                        onClick={() => {
                          closeModal();
                          setTimeout(() => openModal('collections'), 300);
                        }}
                        className="flex-[2] py-3 rounded-full
                                   bg-primary/10 border border-primary/30
                                   text-ancient-gold text-sm font-bold tracking-wider
                                   hover:bg-primary/20 hover:border-primary/50
                                   transition-all"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        CONTINUE SHOPPING
                      </motion.button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WishlistModal;
