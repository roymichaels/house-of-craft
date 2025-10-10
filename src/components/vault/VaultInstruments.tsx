import { motion, AnimatePresence } from 'framer-motion';
import { Instrument } from '@/data/vaultOrders';

interface VaultInstrumentsProps {
  instruments: Instrument[];
  orderTitle: string;
  activeInstrument: string | null;
  onSelectInstrument: (instrumentId: string) => void;
}

const VaultInstruments = ({ 
  instruments, 
  orderTitle, 
  activeInstrument, 
  onSelectInstrument 
}: VaultInstrumentsProps) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="instruments"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="px-6 py-12 border-t border-primary/10"
      >
        {/* Breadcrumb */}
        <div className="text-center mb-8">
          <p className="text-xs text-muted-foreground/60 tracking-widest mb-2">
            {orderTitle.toUpperCase()}
          </p>
          <h3 className="text-2xl font-ancient text-primary">
            Select an Instrument
          </h3>
        </div>

        {/* Instrument Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {instruments.map((instrument, index) => (
            <motion.button
              key={instrument.id}
              onClick={() => onSelectInstrument(instrument.id)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`
                group relative p-6 border transition-all duration-500
                ${activeInstrument === instrument.id
                  ? 'border-primary bg-primary/10 shadow-[0_0_30px_rgba(196,166,97,0.2)]'
                  : 'border-border/40 hover:border-primary/50 hover:bg-card'
                }
              `}
            >
              {/* Marble divider lines */}
              <span className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b 
                               from-transparent via-primary/20 to-transparent" />
              <span className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b 
                               from-transparent via-primary/20 to-transparent" />

              {/* Title */}
              <h4 className="font-ancient text-lg text-foreground mb-3 
                             group-hover:text-primary transition-colors">
                {instrument.name}
              </h4>

              {/* Description */}
              <p className="text-sm text-muted-foreground/70 leading-relaxed">
                {instrument.description}
              </p>

              {/* Arrow indicator */}
              <div className="mt-4 text-primary/60 group-hover:text-primary 
                              group-hover:translate-x-1 transition-all duration-300">
                →
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VaultInstruments;
