// Apollo Luxury Catalog Type Definitions
// Comprehensive types for the enhanced catalog system

// ============================================================================
// BRAND FOUNDATION TYPES
// ============================================================================

export interface BrandColor {
  id: string;
  name: string;
  slug: string;
  hex_value: string;
  description: string | null;
  color_family: string | null;
  usage_context: string[] | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface BrandMaterial {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  properties: Record<string, any>;
  care_instructions: string | null;
  origin: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export type CollectionType = 'modern' | 'classic' | 'vault';

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  type: CollectionType;
  tagline: string | null;
  display_order: number;
  is_visible: boolean;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// PRODUCT TYPES
// ============================================================================

export interface Product {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  subcategory: string | null;
  in_stock: boolean;
  specs: Record<string, any> | null;

  // Enhanced fields
  collection_id: string | null;
  symbolic_meaning: string | null;
  brand_role: string | null;
  ai_prompt_id: string | null;
  limited_edition_size: number | null;
  limited_edition_number: number | null;
  consultation_required: boolean;
  materials: string[] | null;

  // Timestamps
  created_at: string;
  updated_at: string;
  created_by: string | null;

  // Relations
  collection?: Collection;
  variants?: ProductVariant[];
  lifestyle_looks?: LifestyleLook[];
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string | null;
  variant_type: string;
  variant_value: string;
  price_adjustment: number;
  in_stock: boolean;
  stock_quantity: number;
  display_order: number;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// CATEGORY TYPES
// ============================================================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  image_url: string | null;
  tagline: string | null;
  display_order: number;
  is_visible: boolean;
  product_count: number;
  metadata: Record<string, any>;

  // Enhanced fields
  latin_inscription: string | null;
  brand_hierarchy: Record<string, any>;
  visual_specifications: Record<string, any>;

  // Timestamps
  created_at: string;
  updated_at: string;

  // Relations
  parent?: Category;
  subcategories?: Category[];
  products?: Product[];
}

// ============================================================================
// LIFESTYLE LOOK TYPES (Shop by Look)
// ============================================================================

export interface LifestyleLook {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  hero_image_url: string | null;
  color_palette: string[];
  styling_narrative: string | null;
  ideal_occasions: string[];
  display_order: number;
  is_visible: boolean;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;

  // Relations
  products?: Product[];
  hero_items?: Product[];
}

export interface ProductLifestyleLook {
  id: string;
  product_id: string;
  lifestyle_look_id: string;
  is_hero_item: boolean;
  display_order: number;
  created_at: string;
}

// ============================================================================
// AI IMAGE PROMPT TYPES
// ============================================================================

export interface AIImagePrompt {
  id: string;
  name: string;
  category: string;
  base_prompt: string;
  style_parameters: Record<string, any>;
  lighting_specs: string | null;
  camera_specs: string | null;
  material_rendering: string | null;
  color_grading: string | null;
  example_urls: string[] | null;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// CATALOG DATA STRUCTURES
// ============================================================================

export interface ApolloCatalogStructure {
  categories: Category[];
  collections: Collection[];
  colors: BrandColor[];
  materials: BrandMaterial[];
  lifestyle_looks: LifestyleLook[];
  ai_prompts: AIImagePrompt[];
}

// ============================================================================
// PRODUCT CATALOG ENUMS
// ============================================================================

export const APOLLO_CATEGORIES = [
  'timepieces',
  'accessories',
  'leather-goods',
  'apparel',
  'home-ritual',
  'print-media',
  'shop-by-look'
] as const;

export type ApolloCategorySlug = typeof APOLLO_CATEGORIES[number];

export const TIMEPIECE_SUBCATEGORIES = [
  'modern-line',
  'classic-line'
] as const;

export const ACCESSORIES_SUBCATEGORIES = [
  'writing-tools',
  'rings-signets',
  'pocket-tools'
] as const;

export const LEATHER_GOODS_SUBCATEGORIES = [
  'wallets',
  'bags',
  'belts'
] as const;

export const APPAREL_SUBCATEGORIES = [
  'outerwear',
  'shirts-tops',
  'trousers',
  'loungewear'
] as const;

export const HOME_RITUAL_SUBCATEGORIES = [
  'candles-incense',
  'decor-tools',
  'desk-objects'
] as const;

export const PRINT_MEDIA_SUBCATEGORIES = [
  'books-journals',
  'prints-art'
] as const;

export const LIFESTYLE_LOOK_TYPES = [
  'yacht',
  'golf',
  'business',
  'command',
  'house',
  'evening',
  'traveler'
] as const;

export type LifestyleLookType = typeof LIFESTYLE_LOOK_TYPES[number];

// ============================================================================
// APOLLO COLOR PALETTE
// ============================================================================

export const APOLLO_COLORS = {
  apolloGold: '#D4AF37',
  onyxBlack: '#0A0A0A',
  ivory: '#E5E0D8',
  tobacco: '#7A5A3A',
  olive: '#3E4430',
  steel: '#9C9C9C'
} as const;

// ============================================================================
// HELPER TYPES FOR FORMS AND APIs
// ============================================================================

export interface ProductFormData {
  name: string;
  slug?: string;
  description?: string;
  price: number;
  image_url?: string;
  category?: string;
  subcategory?: string;
  collection_id?: string;
  in_stock: boolean;
  specs?: Record<string, any>;
  symbolic_meaning?: string;
  brand_role?: string;
  ai_prompt_id?: string;
  limited_edition_size?: number;
  consultation_required: boolean;
  materials?: string[];
}

export interface CategoryFormData {
  name: string;
  slug?: string;
  description?: string;
  parent_id?: string;
  image_url?: string;
  tagline?: string;
  display_order: number;
  is_visible: boolean;
  latin_inscription?: string;
  brand_hierarchy?: Record<string, any>;
  visual_specifications?: Record<string, any>;
}

export interface LifestyleLookFormData {
  name: string;
  slug?: string;
  description?: string;
  hero_image_url?: string;
  color_palette: string[];
  styling_narrative?: string;
  ideal_occasions: string[];
  display_order: number;
  is_visible: boolean;
}

// ============================================================================
// CATALOG QUERY TYPES
// ============================================================================

export interface CatalogFilters {
  category?: string;
  subcategory?: string;
  collection?: CollectionType;
  lifestyle_look?: string;
  price_min?: number;
  price_max?: number;
  in_stock?: boolean;
  materials?: string[];
  tags?: string[];
}

export interface CatalogSortOptions {
  field: 'name' | 'price' | 'created_at' | 'display_order';
  direction: 'asc' | 'desc';
}

export interface PaginatedCatalogResponse<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
  has_more: boolean;
}
