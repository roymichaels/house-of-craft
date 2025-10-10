import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useModalStore } from "@/stores/modalStore";
import { GoldenIcon } from "@/components/ui/GoldenIcon";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const CartModal = () => {
  const { activeModal, closeModal, openModal } = useModalStore();
  const { items, updateQuantity, removeItem, clearCart, getTotal, getItemCount } = useCartStore();
  const isOpen = activeModal === 'cart';

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

  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { items }
      });

      if (error) throw error;

      if (data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Unable to create checkout session. Please try again.');
      setIsCheckingOut(false);
    }
  };

  const handleRemoveItem = (productId: string, productName: string) => {
    removeItem(productId);
    toast.success(`${productName} removed from cart`);
  };

  const isEmpty = items.length === 0;
  const total = getTotal();
  const itemCount = getItemCount();

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

          {/* Cart Modal */}
          <motion.div
            className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center p-0 md:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full md:max-w-2xl h-[90vh] md:h-auto md:max-h-[85vh]
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
                  <GoldenIcon icon={ShoppingBag} size={24} />
                  <div>
                    <h2 className="text-xl font-ancient text-foreground">Your Cart</h2>
                    {!isEmpty && (
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {itemCount} {itemCount === 1 ? 'item' : 'items'}
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

              {/* Cart Content */}
              {isEmpty ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <GoldenIcon icon={ShoppingBag} size={64} className="mb-4 opacity-30" />
                    <h3 className="text-lg font-ancient text-foreground mb-2">Your cart is empty</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Add items from the catalog to get started
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
                      BROWSE CATALOG
                    </motion.button>
                  </motion.div>
                </div>
              ) : (
                <>
                  {/* Items List */}
                  <div className="flex-1 overflow-y-auto momentum-scroll p-6 space-y-4">
                    <AnimatePresence mode="popLayout">
                      {items.map((item, index) => (
                        <motion.div
                          key={item.productId}
                          className="flex gap-4 p-4 rounded-2xl bg-card/40 backdrop-blur-sm
                                     border border-border/30 hover:border-primary/30
                                     transition-all group"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          transition={{ delay: index * 0.05 }}
                          layout
                        >
                          {/* Product Image */}
                          <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted/30 flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-ancient text-foreground truncate">{item.name}</h4>
                            <p className="text-xs text-muted-foreground capitalize truncate">
                              {item.category} · {item.subcategory}
                            </p>
                            <p className="text-sm font-semibold text-foreground mt-2">
                              ${item.price.toLocaleString()}
                            </p>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex flex-col items-end justify-between">
                            <motion.button
                              onClick={() => handleRemoveItem(item.productId, item.name)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <GoldenIcon icon={Trash2} size={16} />
                            </motion.button>

                            <div className="flex items-center gap-2">
                              <motion.button
                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                className="w-7 h-7 rounded-full border border-border/30
                                           flex items-center justify-center
                                           hover:border-primary/40 hover:bg-primary/5
                                           transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Minus size={12} className="text-muted-foreground" />
                              </motion.button>

                              <span className="w-8 text-center font-medium text-foreground">
                                {item.quantity}
                              </span>

                              <motion.button
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                className="w-7 h-7 rounded-full border border-border/30
                                           flex items-center justify-center
                                           hover:border-primary/40 hover:bg-primary/5
                                           transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Plus size={12} className="text-muted-foreground" />
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Footer */}
                  <div className="border-t border-border/30 p-6 space-y-4 bg-background/50 backdrop-blur-sm">
                    {/* Total */}
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-ancient text-foreground">Total</span>
                      <span className="text-2xl font-ancient text-ancient-gold">
                        ${total.toLocaleString()}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <motion.button
                        onClick={() => {
                          clearCart();
                          toast.success('Cart cleared');
                        }}
                        className="flex-1 py-3 rounded-full border border-border/30
                                   text-muted-foreground text-sm font-medium tracking-wider
                                   hover:border-destructive/50 hover:text-destructive
                                   transition-all"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        CLEAR CART
                      </motion.button>

                      <motion.button
                        onClick={handleCheckout}
                        disabled={isCheckingOut}
                        className="flex-[2] py-3 rounded-full
                                   bg-gradient-to-r from-primary via-primary to-primary/80
                                   text-background text-sm font-bold tracking-wider
                                   hover:shadow-lg hover:shadow-primary/25
                                   transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={!isCheckingOut ? { scale: 1.02 } : {}}
                        whileTap={!isCheckingOut ? { scale: 0.98 } : {}}
                      >
                        {isCheckingOut ? 'CREATING CHECKOUT...' : 'PROCEED TO CHECKOUT'}
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

export default CartModal;
