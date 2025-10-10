import { Html } from "@react-three/drei";

interface RelicLabelProps {
  text: string;
  visible: boolean;
}

export const RelicLabel = ({ text, visible }: RelicLabelProps) => {
  if (!visible) return null;
  
  return (
    <Html
      position={[0, 1.2, 0]}
      center
      distanceFactor={8}
      style={{
        pointerEvents: 'none',
        userSelect: 'none'
      }}
    >
      <div className="px-4 py-2 bg-background/95 border border-primary/50 rounded-md backdrop-blur-sm">
        <p className="font-ancient text-primary text-sm whitespace-nowrap">
          {text}
        </p>
      </div>
    </Html>
  );
};
