import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useModalStore } from "@/stores/modalStore";
import { useEffect, useState } from "react";
import Philosophy from "@/components/stories/Philosophy";
import Timeline from "@/components/stories/Timeline";
import { GoldenIcon } from "@/components/ui/GoldenIcon";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const essays = [
  {
    id: "solar-imperative",
    title: "The Solar Imperative",
    category: "Manifesto",
    excerpt: "In light, we find clarity. In clarity, we command. The sun does not question—it illuminates, reveals, and demands truth from all who stand beneath it.",
    content: `The sun rises without permission. It does not negotiate with the horizon, nor does it ask if the world is ready for its light. It simply is—uncompromising, inevitable, absolute.

This is the essence of the Solar Imperative: to exist with such clarity and purpose that your presence alone transforms the landscape around you.

Modern man has forgotten this primal truth. He waits for permission, seeks validation, dims his own light to make others comfortable. He has traded sovereignty for acceptance, command for consensus.

But light does not compromise. It either illuminates or it does not. There is no middle ground, no gray area between clarity and confusion.

The Solar Imperative demands you become a source of light rather than a mere reflector. To generate your own clarity rather than waiting for others to show you the way. To stand at the center of your own order, radiating purpose with such intensity that others naturally orbit your vision.

This is not arrogance—it is alignment. The sun does not boast of its brightness; it simply shines. Your mastery of self becomes the gravitational force that pulls opportunity, respect, and excellence into your sphere.

Every morning is a declaration: Will you rise like the sun, or will you remain in shadow? The choice is yours, but understand—the world does not wait for those who hesitate at dawn.`
  },
  {
    id: "time-discipline",
    title: "Time as Discipline",
    category: "Essay",
    excerpt: "Every hour is a covenant with yourself. The modern world begs for distraction—mastery answers with precision, presence, and unwavering intent.",
    content: `Time is the most democratic of all resources—every man receives exactly 24 hours per day. Yet observe how radically different the outcomes. Some men build empires; others merely survive. The difference is not in the hours given, but in the discipline applied.

The watch on your wrist is not merely a tool—it is a philosophical instrument. Each tick represents a choice: command or surrender, presence or distraction, sovereignty or servitude.

Modern society has declared war on your attention. Notifications, endless scrolls, manufactured urgency—all designed to fragment your consciousness into a thousand tiny moments, none of them truly yours. This is not accidental. A distracted man is a controllable man. A scattered mind is a weak mind.

Time discipline begins with a single revolutionary act: deciding that your hours belong to you, not to the world's demands.

This means creating sacred containers—periods of time so protected, so inviolable, that nothing short of genuine emergency may interrupt them. One hour of deep work without interruption is worth more than eight hours of fragmented attention.

The ancient philosophers understood this. They spoke of kairos—not chronological time, but the right time, the opportune moment. To recognize kairos requires presence. To seize kairos requires discipline.

Your timepiece should be a reminder: every second that passes is a second you chose to invest or squander. There are no neutral moments. You are either building your order or contributing to chaos.

The question is not whether you have time. The question is whether you have the discipline to protect it, the wisdom to invest it, and the courage to refuse its theft.`
  },
  {
    id: "objects-intent",
    title: "Objects of Intent",
    category: "Doctrine",
    excerpt: "Possessions are not mere artifacts. They are symbols of philosophy—each chosen instrument a testament to your command over the material realm.",
    content: `Every object in your possession is either elevating you or degrading you. There is no neutral ground in the material realm.

The average man surrounds himself with convenience and distraction. His possessions serve him in the moment but build nothing for the future. His watch tells time but teaches nothing. His pen writes but inspires nothing. His leather holds things but signifies nothing.

This is poverty masquerading as practicality.

The man of order understands that objects are not neutral. They are either instruments of elevation or weapons of entropy. A timepiece is not just a device—it is a daily reminder of precision, heritage, and the weight of each passing moment. A well-crafted pen is not just a writing tool—it is a commitment to the permanence of your words.

When you choose an object with intent, you are making a declaration: I refuse the disposable. I reject the mediocre. I demand that even my instruments reflect the standards I hold for myself.

This is not materialism—it is philosophy made tangible.

The Stoics understood this paradox: to be unattached to possessions, one must first possess things worthy of respect. To practice detachment, one must first practice discernment. You cannot release what you never properly held.

Consider the Japanese concept of ichi-go ichi-e: "one time, one meeting"—the philosophy that each encounter is unique and unrepeatable. This applies to objects as well. The pen in your hand, the watch on your wrist, the journal on your desk—each is participating in this moment of your life, this unrepeatable chapter.

Will you honor that moment with objects of intent, or will you fill your life with forgettable placeholders?

The man who masters himself begins by mastering his environment. Choose each possession as if you were choosing a trusted advisor. Because in truth, you are.`
  }
];

const DoctrineModal = () => {
  const { activeModal, closeModal } = useModalStore();
  const isOpen = activeModal === 'doctrine';
  const [activeTab, setActiveTab] = useState("manifestos");

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
                      ORDO AB LUX
                    </p>
                    <h2 className="text-4xl md:text-6xl font-ancient text-ancient-gold mb-4 tracking-wider drop-shadow-[0_0_40px_rgba(212,175,55,0.4)]">
                      The Doctrine
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-ancient-tulip italic">
                      Wisdom for men who command themselves
                    </p>
                  </motion.div>
                </div>

                {/* Tabbed Content */}
                <div className="px-6 py-12">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-5xl mx-auto">
                    <TabsList className="grid w-full grid-cols-3 mb-12 bg-background/50 border border-ancient-gold/20">
                      <TabsTrigger 
                        value="manifestos"
                        className="data-[state=active]:bg-ancient-gold/10 data-[state=active]:text-ancient-gold font-ancient tracking-wider"
                      >
                        Manifestos
                      </TabsTrigger>
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

                    {/* Manifestos Tab */}
                    <TabsContent value="manifestos" className="space-y-6">
                      <Accordion type="single" collapsible className="space-y-4">
                        {essays.map((essay, index) => (
                          <AccordionItem 
                            key={essay.id} 
                            value={essay.id}
                            className="border-l-2 border-ancient-gold/30 pl-6 hover:border-ancient-gold transition-colors duration-300"
                          >
                            <AccordionTrigger className="hover:no-underline group">
                              <div className="text-left">
                                <div className="text-ancient-gold/60 text-xs font-ancient tracking-widest mb-2">
                                  {essay.category}
                                </div>
                                <h3 className="font-ancient text-2xl md:text-3xl text-foreground mb-3 tracking-wide group-hover:text-ancient-gold transition-colors">
                                  {essay.title}
                                </h3>
                                <p className="text-muted-foreground text-base md:text-lg leading-relaxed font-serif italic">
                                  "{essay.excerpt}"
                                </p>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-6 pb-8">
                              <div className="prose prose-invert max-w-none">
                                {essay.content.split('\n\n').map((paragraph, idx) => (
                                  <p key={idx} className="text-foreground/80 leading-relaxed mb-4 text-base md:text-lg font-serif">
                                    {paragraph}
                                  </p>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </TabsContent>

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

export default DoctrineModal;
