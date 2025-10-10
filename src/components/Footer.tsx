import { motion } from "framer-motion";
import { useModalStore } from "@/stores/modalStore";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { openModal } = useModalStore();

  const footerLinks = {
    Order: [
      { name: "Philosophy", path: "#mindcraft" },
      { name: "Doctrine", path: "#doctrine" },
      { name: "Inner Sanctum", path: "#circle" },
      { name: "Council", path: "#circle" },
    ],
    Instruments: [
      { name: "Chronometers", path: "#objects" },
      { name: "Vestments", path: "#objects" },
      { name: "Leather Goods", path: "#objects" },
      { name: "Implements", path: "#objects" },
    ],
    Support: [
      { name: "Provenance", path: "#mindcraft" },
      { name: "Dispatch", path: "#circle" },
      { name: "Privacy", path: "#" },
      { name: "Terms", path: "#" },
    ],
  };

  return (
    <>
      {/* Take the Oath CTA */}
      <section className="border-t border-border/50 bg-gradient-to-b from-background to-card">
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Latin inscription */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-order text-primary/60 text-xs tracking-[0.3em]"
            >
              TEMPUS DOMINI SOLIS
            </motion.p>
            
            {/* Main heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-ancient text-ancient-gold
                         drop-shadow-[0_0_30px_rgba(196,166,97,0.3)]"
            >
              Join The Order
            </motion.h2>
            
            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-base text-muted-foreground max-w-xl mx-auto"
            >
              The Inner Sanctum awaits those who command themselves.
              Brotherhood, mentorship, and exclusive instruments for men of discipline.
            </motion.p>
            
            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <button
                onClick={() => openModal('email-capture')}
                className="group relative px-10 py-4 
                           border-2 border-primary/40 
                           font-ancient text-primary tracking-wider
                           hover:border-primary hover:bg-primary/10
                           transition-all duration-500
                           hover:shadow-[0_0_40px_rgba(196,166,97,0.3)]"
              >
                <span className="relative z-10">TAKE THE OATH</span>
                
                {/* Subtle glow on hover */}
                <span className="absolute inset-0 bg-primary/5 opacity-0 
                                 group-hover:opacity-100 transition-opacity duration-500" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/50 bg-card">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-3xl font-ancient tracking-wider text-ancient-gold mb-2">APOLLON</h3>
            <p className="text-xs imperial-caps text-ancient-silver/50 mb-4">
              The Order of Light • Est. MMXXV
            </p>
            <p className="text-sm text-muted-foreground mb-6 text-balance">
              Where Light Becomes Order.
            </p>
            <p className="text-xs font-order text-ancient-gold/60">
              Lux Est Disciplina
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-medium mb-4 tracking-wide text-sm">{category}</h4>
              <ul className="space-y-3">
                {links.map((link, index) => (
                  <li key={`${category}-${link.name}-${index}`}>
                    <a
                      href={link.path}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} APOLLON. All rights reserved.
            </p>
            <span className="text-xs font-order text-ancient-gold/40">
              Tempus Domini Solis
            </span>
          </div>
          <div className="flex gap-6">
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
      </div>
    </footer>
    </>
  );
};

export default Footer;
