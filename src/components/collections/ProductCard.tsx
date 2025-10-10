import { motion } from "framer-motion";

interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  price: string;
  image: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <motion.div
      className="group relative overflow-hidden rounded-sm bg-card border border-border/50
                 hover:border-primary/30 transition-all duration-700
                 hover:shadow-[0_0_40px_rgba(196,166,97,0.15)]"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Dark vignette overlay on image */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/60 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 
                      pointer-events-none" />
      
      {/* Golden glow on hover */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent
                      opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10
                      pointer-events-none" />

      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      {/* Content */}
      <div className="relative p-6 space-y-3">
        <h3 className="text-xl font-ancient tracking-wide text-foreground 
                       group-hover:text-primary transition-colors duration-300">
          {product.name}
        </h3>
        
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>

        {/* Price & CTA Row */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm font-medium text-foreground/70">
            {product.price}
          </span>
          
          {/* Ritual CTA Button */}
          <motion.button
            className="px-4 py-2 text-xs font-medium tracking-wider
                       border border-primary/30 text-primary
                       hover:bg-primary/10 hover:border-primary
                       transition-all duration-300
                       opacity-0 group-hover:opacity-100"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ACQUIRE
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
