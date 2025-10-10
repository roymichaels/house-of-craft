import { motion } from "framer-motion";
import { Shield, Lock, Award, Truck, RotateCcw, CheckCircle2 } from "lucide-react";

interface TrustBadgesProps {
  variant?: 'compact' | 'full';
  className?: string;
}

const badges = [
  {
    icon: Shield,
    title: "Authenticity Guaranteed",
    description: "Every item verified by experts"
  },
  {
    icon: Lock,
    title: "Secure Checkout",
    description: "256-bit SSL encryption"
  },
  {
    icon: Award,
    title: "Premium Quality",
    description: "Curated by artisans"
  },
  {
    icon: Truck,
    title: "Insured Shipping",
    description: "Worldwide delivery"
  },
  {
    icon: RotateCcw,
    title: "30-Day Returns",
    description: "Hassle-free returns"
  },
  {
    icon: CheckCircle2,
    title: "Lifetime Support",
    description: "Expert assistance"
  }
];

const TrustBadges = ({ variant = 'full', className = '' }: TrustBadgesProps) => {
  const displayBadges = variant === 'compact' ? badges.slice(0, 3) : badges;

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 gap-4 ${className}`}>
      {displayBadges.map((badge, index) => {
        const Icon = badge.icon;
        return (
          <motion.div
            key={badge.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-3 p-3 rounded-lg bg-card/20 backdrop-blur-sm
                       border border-border/20 hover:border-primary/30 transition-all group"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 
                          flex items-center justify-center
                          group-hover:bg-primary/20 transition-all">
              <Icon className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-medium text-foreground mb-0.5">
                {badge.title}
              </h4>
              <p className="text-[10px] text-muted-foreground line-clamp-1">
                {badge.description}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default TrustBadges;
