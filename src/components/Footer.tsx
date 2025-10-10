import { motion } from "framer-motion";
import { useModalStore } from "@/stores/modalStore";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { openModal } = useModalStore();


  return (
    <>
      <footer className="border-t border-border/50 bg-card">
        <div className="container mx-auto px-6 py-16 md:py-20">
          {/* Main Footer Content */}
          <div className="text-center mb-12">
            <h3 className="text-4xl md:text-5xl font-ancient tracking-wider text-ancient-gold mb-4
                           drop-shadow-[0_0_30px_rgba(212,175,55,0.3)]">
              APOLLON
            </h3>
            <p className="text-xs font-order text-primary/60 tracking-[0.3em] mb-6">
              LUX EST DISCIPLINA
            </p>
            
            {/* Navigation Links */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-8 mb-8 text-sm">
              <a href="#doctrine" className="text-muted-foreground hover:text-primary transition-colors">
                Philosophy
              </a>
              <a href="#objects" className="text-muted-foreground hover:text-primary transition-colors">
                Collections
              </a>
              <button 
                onClick={() => openModal('sanctum')}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                The Chamber
              </button>
            </div>
            
            {/* Social Links */}
            <div className="flex justify-center gap-6 mb-8">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-ancient-gold transition-colors"
              >
                Instagram
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-ancient-gold transition-colors"
              >
                X
              </a>
            </div>
          </div>
          
          {/* Bottom Copyright */}
          <div className="pt-8 border-t border-border/30 text-center">
            <p className="text-xs text-muted-foreground/60">
              © MMXXV APOLLON
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
