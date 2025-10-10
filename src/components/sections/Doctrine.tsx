import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FileText, ArrowRight } from "lucide-react";
import { useModalStore } from "@/stores/modalStore";
import { GoldenIcon } from "@/components/ui/GoldenIcon";

const Doctrine = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-38% 0px" });
  const { openModal } = useModalStore();

  const writings = [
    {
      title: "The Solar Imperative",
      excerpt: "In light, we find clarity. In clarity, we command. The sun does not question—it illuminates, reveals, and demands truth from all who stand beneath it.",
      category: "Manifesto",
    },
    {
      title: "Time as Discipline",
      excerpt: "Every hour is a covenant with yourself. The modern world begs for distraction—mastery answers with precision, presence, and unwavering intent.",
      category: "Essay",
    },
    {
      title: "Objects of Intent",
      excerpt: "Possessions are not mere artifacts. They are symbols of philosophy—each chosen instrument a testament to your command over the material realm.",
      category: "Doctrine",
    },
  ];

  return (
    <section ref={ref} className="w-full py-32 px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 0.6, y: 0 } : { opacity: 0 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="font-order text-primary/60 text-xs tracking-[0.3em] mb-4"
          >
            ORDO AB LUX
          </motion.p>
          <h2 className="font-ancient text-6xl md:text-8xl text-ancient-gold mb-6 tracking-wider 
                         drop-shadow-[0_0_40px_rgba(212,175,55,0.4)]">
            The Doctrine
          </h2>
          <p className="text-foreground/60 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed 
                        font-ancient-tulip italic [text-shadow:0_2px_8px_rgba(0,0,0,0.8)]">
            Wisdom for men who command themselves
          </p>
        </motion.div>

        {/* Writings List */}
        <div className="space-y-8">
          {writings.map((writing, index) => (
            <motion.article
              key={writing.title}
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative border-l-2 border-ancient-gold/30 pl-8 py-6 hover:border-ancient-gold transition-all duration-500"
            >
              <div className="flex items-start gap-4">
                <GoldenIcon icon={FileText} size="lg" glow="subtle" className="mt-1" />
                <div className="flex-1">
                  <div className="text-ancient-gold/60 text-xs font-ancient tracking-widest mb-2">
                    {writing.category}
                  </div>
                  <h3 className="font-ancient text-3xl text-foreground mb-4 tracking-wide group-hover:text-ancient-gold transition-colors duration-300 [text-shadow:0_2px_8px_rgba(0,0,0,0.8)]">
                    {writing.title}
                  </h3>
                  <p className="text-muted-foreground text-lg leading-relaxed mb-4 font-serif italic [text-shadow:0_2px_6px_rgba(0,0,0,0.7)]">
                    "{writing.excerpt}"
                  </p>
                  <button
                    onClick={() => openModal('stories')}
                    className="inline-flex items-center text-ancient-gold text-sm font-medium group-hover:translate-x-2 transition-transform duration-300"
                  >
                    Read Full Essay
                    <GoldenIcon icon={ArrowRight} size="sm" glow="subtle" className="ml-2" />
                  </button>
                </div>
              </div>

              {/* Hover glow */}
              <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-ancient-gold/0 via-ancient-gold to-ancient-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.article>
          ))}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <button
            onClick={() => openModal('stories')}
            className="inline-flex items-center gap-3 px-8 py-4 border-2 border-ancient-gold text-ancient-gold font-ancient tracking-widest hover:bg-ancient-gold hover:text-background transition-all duration-300"
          >
            Study the Doctrine
            <GoldenIcon icon={ArrowRight} size="md" glow="medium" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Doctrine;
