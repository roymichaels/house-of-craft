import { Html } from "@react-three/drei";
import { SceneMode } from "@/contexts/SceneContext";
import { OrderLanguage } from "@/lib/orderLanguage";

interface LatinInscriptionProps {
  mode: SceneMode;
  position: [number, number, number];
}

export const LatinInscription = ({ mode, position }: LatinInscriptionProps) => {
  return (
    <Html position={position} center distanceFactor={15}>
      <div className="pointer-events-none select-none opacity-30 hover:opacity-60 transition-opacity duration-1000">
        <p className="font-ancient text-ancient-gold text-xs tracking-[0.3em] uppercase">
          {OrderLanguage.latin[mode]}
        </p>
      </div>
    </Html>
  );
};
