import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, Package, Ruler, Eye, Star, ShoppingCart, Zap, Check, Minus, Plus, TruckIcon } from "lucide-react";
import { useModalStore } from "@/stores/modalStore";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useEffect, useState } from "react";
import { OrderLanguage } from "@/lib/orderLanguage";
import { latin } from "@/lib/brandLanguage";
import { ProductMediaGallery } from "./ProductMediaGallery";
import ReviewsSection from "@/components/reviews/ReviewsSection";
import TrustBadges from "@/components/trust/TrustBadges";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type TabType = 'overview' | 'specs' | 'reviews';

const ObjectModal = () => {
  const { activeModal, objectData, closeModal, openModal } = useModalStore();
  const isOpen = activeModal === 'object';
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  
  const { addItem, getItemQuantity } = useCartStore();
  const cartQuantity = objectData?.productId ? getItemQuantity(objectData.productId) : 0;

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    
    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    
    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, closeModal]);

  if (!objectData) return null;

  // Support both old (image) and new (media) format
  const mediaItems = objectData.media || (objectData.image ? [{ type: 'image' as const, url: objectData.image }] : []);

  // Use product specs or fallback to mock
  const specs = objectData.specs || {
    'Material': 'Premium stainless steel',
    'Dimensions': '42mm diameter, 12mm thickness',
    'Weight': '180g',
    'Water Resistance': '100m / 10 ATM',
    'Movement': 'Automatic mechanical',
    'Power Reserve': '42 hours'
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, Math.min(10, prev + delta)));
  };

  const handleAddToCart = async () => {
    if (!objectData.productId) return;
    
    setIsAddingToCart(true);
    
    try {
      addItem({
        productId: objectData.productId,
        name: objectData.title,
        price: typeof objectData.price === 'number' ? objectData.price : parseFloat(objectData.price?.replace(/[^0-9.]/g, '') || '0'),
        image: mediaItems[0]?.url || '',
        category: objectData.category,
        subcategory: objectData.subcategory || ''
      }, quantity);

      setJustAdded(true);
      
      toast({
        title: "Added to cart",
        description: `${quantity}x ${objectData.title} added to your cart`,
      });

      setTimeout(() => setJustAdded(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive"
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!objectData.productId) return;
    
    setIsBuyingNow(true);
    
    try {
      const priceValue = typeof objectData.price === 'number' ? objectData.price : parseFloat(objectData.price?.replace(/[^0-9.]/g, '') || '0');
      
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          items: [{
            productId: objectData.productId,
            name: objectData.title,
            price: priceValue,
            image: mediaItems[0]?.url || '',
            quantity,
            category: objectData.category,
            subcategory: objectData.subcategory || ''
          }]
        }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout failed",
        description: "Unable to create checkout session. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsBuyingNow(false);
    }
  };

  const formatPrice = (price: string | number | undefined) => {
    if (!price) return '';
    const numPrice = typeof price === 'number' ? price : parseFloat(price.replace(/[^0-9.]/g, ''));
    return `$${numPrice.toLocaleString()}`;
  };

  const totalPrice = () => {
    if (!objectData.price) return '';
    const numPrice = typeof objectData.price === 'number' ? objectData.price : parseFloat(objectData.price.replace(/[^0-9.]/g, ''));
    return `$${(numPrice * quantity).toLocaleString()}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Cinematic background with radial gold glow */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-[#0a0a08] via-obsidian-core to-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            {/* Radial gold glow - simulates sunlight through blinds */}
            <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-ancient-gold/10 blur-[150px] rounded-full" />
            
            {/* Animated dust particles */}
            <div className="absolute inset-0 opacity-20">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-ancient-gold/30 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -100, 0],
                    opacity: [0, 0.6, 0],
                  }}
                  transition={{
                    duration: 8 + Math.random() * 4,
                    repeat: Infinity,
                    delay: Math.random() * 5,
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Modal Content */}
          <motion.div
            className="relative z-10 w-full h-screen flex flex-col md:grid md:grid-cols-[60%_40%] gap-4 md:gap-8 p-4 md:p-12 
                       bg-gradient-to-b from-card/30 via-card/50 to-card/30 
                       border-y border-ancient-gold/20"
            initial={{ 
              scale: 0.98, 
              y: 20, 
              opacity: 0,
              filter: "blur(8px)"
            }}
            animate={{ 
              scale: 1, 
              y: 0, 
              opacity: 1,
              filter: "blur(0px)"
            }}
            exit={{ 
              scale: 0.98, 
              y: 20, 
              opacity: 0,
              filter: "blur(8px)"
            }}
            transition={{ 
              duration: 0.5, 
              ease: [0.25, 0.1, 0.25, 1] 
            }}
          >
            {/* Go Back Button */}
            <motion.button
              onClick={closeModal}
              className="absolute top-6 left-6 z-20 p-2 rounded-full
                         bg-black/40 backdrop-blur-sm border border-ancient-gold/20
                         text-ancient-gold/60 hover:text-ancient-gold hover:bg-ancient-gold/10
                         transition-all duration-300 group"
              whileHover={{ scale: 1.05, x: -2 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </motion.button>

            {/* Close Button */}
            <motion.button
              onClick={closeModal}
              className="absolute top-6 right-6 z-20 p-2 rounded-full
                         bg-black/40 backdrop-blur-sm border border-ancient-gold/20
                         text-ancient-gold/60 hover:text-ancient-gold hover:bg-ancient-gold/10
                         transition-all duration-300 group"
              whileHover={{ scale: 1.05, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </motion.button>

            {/* Left Panel - Media Gallery */}
            <div className="relative h-[50vh] md:h-full">
              <ProductMediaGallery media={mediaItems} title={objectData.title} />
            </div>

            {/* Right Panel - Product Details with Tabs */}
            <div className="flex-1 flex flex-col relative pb-20 md:pb-0 overflow-y-auto momentum-scroll">
              {/* Rotating sigil watermark */}
              <motion.div
                className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none"
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              >
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="1" className="text-ancient-gold" />
                  <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="1" className="text-ancient-gold" />
                  <path d="M50 5 L50 95 M5 50 L95 50" stroke="currentColor" strokeWidth="1" className="text-ancient-gold" />
                </svg>
              </motion.div>

              {/* Header Section */}
              <div className="relative mb-6">
                {/* Golden geometry frame corners */}
                <div className="absolute -top-2 -left-2 w-6 h-6 border-l-2 border-t-2 border-ancient-gold/50" />
                <div className="absolute -top-2 -right-2 w-6 h-6 border-r-2 border-t-2 border-ancient-gold/50" />
                
                {/* Latin inscription based on category */}
                <p className="font-serif italic text-ancient-gold/40 text-xs tracking-[0.3em] uppercase mb-2">
                  {latin[objectData.category.toLowerCase()] || "Forma Sequitur Rationem"}
                </p>

                {/* Category badge */}
                <p className="text-xs font-cinzel tracking-[0.2em] text-ancient-gold uppercase mb-3">
                  {objectData.category}
                </p>

                {/* Title with ambient glow */}
                <div className="relative mb-4">
                  <div className="absolute -inset-4 bg-ancient-gold/10 blur-2xl rounded-full" />
                  
                  <h2 className="relative font-ancient text-4xl md:text-5xl text-ancient-gold 
                                 tracking-[0.05em] leading-tight
                                 drop-shadow-[0_0_30px_rgba(196,166,97,0.4)]">
                    {objectData.title}
                  </h2>
                </div>

                {/* Subtitle */}
                <p className="font-serif text-base md:text-lg leading-relaxed text-foreground/80 mb-1">
                  {objectData.description}
                </p>

                {/* Rating Preview */}
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={14} className="fill-primary text-primary" />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">4.8 (127 reviews)</span>
                </div>
              </div>

              {/* Price Display & Stock Status */}
              {objectData.price && (
                <div className="pb-6 border-b border-ancient-gold/20 space-y-4">
                  {/* Stock Badge */}
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      objectData.inStock 
                        ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                        : 'bg-red-500/10 text-red-500 border border-red-500/20'
                    }`}>
                      {objectData.inStock ? '✓ In Stock' : 'Out of Stock'}
                    </div>
                    {cartQuantity > 0 && (
                      <div className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                        {cartQuantity} in cart
                      </div>
                    )}
                  </div>

                  {/* Price Section */}
                  <div>
                    <p className="text-xs font-cinzel tracking-[0.2em] text-ancient-gold/60 uppercase mb-2">
                      Investment
                    </p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-ancient text-ancient-gold tracking-wide">
                        {formatPrice(objectData.price)}
                      </p>
                      {quantity > 1 && (
                        <>
                          <span className="text-ancient-gold/40">×</span>
                          <span className="text-lg text-ancient-gold/60">{quantity}</span>
                          <span className="text-ancient-gold/40">=</span>
                          <span className="text-2xl font-ancient text-ancient-gold">
                            {totalPrice()}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Delivery & Shipping Info */}
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <TruckIcon size={14} className="text-primary" />
                      <span>Ships within 2-3 business days</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package size={14} className="text-primary" />
                      <span>Free shipping on orders over $500</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tabs Navigation */}
              <div className="flex gap-1 border-b border-border/20 mt-6 mb-6">
                {[
                  { id: 'overview' as TabType, label: 'Overview', icon: Eye },
                  { id: 'specs' as TabType, label: 'Specifications', icon: Ruler },
                  { id: 'reviews' as TabType, label: 'Reviews', icon: Star }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium
                                 border-b-2 transition-colors relative
                                 ${activeTab === tab.id 
                                   ? 'border-primary text-primary' 
                                   : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon size={14} />
                      {tab.label}
                    </motion.button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1"
                >
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      {/* Philosophical tagline */}
                      {objectData.story && (
                        <div>
                          <p className="font-serif italic text-sm text-ancient-silver/60 leading-relaxed">
                            "{objectData.story}"
                          </p>
                        </div>
                      )}

                      {/* Trust Badges */}
                      <div>
                        <h3 className="text-sm font-ancient text-foreground mb-4">Why Choose APOLLON</h3>
                        <TrustBadges variant="compact" />
                      </div>
                    </div>
                  )}

                  {activeTab === 'specs' && (
                    <div className="space-y-3">
                      {Object.entries(specs).map(([key, value], index) => (
                        <motion.div
                          key={key}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-start justify-between py-3 border-b border-border/10"
                        >
                          <span className="text-sm text-muted-foreground">{key}</span>
                          <span className="text-sm text-foreground font-medium text-right">{value}</span>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <ReviewsSection productId={objectData.title} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* E-commerce Action Bar - Fixed at bottom on mobile, inline on desktop */}
            <div className="fixed md:relative bottom-0 left-0 right-0 md:bottom-auto md:left-auto 
                            p-4 md:p-0 bg-gradient-to-t from-black via-black/95 to-transparent 
                            md:bg-none z-20 md:z-auto md:absolute md:bottom-8 md:right-12 md:w-80">
              <div className="space-y-3">
                {/* Quantity Selector */}
                <div className="flex items-center justify-between bg-card/30 backdrop-blur-sm border border-ancient-gold/20 rounded-lg p-3">
                  <span className="text-sm font-medium text-foreground">Quantity</span>
                  <div className="flex items-center gap-3">
                    <motion.button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="w-8 h-8 rounded-full bg-ancient-gold/10 border border-ancient-gold/30 
                                 flex items-center justify-center text-ancient-gold
                                 disabled:opacity-30 disabled:cursor-not-allowed
                                 hover:bg-ancient-gold/20 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Minus size={14} />
                    </motion.button>
                    <span className="w-8 text-center font-ancient text-lg text-ancient-gold">
                      {quantity}
                    </span>
                    <motion.button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= 10}
                      className="w-8 h-8 rounded-full bg-ancient-gold/10 border border-ancient-gold/30 
                                 flex items-center justify-center text-ancient-gold
                                 disabled:opacity-30 disabled:cursor-not-allowed
                                 hover:bg-ancient-gold/20 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Plus size={14} />
                    </motion.button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <motion.button
                  onClick={handleAddToCart}
                  disabled={!objectData.inStock || isAddingToCart}
                  className="relative w-full px-6 py-3.5 rounded-lg overflow-hidden group
                             bg-gradient-to-r from-[#d4af37] to-[#f2e29f]
                             hover:from-[#f2e29f] hover:to-[#d4af37]
                             disabled:opacity-50 disabled:cursor-not-allowed
                             transition-all duration-300"
                  whileHover={objectData.inStock ? { scale: 1.02, y: -1 } : {}}
                  whileTap={objectData.inStock ? { scale: 0.98 } : {}}
                >
                  <motion.div
                    className="absolute inset-0 bg-ancient-gold blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                    initial={false}
                  />
                  
                  <span className="relative z-10 flex items-center justify-center gap-2 
                                   font-cinzel text-sm tracking-[0.15em] uppercase text-obsidian-core font-semibold">
                    {isAddingToCart ? (
                      <>Adding...</>
                    ) : justAdded ? (
                      <>
                        <Check size={16} />
                        Added to Cart
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={16} />
                        Add to Cart
                      </>
                    )}
                  </span>
                </motion.button>

                {/* Buy Now Button */}
                <motion.button
                  onClick={handleBuyNow}
                  disabled={!objectData.inStock || isBuyingNow}
                  className="relative w-full px-6 py-3 rounded-lg overflow-hidden group
                             bg-card/40 backdrop-blur-sm border border-ancient-gold/30
                             hover:bg-ancient-gold/10 hover:border-ancient-gold/50
                             disabled:opacity-50 disabled:cursor-not-allowed
                             transition-all duration-300"
                  whileHover={objectData.inStock ? { scale: 1.01 } : {}}
                  whileTap={objectData.inStock ? { scale: 0.99 } : {}}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2 
                                   font-cinzel text-sm tracking-[0.15em] uppercase text-ancient-gold font-medium">
                    {isBuyingNow ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <Zap size={16} />
                        Buy Now
                      </>
                    )}
                  </span>
                </motion.button>

                {/* View Cart Link */}
                {justAdded && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => {
                      closeModal();
                      setTimeout(() => openModal('cart'), 300);
                    }}
                    className="w-full text-center text-xs text-ancient-gold/60 hover:text-ancient-gold transition-colors"
                  >
                    View Cart →
                  </motion.button>
                )}

                {/* Secure Checkout Badge */}
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/60 pt-2">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>Secure Checkout</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ObjectModal;
