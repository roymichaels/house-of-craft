const Footer = () => {
  const currentYear = new Date().getFullYear();

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
                {links.map((link) => (
                  <li key={link.path}>
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
  );
};

export default Footer;
