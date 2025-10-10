import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import watchesImage from "@/assets/collection-watches.jpg";
import tailoringImage from "@/assets/collection-tailoring.jpg";
import leatherImage from "@/assets/collection-leather.jpg";

const collections = [
  {
    title: "Modern Icons",
    description: "Contemporary pieces that define our moment in time",
    image: watchesImage,
    path: "/collections?category=modern",
  },
  {
    title: "Certified Classics",
    description: "Heritage timepieces with authenticated provenance",
    image: tailoringImage,
    path: "/collections?category=classic",
  },
  {
    title: "Vintage Soul",
    description: "Rare finds from exceptional eras of craftsmanship",
    image: leatherImage,
    path: "/collections?category=vintage",
  },
];

const FeaturedCollections = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div className="py-24 md:py-32 container mx-auto px-6 w-full" ref={ref}>
      <motion.div 
        className="mb-16 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2 className="text-4xl md:text-5xl font-serif mb-4">Our Collections</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Each piece tells a story of precision, artistry, and timeless design
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {collections.map((collection, index) => (
          <Link
            key={collection.title}
            to={collection.path}
          >
            <motion.div
              className="group relative overflow-hidden rounded-sm aspect-[4/5] bg-card"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ 
              duration: 0.8, 
              delay: index * 0.15,
              ease: [0.16, 1, 0.3, 1]
            }}
          >
            {/* Image */}
            <div className="absolute inset-0 grain">
              <img
                src={collection.image}
                alt={collection.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-500" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-8">
              <h3 className="text-2xl md:text-3xl font-serif mb-2 transition-all">
                {collection.title}
              </h3>
              <p className="text-muted-foreground text-balance">{collection.description}</p>
            </div>

            {/* Hover Border Effect */}
            <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/20 transition-colors duration-500 pointer-events-none" />
          </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FeaturedCollections;
