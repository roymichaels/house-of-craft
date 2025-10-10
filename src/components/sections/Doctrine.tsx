import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { BookOpen } from "lucide-react";
import { useModalStore } from "@/stores/modalStore";
import { GoldenIcon } from "@/components/ui/GoldenIcon";

const Doctrine = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-38% 0px" });
  const { openModal } = useModalStore();

  return (
    <section id="doctrine" ref={ref} className="w-full py-20 px-6 relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 0.6, y: 0 } : { opacity: 0 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="font-ancient text-primary/60 text-xs tracking-[0.3em] mb-4"
          >
            LUX EST DISCIPLINA
          </motion.p>
          <h2 className="font-ancient text-6xl md:text-8xl text-ancient-gold mb-6 tracking-wider 
                         drop-shadow-[0_0_40px_rgba(212,175,55,0.4)]">
            Philosophy & Mission
          </h2>
          <p className="text-foreground/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed 
                        font-romania italic [text-shadow:0_2px_8px_rgba(0,0,0,0.8)] mb-12">
            The principles that guide creation, command, and conduct
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <button
              onClick={() => openModal('doctrine')}
              className="inline-flex items-center gap-3 px-8 py-4 border-2 border-ancient-gold text-ancient-gold font-ancient tracking-widest hover:bg-ancient-gold hover:text-background transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_40px_rgba(212,175,55,0.4)]"
            >
              <GoldenIcon icon={BookOpen} size="md" glow="medium" />
              Explore the Philosophy
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Doctrine;
