import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Lock, Users, Zap, Crown } from "lucide-react";
import { useModalStore } from "@/stores/modalStore";
import { GoldenIcon } from "@/components/ui/GoldenIcon";

const Circle = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-38% 0px" });
  const { openModal } = useModalStore();

  const benefits = [
    {
      icon: Crown,
      title: "Vault Access",
      description: "First access to rare instruments, limited editions, and bespoke offerings never available to the public.",
    },
    {
      icon: Users,
      title: "The Brotherhood",
      description: "Fellowship with men who value discipline, mastery, and the relentless pursuit of excellence.",
    },
    {
      icon: Lock,
      title: "Council of Masters",
      description: "Quarterly sessions with craftsmen, philosophers, and architects of thought—conversations that sharpen command.",
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
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-[2px] bg-ancient-gold" />
            <GoldenIcon icon={Lock} size="lg" glow="strong" />
            <div className="w-12 h-[2px] bg-ancient-gold" />
          </div>
          
          <h2 className="font-ancient text-6xl md:text-8xl text-ancient-gold mb-6 tracking-wider 
                         drop-shadow-[0_0_40px_rgba(212,175,55,0.4)]">
            The Inner Sanctum
          </h2>
          <p className="text-foreground/60 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed 
                        font-ancient-tulip italic [text-shadow:0_2px_8px_rgba(0,0,0,0.8)]">
            Entry is granted only to those who command themselves
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative p-8 border border-white/10 bg-black/25 backdrop-blur-md hover:border-ancient-gold/50 transition-all duration-500"
            >
              <GoldenIcon icon={benefit.icon} size="xl" glow="medium" className="mb-4" />
              <h3 className="font-ancient text-2xl text-foreground mb-3 tracking-wide [text-shadow:0_2px_8px_rgba(0,0,0,0.8)]">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed font-serif [text-shadow:0_2px_6px_rgba(0,0,0,0.7)]">
                {benefit.description}
              </p>
              
              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-ancient-gold/20 group-hover:border-ancient-gold/60 transition-colors duration-500" />
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center"
        >
          <div className="mb-8">
            <p className="text-foreground text-lg mb-2 font-serif [text-shadow:0_2px_8px_rgba(0,0,0,0.8)]">
              Initiation is by invitation or request.
            </p>
            <p className="text-muted-foreground text-sm font-serif [text-shadow:0_2px_6px_rgba(0,0,0,0.7)]">
              For serious inquiries regarding collaborations, commissions, or private access.
            </p>
          </div>
          
          <button
            onClick={() => openModal('concierge')}
            className="inline-flex items-center gap-3 px-12 py-5 bg-ancient-gold text-background font-ancient text-lg tracking-widest hover:bg-ancient-gold/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-ancient-gold/20"
          >
            Take the Oath
          </button>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-32 h-32 border border-ancient-gold/10 rotate-45" />
        <div className="absolute bottom-10 right-10 w-40 h-40 border border-ancient-gold/10 rotate-12" />
      </div>
    </section>
  );
};

export default Circle;
