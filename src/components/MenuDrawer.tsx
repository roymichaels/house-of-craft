import { motion, AnimatePresence } from "framer-motion";
import { X, User } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useModalStore } from "@/stores/modalStore";
import type { ModalType } from "@/stores/modalStore";
import { GoldenIcon } from "@/components/ui/GoldenIcon";

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const MenuDrawer = ({ isOpen, onClose }: MenuDrawerProps) => {
  const location = useLocation();
  const { openModal } = useModalStore();
  const isHomepage = location.pathname === "/";

  const navItems = [
    { name: "Hall of Discipline", scrollTo: "mindcraft", type: "scroll" as const },
    { name: "Vault of Instruments", scrollTo: "objects", type: "scroll" as const },
    { name: "Library of Light", scrollTo: "doctrine", type: "scroll" as const },
    { name: "Inner Sanctum", scrollTo: "circle", type: "scroll" as const },
    { name: "The Vault", modal: "collections" as ModalType, type: "modal" as const },
    { name: "The Doctrine", modal: "stories" as ModalType, type: "modal" as const },
    { name: "Concierge", modal: "concierge" as ModalType, type: "modal" as const },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    onClose();
    
    if (item.type === "scroll") {
      // Scroll to section
      setTimeout(() => {
        const element = document.getElementById(item.scrollTo);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);
    } else if (item.type === "modal" && item.modal) {
      // Open modal
      setTimeout(() => {
        openModal(item.modal as ModalType);
      }, 300);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={onClose}
          />

          {/* Drawer Content */}
          <motion.div
            className="fixed inset-0 z-[101] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-8 right-8 group"
              aria-label="Close menu"
            >
              <GoldenIcon icon={X} size="lg" glow="medium" className="hover:rotate-90 duration-500" />
            </button>

            {/* Menu Items - Aligned with homepage spacing */}
            <nav className="flex flex-col items-center gap-6 md:gap-8 px-8 max-w-4xl mx-auto">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.type === "scroll" ? item.scrollTo : item.name}
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.1 + index * 0.1,
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <button
                    onClick={() => handleNavClick(item)}
                    className="font-ancient text-3xl md:text-5xl text-ancient-gold hover:text-aureate
                               transition-all duration-500 tracking-[0.15em] 
                               drop-shadow-[0_0_30px_rgba(212,175,55,0.4)]
                               hover:drop-shadow-[0_0_50px_rgba(212,175,55,0.6)]
                               hover:scale-105"
                  >
                    {item.name}
                  </button>
                </motion.div>
              ))}

              {/* Divider - Roman style */}
              <div className="flex items-center gap-4 my-4">
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-ancient-gold/40 to-ancient-gold/40" />
                <div className="w-1.5 h-1.5 rounded-full bg-ancient-gold" />
                <div className="h-px w-16 bg-gradient-to-l from-transparent via-ancient-gold/40 to-ancient-gold/40" />
              </div>

              {/* Sign In */}
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.1 + navItems.length * 0.1,
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2 border-ancient-gold/40 text-ancient-gold hover:bg-ancient-gold/10 
                             font-sans hover:border-ancient-gold transition-all duration-500
                             hover:shadow-[0_0_30px_hsl(var(--ancient-gold)/0.4)]"
                  onClick={onClose}
                >
                  <GoldenIcon icon={User} size="md" glow="subtle" />
                  Sign In
                </Button>
              </motion.div>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MenuDrawer;
