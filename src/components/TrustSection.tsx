import { Shield, Package, RotateCcw, BadgeCheck } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const features = [
  {
    icon: BadgeCheck,
    title: "Certified Authentic",
    description: "Every piece verified by independent horological experts",
  },
  {
    icon: Shield,
    title: "Fully Insured",
    description: "Complimentary insurance on all shipments worldwide",
  },
  {
    icon: Package,
    title: "Concierge Service",
    description: "Personal assistance for sourcing, servicing, and consultation",
  },
  {
    icon: RotateCcw,
    title: "14-Day Returns",
    description: "Complete peace of mind with our flexible return policy",
  },
];

const TrustSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div className="py-20 border-t border-border/50 w-full" ref={ref}>
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground text-balance">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustSection;
