// APOLLO - Extended Catalog (Apparel, Home & Ritual, Print & Media, Shop by Look)
// Continuation of comprehensive product catalog

import type { Product } from '@/types/apollo-catalog';

// ============================================================================
// IV. APPAREL - "Tailored discipline. Simplicity that commands attention"
// ============================================================================

export const apparelProducts: Product[] = [
  {
    id: 'ap-001',
    name: 'The Commander',
    slug: 'commander-coat',
    description: 'Wool overcoat. Tailored shoulders. Built for presence.',
    symbolic_meaning: 'Armor for winter. Presence that enters rooms before you do.',
    brand_role: 'The power garment. When authority must be visual.',
    price: 2950,
    image_url: '/assets/collection-tailoring.jpg',
    category: 'apparel',
    subcategory: 'outerwear',
    collection_id: 'classic',
    in_stock: true,
    consultation_required: false,
    specs: {
      Material: '100% Merino Wool (Italian Fabric)',
      Origin: 'Made in Italy',
      Fit: 'Tailored (Slim through body)',
      Lining: 'Silk-Cupro Blend',
      'Available Sizes': 'S, M, L, XL, XXL',
      Care: 'Dry Clean Only'
    },
    materials: ['merino-wool'],
    limited_edition_size: null,
    limited_edition_number: null,
    ai_prompt_id: 'apparel-lifestyle',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: null
  },
  {
    id: 'ap-002',
    name: 'Aurea Shirt',
    slug: 'aurea-shirt',
    description: 'Italian cotton. Perfect collar. Designed for decisive moments.',
    symbolic_meaning: 'Golden ratio in fabric form. Geometry meets discipline.',
    brand_role: 'The foundation garment. Everything builds from this.',
    price: 295,
    image_url: '/assets/collection-tailoring.jpg',
    category: 'apparel',
    subcategory: 'shirts-tops',
    collection_id: 'modern',
    in_stock: true,
    consultation_required: false,
    specs: {
      Material: 'Italian Cotton (120s Thread Count)',
      Collar: 'Cutaway',
      Fit: 'Slim',
      'Available Sizes': 'S, M, L, XL, XXL',
      Colors: 'White, Ivory, Charcoal, Navy',
      Care: 'Machine Wash Cold, Hang Dry'
    },
    materials: ['italian-cotton'],
    limited_edition_size: null,
    limited_edition_number: null,
    ai_prompt_id: 'apparel-lifestyle',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: null
  },
  {
    id: 'ap-003',
    name: 'Domini Trousers',
    slug: 'domini-trousers',
    description: 'Tailored wool. Perfect drape. Built for boardrooms.',
    symbolic_meaning: 'Command from the ground up. Foundation of power dressing.',
    brand_role: 'The executive essential. Paired with victory.',
    price: 485,
    image_url: '/assets/collection-tailoring.jpg',
    category: 'apparel',
    subcategory: 'trousers',
    collection_id: 'modern',
    in_stock: true,
    consultation_required: false,
    specs: {
      Material: 'Italian Wool Blend (95% Wool, 5% Elastane)',
      Fit: 'Tailored Straight Leg',
      Features: 'Flat Front, Side Pockets, Welt Back Pockets',
      'Available Sizes': '30-42 Waist',
      Colors: 'Charcoal, Navy, Black, Stone',
      Care: 'Dry Clean Only'
    },
    materials: ['merino-wool'],
    limited_edition_size: null,
    limited_edition_number: null,
    ai_prompt_id: 'apparel-lifestyle',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: null
  },
  {
    id: 'ap-004',
    name: 'House Robe',
    slug: 'house-robe',
    description: 'Linen blend. Lightweight. Dignity at home.',
    symbolic_meaning: 'Mastery begins in private. Morning ritual made tangible.',
    brand_role: 'The private uniform. Authority without audience.',
    price: 385,
    image_url: '/assets/collection-tailoring.jpg',
    category: 'apparel',
    subcategory: 'loungewear',
    collection_id: 'modern',
    in_stock: true,
    consultation_required: false,
    specs: {
      Material: 'Italian Linen-Cotton Blend',
      Style: 'Shawl Collar, Self-Tie Belt',
      'Available Sizes': 'M, L, XL',
      Colors: 'Tobacco, Olive, Charcoal',
      Care: 'Machine Wash Cold, Tumble Dry Low'
    },
    materials: ['italian-cotton'],
    limited_edition_size: null,
    limited_edition_number: null,
    ai_prompt_id: 'apparel-lifestyle',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: null
  }
];

// ============================================================================
// V. HOME & RITUAL - "Space as an extension of discipline"
// ============================================================================

export const homeRitualProducts: Product[] = [
  {
    id: 'hr-001',
    name: 'Obsidian Candle',
    slug: 'obsidian-candle',
    description: 'Black wax. Cedarwood and leather. Scent as discipline.',
    symbolic_meaning: 'Transform space through ritual. Light as focal point.',
    brand_role: 'The atmosphere maker. Command through subtlety.',
    price: 125,
    image_url: '/assets/object-timepiece.jpg',
    category: 'home-ritual',
    subcategory: 'candles-incense',
    collection_id: 'modern',
    in_stock: true,
    consultation_required: false,
    specs: {
      Wax: 'Soy-Coconut Blend with Black Pigment',
      Scent: 'Cedarwood, Leather, Amber, Tobacco',
      'Burn Time': '60 hours',
      Weight: '8 oz',
      Vessel: 'Black Glass with Brass Lid'
    },
    materials: ['frosted-glass', 'solid-brass'],
    limited_edition_size: null,
    limited_edition_number: null,
    ai_prompt_id: 'home-ritual-ambiance',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: null
  },
  {
    id: 'hr-002',
    name: 'Chrono Vessel',
    slug: 'chrono-vessel',
    description: 'Brass hourglass. Visual reminder. Time belongs to the focused.',
    symbolic_meaning: 'Sand falls for no one. Measure what matters.',
    brand_role: 'The meditation tool. Presence made visible.',
    price: 385,
    image_url: '/assets/object-timepiece.jpg',
    category: 'home-ritual',
    subcategory: 'decor-tools',
    collection_id: 'classic',
    in_stock: true,
    consultation_required: false,
    specs: {
      Material: 'Solid Brass with Hand-Polished Finish',
      Duration: '30 minutes',
      Height: '8 inches',
      Base: 'Marble',
      Weight: '850g'
    },
    materials: ['solid-brass', 'natural-stone'],
    limited_edition_size: null,
    limited_edition_number: null,
    ai_prompt_id: 'home-ritual-ambiance',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: null
  },
  {
    id: 'hr-003',
    name: 'The Obelisk',
    slug: 'the-obelisk',
    description: 'Marble desk sculpture. Geometric presence. Form as function.',
    symbolic_meaning: 'Ancient monuments reduced to desk scale. Permanence on your terms.',
    brand_role: 'The power object. Visual anchor.',
    price: 650,
    image_url: '/assets/object-accessories.jpg',
    category: 'home-ritual',
    subcategory: 'desk-objects',
    collection_id: 'vault',
    in_stock: true,
    consultation_required: false,
    specs: {
      Material: 'Italian Carrara Marble',
      Dimensions: '3" x 3" x 12"',
      Weight: '5 lbs',
      Finish: 'Polished',
      Base: 'Brass Inlay'
    },
    materials: ['natural-stone', 'solid-brass'],
    limited_edition_size: null,
    limited_edition_number: null,
    ai_prompt_id: 'home-ritual-ambiance',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: null
  },
  {
    id: 'hr-004',
    name: 'Reading Light',
    slug: 'reading-light',
    description: 'Brass and frosted glass. Warm glow. Built for focused thought.',
    symbolic_meaning: 'Light for those who read to lead. Illuminate truth.',
    brand_role: 'The scholar\'s tool. Atmosphere and function.',
    price: 545,
    image_url: '/assets/object-timepiece.jpg',
    category: 'home-ritual',
    subcategory: 'decor-tools',
    collection_id: 'classic',
    in_stock: true,
    consultation_required: false,
    specs: {
      Materials: 'Solid Brass, Frosted Glass Shade',
      Bulb: 'E26 LED (Warm White 2700K)',
      Height: '18 inches',
      Base: '6 inch diameter',
      Switch: 'Brass Rotary Dimmer'
    },
    materials: ['solid-brass', 'frosted-glass'],
    limited_edition_size: null,
    limited_edition_number: null,
    ai_prompt_id: 'home-ritual-ambiance',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: null
  }
];

// ============================================================================
// VI. PRINT & MEDIA - "Reflections for the modern stoic"
// ============================================================================

export const printMediaProducts: Product[] = [
  {
    id: 'pm-001',
    name: 'The Command Ledger',
    slug: 'command-ledger',
    description: 'Leather-bound journal. Blank pages. Your legacy begins here.',
    symbolic_meaning: 'Write the world you want to inhabit. Words become worlds.',
    brand_role: 'The strategist\'s companion. Plans made permanent.',
    price: 165,
    image_url: '/assets/collection-leather.jpg',
    category: 'print-media',
    subcategory: 'books-journals',
    collection_id: 'modern',
    in_stock: true,
    consultation_required: false,
    specs: {
      Cover: 'Full-Grain Italian Leather',
      Pages: '240 Pages (120gsm Ivory Laid)',
      'Page Type': 'Blank or Ruled',
      Dimensions: '8" x 10"',
      Binding: 'Sewn Binding for Lay-Flat',
      Details: 'Brass Corner Guards, Ribbon Marker'
    },
    materials: ['italian-full-grain-leather', 'solid-brass'],
    limited_edition_size: null,
    limited_edition_number: null,
    ai_prompt_id: 'print-media-editorial',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: null
  },
  {
    id: 'pm-002',
    name: 'The Doctrine',
    slug: 'the-doctrine',
    description: 'Collected essays on mastery, discipline, and modern masculinity.',
    symbolic_meaning: 'Philosophy forged in fire. The APOLLO worldview codified.',
    brand_role: 'The manifesto. Read to understand the way.',
    price: 85,
    image_url: '/assets/collection-leather.jpg',
    category: 'print-media',
    subcategory: 'books-journals',
    collection_id: 'classic',
    in_stock: true,
    consultation_required: false,
    specs: {
      Format: 'Hardcover with Dust Jacket',
      Pages: '312 Pages',
      Dimensions: '6" x 9"',
      'Jacket Material': 'Letterpress on Textured Stock',
      Binding: 'Smyth-Sewn',
      'Interior': 'Cream Paper, Black & Gold Foil Accents'
    },
    materials: [],
    limited_edition_size: null,
    limited_edition_number: null,
    ai_prompt_id: 'print-media-editorial',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: null
  },
  {
    id: 'pm-003',
    name: 'Meditations Print',
    slug: 'meditations-print',
    description: 'Limited edition art print. Stoic wisdom in golden type.',
    symbolic_meaning: 'Daily reminder. Mount on wall. Remember the way.',
    brand_role: 'Visual anchor. Philosophy made tangible.',
    price: 145,
    image_url: '/assets/collection-leather.jpg',
    category: 'print-media',
    subcategory: 'prints-art',
    collection_id: 'vault',
    in_stock: true,
    consultation_required: false,
    specs: {
      'Print Type': 'Giclée on Museum-Grade Paper',
      Dimensions: '16" x 20" (18" x 24" with Mat)',
      Edition: 'Limited to 250 prints',
      'Ink': 'Archival Pigment',
      Matting: 'Included - Acid-Free',
      Frame: 'Optional - Black Wood with Glass'
    },
    materials: [],
    limited_edition_size: 250,
    limited_edition_number: null,
    ai_prompt_id: 'print-media-editorial',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: null
  }
];

// ============================================================================
// VII. SHOP BY LOOK - Lifestyle Curations
// ============================================================================

// Products are tagged with lifestyle_look relationships in the junction table
// This allows products to appear in multiple looks
// Hero items are flagged with is_hero_item: true

// Lifestyle looks are seeded in the database
// Products can be assigned via the admin interface or API

// Export all extended catalog data
export const apolloCatalogExtended = {
  apparel: apparelProducts,
  homeRitual: homeRitualProducts,
  printMedia: printMediaProducts
};
