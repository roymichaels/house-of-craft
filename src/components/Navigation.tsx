import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import MenuDrawer from "./MenuDrawer";

const Navigation = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const location = useLocation();
  const isHomepage = location.pathname === "/";
  const { scrollYProgress } = useScroll();
  
  // Navigation appears after scrolling on homepage, always visible on other pages
  const navOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const shouldShowNav = !isHomepage;

  return (
    <>
      {/* Menu Drawer */}
      <MenuDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      {/* Floating Menu Button */}
      <motion.button
        onClick={() => setIsDrawerOpen(true)}
        className="fixed top-8 right-8 md:right-12 z-50 w-12 h-12 rounded-full 
                   border border-ancient-gold/30 backdrop-blur-sm
                   flex items-center justify-center
                   opacity-60 hover:opacity-100 hover:border-ancient-gold/60
                   transition-all duration-300
                   focus:outline-none focus:ring-2 focus:ring-ancient-gold/50"
        style={{ opacity: shouldShowNav ? 1 : navOpacity }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5 text-ancient-gold" />
      </motion.button>

      {/* Logo - appears after scroll on homepage, always visible on other pages */}
      <motion.div
        className="fixed top-8 left-12 md:left-16 z-40"
        style={{ opacity: shouldShowNav ? 1 : navOpacity }}
      >
        <Link 
          to="/" 
          className="text-xl font-ancient tracking-wider text-ancient-gold 
                     opacity-60 hover:opacity-100 transition-opacity"
        >
          TH
        </Link>
      </motion.div>
    </>
  );
};

export default Navigation;
