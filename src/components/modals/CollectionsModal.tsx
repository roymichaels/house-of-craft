import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft } from "lucide-react";
import { useModalStore } from "@/stores/modalStore";
import { useState, useEffect } from "react";
import { vaultOrders } from "@/data/vaultOrders";
import VaultOrderTabs from "@/components/vault/VaultOrderTabs";
import VaultInstruments from "@/components/vault/VaultInstruments";
import VaultRelicGrid from "@/components/vault/VaultRelicGrid";

type ViewState = 'orders' | 'instruments' | 'relics';

const CollectionsModal = () => {
  const { activeModal, closeModal } = useModalStore();
  const isOpen = activeModal === 'collections';

  // State management
  const [viewState, setViewState] = useState<ViewState>('orders');
  const [activeOrder, setActiveOrder] = useState<string | null>(null);
  const [activeInstrument, setActiveInstrument] = useState<string | null>(null);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setViewState('orders');
      setActiveOrder(null);
      setActiveInstrument(null);
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        if (viewState === 'relics') {
          setViewState('instruments');
          setActiveInstrument(null);
        } else if (viewState === 'instruments') {
          setViewState('orders');
          setActiveOrder(null);
        } else {
          closeModal();
        }
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, viewState, closeModal]);

  // Navigation handlers
  const handleOrderSelect = (orderId: string) => {
    setActiveOrder(orderId);
    setViewState('instruments');
  };

  const handleInstrumentSelect = (instrumentId: string) => {
    setActiveInstrument(instrumentId);
    setViewState('relics');
  };

  const handleBackToInstruments = () => {
    setActiveInstrument(null);
    setViewState('instruments');
  };

  const handleBackToOrders = () => {
    setActiveOrder(null);
    setActiveInstrument(null);
    setViewState('orders');
  };

  // Get current data
  const currentOrder = vaultOrders.find(o => o.id === activeOrder);
  const currentInstrument = currentOrder?.instruments.find(i => i.id === activeInstrument);

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
                  className="absolute top-6 right-6 p-2 rounded-full bg-background/80 
                             hover:bg-primary/20 transition-colors z-10"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Back Button (contextual) */}
                {viewState !== 'orders' && (
                  <button
                    onClick={viewState === 'relics' ? handleBackToInstruments : handleBackToOrders}
                    className="absolute top-6 left-6 p-2 rounded-full bg-background/80 
                               hover:bg-primary/20 transition-colors z-10 flex items-center gap-2"
                    aria-label="Go back"
                  >
                    <ChevronLeft className="h-5 w-5" />
                    <span className="text-sm">Back</span>
                  </button>
                )}

                {/* Header - The Vault */}
                <div className="relative text-center pt-16 pb-12 px-6 border-b border-primary/10">
                  {/* Golden aura backdrop */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] 
                                  bg-primary/10 blur-[100px] pointer-events-none" />
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative z-10"
                  >
                    {/* Latin inscription */}
                    <p className="font-order text-primary/60 text-xs tracking-[0.3em] mb-3">
                      {viewState === 'orders' 
                        ? 'FORMA SEQUITUR RATIONEM'
                        : currentOrder?.latinInscription || 'FORMA SEQUITUR RATIONEM'
                      }
                    </p>
                    
                    {/* Main title */}
                    <h2 className="text-5xl md:text-7xl font-ancient text-ancient-gold mb-6 
                                   drop-shadow-[0_0_30px_rgba(196,166,97,0.3)]">
                      {viewState === 'orders' ? 'THE VAULT' : currentOrder?.title.toUpperCase()}
                    </h2>
                    
                    {/* Subtitle */}
                    <p className="text-base md:text-lg text-foreground/80 max-w-2xl mx-auto mb-2 leading-relaxed">
                      {viewState === 'orders'
                        ? 'Objects forged by Light and Discipline'
                        : currentOrder?.essence
                      }
                    </p>
                    
                    {/* Secondary copy */}
                    <p className="text-sm text-muted-foreground/60 max-w-xl mx-auto italic">
                      {viewState === 'orders'
                        ? 'Each relic is an oath in form — made for men who command their world with intent.'
                        : `Choose your instrument of ${currentOrder?.emotionalTrigger.toLowerCase()}.`
                      }
                    </p>
                  </motion.div>
                </div>

                {/* Content Area - State-Based Rendering */}
                <AnimatePresence mode="wait">
                  {viewState === 'orders' && (
                    <VaultOrderTabs
                      orders={vaultOrders}
                      activeOrder={activeOrder}
                      onSelectOrder={handleOrderSelect}
                    />
                  )}

                  {viewState === 'instruments' && currentOrder && (
                    <VaultInstruments
                      instruments={currentOrder.instruments}
                      orderTitle={currentOrder.title}
                      activeInstrument={activeInstrument}
                      onSelectInstrument={handleInstrumentSelect}
                    />
                  )}

                  {viewState === 'relics' && currentInstrument && currentOrder && (
                    <VaultRelicGrid
                      relics={currentInstrument.relics}
                      instrumentName={currentInstrument.name}
                      orderTitle={currentOrder.title}
                      onBack={handleBackToInstruments}
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CollectionsModal;
