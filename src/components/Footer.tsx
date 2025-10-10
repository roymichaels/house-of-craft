import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    House: [
      { name: "About", path: "/about" },
      { name: "Stories", path: "/stories" },
      { name: "Concierge", path: "/concierge" },
      { name: "The Club", path: "/club" },
    ],
    Collections: [
      { name: "Watches", path: "/collections/watches" },
      { name: "Tailoring", path: "/collections/tailoring" },
      { name: "Leather", path: "/collections/leather" },
      { name: "Pens & Eyewear", path: "/collections/accessories" },
    ],
    Support: [
      { name: "Authentication", path: "/authentication" },
      { name: "Shipping & Returns", path: "/returns" },
      { name: "Privacy Policy", path: "/privacy" },
      { name: "Terms of Service", path: "/terms" },
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
              by Roy Michaels
            </p>
            <p className="text-sm text-muted-foreground mb-6 text-balance">
              A luxury maison for discerning collectors of timepieces, tailoring, and timeless objects.
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
          <p className="text-sm text-muted-foreground">
            © {currentYear} The House. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Twitter
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
