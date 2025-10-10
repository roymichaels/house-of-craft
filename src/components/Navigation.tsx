import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User } from "lucide-react";
import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  
  // Navigation appears after scrolling past 30% of viewport
  const navOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const navY = useTransform(scrollYProgress, [0, 0.3], [-20, 0]);

  const navItems = [
    { name: "Collections", path: "/collections" },
    { name: "Stories", path: "/stories" },
    { name: "The House", path: "/about" },
    { name: "Concierge", path: "/concierge" },
  ];

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 cinematic-blur border-b border-border/50"
      style={{ opacity: navOpacity, y: navY }}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Ancient monogram */}
          <Link to="/" className="text-2xl font-ancient tracking-wider text-ancient-gold transition-opacity hover:opacity-70">
            TH
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-sm tracking-wide text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.name}
              </Link>
            ))}
            <Link to="/auth">
              <Button variant="ghost" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                Sign In
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pt-4 pb-2 space-y-3 animate-fade-in">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className="block text-sm tracking-wide text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.name}
              </Link>
            ))}
            <Link to="/auth" onClick={() => setIsOpen(false)}>
              <Button variant="ghost" size="sm" className="gap-2 w-full justify-start">
                <User className="h-4 w-4" />
                Sign In
              </Button>
            </Link>
          </div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navigation;
