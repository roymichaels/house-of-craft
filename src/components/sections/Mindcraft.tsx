import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Brain, Clock, Target, Sparkles } from "lucide-react";
import { GoldenIcon } from "@/components/ui/GoldenIcon";

const Mindcraft = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-38% 0px" });

  const instruments = [
    {
      icon: Clock,
      title: "Chronometers",
      description: "Time made tangible. Discipline measured in seconds.",
    },
    {
      icon: Brain,
      title: "Implements of Influence",
      description: "For those who shape reality through will.",
    },
    {
      icon: Target,
      title: "Artifacts of Attention",
      description: "Objects that sharpen perception.",
    },
    {
      icon: Sparkles,
      title: "Ritual Implements",
      description: "Symbols that anchor daily command.",
    },
  ];

  return (
    <section ref={ref} className="w-full py-16 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <h2 className="font-ancient text-5xl md:text-7xl text-ancient-gold mb-6 tracking-wider [text-shadow:0_2px_12px_rgba(0,0,0,0.9)]">
            The Instruments of Mastery
          </h2>
          <p className="text-foreground/80 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-serif italic [text-shadow:0_2px_8px_rgba(0,0,0,0.8)]">
            Where discipline meets design. Tools for men who live with intent.
          </p>
        </motion.div>

        {/* Instruments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {instruments.map((instrument, index) => (
            <motion.div
              key={instrument.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative"
            >
              <div className="relative p-8 border border-white/10 bg-black/25 backdrop-blur-md hover:border-ancient-gold/50 transition-all duration-500 hover:bg-black/35">
                <GoldenIcon icon={instrument.icon} size="xl" glow="medium" className="mb-6" />
                <h3 className="font-ancient text-2xl text-foreground mb-4 tracking-wide [text-shadow:0_2px_8px_rgba(0,0,0,0.8)]">
                  {instrument.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed font-serif [text-shadow:0_2px_6px_rgba(0,0,0,0.7)]">
                  {instrument.description}
                </p>
                
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-ancient-gold/0 via-ancient-gold/5 to-ancient-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Mindcraft;
