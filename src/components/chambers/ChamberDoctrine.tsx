import { Text3D } from "../3d/ui/Text3D";
import { InfoPanel3D } from "../3d/ui/InfoPanel3D";

interface ChamberDoctrineProps {
  lightColor: string;
}

const ChamberDoctrine = ({ lightColor }: ChamberDoctrineProps) => {
  return (
    <group>
      {/* Section Header */}
      <Text3D 
        content="THE DOCTRINE"
        position={[0, 3, -2]}
        fontSize={0.4}
        color="#C4A661"
        entranceDelay={0.5}
      />
      
      <InfoPanel3D
        content="The world bends to the man who moves with intent."
        position={[0, 2, -1.8]}
        width={6}
        height={0.8}
        fontSize={0.14}
        entranceDelay={1}
      />
      
      <InfoPanel3D
        content="Manifestos of Order. Essays on discipline, clarity, and dominion."
        position={[0, 0.8, -1.6]}
        width={5}
        height={0.6}
        fontSize={0.11}
        entranceDelay={1.5}
      />
    </group>
  );
};

export default ChamberDoctrine;
