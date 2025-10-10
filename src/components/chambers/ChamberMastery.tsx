interface ChamberMasteryProps {
  lightColor: string;
  accentColor: string;
}

const ChamberMastery = ({ lightColor }: ChamberMasteryProps) => {
  return (
    <group>
      {/* Ambient glow */}
      <pointLight position={[0, 2, 0]} color={lightColor} intensity={0.8} distance={8} />
    </group>
  );
};

export default ChamberMastery;
