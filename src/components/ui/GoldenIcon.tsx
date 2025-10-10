import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface GoldenIconProps {
  icon: LucideIcon;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | number;
  glow?: "none" | "subtle" | "medium" | "strong" | "pulse";
  className?: string;
  animate?: boolean;
}

const sizeMap = {
  sm: "w-5 h-5",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-12 h-12",
  "2xl": "w-16 h-16",
};

const glowMap = {
  none: "",
  subtle: "drop-shadow-[0_0_8px_rgba(196,166,97,0.3)]",
  medium: "drop-shadow-[0_0_15px_rgba(196,166,97,0.5)]",
  strong: "drop-shadow-[0_0_25px_rgba(196,166,97,0.7)]",
  pulse: "drop-shadow-[0_0_20px_rgba(196,166,97,0.6)] animate-pulse",
};

export const GoldenIcon = ({
  icon: Icon,
  size = "md",
  glow = "subtle",
  className,
  animate = true,
}: GoldenIconProps) => {
  const sizeStyle = typeof size === 'number' ? { width: size, height: size } : undefined;
  
  return (
    <Icon
      style={sizeStyle}
      className={cn(
        "text-ancient-gold",
        typeof size === 'string' && sizeMap[size],
        glowMap[glow],
        animate && "transition-all duration-300 hover:scale-110",
        className
      )}
    />
  );
};
