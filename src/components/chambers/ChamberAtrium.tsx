import OrbModel from "../hero/OrbModel";
import { LightColumns } from "../3d/effects/LightColumns";
import { SolarHalo } from "../3d/effects/SolarHalo";
import { LatinInscription } from "../3d/LatinInscription";
import Logo3D from "../3d/Logo3D";

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
      
      {/* Volumetric Light Columns */}
      <LightColumns lightColor={lightColor} intensity={1.0} />
      
      {/* 3D Logo */}
      <Logo3D lightColor={lightColor} />
      
      {/* Latin Inscription */}
      <LatinInscription mode="hero" position={[0, 3, -8]} />
    </group>
  );
};

export default ChamberAtrium;
