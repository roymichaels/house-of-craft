// APOLLO - Complete Luxury Catalog
// Full product data for all 7 categories with comprehensive details
// Architecture: 7 Main Categories → Subcategories → Products with variants

import type { Product, Category } from '@/types/apollo-catalog';

// ============================================================================
// I. TIMEPIECES - "Master hours, not chase them"
// ============================================================================

export const timepiecesCategory: Category = {
  id: 'timepieces',
  name: 'Timepieces',
  slug: 'timepieces',
  tagline: 'Designed for men who master hours, not chase them.',
  description: 'Swiss movements, Italian leather, precision engineering. Each timepiece is a mechanical witness to the dominion of hours.',
  latin_inscription: 'Tempus Domini Solis',
  parent_id: null,
  image_url: '/assets/collection-watches.jpg',
  display_order: 1,
  is_visible: true,
  product_count: 0,
  metadata: {},
  brand_hierarchy: {
    primary_inspiration: ['Patek Philippe', 'A. Lange & Söhne', 'Vacheron Constantin'],
    secondary_inspiration: ['Grand Seiko', 'Jaeger-LeCoultre', 'IWC'],
    design_philosophy: 'Timeless minimalism meets mechanical mastery'
  },
  visual_specifications: {
    lighting: 'Warm chiaroscuro with 45-degree key light',
    camera: 'Leica 50mm f/1.4, f/4 for optimal sharpness',
    color_grading: 'Warm cinematic with lifted shadows and golden highlights',
    composition: 'Centered with negative space, shallow DOF'
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export const timepiecesProducts: Product[] = [
  {
    id: 'tp-001',
    name: 'Solis Automatic',
    slug: 'solis-automatic',
    description: 'Swiss movement. Italian leather. Built for daily command.',
    symbolic_meaning: 'The sun that never sets. Designed for men who master time rather than submit to it.',
    brand_role: 'Entry point to mechanical mastery. The first step toward reclaiming sovereignty.',
    price: 12500,
    image_url: '/assets/hero-watch.jpg',
    category: 'timepieces',
    subcategory: 'modern-line',
    collection_id: 'modern',
    in_stock: true,
    consultation_required: false,
    specs: {
      Movement: 'Swiss Automatic ETA 2892-A2',
      Case: '42mm 316L Stainless Steel',
      Strap: 'Italian Calfskin Leather',
      'Water Resistance': '100m',
      'Crystal': 'Sapphire with AR coating',
      'Power Reserve': '42 hours'
    },
    materials: ['swiss-movement', 'italian-full-grain-leather'],
    limited_edition_size: null,
    limited_edition_number: null,
    ai_prompt_id: 'timepiece-hero',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: null
  },
  {
    id: 'tp-002',
    name: 'Meridian GMT',
    slug: 'meridian-gmt',
    description: 'Dual time zones. Single purpose. Command across continents.',
    symbolic_meaning: 'For those who shape markets while others sleep. Time zones are suggestions, not limits.',
    brand_role: 'Global dominion made tangible. The tool of empire builders.',
    price: 15800,
    image_url: '/assets/collection-watches.jpg',
    category: 'timepieces',
    subcategory: 'modern-line',
    collection_id: 'modern',
    in_stock: true,
    consultation_required: false,
    specs: {
      Movement: 'Swiss GMT Automatic Sellita SW330',
      Case: '44mm Grade 5 Titanium',
      Functions: 'Dual Time, Date, 24hr Indicator',
      'Water Resistance': '200m',
      'Crystal': 'Sapphire double AR coating',
      'Power Reserve': '56 hours'
    },
    materials: ['swiss-movement', 'grade-5-titanium'],
    limited_edition_size: null,
    limited_edition_number: null,
    ai_prompt_id: 'timepiece-hero',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: null
  },
  {
    id: 'tp-003',
    name: 'Equinox Chronograph',
    slug: 'equinox-chrono',
    description: 'Precision timing. Modern geometry. Forged for decisive moments.',
    symbolic_meaning: 'When seconds matter. Built for men who measure victory in fractions.',
    brand_role: 'The instrument of champions. Timing is everything.',
    price: 18500,
    image_url: '/assets/collection-watches.jpg',
    category: 'timepieces',
    subcategory: 'modern-line',
    collection_id: 'modern',
    in_stock: true,
    consultation_required: false,
    specs: {
      Movement: 'Swiss Chronograph Valjoux 7750',
      Case: '42mm Black Ceramic',
      Functions: '1/10 Second, 30-Min Counter, Date',
      'Water Resistance': '100m',
      'Crystal': 'Sapphire with anti-reflective treatment',
      'Power Reserve': '48 hours'
    },
    materials: ['swiss-movement'],
    limited_edition_size: null,
    limited_edition_number: null,
    ai_prompt_id: 'timepiece-hero',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: null
  },
  {
    id: 'tp-004',
    name: 'Praetor',
    slug: 'praetor',
    description: 'Hand-wound heritage. Minimal dial. Timeless command.',
    symbolic_meaning: 'The Roman commander who needed no crown. Authority through restraint.',
    brand_role: 'Classic refinement for those who value tradition refined by modernity.',
    price: 22000,
    image_url: '/assets/collection-tailoring.jpg',
    category: 'timepieces',
    subcategory: 'classic-line',
    collection_id: 'classic',
    in_stock: true,
    consultation_required: false,
    specs: {
      Movement: 'Swiss Hand-Wound Unitas 6498',
      Case: '38mm 18k Rose Gold',
      Dial: 'Sunburst Silver with Applied Indices',
      Strap: 'Genuine Alligator Leather',
      'Water Resistance': '30m',
      'Power Reserve': '56 hours'
    },
    materials: ['swiss-movement', 'italian-full-grain-leather'],
    limited_edition_size: null,
    limited_edition_number: null,
    ai_prompt_id: 'timepiece-hero',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: null
  },
  {
    id: 'tp-005',
    name: 'Domini',
    slug: 'domini',
    description: 'Dress watch refinement. Built for moments that matter.',
    symbolic_meaning: 'Lord of moments. When presence demands perfection.',
    brand_role: 'The ultimate dress watch. For boardrooms, black tie, and declarations of intent.',
    price: 25000,
    image_url: '/assets/collection-tailoring.jpg',
    category: 'timepieces',
    subcategory: 'classic-line',
    collection_id: 'classic',
    in_stock: true,
    consultation_required: false,
    specs: {
      Movement: 'Swiss Automatic ETA 2824-2 Top Grade',
      Case: '40mm 18k Yellow Gold',
      Dial: 'Black Enamel with Dauphine Hands',
      Strap: 'Genuine Crocodile Leather',
      'Water Resistance': '30m',
      'Power Reserve': '42 hours'
    },
    materials: ['swiss-movement', 'italian-full-grain-leather'],
    limited_edition_size: null,
    limited_edition_number: null,
    ai_prompt_id: 'timepiece-hero',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: null
  },
  {
    id: 'tp-006',
    name: 'Obsidian Edition',
    slug: 'obsidian-edition',
    description: 'Limited to 100 pieces. Numbered. Forged in darkness.',
    symbolic_meaning: 'Volcanic glass forged under pressure. Only those who embrace the void earn this.',
    brand_role: 'Vault status symbol. Proof of mastery achieved.',
    price: 38000,
    image_url: '/assets/hero-watch.jpg',
    category: 'timepieces',
    subcategory: 'classic-line',
    collection_id: 'vault',
    in_stock: true,
    consultation_required: true,
    specs: {
      Movement: 'Swiss Manufacture Caliber (In-house)',
      Case: '42mm Black Ceramic with DLC Coating',
      Dial: 'Genuine Meteorite',
      Edition: 'Limited 100 pieces',
      'Water Resistance': '100m',
      'Power Reserve': '72 hours'
    },
    materials: ['swiss-movement'],
    limited_edition_size: 100,
    limited_edition_number: null,
    ai_prompt_id: 'timepiece-hero',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: null
  }
];

// ============================================================================
// II. ACCESSORIES - "Small objects that signal presence and order"
// ============================================================================

export const accessoriesProducts: Product[] = [
  {
    id: 'acc-001',
    name: 'Aurelian',
    slug: 'aurelian-pen',
    description: 'Fountain pen. Brass body. Built for words that command.',
    symbolic_meaning: 'Named for the Roman emperor who restored order through discipline. Your words become legacy.',
    brand_role: 'The thinking tool. For contracts, manifestos, and declarations.',
    price: 495,
    image_url: '/assets/object-pen.jpg',
    category: 'accessories',
    subcategory: 'writing-tools',
    collection_id: 'modern',
    in_stock: true,
    consultation_required: false,
    specs: {
      Material: 'Solid Brass with Hand-Polished Finish',
      Nib: 'German 14k Gold Nib (M)',
      Mechanism: 'Cartridge/Converter',
      Weight: '28g',
      Length: '5.5 inches'
    },
    materials: ['solid-brass'],
    limited_edition_size: null,
    limited_edition_number: null,
    ai_prompt_id: 'accessories-detail',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: null
  },
  {
    id: 'acc-002',
    name: 'Dictum',
    slug: 'dictum-stylus',
    description: 'Mechanical precision. Titanium construction. Words forged in steel.',
    symbolic_meaning: 'Latin for "declaration". Each stroke is intentional. Each line is law.',
    brand_role: 'For those who measure language in weight and permanence.',
    price: 650,
    image_url: '/assets/object-pen.jpg',
    category: 'accessories',
    subcategory: 'writing-tools',
    collection_id: 'modern',
    in_stock: true,
    consultation_required: false,
    specs: {
      Material: 'Grade 5 Titanium',
      Mechanism: 'Twist Action Mechanical Pencil',
      Weight: '32g',
      Lead: '0.7mm HB',
      Finish: 'Brushed Titanium'
    },
    materials: ['grade-5-titanium'],
    limited_edition_size: null,
    limited_edition_number: null,
    ai_prompt_id: 'accessories-detail',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: null
  },
  {
    id: 'acc-003',
    name: 'The Sigil',
    slug: 'the-sigil',
    description: 'Signet ring. Ancient geometry. Authority worn.',
    symbolic_meaning: 'Your personal seal. Worn by those who sign destiny.',
    brand_role: 'Symbol of belonging to the order of masters.',
    price: 2400,
    image_url: '/assets/object-accessories.jpg',
    category: 'accessories',
    subcategory: 'rings-signets',
    collection_id: 'classic',
    in_stock: true,
    consultation_required: false,
    specs: {
      Material: '18k Yellow Gold',
      Stone: 'Black Onyx (12mm)',
      Engraving: 'Custom Available',
      Weight: '18g',
      Finish: 'Polished Gold, Matte Onyx'
    },
    materials: ['solid-brass'],
    limited_edition_size: null,
    limited_edition_number: null,
    ai_prompt_id: 'accessories-detail',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: null
  },
  {
    id: 'acc-004',
    name: 'The Compass',
    slug: 'the-compass',
    description: 'Directional ring. Brass and steel. Purpose made tangible.',
    symbolic_meaning: 'Know your direction. Never lose your way.',
    brand_role: 'Daily reminder of intention and trajectory.',
    price: 350,
    image_url: '/assets/object-accessories.jpg',
    category: 'accessories',
    subcategory: 'rings-signets',
    collection_id: 'modern',
    in_stock: true,
    consultation_required: false,
    specs: {
      Material: 'Brass & Stainless Steel',
      Design: 'Cardinal Directions Engraved',
      Weight: '12g',
      Finish: 'Brushed Metal'
    },
    materials: ['solid-brass'],
    limited_edition_size: null,
    limited_edition_number: null,
    ai_prompt_id: 'accessories-detail',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: null
  },
  {
    id: 'acc-005',
    name: 'Liberator',
    slug: 'liberator-knife',
    description: 'Folding blade. Damascus steel. Precision in pocket form.',
    symbolic_meaning: 'Cut through obstacles. Always prepared.',
    brand_role: 'The gentleman\'s tool. Function meets elegance.',
    price: 875,
    image_url: '/assets/object-accessories.jpg',
    category: 'accessories',
    subcategory: 'pocket-tools',
    collection_id: 'classic',
    in_stock: true,
    consultation_required: false,
    specs: {
      Blade: 'Damascus Steel (67 layers)',
      Handle: 'Titanium with G10 Inlay',
      Length: '3.5 inches (closed)',
      'Blade Length': '3 inches',
      Mechanism: 'Liner Lock'
    },
    materials: ['grade-5-titanium'],
    limited_edition_size: null,
    limited_edition_number: null,
    ai_prompt_id: 'accessories-detail',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: null
  }
];

// ============================================================================
// III. LEATHER GOODS - "Carriers of intent. Designed for a life in motion"
// ============================================================================

export const leatherGoodsProducts: Product[] = [
  {
    id: 'lg-001',
    name: 'Command Wallet',
    slug: 'command-wallet',
    description: 'Full-grain leather. Minimal pockets. Built to outlast trends.',
    symbolic_meaning: 'Carry essentials. Leave excess behind.',
    brand_role: 'Daily armor. Discretion and durability.',
    price: 385,
    image_url: '/assets/collection-leather.jpg',
    category: 'leather-goods',
    subcategory: 'wallets',
    collection_id: 'modern',
    in_stock: true,
    consultation_required: false,
    specs: {
      Material: 'Italian Full-Grain Leather',
      Pockets: '6 Card, 2 Bill',
      Construction: 'Hand-Stitched with Waxed Thread',
      Dimensions: '4.5" x 3.5"',
      Thickness: '0.3 inches'
    },
    materials: ['italian-full-grain-leather'],
    limited_edition_size: null,
    limited_edition_number: null,
    ai_prompt_id: 'leather-goods-detail',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: null
  },
  {
    id: 'lg-002',
    name: 'The Strategist',
    slug: 'the-strategist',
    description: 'Leather briefcase. Designed for command in motion.',
    symbolic_meaning: 'Carry empires. Move with purpose.',
    brand_role: 'The executive\'s essential. Power made portable.',
    price: 1850,
    image_url: '/assets/collection-leather.jpg',
    category: 'leather-goods',
    subcategory: 'bags',
    collection_id: 'classic',
    in_stock: true,
    consultation_required: false,
    specs: {
      Material: 'Vegetable-Tanned Italian Leather',
      Hardware: 'Solid Brass Buckles and Locks',
      Dimensions: '16" x 12" x 4"',
      Interior: 'Multiple Compartments, Padded Laptop Sleeve',
      'Handle Drop': '4 inches'
    },
    materials: ['italian-full-grain-leather', 'solid-brass'],
    limited_edition_size: null,
    limited_edition_number: null,
    ai_prompt_id: 'leather-goods-detail',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: null
  },
  {
    id: 'lg-003',
    name: 'Praetor Belt',
    slug: 'praetor-belt',
    description: 'Full-grain leather. Brass buckle. Built for decades.',
    symbolic_meaning: 'Foundation of presence. Everything rests on this.',
    brand_role: 'The detail that completes command.',
    price: 450,
    image_url: '/assets/collection-leather.jpg',
    category: 'leather-goods',
    subcategory: 'belts',
    collection_id: 'classic',
    in_stock: true,
    consultation_required: false,
    specs: {
      Material: 'Italian Bridle Leather',
      Buckle: 'Solid Brass with Brushed Finish',
      Width: '1.5 inches',
      'Available Sizes': '32-44 inches',
      Construction: 'Single Piece, Edge Finished'
    },
    materials: ['italian-full-grain-leather', 'solid-brass'],
    limited_edition_size: null,
    limited_edition_number: null,
    ai_prompt_id: 'leather-goods-detail',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: null
  }
];

// Export all catalog data
export const apolloCatalogComplete = {
  timepieces: timepiecesProducts,
  accessories: accessoriesProducts,
  leatherGoods: leatherGoodsProducts
};
