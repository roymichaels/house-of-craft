import { useScroll, useTransform } from "framer-motion";

export const useTitleReveal = () => {
  const { scrollYProgress } = useScroll();

  // Title reveals when scrolling past 80vh (0.8 of viewport)
  const titleOpacity = useTransform(scrollYProgress, [0.6, 0.8], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0.6, 0.8], [30, 0]);
  const titleScale = useTransform(scrollYProgress, [0.6, 0.8], [0.95, 1]);

  return {
    titleOpacity,
    titleY,
    titleScale,
  };
};
