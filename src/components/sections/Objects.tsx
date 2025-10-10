import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useModalStore } from "@/stores/modalStore";

const Objects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-38% 0px" });
  const { openModal } = useModalStore();

  const collections = [
    {
      category: "Timepieces",
      title: "Instruments of Time",
      description: "Every object here serves one purpose — to sharpen the mind that wields it.",
      story: "Forged for those who master presence. Each chronometer is a meditation on control.",
      image: "/placeholder.svg",
    },
    {
      category: "Writing Instruments",
      title: "Tools of Thought",
      description: "Every mark is a declaration. Every word, a weapon.",
      story: "Master craftsmen understand: the instrument shapes the idea. These are not pens — they are extensions of will.",
      image: "/placeholder.svg",
    },
    {
      category: "Accessories",
      title: "Objects of Power",
      description: "What you wear announces what you've conquered.",
      story: "Curated for clarity. Every piece selected for function, refined for presence.",
      image: "/placeholder.svg",
    },
  ];

  return (
    <section ref={ref} className="w-full py-32 px-6 bg-card relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <h2 className="font-ancient text-5xl md:text-7xl text-ancient-gold mb-6 tracking-wider">
            Selected Objects
          </h2>
          <p className="text-foreground/80 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-serif italic">
            Chosen for precision, presence, and permanence.
          </p>
        </motion.div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.category}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{
                duration: 0.6,
                delay: index * 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <button
                onClick={() => openModal('object', {
                  title: collection.title,
                  category: collection.category,
                  description: collection.description,
                  image: collection.image,
                  story: collection.story,
                })}
                className="group block relative overflow-hidden border border-border hover:border-ancient-gold/50 transition-all duration-500 w-full text-left"
              >
                {/* Image container */}
                <div className="aspect-[4/5] overflow-hidden bg-muted">
                  <img
                    src={collection.image}
                    alt={collection.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-500" />
                </div>

                {/* Text content */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="text-ancient-gold/70 text-sm font-ancient tracking-widest mb-2">
                    {collection.category}
                  </div>
                  <h3 className="font-ancient text-3xl text-foreground mb-3 tracking-wide group-hover:text-ancient-gold transition-colors duration-300">
                    {collection.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 font-serif">
                    {collection.description}
                  </p>
                  <div className="flex items-center text-ancient-gold text-sm font-medium group-hover:translate-x-2 transition-transform duration-300">
                    Acquire →
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Objects;
