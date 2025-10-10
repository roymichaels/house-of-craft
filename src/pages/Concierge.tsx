import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import ServiceCard from "@/components/concierge/ServiceCard";
import ContactForm from "@/components/concierge/ContactForm";
import Footer from "@/components/Footer";
import { Search, Shield, Wrench, TrendingUp } from "lucide-react";

const services = [
  {
    icon: Search,
    title: "Watch Sourcing & Acquisition",
    description:
      "Leverage our global network to find that specific timepiece you've been searching for. From rare vintage pieces to modern grails.",
  },
  {
    icon: Shield,
    title: "Authentication & Appraisal",
    description:
      "Expert verification and valuation services. Our authentication process ensures authenticity and provides detailed provenance documentation.",
  },
  {
    icon: Wrench,
    title: "Service & Restoration",
    description:
      "Connect with master watchmakers for maintenance, restoration, and preservation of your timepieces to museum-quality standards.",
  },
  {
    icon: TrendingUp,
    title: "Portfolio Management",
    description:
      "Strategic guidance for collectors building or managing their watch portfolios with investment-grade insights and market intelligence.",
  },
];

const Concierge = () => {
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
          <span className="text-foreground">Concierge</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="relative py-24 md:py-32 overflow-hidden grain">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <p className="font-ancient text-primary text-sm tracking-wider mb-4">
              WHITE GLOVE SERVICE
            </p>
            <h1 className="text-5xl md:text-7xl font-serif mb-6">
              Personal Concierge
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
              Expert guidance for discerning collectors. From sourcing rare pieces to portfolio
              management, we're your trusted advisors in horology.
            </p>
          </motion.div>

          <motion.div
            className="h-px w-32 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-12"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
          />
        </div>
      </section>

      {/* Services */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-serif mb-4">Our Services</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive support for every aspect of your collecting journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <ServiceCard key={service.title} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-24 md:py-32 bg-muted/20">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-serif mb-4">Get in Touch</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Share your collecting goals, and we'll craft a personalized approach
            </p>
          </motion.div>

          <ContactForm />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Concierge;
