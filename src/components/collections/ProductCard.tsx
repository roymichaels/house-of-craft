import { motion } from "framer-motion";
import { ShoppingBag, Check } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useModalStore } from "@/stores/modalStore";
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

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem, getItemQuantity } = useCartStore();
  const { openModal } = useModalStore();
  const inCart = getItemQuantity(product.id) > 0;

  const displayPrice = typeof product.price === 'number' 
    ? `$${product.price.toLocaleString()}` 
    : product.price;

  const handleCardClick = () => {
    openModal('object', {
      title: product.name,
      category: product.category,
      description: product.description,
      image: product.image,
      story: `${product.name} - ${product.description}`,
      price: displayPrice
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

  return (
    <motion.div
      onClick={handleCardClick}
      className="group relative overflow-hidden rounded-2xl bg-card/50 backdrop-blur-sm
                 border border-border/30 hover:border-primary/40
                 shadow-lg hover:shadow-2xl hover:shadow-primary/10
                 transition-all duration-300 cursor-pointer"
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/60 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 
                      pointer-events-none" />
      
      {/* Golden glow */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent
                      opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10
                      pointer-events-none rounded-2xl" />

      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-muted/30 to-muted/10">
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative p-5 space-y-3 z-20">
        {/* Category Badge */}
        <div className="inline-block px-2.5 py-1 bg-primary/10 border border-primary/20 rounded-full">
          <span className="text-xs font-medium text-ancient-gold tracking-wider">
            {product.category.toUpperCase()}
          </span>
        </div>

        <h3 className="text-lg font-ancient tracking-wide text-foreground 
                       group-hover:text-ancient-gold transition-colors duration-200">
          {product.name}
        </h3>
        
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Price & CTA Row */}
        <div className="flex items-center justify-between pt-3">
          {/* Floating price pill */}
          <motion.div
            className="px-3 py-1.5 bg-background/80 backdrop-blur-sm border border-border/50 rounded-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <span className="text-sm font-semibold text-foreground">
              {displayPrice}
            </span>
          </motion.div>
          
          {/* Add to Cart Button */}
          <motion.button
            onClick={handleAddToCart}
            className={`px-4 py-2 text-xs font-medium tracking-wider rounded-full
                       transition-all duration-200 flex items-center gap-1.5
                       opacity-0 group-hover:opacity-100
                       ${inCart 
                         ? 'bg-primary/20 border border-primary/50 text-ancient-gold' 
                         : 'bg-primary/10 border border-primary/30 text-ancient-gold hover:bg-primary/20 hover:border-primary/50'
                       }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
            }}
          >
            {inCart ? (
              <>
                <Check size={14} />
                IN CART
              </>
            ) : (
              <>
                <ShoppingBag size={14} />
                ADD
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
