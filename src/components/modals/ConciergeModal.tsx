import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Shield, Wrench, TrendingUp } from "lucide-react";
import { useModalStore } from "@/stores/modalStore";
import { useSceneStore } from "@/contexts/SceneContext";
import { useEffect } from "react";
import ServiceCard from "@/components/concierge/ServiceCard";
import ContactForm from "@/components/concierge/ContactForm";
import OathRitual from "@/components/concierge/OathRitual";
import EmailCaptureForm from "@/components/concierge/EmailCaptureForm";

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

const ConciergeModal = () => {
  const { activeModal, closeModal } = useModalStore();
  const { mode } = useSceneStore();
  const isOpen = activeModal === 'concierge' || activeModal === 'email-capture';
  const isInnerChamber = mode === 'circle';
  const isEmailCapture = activeModal === 'email-capture';

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) closeModal();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeModal]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
            onClick={closeModal}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed inset-0 z-50 overflow-y-auto"
            onClick={(e) => e.target === e.currentTarget && closeModal()}
          >
            <div className="min-h-screen px-6 py-24">
              <div className="relative bg-background/95 backdrop-blur-sm rounded-lg max-w-7xl mx-auto border border-primary/20">
                {/* Close Button */}
                <button
                  onClick={closeModal}
                  className="absolute top-6 right-6 p-2 rounded-full bg-background/80 hover:bg-primary/20 transition-colors z-10"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Conditional Content: Email Capture, Oath Ritual, or Standard Concierge */}
                {isEmailCapture ? (
                  <div className="px-6 py-16">
                    <EmailCaptureForm />
                  </div>
                ) : isInnerChamber ? (
                  <div className="px-6 py-16">
                    <OathRitual />
                  </div>
                ) : (
                  <>
                    {/* Header */}
                    <div className="text-center pt-16 pb-12 px-6 border-b border-primary/10">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <p className="font-ancient text-primary text-sm tracking-wider mb-4">
                          White Glove Service
                        </p>
                        <h2 className="text-4xl md:text-6xl font-serif mb-4">
                          Personal Concierge
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                          Expert guidance for discerning collectors. From sourcing rare pieces to portfolio management, we're your trusted advisors in horology.
                        </p>
                      </motion.div>
                    </div>

                    {/* Services */}
                    <div className="px-6 py-16">
                      <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                      >
                        <h3 className="text-3xl md:text-4xl font-serif mb-4">Our Services</h3>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                          Comprehensive support for every aspect of your collecting journey
                        </p>
                      </motion.div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                        {services.map((service, index) => (
                          <ServiceCard key={service.title} service={service} index={index} />
                        ))}
                      </div>

                      {/* Contact Form */}
                      <div className="border-t border-primary/10 pt-16">
                        <motion.div
                          className="text-center mb-12"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8 }}
                        >
                          <h3 className="text-3xl md:text-4xl font-serif mb-4">Get in Touch</h3>
                          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Share your collecting goals, and we'll craft a personalized approach
                          </p>
                        </motion.div>

                        <ContactForm />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConciergeModal;
