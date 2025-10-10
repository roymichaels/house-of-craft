import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Brain, Clock, Target, Sparkles } from "lucide-react";

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
    <section ref={ref} className="w-full py-16 px-6 bg-background relative overflow-hidden grain">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card to-background opacity-50" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <h2 className="font-ancient text-5xl md:text-7xl text-ancient-gold mb-6 tracking-wider">
            The Instruments of Mastery
          </h2>
          <p className="text-foreground/80 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-serif italic">
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
              <div className="relative p-8 border border-border bg-card/50 backdrop-blur-sm hover:border-ancient-gold/50 transition-all duration-500 hover:bg-card/80">
                <instrument.icon className="w-12 h-12 text-ancient-gold mb-6 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-ancient text-2xl text-foreground mb-4 tracking-wide">
                  {instrument.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed font-serif">
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
