import { motion } from "framer-motion";

const milestones = [
  {
    year: "2020",
    title: "The Beginning",
    description:
      "Founded with a vision to bridge collectors with exceptional timepieces that tell stories.",
  },
  {
    year: "2021",
    title: "First Acquisition",
    description:
      "Sourced our first rare vintage Patek Philippe, establishing our reputation for finding the unfindable.",
  },
  {
    year: "2022",
    title: "Authentication Excellence",
    description:
      "Developed proprietary authentication process, becoming trusted advisors to serious collectors.",
  },
  {
    year: "2023",
    title: "Global Expansion",
    description:
      "Extended our network to include master watchmakers and private collectors across continents.",
  },
  {
    year: "2024",
    title: "Modern Era",
    description:
      "Launched digital concierge service, making world-class timepiece expertise accessible anywhere.",
  },
];

const Timeline = () => {
  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-serif mb-4">Our Journey</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Five years of passion, expertise, and unwavering commitment to excellence
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.year}
              className="relative pl-12 md:pl-24 pb-16 last:pb-0"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.8,
                delay: index * 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {/* Timeline line */}
              {index !== milestones.length - 1 && (
                <div className="absolute left-6 md:left-12 top-8 bottom-0 w-px bg-border" />
              )}

              {/* Timeline dot */}
              <div className="absolute left-3 md:left-9 top-2 w-6 h-6 rounded-full border-2 border-primary bg-background flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>

              {/* Content */}
              <div className="bg-card border border-border rounded-sm p-6 hover:border-primary/30 transition-colors duration-300">
                <span className="font-ancient text-primary text-sm tracking-wider">
                  {milestone.year}
                </span>
                <h3 className="text-2xl font-serif mt-2 mb-3">
                  {milestone.title}
                </h3>
                <p className="text-muted-foreground text-balance">
                  {milestone.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Timeline;
