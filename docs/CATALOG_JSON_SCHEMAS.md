# Apollo Catalog JSON Schema Templates

## Overview
This document provides JSON schema templates for all Apollo catalog entities, ready for database integration and AI builder compatibility.

---

## 1. Product Schema

```json
{
  "id": "uuid",
  "name": "string (required)",
  "slug": "string (auto-generated from name)",
  "description": "string (1-2 sentences, controlled rhythm)",
  "symbolic_meaning": "string (philosophical significance)",
  "brand_role": "string (role in Apollo ecosystem)",
  "price": "number (required)",
  "image_url": "string (URL)",
  "category": "string (enum: timepieces, accessories, leather-goods, apparel, home-ritual, print-media)",
  "subcategory": "string (depends on category)",
  "collection_id": "uuid (references collections table)",
  "in_stock": "boolean (default: true)",
  "consultation_required": "boolean (default: false)",
  "specs": {
    "type": "object",
    "properties": {
      "key": "value pairs specific to product type"
    }
  },
  "materials": ["array of material UUIDs"],
  "limited_edition_size": "number | null",
  "limited_edition_number": "number | null",
  "ai_prompt_id": "uuid (references ai_image_prompts)",
  "created_at": "timestamp",
  "updated_at": "timestamp",
  "created_by": "uuid (references auth.users)"
}
```

### Example: Timepiece Product

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Solis Automatic",
  "slug": "solis-automatic",
  "description": "Swiss movement. Italian leather. Built for daily command.",
  "symbolic_meaning": "The sun that never sets. Designed for men who master time rather than submit to it.",
  "brand_role": "Entry point to mechanical mastery. The first step toward reclaiming sovereignty.",
  "price": 12500,
  "image_url": "/assets/hero-watch.jpg",
  "category": "timepieces",
  "subcategory": "modern-line",
  "collection_id": "modern-line-collection-uuid",
  "in_stock": true,
  "consultation_required": false,
  "specs": {
    "Movement": "Swiss Automatic ETA 2892-A2",
    "Case": "42mm 316L Stainless Steel",
    "Strap": "Italian Calfskin Leather",
    "Water Resistance": "100m",
    "Crystal": "Sapphire with AR coating",
    "Power Reserve": "42 hours"
  },
  "materials": [
    "swiss-movement-uuid",
    "italian-leather-uuid"
  ],
  "limited_edition_size": null,
  "limited_edition_number": null,
  "ai_prompt_id": "timepiece-hero-uuid",
  "created_at": "2025-10-11T00:00:00Z",
  "updated_at": "2025-10-11T00:00:00Z",
  "created_by": "admin-user-uuid"
}
```

---

## 2. Category Schema

```json
{
  "id": "uuid",
  "name": "string (required)",
  "slug": "string (auto-generated)",
  "description": "string (category overview)",
  "tagline": "string (purpose-driven statement)",
  "latin_inscription": "string (Latin phrase)",
  "parent_id": "uuid | null (for subcategories)",
  "image_url": "string (hero image URL)",
  "display_order": "number (sort order)",
  "is_visible": "boolean (default: true)",
  "product_count": "number (computed)",
  "metadata": {
    "type": "object",
    "properties": {}
  },
  "brand_hierarchy": {
    "primary_inspiration": ["array of brand names"],
    "secondary_inspiration": ["array of brand names"],
    "design_philosophy": "string"
  },
  "visual_specifications": {
    "lighting": "string (lighting specs)",
    "camera": "string (camera specs)",
    "color_grading": "string (grading specs)",
    "composition": "string (composition rules)"
  },
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### Example: Timepieces Category

```json
{
  "id": "timepieces-uuid",
  "name": "Timepieces",
  "slug": "timepieces",
  "description": "Swiss movements, Italian leather, precision engineering. Each timepiece is a mechanical witness to the dominion of hours.",
  "tagline": "Designed for men who master hours, not chase them.",
  "latin_inscription": "Tempus Domini Solis",
  "parent_id": null,
  "image_url": "/assets/collection-watches.jpg",
  "display_order": 1,
  "is_visible": true,
  "product_count": 0,
  "metadata": {},
  "brand_hierarchy": {
    "primary_inspiration": [
      "Patek Philippe",
      "A. Lange & Söhne",
      "Vacheron Constantin"
    ],
    "secondary_inspiration": [
      "Grand Seiko",
      "Jaeger-LeCoultre",
      "IWC"
    ],
    "design_philosophy": "Timeless minimalism meets mechanical mastery"
  },
  "visual_specifications": {
    "lighting": "Warm chiaroscuro with 45-degree key light",
    "camera": "Leica 50mm f/1.4, f/4 for optimal sharpness",
    "color_grading": "Warm cinematic with lifted shadows and golden highlights",
    "composition": "Centered with negative space, shallow DOF"
  },
  "created_at": "2025-10-11T00:00:00Z",
  "updated_at": "2025-10-11T00:00:00Z"
}
```

---

## 3. Collection Schema

```json
{
  "id": "uuid",
  "name": "string (required)",
  "slug": "string (auto-generated)",
  "description": "string",
  "type": "enum (modern, classic, vault)",
  "tagline": "string",
  "display_order": "number",
  "is_visible": "boolean (default: true)",
  "metadata": {
    "type": "object",
    "properties": {}
  },
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### Example: Modern Line Collection

```json
{
  "id": "modern-line-uuid",
  "name": "Modern Line",
  "slug": "modern-line",
  "description": "Contemporary pieces for daily command. Clean lines, modern materials, timeless design.",
  "type": "modern",
  "tagline": "Built for the present. Designed for permanence.",
  "display_order": 1,
  "is_visible": true,
  "metadata": {
    "design_principles": [
      "Contemporary minimalism",
      "Functional excellence",
      "Timeless appeal"
    ],
    "target_customer": "Modern professionals who value quality and restraint"
  },
  "created_at": "2025-10-11T00:00:00Z",
  "updated_at": "2025-10-11T00:00:00Z"
}
```

---

## 4. Brand Color Schema

```json
{
  "id": "uuid",
  "name": "string (required)",
  "slug": "string (auto-generated)",
  "hex_value": "string (required, format: #RRGGBB)",
  "description": "string",
  "color_family": "string (e.g., Gold, Black, Neutral)",
  "usage_context": ["array of usage contexts"],
  "display_order": "number",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### Example: Apollo Gold

```json
{
  "id": "apollo-gold-uuid",
  "name": "Apollo Gold",
  "slug": "apollo-gold",
  "hex_value": "#D4AF37",
  "description": "Primary brand color. Warm, refined, symbolic of mastery and light.",
  "color_family": "Gold",
  "usage_context": [
    "primary",
    "accents",
    "typography",
    "icons"
  ],
  "display_order": 1,
  "created_at": "2025-10-11T00:00:00Z",
  "updated_at": "2025-10-11T00:00:00Z"
}
```

---

## 5. Brand Material Schema

```json
{
  "id": "uuid",
  "name": "string (required)",
  "slug": "string (auto-generated)",
  "description": "string",
  "properties": {
    "texture": "string",
    "durability": "string",
    "additional_properties": "varies by material"
  },
  "care_instructions": "string",
  "origin": "string (geographic origin)",
  "display_order": "number",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### Example: Italian Full-Grain Leather

```json
{
  "id": "italian-leather-uuid",
  "name": "Italian Full-Grain Leather",
  "slug": "italian-full-grain-leather",
  "description": "Vegetable-tanned leather from Italian tanneries. Ages beautifully over decades.",
  "properties": {
    "texture": "smooth",
    "durability": "exceptional",
    "patina": "develops rich character",
    "weight": "substantial"
  },
  "care_instructions": "Clean with dry cloth. Condition quarterly with natural leather cream. Avoid water exposure.",
  "origin": "Tuscany, Italy",
  "display_order": 1,
  "created_at": "2025-10-11T00:00:00Z",
  "updated_at": "2025-10-11T00:00:00Z"
}
```

---

## 6. Lifestyle Look Schema

```json
{
  "id": "uuid",
  "name": "string (required)",
  "slug": "string (auto-generated)",
  "description": "string",
  "hero_image_url": "string",
  "color_palette": ["array of hex color codes"],
  "styling_narrative": "string (philosophical framing)",
  "ideal_occasions": ["array of occasions"],
  "display_order": "number",
  "is_visible": "boolean (default: true)",
  "metadata": {
    "type": "object",
    "properties": {}
  },
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### Example: Business Look

```json
{
  "id": "business-look-uuid",
  "name": "Business",
  "slug": "business",
  "description": "Power dressing for men who shape markets.",
  "hero_image_url": "/assets/looks/business-hero.jpg",
  "color_palette": [
    "#0A0A0A",
    "#9C9C9C",
    "#E5E0D8",
    "#D4AF37"
  ],
  "styling_narrative": "The boardroom requires armor. Sharp tailoring, precise timepieces, leather that carries contracts and decisions. Every detail communicates competence and control. This is the uniform of those who move billions.",
  "ideal_occasions": [
    "boardroom",
    "client meetings",
    "conferences",
    "power lunch"
  ],
  "display_order": 3,
  "is_visible": true,
  "metadata": {
    "hero_products": [
      "domini-watch-uuid",
      "strategist-briefcase-uuid",
      "aurea-shirt-uuid"
    ],
    "styling_tips": [
      "Charcoal or navy as base",
      "Minimal accessories with maximum impact",
      "Timepiece as status signal",
      "Italian leather for authority"
    ]
  },
  "created_at": "2025-10-11T00:00:00Z",
  "updated_at": "2025-10-11T00:00:00Z"
}
```

---

## 7. AI Image Prompt Schema

```json
{
  "id": "uuid",
  "name": "string (required)",
  "category": "string (product category)",
  "base_prompt": "string (master prompt template)",
  "style_parameters": {
    "aesthetic": "string",
    "mood": "string",
    "composition": "string",
    "background": "string"
  },
  "lighting_specs": "string (detailed lighting description)",
  "camera_specs": "string (camera and lens specs)",
  "material_rendering": "string (material-specific instructions)",
  "color_grading": "string (post-processing specs)",
  "example_urls": ["array of reference image URLs"],
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### Example: Timepiece Hero Prompt

```json
{
  "id": "timepiece-hero-uuid",
  "name": "Timepiece Hero",
  "category": "timepieces",
  "base_prompt": "Luxury mechanical wristwatch photographed in cinematic lighting",
  "style_parameters": {
    "aesthetic": "luxury minimalism",
    "mood": "authoritative",
    "composition": "centered with negative space",
    "background": "gradient dark to mid-tone"
  },
  "lighting_specs": "Chiaroscuro lighting with warm key light at 45 degrees. Rim light for separation. Subtle fill to maintain shadow detail. Color temperature: 3200K-4000K.",
  "camera_specs": "Leica 50mm f/1.4 at f/4 for optimal sharpness. Shallow depth of field to isolate subject. Eye-level perspective.",
  "material_rendering": "Show metal reflections with golden warmth. Emphasize mechanical details through selective focus. Leather strap should show texture and grain.",
  "color_grading": "Warm cinematic grade with lifted shadows. Golden highlights. Subtle vignette. Film-like grain texture.",
  "example_urls": [
    "https://example.com/ref1.jpg",
    "https://example.com/ref2.jpg"
  ],
  "created_at": "2025-10-11T00:00:00Z",
  "updated_at": "2025-10-11T00:00:00Z"
}
```

---

## 8. Product Variant Schema

```json
{
  "id": "uuid",
  "product_id": "uuid (references products)",
  "sku": "string (unique)",
  "variant_type": "string (e.g., size, color, material)",
  "variant_value": "string (e.g., 42mm, Black, Titanium)",
  "price_adjustment": "number (+ or - from base price)",
  "in_stock": "boolean",
  "stock_quantity": "number",
  "display_order": "number",
  "metadata": {
    "type": "object",
    "properties": {}
  },
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### Example: Watch Size Variant

```json
{
  "id": "variant-uuid",
  "product_id": "solis-automatic-uuid",
  "sku": "SOL-AUTO-42-SS",
  "variant_type": "size",
  "variant_value": "42mm",
  "price_adjustment": 0,
  "in_stock": true,
  "stock_quantity": 15,
  "display_order": 1,
  "metadata": {
    "case_diameter": "42mm",
    "lug_width": "22mm",
    "thickness": "11mm"
  },
  "created_at": "2025-10-11T00:00:00Z",
  "updated_at": "2025-10-11T00:00:00Z"
}
```

---

## 9. Product Lifestyle Look Junction Schema

```json
{
  "id": "uuid",
  "product_id": "uuid (references products)",
  "lifestyle_look_id": "uuid (references lifestyle_looks)",
  "is_hero_item": "boolean (featured product in this look)",
  "display_order": "number",
  "created_at": "timestamp"
}
```

### Example: Business Look Product Assignment

```json
{
  "id": "junction-uuid",
  "product_id": "strategist-briefcase-uuid",
  "lifestyle_look_id": "business-look-uuid",
  "is_hero_item": true,
  "display_order": 1,
  "created_at": "2025-10-11T00:00:00Z"
}
```

---

## Bulk Import Template

For importing multiple products at once:

```json
{
  "products": [
    {
      "name": "Product Name",
      "description": "Short description",
      "price": 0,
      "category": "category-slug",
      "subcategory": "subcategory-slug",
      "collection_id": "collection-uuid",
      "specs": {},
      "materials": [],
      "in_stock": true
    }
  ],
  "categories": [],
  "collections": [],
  "lifestyle_looks": []
}
```

---

## Validation Rules

### Product
- `name`: Required, 3-100 characters
- `slug`: Auto-generated, unique, lowercase-hyphenated
- `description`: 10-300 characters
- `price`: Required, positive number
- `category`: Must exist in categories table
- `collection_id`: Must exist in collections table if provided

### Category
- `name`: Required, unique
- `slug`: Auto-generated, unique
- `parent_id`: Must be valid category UUID if provided
- `display_order`: Non-negative integer

### Collection
- `name`: Required, unique
- `type`: Must be 'modern', 'classic', or 'vault'
- `slug`: Auto-generated, unique

---

This schema documentation ensures consistency across all catalog data and enables seamless integration with AI builders and external systems.
