import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import MenuDrawer from "./MenuDrawer";

const Navigation = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      {/* Menu Drawer */}
      <MenuDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      {/* Floating Menu Button */}
      <motion.button
        onClick={() => setIsDrawerOpen(true)}
        className="fixed top-6 right-6 md:top-8 md:right-12 z-[60] w-12 h-12 rounded-full 
                   border border-ancient-gold/30 backdrop-blur-sm
                   flex items-center justify-center
                   opacity-60 hover:opacity-100 hover:border-ancient-gold/60
                   transition-all duration-300
                   focus:outline-none focus:ring-2 focus:ring-ancient-gold/50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5 text-ancient-gold" />
      </motion.button>

      {/* Logo */}
      <motion.div 
        className="fixed top-6 left-6 md:top-8 md:left-12 z-[60] 
                   backdrop-blur-sm border border-ancient-gold/20 
                   p-2 rounded-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <Link 
          to="/" 
          className="text-xl font-ancient tracking-wider text-ancient-gold 
                     opacity-60 hover:opacity-100 transition-opacity"
        >
          ΛΠ
        </Link>
      </motion.div>
    </>
  );
};

export default Navigation;
