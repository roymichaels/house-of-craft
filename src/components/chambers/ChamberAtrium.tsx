import OrbModel from "../hero/OrbModel";
import { TempleColumns } from "../3d/effects/TempleColumns";
import { LatinInscription } from "../3d/LatinInscription";

interface ChamberAtriumProps {
  lightColor: string;
}

const ChamberAtrium = ({ lightColor }: ChamberAtriumProps) => {
  return (
    <group>
      {/* Central Orb */}
      <OrbModel rotationSpeed={0.3} lightColor={lightColor} />
      
      {/* Roman Temple Columns - Framing layout */}
      <TempleColumns layout="temple-framing" height={12} lightColor={lightColor} />
      
      {/* Latin Inscription */}
      <LatinInscription mode="hero" position={[0, 3, -8]} />
    </group>
  );
};

export default ChamberAtrium;
