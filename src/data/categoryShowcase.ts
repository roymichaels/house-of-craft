import timepieceImage from "@/assets/collection-watches.jpg";
import leatherImage from "@/assets/collection-leather.jpg";
import tailoringImage from "@/assets/collection-tailoring.jpg";
import accessoriesImage from "@/assets/object-accessories.jpg";

export interface CategoryShowcase {
  id: string;
  name: string;
  tagline: string;
  heroImage: string;
  productCount: number;
  icon: string;
}

export const categoryShowcase: CategoryShowcase[] = [
  {
    id: 'timepieces',
    name: 'Timepieces',
    tagline: 'Master hours, not chase them',
    heroImage: timepieceImage,
    productCount: 12,
    icon: 'Watch'
  },
  {
    id: 'accessories',
    name: 'Accessories',
    tagline: 'Symbols of presence and order',
    heroImage: accessoriesImage,
    productCount: 18,
    icon: 'Crown'
  },
  {
    id: 'leather-goods',
    name: 'Leather Goods',
    tagline: 'Carriers of intent',
    heroImage: leatherImage,
    productCount: 15,
    icon: 'Wallet'
  },
  {
    id: 'apparel',
    name: 'Apparel',
    tagline: 'Tailored discipline',
    heroImage: tailoringImage,
    productCount: 24,
    icon: 'Shirt'
  },
  {
    id: 'home-ritual',
    name: 'Home & Ritual',
    tagline: 'Space as discipline',
    heroImage: leatherImage,
    productCount: 16,
    icon: 'BookOpen'
  },
  {
    id: 'print-media',
    name: 'Print & Media',
    tagline: 'Reflections for the modern stoic',
    heroImage: accessoriesImage,
    productCount: 8,
    icon: 'PenTool'
  }
];
