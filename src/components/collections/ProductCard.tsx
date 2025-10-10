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
  images?: string[];
  videos?: string[];
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
      className="group cursor-pointer"
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden rounded-lg mb-3 bg-muted/20">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Product Details */}
      <div className="space-y-1">
        {/* Title */}
        <h3 className="text-sm font-romania text-foreground line-clamp-1 tracking-wide">
          {product.name}
        </h3>
        
        {/* Subtitle/Description */}
        <p className="text-xs font-sans text-muted-foreground line-clamp-1">
          {product.description}
        </p>

        {/* Price */}
        <p className="text-sm font-sans font-semibold text-foreground pt-1">
          {displayPrice}
        </p>
      </div>
    </motion.div>
  );
};

export default ProductCard;
