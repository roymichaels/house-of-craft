import { motion } from "framer-motion";

interface SegmentedControlProps {
  options: { id: string; label: string; count?: number }[];
  activeOption: string;
  onChange: (optionId: string) => void;
}

const SegmentedControl = ({ options, activeOption, onChange }: SegmentedControlProps) => {
  return (
    <div className="inline-flex bg-black/40 backdrop-blur-sm p-1 rounded-full border border-ancient-gold/20">
      {options.map((option) => {
        const isActive = activeOption === option.id;
        
        return (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className="relative px-4 py-2 text-sm font-medium transition-colors rounded-full min-w-[80px]"
          >
            {/* Animated background pill */}
            {isActive && (
              <motion.div
                layoutId="activeSegment"
                className="absolute inset-0 bg-gradient-to-r from-ancient-gold/30 to-ancient-gold/20 border border-ancient-gold/50 rounded-full shadow-lg shadow-ancient-gold/20"
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
              />
            )}
            
            {/* Label */}
            <span
              className={`relative z-10 transition-colors duration-200 ${
                isActive ? 'text-ancient-gold' : 'text-muted-foreground/40'
              }`}
            >
              {option.label}
            </span>
            
            {/* Count badge */}
            {option.count !== undefined && (
              <span
                className={`ml-1.5 text-xs ${
                  isActive ? 'text-ancient-gold/70' : 'text-muted-foreground/30'
                }`}
              >
                {option.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default SegmentedControl;
