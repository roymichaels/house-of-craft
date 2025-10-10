import { motion } from "framer-motion";
import { ShoppingBag, Heart, Package, Truck } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useModalStore } from "@/stores/modalStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  description: string;
  price: string | number;
  image: string;
  images?: string[];
  videos?: string[];
  specs?: Record<string, string>;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem, getItemQuantity } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { openModal } = useModalStore();
  const inCart = getItemQuantity(product.id) > 0;
  const inWishlist = isInWishlist(product.id);

  const displayPrice = typeof product.price === 'number' 
    ? `$${product.price.toLocaleString()}` 
    : product.price;

  const handleCardClick = () => {
    // Build media array from images and videos
    const mediaItems = [
      ...(product.images?.map(img => ({ type: 'image' as const, url: img })) || 
         [{ type: 'image' as const, url: product.image }]),
      ...(product.videos?.map(vid => ({ type: 'video' as const, url: vid })) || [])
    ];

    openModal('object', {
      title: product.name,
      category: product.category,
      description: product.description,
      image: product.image,
      media: mediaItems,
      story: `${product.name} - ${product.description}`,
      price: displayPrice,
      productId: product.id,
      subcategory: product.subcategory,
      inStock: true,
      specs: product.specs
    });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
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
    }, 1);

    toast.success(`${product.name} added to cart`);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const price = typeof product.price === 'string' 
      ? parseFloat(product.price.replace(/[^0-9.]/g, '')) || 0
      : product.price;

    toggleItem({
      productId: product.id,
      name: product.name,
      price: price,
      image: product.image,
      category: product.category,
      subcategory: product.subcategory || 'general'
    });

    toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist');
  };

  // Mock stock status (in a real app, this would come from product data)
  const stockStatus = Math.random() > 0.2 ? 'in-stock' : 'low-stock';
  const estimatedDelivery = '3-5 business days';

  return (
    <motion.div
      onClick={handleCardClick}
      className="group cursor-pointer relative"
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
    >
      {/* Hover glow effect */}
      <motion.div
        className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 
                   rounded-lg opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"
        initial={false}
      />
      
      <div className="relative">{/* Image Container */}
      <div className="relative aspect-square overflow-hidden rounded-lg mb-3 bg-muted/20"
           style={{ transformStyle: 'preserve-3d' }}>
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        
        {/* Wishlist Button */}
        <motion.button
          onClick={handleWishlistToggle}
          className="absolute top-2 right-2 w-8 h-8 rounded-full 
                     bg-background/80 backdrop-blur-sm border border-border/30
                     flex items-center justify-center
                     opacity-0 group-hover:opacity-100 transition-opacity"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Heart 
            size={16} 
            className={inWishlist ? "fill-primary text-primary" : "text-muted-foreground"} 
          />
        </motion.button>

        {/* Stock Badge */}
        {stockStatus === 'low-stock' && (
          <div className="absolute top-2 left-2 px-2 py-1 rounded-md 
                          bg-destructive/90 backdrop-blur-sm text-xs text-white font-medium">
            Low Stock
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="space-y-1.5">
        {/* Title */}
        <h3 className="text-sm font-romania text-foreground line-clamp-1 tracking-wide">
          {product.name}
        </h3>
        
        {/* Subtitle/Description */}
        <p className="text-xs font-sans text-muted-foreground line-clamp-1">
          {product.description}
        </p>

        {/* Price & Stock Info */}
        <div className="flex items-center justify-between pt-0.5">
          <p className="text-sm font-sans font-semibold text-foreground">
            {displayPrice}
          </p>
          
          {stockStatus === 'in-stock' && (
            <div className="flex items-center gap-1 text-[10px] text-green-600">
              <Package size={10} />
              <span>In Stock</span>
            </div>
          )}
        </div>

        {/* Delivery Info */}
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Truck size={10} />
          <span>{estimatedDelivery}</span>
        </div>
      </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
