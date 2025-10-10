import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import Timeline from "@/components/stories/Timeline";
import Philosophy from "@/components/stories/Philosophy";
import Footer from "@/components/Footer";

const Stories = () => {
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
          <span className="text-foreground">Stories</span>
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
              THE HOUSE OF TIME
            </p>
            <h1 className="text-5xl md:text-7xl font-serif mb-6">
              Our Story
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
              Where heritage meets innovation, and every timepiece carries the weight of history
              forward into tomorrow.
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

      <Philosophy />
      <Timeline />

      {/* Founder's Message */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <blockquote className="text-2xl md:text-3xl font-serif italic text-balance mb-8">
              "We don't just sell timepieces. We preserve legacies, honor craftsmanship,
              and connect collectors with pieces that will define their own stories."
            </blockquote>
            <p className="text-primary font-ancient tracking-wider">
              — The Founders
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Stories;
