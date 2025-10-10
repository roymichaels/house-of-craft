import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useModalStore } from "@/stores/modalStore";
import { categoryShowcase, type CategoryShowcase } from "@/data/categoryShowcase";
import { catalog } from "@/data/catalog";
import { cn } from "@/lib/utils";


// Calculate actual product counts from catalog
const getCategoryProductCount = (categoryId: string): number => {
  const category = catalog.find(c => c.slug === categoryId);
  if (!category) return 0;
  return category.subcategories.reduce((acc, sub) => acc + sub.products.length, 0);
};

// Category Card Component
interface CategoryCardProps {
  category: CategoryShowcase;
  delay?: number;
}

const CategoryCard = ({ category, delay = 0 }: CategoryCardProps) => {
  const { openModalWithCategory } = useModalStore();
  const productCount = getCategoryProductCount(category.id);

  return (
    <motion.button
      onClick={() => openModalWithCategory(category.id)}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl",
        "aspect-square",
        "bg-black/80 backdrop-blur-xl border border-ancient-gold/10",
        "hover:border-ancient-gold/40 hover:bg-black/90",
        "transition-all duration-500",
        "p-6 md:p-8",
        "opacity-85 hover:opacity-100",
        "shadow-[0_4px_40px_rgba(0,0,0,0.4)]",
        "hover:shadow-[0_8px_60px_rgba(196,166,97,0.1)]",
        "hover:-translate-y-1"
      )}
      style={{
        maskImage: 'radial-gradient(ellipse 100% 100% at 50% 50%, rgba(0,0,0,1) 80%, rgba(0,0,0,0.6) 100%)'
      }}
    >
      {/* Background Image */}
      <div className="absolute inset-0 opacity-70 group-hover:opacity-80 transition-opacity duration-700">
        <img
          src={category.heroImage}
          alt={category.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full justify-center items-center text-center">
        <div className="space-y-3 md:space-y-4">
          {/* Name */}
          <h3 className="font-ancient text-ancient-gold text-2xl md:text-3xl
                         leading-tight
                         drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]
                         group-hover:drop-shadow-[0_0_30px_rgba(196,166,97,0.8)]
                         transition-all duration-300">
            {category.name.charAt(0).toUpperCase() + category.name.slice(1).toLowerCase()}
          </h3>

          {/* Tagline */}
          <p className="text-sm md:text-base text-foreground/60 italic leading-snug">
            {category.tagline}
          </p>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent
                      opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </motion.button>
  );
};

const Objects = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Get all categories in the desired order
  const [timepieces, accessories, leatherGoods, apparel, homeRitual, printMedia] = categoryShowcase;

  return (
    <section ref={sectionRef} className="py-24 md:py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16 md:mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-ancient text-ancient-gold mb-6
                         drop-shadow-[0_0_30px_rgba(196,166,97,0.3)]">
            SELECTED OBJECTS
          </h2>
          <p className="text-base md:text-lg text-foreground/70 max-w-2xl mx-auto">
            Chosen for precision, presence, and permanence
          </p>
        </motion.div>

        {/* Category Showcase Grid - 2 Rows x 3 Columns - Centered */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {/* Row 1: Timepieces, Accessories, Leather Goods */}
          <CategoryCard category={timepieces} delay={0} />
          <CategoryCard category={accessories} delay={0.1} />
          <CategoryCard category={leatherGoods} delay={0.15} />

          {/* Row 2: Apparel, Home & Ritual, Print & Media */}
          <CategoryCard category={apparel} delay={0.2} />
          <CategoryCard category={homeRitual} delay={0.25} />
          <CategoryCard category={printMedia} delay={0.3} />
        </div>
      </div>
    </section>
  );
};

export default Objects;
