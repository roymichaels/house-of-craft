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
    <motion.div
      className="pointer-events-none fixed z-[9999] w-64 h-64 rounded-full"
      style={{
        left: mousePosition.x - 128,
        top: mousePosition.y - 128,
        background: "radial-gradient(circle at center, rgba(196,166,97,0.15) 0%, transparent 70%)",
      }}
      animate={{
        opacity: isOverInteractive ? 1 : 0,
        scale: isOverInteractive ? 1 : 0.8,
      }}
      transition={{ duration: 0.2 }}
    />
  );
};

export default CursorGlow;
