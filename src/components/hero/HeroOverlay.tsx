import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface HeroOverlayProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}

const HeroOverlay = ({ title, subtitle, ctaText, ctaLink }: HeroOverlayProps) => {
  return (
    <div className="relative z-10 container mx-auto px-6 text-center flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif mb-6 animate-fade-in text-balance">
        {title}
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up text-balance">
        {subtitle}
      </p>
      <Link to={ctaLink}>
        <Button
          size="lg"
          className="h-12 px-8 text-base gap-2 transition-all duration-300 hover:gap-4"
        >
          {ctaText}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default HeroOverlay;
