import { motion } from "framer-motion";
import { Clock, Award, Heart } from "lucide-react";

const values = [
  {
    icon: Clock,
    title: "Timeless Craftsmanship",
    description:
      "Every piece we curate represents decades, sometimes centuries, of horological expertise and artisanal dedication.",
  },
  {
    icon: Award,
    title: "Authenticated Excellence",
    description:
      "Our rigorous authentication process ensures every timepiece meets the highest standards of provenance and condition.",
  },
  {
    icon: Heart,
    title: "Passion for Heritage",
    description:
      "We believe each watch carries stories worth preserving—connecting past craftsmanship with future generations.",
  },
];

const Philosophy = () => {
  return (
    <section className="py-24 md:py-32 bg-muted/20">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-serif mb-4">Our Philosophy</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built on principles that honor the past while embracing the future
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              className="text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.8,
                delay: index * 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-primary/30 bg-primary/5 mb-6">
                <value.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-serif mb-4">{value.title}</h3>
              <p className="text-muted-foreground text-balance">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
