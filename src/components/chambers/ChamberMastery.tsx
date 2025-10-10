import { SolarHalo } from "../3d/effects/SolarHalo";

interface ChamberMasteryProps {
  lightColor: string;
  accentColor: string;
}

const ChamberMastery = ({ lightColor, accentColor }: ChamberMasteryProps) => {
  return (
    <group>
      {/* Solar halo marking this chamber */}
      <SolarHalo radius={2.5} lightColor={accentColor} intensity={0.6} />
      
      {/* Ambient glow */}
      <pointLight position={[0, 2, 0]} color={lightColor} intensity={0.8} distance={8} />
    </group>
  );
};

export default ChamberMastery;
