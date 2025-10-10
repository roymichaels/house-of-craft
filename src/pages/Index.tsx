import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import Mindcraft from "@/components/sections/Mindcraft";
import Objects from "@/components/sections/Objects";
import Doctrine from "@/components/sections/Doctrine";
import Circle from "@/components/sections/Circle";
import Footer from "@/components/Footer";
import EmailCaptureModal from "@/components/EmailCaptureModal";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <section id="hero" className="min-h-screen">
        <HeroSection />
      </section>
      <section id="mindcraft" className="min-h-screen flex items-center">
        <Mindcraft />
      </section>
      <section id="objects" className="min-h-screen flex items-center">
        <Objects />
      </section>
      <section id="doctrine" className="min-h-screen flex items-center">
        <Doctrine />
      </section>
      <section id="circle" className="min-h-screen flex items-center">
        <Circle />
      </section>
      <section id="footer">
        <Footer />
      </section>
      <EmailCaptureModal />
    </div>
  );
};

export default Index;
