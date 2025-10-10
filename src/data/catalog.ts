// APOLLON - Modern Product Catalog
// Architecture: Category > Subcategory > Product

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string; // Short, controlled rhythm (1-2 sentences)
  price: string | number;
  images: string[];
  category: string;
  subcategory: string;
  collection?: 'modern' | 'classic' | 'vault';
  inStock: boolean;
  specs?: Record<string, string>;
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  products: Product[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  tagline: string; // Purpose-driven statement
  subcategories: Subcategory[];
}

// ============================================================================
// I. TIMEPIECES
// ============================================================================

export const timepieces: Category = {
  id: 'timepieces',
  name: 'Timepieces',
  slug: 'timepieces',
  tagline: 'Designed for men who master hours, not chase them.',
  subcategories: [
    {
      id: 'modern-line',
      name: 'Modern Line',
      slug: 'modern-line',
      description: 'Contemporary watches for daily command.',
      products: [
        {
          id: 'solis-automatic',
          name: 'Solis Automatic',
          slug: 'solis-automatic',
          description: 'Swiss movement. Italian leather. Built for daily command.',
          price: 12500,
          images: ['/src/assets/hero-watch.jpg'],
          category: 'timepieces',
          subcategory: 'modern-line',
          collection: 'modern',
          inStock: true,
          specs: {
            'Movement': 'Swiss Automatic',
            'Case': '42mm Stainless Steel',
            'Strap': 'Italian Leather',
            'Water Resistance': '100m'
          }
        },
        {
          id: 'meridian-gmt',
          name: 'Meridian GMT',
          slug: 'meridian-gmt',
          description: 'Dual time zones. Single purpose. Command across continents.',
          price: 15800,
          images: ['/src/assets/collection-watches.jpg'],
          category: 'timepieces',
          subcategory: 'modern-line',
          collection: 'modern',
          inStock: true,
          specs: {
            'Movement': 'Swiss GMT Automatic',
            'Case': '44mm Titanium',
            'Functions': 'Dual Time, Date',
            'Water Resistance': '200m'
          }
        },
        {
          id: 'equinox-chrono',
          name: 'Equinox Chronograph',
          slug: 'equinox-chrono',
          description: 'Precision timing. Modern geometry. Forged for decisive moments.',
          price: 18500,
          images: ['/src/assets/collection-watches.jpg'],
          category: 'timepieces',
          subcategory: 'modern-line',
          collection: 'modern',
          inStock: true,
          specs: {
            'Movement': 'Swiss Chronograph',
            'Case': '42mm Ceramic',
            'Functions': '1/10 Second, 30-Min Counter',
            'Water Resistance': '100m'
          }
        }
      ]
    },
    {
      id: 'classic-line',
      name: 'Classic Line',
      slug: 'classic-line',
      description: 'Heritage-inspired mechanicals with modern precision.',
      products: [
        {
          id: 'praetor',
          name: 'Praetor',
          slug: 'praetor',
          description: 'Hand-wound heritage. Minimal dial. Timeless command.',
          price: 22000,
          images: ['/src/assets/collection-tailoring.jpg'],
          category: 'timepieces',
          subcategory: 'classic-line',
          collection: 'classic',
          inStock: true,
          specs: {
            'Movement': 'Swiss Hand-Wound',
            'Case': '38mm Rose Gold',
            'Dial': 'Sunburst Silver',
            'Strap': 'Alligator Leather'
          }
        },
        {
          id: 'domini',
          name: 'Domini',
          slug: 'domini',
          description: 'Dress watch refinement. Built for moments that matter.',
          price: 25000,
          images: ['/src/assets/collection-tailoring.jpg'],
          category: 'timepieces',
          subcategory: 'classic-line',
          collection: 'classic',
          inStock: true,
          specs: {
            'Movement': 'Swiss Automatic',
            'Case': '40mm Yellow Gold',
            'Dial': 'Black Enamel',
            'Strap': 'Crocodile Leather'
          }
        },
        {
          id: 'obsidian-edition',
          name: 'Obsidian Edition',
          slug: 'obsidian-edition',
          description: 'Limited to 100 pieces. Numbered. Forged in darkness.',
          price: 38000,
          images: ['/src/assets/hero-watch.jpg'],
          category: 'timepieces',
          subcategory: 'classic-line',
          collection: 'vault',
          inStock: true,
          specs: {
            'Movement': 'Swiss Manufacture',
            'Case': '42mm Black Ceramic',
            'Edition': 'Limited 100 pieces',
            'Dial': 'Meteorite'
          }
        }
      ]
    }
  ]
};

// ============================================================================
// II. ACCESSORIES
// ============================================================================

export const accessories: Category = {
  id: 'accessories',
  name: 'Accessories',
  slug: 'accessories',
  tagline: 'Small objects that signal presence and order.',
  subcategories: [
    {
      id: 'writing-tools',
      name: 'Writing Tools',
      slug: 'writing-tools',
      description: 'Precision pens, brass styluses, mechanical pencils.',
      products: [
        {
          id: 'aurelian-pen',
          name: 'Aurelian',
          slug: 'aurelian-pen',
          description: 'Fountain pen. Brass body. Built for words that command.',
          price: 495,
          images: ['/src/assets/object-pen.jpg'],
          category: 'accessories',
          subcategory: 'writing-tools',
          inStock: true,
          specs: {
            'Material': 'Solid Brass',
            'Nib': 'German Gold Nib',
            'Finish': 'Hand-Polished'
          }
        },
        {
          id: 'dictum-stylus',
          name: 'Dictum',
          slug: 'dictum-stylus',
          description: 'Mechanical precision. Titanium construction. Words forged in steel.',
          price: 650,
          images: ['/src/assets/object-pen.jpg'],
          category: 'accessories',
          subcategory: 'writing-tools',
          inStock: true,
          specs: {
            'Material': 'Grade 5 Titanium',
            'Mechanism': 'Twist Action',
            'Weight': '32g'
          }
        }
      ]
    },
    {
      id: 'rings-signets',
      name: 'Rings & Signets',
      slug: 'rings-signets',
      description: 'Symbols of mastery and belonging.',
      products: [
        {
          id: 'the-sigil',
          name: 'The Sigil',
          slug: 'the-sigil',
          description: 'Signet ring. Ancient geometry. Authority worn.',
          price: 2400,
          images: ['/src/assets/object-accessories.jpg'],
          category: 'accessories',
          subcategory: 'rings-signets',
          inStock: true,
          specs: {
            'Material': '18k Yellow Gold',
            'Stone': 'Black Onyx',
            'Engraving': 'Custom Available'
          }
        },
        {
          id: 'the-compass',
          name: 'The Compass',
          slug: 'the-compass',
          description: 'Directional ring. Brass and steel. Purpose made tangible.',
          price: 350,
          images: ['/src/assets/object-accessories.jpg'],
          category: 'accessories',
          subcategory: 'rings-signets',
          inStock: true,
          specs: {
            'Material': 'Brass & Stainless Steel',
            'Design': 'Cardinal Directions',
            'Finish': 'Brushed'
          }
        }
      ]
    },
    {
      id: 'pocket-tools',
      name: 'Pocket Tools',
      slug: 'pocket-tools',
      description: 'Blades, lighters, minimal cards for daily ritual.',
      products: [
        {
          id: 'liberator-knife',
          name: 'Liberator',
          slug: 'liberator-knife',
          description: 'Folding blade. Damascus steel. Precision in pocket form.',
          price: 875,
          images: ['/src/assets/object-accessories.jpg'],
          category: 'accessories',
          subcategory: 'pocket-tools',
          inStock: true,
          specs: {
            'Blade': 'Damascus Steel',
            'Handle': 'Titanium',
            'Length': '3.5 inches (closed)'
          }
        }
      ]
    }
  ]
};

// ============================================================================
// III. LEATHER GOODS
// ============================================================================

export const leatherGoods: Category = {
  id: 'leather-goods',
  name: 'Leather Goods',
  slug: 'leather-goods',
  tagline: 'Carriers of intent. Designed for a life in motion.',
  subcategories: [
    {
      id: 'wallets',
      name: 'Wallets',
      slug: 'wallets',
      description: 'Slim, armored, built for discretion.',
      products: [
        {
          id: 'command-wallet',
          name: 'Command Wallet',
          slug: 'command-wallet',
          description: 'Full-grain leather. Minimal pockets. Built to outlast trends.',
          price: 385,
          images: ['/src/assets/collection-leather.jpg'],
          category: 'leather-goods',
          subcategory: 'wallets',
          inStock: true,
          specs: {
            'Material': 'Italian Full-Grain Leather',
            'Pockets': '6 Card, 2 Bill',
            'Construction': 'Hand-Stitched'
          }
        }
      ]
    },
    {
      id: 'bags',
      name: 'Bags',
      slug: 'bags',
      description: 'Briefs, messengers, compact travel pieces.',
      products: [
        {
          id: 'the-strategist',
          name: 'The Strategist',
          slug: 'the-strategist',
          description: 'Leather briefcase. Designed for command in motion.',
          price: 1850,
          images: ['/src/assets/collection-leather.jpg'],
          category: 'leather-goods',
          subcategory: 'bags',
          inStock: true,
          specs: {
            'Material': 'Vegetable-Tanned Leather',
            'Hardware': 'Solid Brass',
            'Dimensions': '16" x 12" x 4"'
          }
        }
      ]
    },
    {
      id: 'belts',
      name: 'Belts',
      slug: 'belts',
      description: 'Forged hardware. Italian leather.',
      products: [
        {
          id: 'praetor-belt',
          name: 'Praetor Belt',
          slug: 'praetor-belt',
          description: 'Full-grain leather. Brass buckle. Built for decades.',
          price: 450,
          images: ['/src/assets/collection-leather.jpg'],
          category: 'leather-goods',
          subcategory: 'belts',
          inStock: true,
          specs: {
            'Material': 'Italian Bridle Leather',
            'Buckle': 'Solid Brass',
            'Width': '1.5 inches'
          }
        }
      ]
    }
  ]
};

// ============================================================================
// IV. APPAREL
// ============================================================================

export const apparel: Category = {
  id: 'apparel',
  name: 'Apparel',
  slug: 'apparel',
  tagline: 'Tailored discipline. Simplicity that commands attention.',
  subcategories: [
    {
      id: 'outerwear',
      name: 'Outerwear',
      slug: 'outerwear',
      description: 'Coats, field jackets, minimalist bombers.',
      products: [
        {
          id: 'commander-coat',
          name: 'The Commander',
          slug: 'commander-coat',
          description: 'Wool overcoat. Tailored shoulders. Built for presence.',
          price: 2950,
          images: ['/src/assets/collection-tailoring.jpg'],
          category: 'apparel',
          subcategory: 'outerwear',
          inStock: true,
          specs: {
            'Material': '100% Merino Wool',
            'Origin': 'Italian Fabric',
            'Fit': 'Tailored'
          }
        }
      ]
    },
    {
      id: 'shirts-tops',
      name: 'Shirts & Tops',
      slug: 'shirts-tops',
      description: 'Clean lines, strong collar geometry, premium fabrics.',
      products: [
        {
          id: 'aurea-shirt',
          name: 'Aurea Shirt',
          slug: 'aurea-shirt',
          description: 'Italian cotton. Perfect collar. Designed for decisive moments.',
          price: 295,
          images: ['/src/assets/collection-tailoring.jpg'],
          category: 'apparel',
          subcategory: 'shirts-tops',
          inStock: true,
          specs: {
            'Material': 'Italian Cotton',
            'Collar': 'Cutaway',
            'Fit': 'Slim'
          }
        }
      ]
    }
  ]
};

// ============================================================================
// V. HOME & RITUAL
// ============================================================================

export const homeRitual: Category = {
  id: 'home-ritual',
  name: 'Home & Ritual',
  slug: 'home-ritual',
  tagline: 'For men who treat space as an extension of discipline.',
  subcategories: [
    {
      id: 'candles-incense',
      name: 'Candles & Incense',
      slug: 'candles-incense',
      description: 'Scent rituals for focus and calm.',
      products: [
        {
          id: 'obsidian-candle',
          name: 'Obsidian Candle',
          slug: 'obsidian-candle',
          description: 'Black wax. Cedarwood and leather. Scent as discipline.',
          price: 125,
          images: ['/src/assets/object-timepiece.jpg'],
          category: 'home-ritual',
          subcategory: 'candles-incense',
          inStock: true,
          specs: {
            'Wax': 'Soy Blend',
            'Scent': 'Cedarwood, Leather, Amber',
            'Burn Time': '60 hours'
          }
        }
      ]
    },
    {
      id: 'decor-tools',
      name: 'Decor & Tools',
      slug: 'decor-tools',
      description: 'Desk objects, hourglasses, brass geometry.',
      products: [
        {
          id: 'chrono-vessel',
          name: 'Chrono Vessel',
          slug: 'chrono-vessel',
          description: 'Brass hourglass. Visual reminder. Time belongs to the focused.',
          price: 385,
          images: ['/src/assets/object-timepiece.jpg'],
          category: 'home-ritual',
          subcategory: 'decor-tools',
          inStock: true,
          specs: {
            'Material': 'Solid Brass',
            'Duration': '30 minutes',
            'Height': '8 inches'
          }
        }
      ]
    }
  ]
};

// ============================================================================
// VI. PRINT & MEDIA
// ============================================================================

export const printMedia: Category = {
  id: 'print-media',
  name: 'Print & Media',
  slug: 'print-media',
  tagline: 'Writings and reflections for the modern stoic.',
  subcategories: [
    {
      id: 'books-journals',
      name: 'Books & Journals',
      slug: 'books-journals',
      description: 'Bound reflections on mastery.',
      products: [
        {
          id: 'command-ledger',
          name: 'The Command Ledger',
          slug: 'command-ledger',
          description: 'Leather-bound journal. Blank pages. Your legacy begins here.',
          price: 165,
          images: ['/src/assets/collection-leather.jpg'],
          category: 'print-media',
          subcategory: 'books-journals',
          inStock: true,
          specs: {
            'Cover': 'Full-Grain Leather',
            'Pages': '240 Pages',
            'Paper': 'Ivory Laid'
          }
        }
      ]
    }
  ]
};

// ============================================================================
// VII. LIMITED EDITIONS
// ============================================================================

export const limitedEditions: Category = {
  id: 'limited-editions',
  name: 'Limited Editions',
  slug: 'limited-editions',
  tagline: 'Objects crafted in small runs for collectors and initiates.',
  subcategories: [
    {
      id: 'vault-editions',
      name: 'Vault Editions',
      slug: 'vault-editions',
      description: 'Numbered pieces in brass, stone, or leather.',
      products: [
        {
          id: 'solis-vault',
          name: 'Solis Vault Edition',
          slug: 'solis-vault',
          description: 'Limited to 100. Swiss manufacture. Each numbered and sealed.',
          price: 58000,
          images: ['/src/assets/hero-watch.jpg'],
          category: 'limited-editions',
          subcategory: 'vault-editions',
          collection: 'vault',
          inStock: true,
          specs: {
            'Movement': 'Swiss In-House',
            'Case': '42mm Platinum',
            'Edition': 'Limited 100 pieces',
            'Certificate': 'Numbered & Certified'
          }
        }
      ]
    }
  ]
};

// ============================================================================
// CATALOG EXPORT
// ============================================================================

export const catalog: Category[] = [
  timepieces,
  accessories,
  leatherGoods,
  apparel,
  homeRitual,
  printMedia,
  limitedEditions
];

// Helper functions
export const getCategoryBySlug = (slug: string): Category | undefined => {
  return catalog.find(cat => cat.slug === slug);
};

export const getProductBySlug = (categorySlug: string, productSlug: string): Product | undefined => {
  const category = getCategoryBySlug(categorySlug);
  if (!category) return undefined;
  
  for (const subcategory of category.subcategories) {
    const product = subcategory.products.find(p => p.slug === productSlug);
    if (product) return product;
  }
  return undefined;
};

export const getAllProducts = (): Product[] => {
  return catalog.flatMap(category =>
    category.subcategories.flatMap(subcategory =>
      subcategory.products
    )
  );
};
