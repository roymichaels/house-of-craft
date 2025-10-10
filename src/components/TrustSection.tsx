import { Shield, Package, RotateCcw, BadgeCheck } from "lucide-react";

const features = [
  {
    icon: BadgeCheck,
    title: "Certified Authentic",
    description: "Every piece verified by independent horological experts",
  },
  {
    icon: Shield,
    title: "Fully Insured",
    description: "Complimentary insurance on all shipments worldwide",
  },
  {
    icon: Package,
    title: "Concierge Service",
    description: "Personal assistance for sourcing, servicing, and consultation",
  },
  {
    icon: RotateCcw,
    title: "14-Day Returns",
    description: "Complete peace of mind with our flexible return policy",
  },
];

const TrustSection = () => {
  return (
    <section className="py-20 border-t border-border/50">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="text-center animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground text-balance">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
