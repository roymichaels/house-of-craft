import OrbModel from "../hero/OrbModel";
import { SolarHalo } from "../3d/effects/SolarHalo";

interface ChamberAtriumProps {
  lightColor: string;
}

const ChamberAtrium = ({ lightColor }: ChamberAtriumProps) => {
  return (
    <group>
      {/* Central Orb - Eye of Apollo */}
      <OrbModel rotationSpeed={0.3} lightColor={lightColor} />
      
      {/* Apollo's Halo - Solar Ring */}
      <SolarHalo radius={3.5} lightColor={lightColor} intensity={1.0} />
    </group>
  );
};

export default ChamberAtrium;
