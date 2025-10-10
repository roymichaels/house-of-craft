import OrbModel from "../hero/OrbModel";
import { Text3D } from "../3d/ui/Text3D";
import { Button3D } from "../3d/ui/Button3D";
import { useModalStore } from "@/stores/modalStore";

interface ChamberAtriumProps {
  lightColor: string;
}

const ChamberAtrium = ({ lightColor }: ChamberAtriumProps) => {
  const { openModal } = useModalStore();

  return (
    <group>
      {/* Central Orb - Eye of Apollo */}
      <OrbModel rotationSpeed={0.3} lightColor={lightColor} />
      
      {/* 3D UI Elements - Holographic Interface */}
      <Text3D 
        content="APOLLON"
        position={[0, 2.5, 0]}
        fontSize={0.8}
        color="#C4A661"
        entranceDelay={3}
      />
      
      <Text3D 
        content="Where Light Becomes Order"
        position={[0, 1.2, 0]}
        fontSize={0.15}
        color="#E8E8E8"
        opacity={0.7}
        entranceDelay={5}
      />
      
      <Text3D 
        content="Built to last decades. Forged for men who value time, not trends."
        position={[0, -1.5, 1]}
        fontSize={0.12}
        color="#E8E8E8"
        opacity={0.6}
        maxWidth={6}
        entranceDelay={7}
      />
      
      <Button3D
        label="ENTER THE ORDER"
        position={[0, -2.8, 1.5]}
        onClick={() => openModal('collections')}
        entranceDelay={9}
      />
    </group>
  );
};

export default ChamberAtrium;
