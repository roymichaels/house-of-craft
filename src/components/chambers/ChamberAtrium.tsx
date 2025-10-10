import OrbModel from "../hero/OrbModel";

interface ChamberAtriumProps {
  lightColor: string;
}

const ChamberAtrium = ({ lightColor }: ChamberAtriumProps) => {
  return (
    <group>
      {/* Central Orb - Eye of Apollo */}
      <OrbModel rotationSpeed={0.3} lightColor={lightColor} />
    </group>
  );
};

export default ChamberAtrium;
