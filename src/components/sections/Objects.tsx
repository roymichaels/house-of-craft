import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useModalStore } from "@/stores/modalStore";

// Featured categories for homepage
const featuredObjects = [
  {
    id: 'timepieces',
    name: 'TIMEPIECES',
    image: '/src/assets/collection-watches.jpg'
  },
  {
    id: 'accessories',
    name: 'ACCESSORIES',
    image: '/src/assets/object-accessories.jpg'
  },
  {
    id: 'leather-goods',
    name: 'LEATHER GOODS',
    image: '/src/assets/collection-leather.jpg'
  }
];

const Objects = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const { openModalWithCategory } = useModalStore();

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

        {/* Object Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {featuredObjects.map((object, index) => (
            <motion.button
              key={object.id}
              onClick={() => openModalWithCategory(object.id)}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
                ease: [0.25, 0.1, 0.25, 1]
              }}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl
                         border border-primary/20 hover:border-primary/40
                         transition-all duration-500"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Image */}
              <div className="absolute inset-0">
                <img
                  src={object.image}
                  alt={object.name}
                  className="w-full h-full object-cover
                             group-hover:scale-110 transition-transform duration-700"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t 
                                from-black/90 via-black/40 to-transparent" />
              </div>

              {/* Category Name */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <h3 className="text-2xl md:text-3xl font-ancient text-ancient-gold
                               drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]
                               group-hover:drop-shadow-[0_0_25px_rgba(196,166,97,0.6)]
                               transition-all duration-300">
                  {object.name}
                </h3>
              </div>

              {/* Hover Glow */}
              <div className="absolute inset-0 bg-gradient-radial 
                              from-primary/20 via-transparent to-transparent
                              opacity-0 group-hover:opacity-100 
                              transition-opacity duration-500 pointer-events-none" />
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Objects;
