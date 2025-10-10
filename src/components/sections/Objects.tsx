import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useModalStore } from "@/stores/modalStore";
import { categoryShowcase, type CategoryShowcase } from "@/data/categoryShowcase";
import { catalog } from "@/data/catalog";
import { GoldenIcon } from "@/components/ui/GoldenIcon";
import { Watch, Crown, Wallet, Shirt, BookOpen, PenTool, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  'Watch': Watch,
  'Crown': Crown,
  'Wallet': Wallet,
  'Shirt': Shirt,
  'BookOpen': BookOpen,
  'PenTool': PenTool,
  'Sparkles': Sparkles,
};

// Calculate actual product counts from catalog
const getCategoryProductCount = (categoryId: string): number => {
  const category = catalog.find(c => c.slug === categoryId);
  if (!category) return 0;
  return category.subcategories.reduce((acc, sub) => acc + sub.products.length, 0);
};

// Category Card Component
interface CategoryCardProps {
  category: CategoryShowcase;
  featured?: boolean;
  delay?: number;
}

const CategoryCard = ({ category, featured = false, delay = 0 }: CategoryCardProps) => {
  const { openModalWithCategory } = useModalStore();
  const IconComponent = category.icon ? iconMap[category.icon] : Watch;
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
        "bg-card/20 backdrop-blur-sm border border-border/20",
        "hover:border-primary/40 hover:bg-card/40",
        "transition-all duration-500",
        featured ? "aspect-[16/6] p-8 md:p-10" : "aspect-[3/4] md:aspect-[4/5] p-6 md:p-8"
      )}
    >
      {/* Background Image */}
      <div className={cn(
        "absolute inset-0 transition-opacity duration-700",
        featured ? "opacity-30" : "opacity-20",
        "group-hover:opacity-40"
      )}>
        <img
          src={category.heroImage}
          alt={category.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="space-y-3 md:space-y-4">
          {/* Icon */}
          <GoldenIcon
            icon={IconComponent}
            size={featured ? "2xl" : "xl"}
            glow="medium"
            className="group-hover:drop-shadow-[0_0_25px_rgba(196,166,97,0.7)]"
          />

          {/* Name */}
          <h3 className={cn(
            "font-ancient text-ancient-gold",
            "drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]",
            "group-hover:drop-shadow-[0_0_25px_rgba(196,166,97,0.6)]",
            "transition-all duration-300",
            featured ? "text-3xl md:text-4xl lg:text-5xl" : "text-2xl md:text-3xl"
          )}>
            {category.name}
          </h3>

          {/* Tagline */}
          <p className={cn(
            "text-foreground/60 italic",
            featured ? "text-base md:text-lg" : "text-sm md:text-base"
          )}>
            {category.tagline}
          </p>
        </div>

        {/* Item Count Badge */}
        <div className="mt-4 self-start">
          <div className="px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full
                          backdrop-blur-sm group-hover:bg-primary/15 group-hover:border-primary/30
                          transition-all duration-300">
            <span className="text-xs font-medium text-ancient-gold tracking-wider">
              {productCount} ITEMS
            </span>
          </div>
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
  const [timepieces, accessories, leatherGoods, apparel, homeRitual, printMedia, limitedEdition] = categoryShowcase;

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

        {/* Category Showcase Grid */}
        <div className="space-y-6 md:space-y-8">
          {/* Row 1: Featured Timepieces (Full Width) */}
          <CategoryCard category={timepieces} featured={true} delay={0} />

          {/* Row 2: Three Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <CategoryCard category={accessories} delay={0.1} />
            <CategoryCard category={leatherGoods} delay={0.15} />
            <CategoryCard category={apparel} delay={0.2} />
          </div>

          {/* Row 3: Three Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <CategoryCard category={homeRitual} delay={0.25} />
            <CategoryCard category={printMedia} delay={0.3} />
            <CategoryCard category={limitedEdition} delay={0.35} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Objects;
