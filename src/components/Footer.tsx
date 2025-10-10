import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    House: [
      { name: "Philosophy", path: "/about" },
      { name: "Doctrine", path: "/stories" },
      { name: "Inner Chamber", path: "/concierge" },
      { name: "Council", path: "/club" },
    ],
    Archives: [
      { name: "Chronometers", path: "/collections/watches" },
      { name: "Vestments", path: "/collections/tailoring" },
      { name: "Leather Goods", path: "/collections/leather" },
      { name: "Implements", path: "/collections/accessories" },
    ],
    Support: [
      { name: "Provenance", path: "/authentication" },
      { name: "Dispatch", path: "/returns" },
      { name: "Privacy", path: "/privacy" },
      { name: "Terms", path: "/terms" },
    ],
  };

  return (
    <footer className="border-t border-border/50 bg-card">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-3xl font-ancient tracking-wider text-ancient-gold mb-2">THE HOUSE</h3>
            <p className="text-xs font-sans tracking-widest text-ancient-silver/50 uppercase mb-4">
              Est. MMXXV
            </p>
            <p className="text-sm text-muted-foreground mb-6 text-balance">
              A sanctuary for those who master time, mind, and matter.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-medium mb-4 tracking-wide text-sm">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
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
              © {currentYear} The House. All rights reserved.
            </p>
            <span className="text-xs font-cinzel text-ancient-gold/40 tracking-wider">
              EST. MMXXV
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
  );
};

export default Footer;
