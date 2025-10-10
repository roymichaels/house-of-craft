import { motion } from "framer-motion";

const CollectionHero = () => {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden grain">
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-7xl font-serif mb-6">
            Curated Collections
          </h1>
          <p className="text-lg md:text-xl font-romania text-muted-foreground max-w-3xl mx-auto text-balance">
            Each timepiece is carefully selected for its heritage, craftsmanship, and story.
            Discover pieces that transcend time.
          </p>
        </motion.div>

        {/* Decorative element */}
        <motion.div
          className="h-px w-32 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-12"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
        />
      </div>
    </section>
  );
};

export default CollectionHero;
