import { motion, AnimatePresence } from "framer-motion";
import { X, User, Shield } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useModalStore } from "@/stores/modalStore";
import type { ModalType } from "@/stores/modalStore";
import { GoldenIcon } from "@/components/ui/GoldenIcon";
import { useAuth } from "@/contexts/AuthContext";

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const MenuDrawer = ({ isOpen, onClose }: MenuDrawerProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { openModal } = useModalStore();
  const { isAdmin } = useAuth();
  const isHomepage = location.pathname === "/";

  const navItems = [
    { name: "Collections", modal: "collections" as ModalType, type: "modal" as const },
    { name: "Philosophy", modal: "philosophy" as ModalType, type: "modal" as const },
    { name: "Our Mission", modal: "mission" as ModalType, type: "modal" as const },
    { name: "Concierge", modal: "concierge" as ModalType, type: "modal" as const },
  ];

  const adminItems = isAdmin ? [
    { name: "Admin Dashboard", path: "/admin/dashboard", type: "link" as const, icon: Shield },
  ] : [];

  const allItems = [...navItems, ...adminItems];

  const handleNavClick = (item: typeof allItems[0]) => {
    onClose();

    if (item.type === "modal" && 'modal' in item && item.modal) {
      setTimeout(() => {
        openModal(item.modal as ModalType);
      }, 300);
    } else if (item.type === "link" && 'path' in item && item.path) {
      setTimeout(() => {
        navigate(item.path);
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

            {/* Menu Items */}
            <nav className="flex flex-col items-center gap-4 md:gap-6 px-8 max-w-4xl mx-auto">
              {allItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.1 + index * 0.08,
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <button
                    onClick={() => handleNavClick(item)}
                    className={`font-ancient ${
                      index === 0
                        ? 'text-4xl md:text-5xl'
                        : 'text-2xl md:text-4xl'
                    } text-ancient-gold hover:text-aureate
                               transition-all duration-500 tracking-[0.15em]
                               drop-shadow-[0_0_30px_rgba(212,175,55,0.4)]
                               hover:drop-shadow-[0_0_50px_rgba(212,175,55,0.6)]
                               hover:scale-105 flex items-center gap-3`}
                  >
                    {item.name}
                    {'icon' in item && item.icon && (
                      <GoldenIcon icon={item.icon} size={index === 0 ? 28 : 20} glow="medium" />
                    )}
                  </button>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MenuDrawer;
