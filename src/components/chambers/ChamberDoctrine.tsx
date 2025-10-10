interface ChamberDoctrineProps {
  lightColor: string;
}

const ChamberDoctrine = ({ lightColor }: ChamberDoctrineProps) => {
  return (
    <group>
      {/* Elevated terrace glow */}
      <pointLight position={[0, 3, 0]} color={lightColor} intensity={1} distance={10} />
    </group>
  );
};

export default ChamberDoctrine;
