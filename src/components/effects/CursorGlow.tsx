import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const CursorGlow = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isOverInteractive, setIsOverInteractive] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      // Check if cursor is over interactive element
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") !== null ||
        target.closest("button") !== null;
      
      setIsOverInteractive(isInteractive);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      {/* Golden ring cursor */}
      <motion.div
        className="pointer-events-none fixed z-[9999]"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          scale: isOverInteractive ? 1.4 : 1,
        }}
        transition={{ duration: 0.15 }}
      >
        <div className="relative w-6 h-6">
          {/* Golden ring */}
          <div 
            className="absolute inset-0 rounded-full border-2 border-ancient-gold"
            style={{
              boxShadow: isOverInteractive 
                ? '0 0 12px rgba(196,166,97,0.6)' 
                : '0 0 6px rgba(196,166,97,0.3)',
            }}
          />
          {/* Inner pulse effect on hover */}
          {isOverInteractive && (
            <motion.div
              className="absolute inset-0 rounded-full bg-ancient-gold"
              initial={{ opacity: 0.4, scale: 0.8 }}
              animate={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.6, repeat: Infinity }}
            />
          )}
        </div>
      </motion.div>

      {/* Subtle glow halo on interactive elements */}
      <motion.div
        className="pointer-events-none fixed z-[9998] w-32 h-32 rounded-full"
        style={{
          left: mousePosition.x - 64,
          top: mousePosition.y - 64,
          background: "radial-gradient(circle at center, rgba(196,166,97,0.08) 0%, transparent 70%)",
        }}
        animate={{
          opacity: isOverInteractive ? 1 : 0,
          scale: isOverInteractive ? 1 : 0.8,
        }}
        transition={{ duration: 0.2 }}
      />
    </>
  );
};

export default CursorGlow;
