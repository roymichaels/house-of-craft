import { Link } from "react-router-dom";
import { ShoppingBag, Heart, User, LogIn, LogOut, Package, FileText, Shield } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import MenuDrawer from "./MenuDrawer";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useModalStore } from "@/stores/modalStore";
import { GoldenIcon } from "./ui/GoldenIcon";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const Navigation = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { getItemCount } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { openModal } = useModalStore();
  const { user, isAdmin, signOut } = useAuth();
  const cartCount = getItemCount();
  const wishlistCount = wishlistItems.length;

  return (
    <>
      {/* Menu Drawer */}
      <MenuDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      {/* Header */}
      <motion.header 
        className="fixed top-0 left-0 w-full z-[1000] px-4 md:px-8 py-3 md:py-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          
          {/* Brand Section */}
          <div className="flex items-center gap-3 relative z-[5]">
            
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
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* User Menu or Login Button */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.button
                    className="w-9 h-9 md:w-10 md:h-10 rounded-full
                               border border-ancient-gold/25 bg-transparent
                               flex items-center justify-center
                               hover:shadow-[0_0_8px_rgba(212,175,55,0.4)]
                               transition-all duration-300
                               focus:outline-none focus:ring-2 focus:ring-ancient-gold/50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="User menu"
                  >
                    <GoldenIcon icon={User} size={18} />
                  </motion.button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel className="text-sm truncate">
                    {user.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                      <User size={16} />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders" className="flex items-center gap-2 cursor-pointer">
                      <FileText size={16} />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/admin/products" className="flex items-center gap-2 cursor-pointer">
                          <Shield size={16} />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={signOut}
                    className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <motion.button
                  className="w-9 h-9 md:w-10 md:h-10 rounded-full
                             border border-ancient-gold/25 bg-transparent
                             flex items-center justify-center
                             hover:shadow-[0_0_8px_rgba(212,175,55,0.4)]
                             transition-all duration-300
                             focus:outline-none focus:ring-2 focus:ring-ancient-gold/50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Sign in"
                >
                  <GoldenIcon icon={LogIn} size={18} />
                </motion.button>
              </Link>
            )}
            {/* Wishlist Button */}
            <motion.button
              onClick={() => openModal('wishlist')}
              className="relative w-9 h-9 md:w-10 md:h-10 rounded-full
                         border border-ancient-gold/25 bg-transparent
                         flex items-center justify-center
                         hover:shadow-[0_0_8px_rgba(212,175,55,0.4)]
                         transition-all duration-300
                         focus:outline-none focus:ring-2 focus:ring-ancient-gold/50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Open wishlist"
            >
              <GoldenIcon icon={Heart} size={18} />
              {wishlistCount > 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full
                             bg-primary text-background text-[10px] font-bold
                             flex items-center justify-center
                             border-2 border-background"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                >
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </motion.span>
              )}
            </motion.button>

            {/* Cart Button */}
            <motion.button
              onClick={() => openModal('cart')}
              className="relative w-9 h-9 md:w-10 md:h-10 rounded-full
                         border border-ancient-gold/25 bg-transparent
                         flex items-center justify-center
                         hover:shadow-[0_0_8px_rgba(212,175,55,0.4)]
                         transition-all duration-300
                         focus:outline-none focus:ring-2 focus:ring-ancient-gold/50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Open cart"
            >
              <GoldenIcon icon={ShoppingBag} size={18} />
              {cartCount > 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full
                             bg-primary text-background text-[10px] font-bold
                             flex items-center justify-center
                             border-2 border-background"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                >
                  {cartCount > 99 ? '99+' : cartCount}
                </motion.span>
              )}
            </motion.button>

            {/* Menu Button */}
            <motion.button
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
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
        </div>
      </motion.header>
    </>
  );
};

export default Navigation;
