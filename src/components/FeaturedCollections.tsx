import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import watchesImage from "@/assets/collection-watches.jpg";
import tailoringImage from "@/assets/collection-tailoring.jpg";
import leatherImage from "@/assets/collection-leather.jpg";

const collections = [
  {
    title: "Modern Icons",
    description: "Contemporary pieces that define our moment in time",
    image: watchesImage,
    path: "/collections/watches",
  },
  {
    title: "Certified Classics",
    description: "Heritage timepieces with authenticated provenance",
    image: tailoringImage,
    path: "/collections/tailoring",
  },
  {
    title: "Vintage Soul",
    description: "Rare finds from exceptional eras of craftsmanship",
    image: leatherImage,
    path: "/collections/leather",
  },
];

const FeaturedCollections = () => {
  return (
    <section className="py-24 md:py-32 container mx-auto px-6">
      <div className="mb-16 text-center">
        <h2 className="text-4xl md:text-5xl font-serif mb-4">Our Collections</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Each piece tells a story of precision, artistry, and timeless design
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {collections.map((collection, index) => (
          <Link
            key={collection.title}
            to={collection.path}
            className="group relative overflow-hidden rounded-sm aspect-[4/5] bg-card"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Image */}
            <div className="absolute inset-0 grain">
              <img
                src={collection.image}
                alt={collection.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-500" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-8">
              <h3 className="text-2xl md:text-3xl font-serif mb-2 flex items-center gap-2 group-hover:gap-3 transition-all">
                {collection.title}
                <ArrowUpRight className="h-5 w-5 text-primary transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </h3>
              <p className="text-muted-foreground text-balance">{collection.description}</p>
            </div>

            {/* Hover Border Effect */}
            <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/20 transition-colors duration-500 pointer-events-none" />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default FeaturedCollections;
