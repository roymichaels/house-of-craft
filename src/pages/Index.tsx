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
      <HeroSection />
      <FeaturedCollections />
      <TrustSection />
      <Footer />
      <EmailCaptureModal />
    </div>
  );
};

export default Index;
