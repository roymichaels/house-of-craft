import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import watchesImage from "@/assets/collection-watches.jpg";
import tailoringImage from "@/assets/collection-tailoring.jpg";
import leatherImage from "@/assets/collection-leather.jpg";

interface CollectionGridProps {
  category: string;
}

const products = [
  {
    id: 1,
    name: "Perpetual Elegance",
    category: "modern",
    description: "Contemporary masterpiece with perpetual calendar",
    price: "Upon Request",
    image: watchesImage,
  },
  {
    id: 2,
    name: "Heritage Chronograph",
    category: "classic",
    description: "Authenticated 1960s chronograph with original papers",
    price: "Upon Request",
    image: tailoringImage,
  },
  {
    id: 3,
    name: "Golden Era Diver",
    category: "vintage",
    description: "Rare vintage diver's watch from the 1950s",
    price: "Upon Request",
    image: leatherImage,
  },
  {
    id: 4,
    name: "Modern Moon Phase",
    category: "modern",
    description: "Contemporary moon phase with innovative mechanics",
    price: "Upon Request",
    image: watchesImage,
  },
  {
    id: 5,
    name: "Dress Watch Classic",
    category: "classic",
    description: "Timeless dress watch with hand-wound movement",
    price: "Upon Request",
    image: tailoringImage,
  },
  {
    id: 6,
    name: "Vintage Racing Chrono",
    category: "vintage",
    description: "Motorsport heritage chronograph from racing's golden age",
    price: "Upon Request",
    image: leatherImage,
  },
];

const CollectionGrid = ({ category }: CollectionGridProps) => {
  const filteredProducts =
    category === "all"
      ? products
      : products.filter((product) => product.category === category);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredProducts.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: index * 0.1,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </div>
  );
};

export default CollectionGrid;
