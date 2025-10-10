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
    name: "Perpetual Dominion",
    category: "modern",
    description: "Contemporary mastery forged with perpetual calendar — time bends to your command",
    price: "By Request",
    image: watchesImage,
  },
  {
    id: 2,
    name: "Heritage Chronograph",
    category: "classic",
    description: "Certified 1960s instrument with original provenance — legacy in steel",
    price: "By Request",
    image: tailoringImage,
  },
  {
    id: 3,
    name: "Golden Era Diver",
    category: "vintage",
    description: "Rare 1950s diver's relic — forged in the age of exploration",
    price: "By Request",
    image: leatherImage,
  },
  {
    id: 4,
    name: "Lunar Presence",
    category: "modern",
    description: "Moon phase innovation — the cosmos measured by your wrist",
    price: "By Request",
    image: watchesImage,
  },
  {
    id: 5,
    name: "Dress Watch Heritage",
    category: "classic",
    description: "Hand-wound refinement — elegance that transcends eras",
    price: "By Request",
    image: tailoringImage,
  },
  {
    id: 6,
    name: "Racing Chronograph",
    category: "vintage",
    description: "Motorsport heritage from racing's golden age — speed made sacred",
    price: "By Request",
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
