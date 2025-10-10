import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import FeaturedCollections from "@/components/FeaturedCollections";
import TrustSection from "@/components/TrustSection";
import Footer from "@/components/Footer";
import EmailCaptureModal from "@/components/EmailCaptureModal";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <section id="hero" className="min-h-screen">
        <HeroSection />
      </section>
      <section id="collections" className="min-h-screen flex items-center">
        <FeaturedCollections />
      </section>
      <section id="trust" className="min-h-screen flex items-center">
        <TrustSection />
      </section>
      <section id="footer">
        <Footer />
      </section>
      <EmailCaptureModal />
    </div>
  );
};

export default Index;
