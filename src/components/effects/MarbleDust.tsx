import { motion } from "framer-motion";

const MarbleDust = () => {
  // Generate random marble dust particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    left: Math.random() * 100,
    delay: Math.random() * 8,
    duration: Math.random() * 12 + 8,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-temple-marble/20"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.left}%`,
            bottom: -10,
          }}
          animate={{
            y: [-10, -window.innerHeight - 100],
            x: [0, Math.sin(particle.id) * 50],
            opacity: [0, 0.6, 0.6, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

export default MarbleDust;
