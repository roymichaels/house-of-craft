import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

interface FilterChip {
  id: string;
  label: string;
  count: number;
}

interface FilterChipsProps {
  chips: FilterChip[];
  selectedChips: string[];
  onToggle: (chipId: string) => void;
}

const FilterChips = ({ chips, selectedChips, onToggle }: FilterChipsProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => {
        const isSelected = selectedChips.includes(chip.id);
        
        return (
          <motion.button
            key={chip.id}
            onClick={() => onToggle(chip.id)}
            className={`
              relative px-4 py-2 rounded-full text-sm font-medium
              transition-all duration-200
              ${isSelected
                ? 'bg-primary/20 text-ancient-gold border border-primary/40'
                : 'bg-card/50 text-muted-foreground border border-border/50 hover:border-primary/20'
              }
            `}
            whileTap={{ scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
            }}
          >
            {/* Check icon */}
            <AnimatePresence>
              {isSelected && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                  className="inline-block mr-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                </motion.span>
              )}
            </AnimatePresence>
            
            {/* Label */}
            <span>{chip.label}</span>
            
            {/* Count */}
            <span className="ml-1.5 text-xs opacity-60">
              {chip.count}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};

export default FilterChips;
