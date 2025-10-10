import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface ServiceCardProps {
  service: Service;
  index: number;
}

const ServiceCard = ({ service, index }: ServiceCardProps) => {
  return (
    <motion.div
      className="group relative p-8 bg-card border border-border rounded-sm hover:border-primary/30 transition-all duration-500"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.8,
        delay: index * 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -4 }}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-primary/30 bg-primary/5 flex items-center justify-center group-hover:border-primary/60 transition-colors duration-300">
          <service.icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-serif mb-3">{service.title}</h3>
          <p className="text-muted-foreground text-balance leading-relaxed">
            {service.description}
          </p>
        </div>
      </div>

      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-primary/0 group-hover:border-primary/20 transition-colors duration-500 rounded-tr-sm" />
    </motion.div>
  );
};

export default ServiceCard;
