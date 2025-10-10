import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Lock, Users, Zap, Crown } from "lucide-react";
import { useModalStore } from "@/stores/modalStore";

const Circle = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-38% 0px" });
  const { openModal } = useModalStore();

  const benefits = [
    {
      icon: Lock,
      title: "Private Access",
      description: "First rights to relics and collaborations.",
    },
    {
      icon: Users,
      title: "Inner Circle",
      description: "Council of craftsmen, strategists, and creators.",
    },
    {
      icon: Zap,
      title: "Bespoke Services",
      description: "Commissions of objects and ideas.",
    },
    {
      icon: Crown,
      title: "Legacy Projects",
      description: "Partnerships that shape the future canon of APOLLON.",
    },
  ];

  return (
    <section ref={ref} className="w-full py-32 px-6 bg-card relative overflow-hidden">
      {/* Radial gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(196,166,97,0.1)_0%,transparent_70%)]" />
      
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
            <Lock className="w-8 h-8 text-ancient-gold" />
            <div className="w-12 h-[2px] bg-ancient-gold" />
          </div>
          
          <h2 className="font-ancient text-5xl md:text-7xl text-ancient-gold mb-6 tracking-wider">
            The Inner Sanctum
          </h2>
          <p className="text-foreground/80 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-serif italic">
            Private access to APOLLON — for those who lead, create, and command through light.
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
              className="group relative p-8 border border-border bg-background/50 backdrop-blur-sm hover:border-ancient-gold/50 transition-all duration-500"
            >
              <benefit.icon className="w-10 h-10 text-ancient-gold mb-4 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="font-ancient text-2xl text-foreground mb-3 tracking-wide">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed font-serif">
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
            <p className="text-foreground text-lg mb-2 font-serif">
              Initiation is by invitation or request.
            </p>
            <p className="text-muted-foreground text-sm font-serif">
              For serious inquiries regarding collaborations, commissions, or private access.
            </p>
          </div>
          
          <button
            onClick={() => openModal('concierge')}
            className="inline-flex items-center gap-3 px-12 py-5 bg-ancient-gold text-background font-ancient text-lg tracking-widest hover:bg-ancient-gold/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-ancient-gold/20"
          >
            Request Entry
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
