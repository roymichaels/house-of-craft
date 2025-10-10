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

      {/* Header */}
      <motion.header 
        className="fixed top-0 left-0 w-full z-[1000] px-4 md:px-8 py-3 md:py-4 bg-black/40 backdrop-blur-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          
          {/* Brand Section */}
          <div className="flex items-center gap-3 md:gap-4 relative z-[5]">
            
            {/* ΛΠ Symbol */}
            <Link 
              to="/"
              className="font-ancient text-lg md:text-xl text-ancient-gold 
                         border border-ancient-gold/30 rounded-md px-2.5 py-1.5
                         bg-ancient-gold/5 hover:bg-ancient-gold/10
                         transition-all duration-300 no-underline"
            >
              ΛΠ
            </Link>

            {/* Gradient Divider */}
            <div className="hidden sm:block w-12 md:w-14 h-6 rounded-sm bg-gradient-to-r from-ancient-gold/50 to-transparent shrink-0" />

            {/* Brand Title - Using exact HeroLogo styling */}
            <div className="hidden sm:flex flex-col gap-0.5">
              <h2 className="font-ancient text-lg md:text-xl tracking-[0.03em] text-ancient-gold drop-shadow-[0_0_20px_rgba(196,166,97,0.5)] m-0 leading-none">
                APOLLON
              </h2>
              <p className="imperial-caps text-[9px] tracking-widest text-ancient-silver/60 m-0 leading-none">
                The Order of Light
              </p>
            </div>
          </div>

          {/* Menu Button */}
          <motion.button
            onClick={() => setIsDrawerOpen(true)}
            className="w-9 h-9 md:w-10 md:h-10 rounded-full 
                       border border-ancient-gold/25 bg-transparent
                       flex flex-col items-center justify-center gap-[3px]
                       hover:shadow-[0_0_8px_rgba(212,175,55,0.4)]
                       transition-all duration-300
                       focus:outline-none focus:ring-2 focus:ring-ancient-gold/50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Open menu"
          >
            <span className="block w-[18px] h-[2px] bg-ancient-gold" />
            <span className="block w-[18px] h-[2px] bg-ancient-gold" />
            <span className="block w-[18px] h-[2px] bg-ancient-gold" />
          </motion.button>
        </div>
      </motion.header>
    </>
  );
};

export default Navigation;
