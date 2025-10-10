import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import MenuDrawer from "./MenuDrawer";

const Navigation = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      {/* Menu Drawer */}
      <MenuDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      {/* Header Container */}
      <motion.header 
        className="fixed top-0 left-0 w-full z-[60] backdrop-blur-md px-4 sm:px-6 md:px-8 lg:px-12 py-3 md:py-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          
          {/* Brand Section */}
          <motion.div 
            className="flex items-center gap-2 md:gap-3 group"
            whileHover={{ y: -1 }}
            transition={{ duration: 0.3 }}
          >
            {/* ΛΠ Symbol */}
            <Link 
              to="/"
              className="font-ancient text-xl md:text-2xl text-ancient-gold 
                         border border-ancient-gold/30 rounded-md px-2.5 py-1
                         bg-ancient-gold/5 shadow-[0_0_10px_rgba(212,175,55,0.15)]
                         hover:shadow-[0_0_15px_rgba(212,175,55,0.25)]
                         transition-all duration-300"
            >
              ΛΠ
            </Link>

            {/* Gradient Separator */}
            <div className="hidden sm:block w-12 md:w-16 h-8 rounded-sm bg-gradient-to-r from-ancient-gold/50 to-transparent" />

            {/* Brand Title */}
            <div className="hidden sm:flex flex-col">
              <h1 className="font-sub-header text-lg md:text-xl text-ancient-gold tracking-wider leading-none">
                APOLLON
              </h1>
              <p className="font-serif text-[0.65rem] md:text-xs text-ancient-gold/70 tracking-[0.15em] uppercase leading-none mt-0.5">
                The Order of Light
              </p>
            </div>
          </motion.div>

          {/* Menu Button */}
          <motion.button
            onClick={() => setIsDrawerOpen(true)}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full 
                       border border-ancient-gold/20 backdrop-blur-sm
                       flex items-center justify-center
                       hover:shadow-[0_0_8px_rgba(212,175,55,0.4)]
                       hover:scale-105 transition-all duration-300
                       focus:outline-none focus:ring-2 focus:ring-ancient-gold/50"
            whileTap={{ scale: 0.95 }}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5 text-ancient-gold" />
          </motion.button>
        </div>
      </motion.header>
    </>
  );
};

export default Navigation;
