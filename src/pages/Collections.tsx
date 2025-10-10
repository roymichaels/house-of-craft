import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import CollectionHero from "@/components/collections/CollectionHero";
import CollectionGrid from "@/components/collections/CollectionGrid";
import Footer from "@/components/Footer";

const Collections = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Collections" },
    { id: "modern", label: "Modern Icons" },
    { id: "classic", label: "Certified Classics" },
    { id: "vintage", label: "Vintage Soul" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Breadcrumbs */}
      <div className="container mx-auto px-6 pt-24">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Collections</span>
        </nav>
      </div>

      <CollectionHero />

      {/* Category Filter */}
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-wrap gap-4 justify-center mb-16">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-sm border transition-all duration-300 ${
                activeCategory === category.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        <CollectionGrid category={activeCategory} />
      </div>

      <Footer />
    </div>
  );
};

export default Collections;
