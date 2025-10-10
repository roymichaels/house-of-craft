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
                 transition-all duration-300 cursor-pointer flex flex-col"
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/60 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 
                      pointer-events-none" />
      
      {/* Golden glow */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent
                      opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10
                      pointer-events-none rounded-2xl" />

      {/* Image Container - Fixed aspect ratio */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-muted/30 to-muted/10">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Golden glow overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent
                        opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Content Area - Text below image */}
      <div className="relative p-4 space-y-2 flex-1 flex flex-col bg-card/80">
        {/* Product Name */}
        <h3 className="text-base md:text-lg font-ancient tracking-wide text-foreground 
                       group-hover:text-ancient-gold transition-colors duration-200 line-clamp-1">
          {product.name}
        </h3>
        
        {/* Short Description */}
        <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 leading-relaxed flex-1">
          {product.description}
        </p>

        {/* Price */}
        <div className="pt-2">
          <span className="text-sm md:text-base font-semibold text-foreground">
            {displayPrice}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
