import { useEffect } from "react";

interface StructuredDataProps {
  type?: "Organization" | "Product" | "WebSite";
  data?: Record<string, unknown>;
}

export const StructuredData = ({ type = "WebSite", data }: StructuredDataProps) => {
  const getStructuredData = () => {
    switch (type) {
      case "Organization":
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Apollo",
          description: "Where Light Becomes Order. Luxury e-commerce platform for timeless instruments of presence.",
          url: "https://apollo.luxury",
          logo: "https://apollo.luxury/logo.png",
          sameAs: [
            "https://instagram.com/apollo",
            "https://twitter.com/apollo",
          ],
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "Customer Service",
            email: "concierge@apollo.luxury",
          },
          ...data,
        };

      case "WebSite":
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Apollo",
          description: "Where Light Becomes Order",
          url: "https://apollo.luxury",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://apollo.luxury/search?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
          ...data,
        };

      case "Product":
        return {
          "@context": "https://schema.org",
          "@type": "Product",
          ...data,
        };

      default:
        return data;
    }
  };

  const structuredData = getStructuredData();

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(structuredData);
    script.id = `structured-data-${type}`;
    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById(`structured-data-${type}`);
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [structuredData, type]);

  return null;
};

export default StructuredData;
