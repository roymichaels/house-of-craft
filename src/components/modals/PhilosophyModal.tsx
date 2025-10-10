import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useModalStore } from "@/stores/modalStore";
import { useEffect, useState } from "react";
import Philosophy from "@/components/stories/Philosophy";
import Timeline from "@/components/stories/Timeline";
import { GoldenIcon } from "@/components/ui/GoldenIcon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PhilosophyModal = () => {
  const { activeModal, closeModal } = useModalStore();
  const isOpen = activeModal === 'philosophy';
  const [activeTab, setActiveTab] = useState("philosophy");

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
            <div className="min-h-screen">
              <div className="relative bg-background/95 backdrop-blur-sm h-screen overflow-y-auto border-y border-primary/20">
                {/* Close Button */}
                <button
                  onClick={closeModal}
                  className="absolute top-6 right-6 p-2 rounded-full bg-background/80 hover:bg-ancient-gold/20 transition-all group z-10"
                  aria-label="Close modal"
                >
                  <GoldenIcon icon={X} size="md" glow="medium" className="hover:rotate-90 duration-500" />
                </button>

                {/* Header */}
                <div className="text-center pt-16 pb-12 px-6 border-b border-primary/10">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <p className="font-ancient text-primary/60 text-xs tracking-[0.3em] mb-4">
                      LUX EST DISCIPLINA
                    </p>
                    <h2 className="text-4xl md:text-6xl font-ancient text-ancient-gold mb-4 tracking-wider drop-shadow-[0_0_40px_rgba(212,175,55,0.4)]">
                      Philosophy
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-romania italic">
                      The principles that guide our creation and purpose
                    </p>
                  </motion.div>
                </div>

                {/* Tabbed Content */}
                <div className="px-6 py-12">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-5xl mx-auto">
                    <TabsList className="grid w-full grid-cols-2 mb-12 bg-background/50 border border-ancient-gold/20">
                      <TabsTrigger 
                        value="philosophy"
                        className="data-[state=active]:bg-ancient-gold/10 data-[state=active]:text-ancient-gold font-ancient tracking-wider"
                      >
                        Philosophy
                      </TabsTrigger>
                      <TabsTrigger 
                        value="history"
                        className="data-[state=active]:bg-ancient-gold/10 data-[state=active]:text-ancient-gold font-ancient tracking-wider"
                      >
                        Our History
                      </TabsTrigger>
                    </TabsList>

                    {/* Philosophy Tab */}
                    <TabsContent value="philosophy">
                      <Philosophy />
                    </TabsContent>

                    {/* History Tab */}
                    <TabsContent value="history">
                      <Timeline />
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PhilosophyModal;
