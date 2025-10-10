import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Crown } from "lucide-react";
import { useModalStore } from "@/stores/modalStore";
import { GoldenIcon } from "@/components/ui/GoldenIcon";

const Circle = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-38% 0px" });
  const { openModal } = useModalStore();

  return (
    <section ref={ref} className="w-full py-24 px-6 relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Crown Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full border-2 border-ancient-gold/30 bg-ancient-gold/5 mb-8"
          >
            <GoldenIcon icon={Crown} size="xl" glow="strong" />
          </motion.div>

          <h2 className="font-ancient text-6xl md:text-8xl text-ancient-gold mb-6 tracking-wider 
                         drop-shadow-[0_0_40px_rgba(212,175,55,0.4)]">
            The Chamber
          </h2>
          <p className="text-foreground/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed 
                        font-ancient-tulip italic [text-shadow:0_2px_8px_rgba(0,0,0,0.8)] mb-12">
            Private access for those who lead, create, and command through light
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <button
              onClick={() => openModal('sanctum')}
              className="inline-flex items-center gap-3 px-8 py-4 border-2 border-ancient-gold text-ancient-gold font-ancient tracking-widest hover:bg-ancient-gold hover:text-background transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_40px_rgba(212,175,55,0.4)]"
            >
              Join The Chamber
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Circle;
