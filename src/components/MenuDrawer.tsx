import { motion, AnimatePresence } from "framer-motion";
import { X, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useModalStore } from "@/stores/modalStore";
import type { ModalType } from "@/stores/modalStore";

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const MenuDrawer = ({ isOpen, onClose }: MenuDrawerProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { openModal } = useModalStore();
  const isHomepage = location.pathname === "/";

  const navItems = [
    { name: "Instruments", scrollTo: "mindcraft", type: "scroll" as const },
    { name: "Objects", scrollTo: "objects", type: "scroll" as const },
    { name: "Doctrine", scrollTo: "doctrine", type: "scroll" as const },
    { name: "Inner Chamber", scrollTo: "circle", type: "scroll" as const },
    { name: "Archives", modal: "collections" as ModalType, type: "modal" as const },
    { name: "Stories", modal: "stories" as ModalType, type: "modal" as const },
    { name: "Concierge", modal: "concierge" as ModalType, type: "modal" as const },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    onClose();
    
    if (item.type === "scroll") {
      if (isHomepage) {
        // On homepage, scroll to section
        setTimeout(() => {
          const element = document.getElementById(item.scrollTo);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 300);
      } else {
        // Navigate home first, then scroll
        navigate("/");
        setTimeout(() => {
          const element = document.getElementById(item.scrollTo);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 500);
      }
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
              className="absolute top-8 right-8 text-ancient-gold/60 hover:text-ancient-gold transition-colors"
              aria-label="Close menu"
            >
              <X className="h-8 w-8" />
            </button>

            {/* Menu Items */}
            <nav className="flex flex-col items-center gap-8">
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
                    className="font-ancient text-4xl md:text-6xl text-ancient-gold hover:text-ancient-gold/70
                               transition-colors tracking-wider drop-shadow-[0_0_20px_rgba(196,166,97,0.3)]
                               hover:drop-shadow-[0_0_30px_rgba(196,166,97,0.5)]"
                  >
                    {item.name}
                  </button>
                </motion.div>
              ))}

              {/* Sign In */}
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.1 + navItems.length * 0.1,
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="mt-8"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2 border-ancient-gold/30 text-ancient-gold hover:bg-ancient-gold/10"
                  onClick={onClose}
                >
                  <User className="h-5 w-5" />
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
