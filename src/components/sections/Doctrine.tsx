import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FileText, ArrowRight } from "lucide-react";
import { useModalStore } from "@/stores/modalStore";

const Doctrine = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-38% 0px" });
  const { openModal } = useModalStore();

  const writings = [
    {
      title: "On Mastery",
      excerpt: "Luxury begins in the mind. It's not what you own, but how you hold it.",
      category: "Philosophy",
    },
    {
      title: "On Time",
      excerpt: "A chronometer is not worn to count seconds, but to remind you that they are yours.",
      category: "Essays",
    },
    {
      title: "On Influence",
      excerpt: "The world bends to the man who moves with intent.",
      category: "Manifestos",
    },
  ];

  return (
    <section ref={ref} className="w-full py-32 px-6 bg-background relative overflow-hidden grain">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--ancient-gold))_1px,transparent_1px)] bg-[length:24px_24px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <h2 className="font-ancient text-5xl md:text-7xl text-ancient-gold mb-6 tracking-wider">
            The Doctrine
          </h2>
          <p className="text-foreground/80 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-serif italic">
            Writings, aphorisms, and manifestos on mastery, perception, and command.
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
                <FileText className="w-6 h-6 text-ancient-gold/70 mt-1 group-hover:text-ancient-gold transition-colors" />
                <div className="flex-1">
                  <div className="text-ancient-gold/60 text-xs font-ancient tracking-widest mb-2">
                    {writing.category}
                  </div>
                  <h3 className="font-ancient text-3xl text-foreground mb-4 tracking-wide group-hover:text-ancient-gold transition-colors duration-300">
                    {writing.title}
                  </h3>
                  <p className="text-muted-foreground text-lg leading-relaxed mb-4 font-serif italic">
                    "{writing.excerpt}"
                  </p>
                  <button
                    onClick={() => openModal('stories')}
                    className="inline-flex items-center text-ancient-gold text-sm font-medium group-hover:translate-x-2 transition-transform duration-300"
                  >
                    Read Full Essay
                    <ArrowRight className="ml-2 w-4 h-4" />
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
            Explore the Doctrine
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Doctrine;
