interface ChamberVaultProps {
  lightColor: string;
}

const ChamberVault = ({ lightColor }: ChamberVaultProps) => {
  return (
    <group>
      {/* Ambient gallery glow */}
      <pointLight position={[0, 2, 0]} color={lightColor} intensity={0.8} distance={8} />
      <pointLight position={[-2, 1, -1]} color={lightColor} intensity={0.4} distance={5} />
      <pointLight position={[2, 1, -1]} color={lightColor} intensity={0.4} distance={5} />
    </group>
  );
};

export default ChamberVault;
